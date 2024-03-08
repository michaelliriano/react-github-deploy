import path from 'path'
import { Application } from 'express'
import { promises as fsPromises } from 'fs'
import { serveModifiedHtml } from './util/html'
import { PUBLIC_DIR } from './constant'
import {
  checkBuildDirectory,
  cloneRepoAndBuild,
  generateDeployUrl,
  generateUniqueId,
  renameBuildDirectory,
} from './util/deploy'

/**
 * Map to store static routes.
 * @type {Map<string, string>}
 */
const staticRoutes = new Map()

export default function (app: Application) {
  /**
   * Handles GET requests to serve modified HTML files.
   */
  app.get('/:id', async (req, res) => {
    /**
     * Folder ID extracted from the request parameters.
     * @type {string}
     */
    const folderId = req.params.id

    /**
     * Index HTML path for the requested folder.
     * @type {string}
     */
    const indexPath = path.join(PUBLIC_DIR, folderId, 'dist', 'index.html')

    try {
      await fsPromises.access(indexPath)

      // Serve the modified HTML file
      const modifiedHtmlPath = await serveModifiedHtml(
        app,
        staticRoutes,
        indexPath,
        folderId,
        path.join(PUBLIC_DIR, folderId, 'dist'),
      )

      if (modifiedHtmlPath) {
        res.sendFile(modifiedHtmlPath)
      } else {
        res.status(500).json({ error: 'Internal server error' })
      }
    } catch (error) {
      console.error(error)
      // If the folder or index.html doesn't exist, return a 404 error
      res.status(404).json({ error: 'Not Found' })
    }
  })

  /**
   * Handles POST requests to deploy a GitHub repository.
   */
  app.post('/deploy', async (req, res) => {
    /**
     * GitHub repository URL from the request body.
     * @type {string}
     */
    const githubRepositoryUrl = req.body.githubUrl

    /**
     * Output directory specified in the request body (defaults to 'dist').
     * @type {string}
     */
    const outDir = req.body.outDir || 'dist'

    try {
      /**
       * Unique identifier generated for the deployment.
       * @type {string}
       */
      const uniqueId = generateUniqueId()

      /**
       * Deployment path for the cloned repository.
       * @type {string}
       */
      const deployPath = path.join(PUBLIC_DIR, uniqueId)

      await cloneRepoAndBuild(githubRepositoryUrl, deployPath)

      /**
       * Build directory path.
       * @type {string}
       */
      const buildDirPath = path.join(deployPath, outDir)

      /**
       * Result of checking the build directory.
       * @type {Response|undefined}
       */
      const buildCheckResult = checkBuildDirectory(buildDirPath, res)

      if (buildCheckResult) {
        return buildCheckResult
      }

      await renameBuildDirectory(buildDirPath, deployPath)

      res.json({ url: generateDeployUrl(uniqueId) })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  })
}
