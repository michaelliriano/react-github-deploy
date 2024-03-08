import { spawnSync } from 'child_process';
import { cloneRepository } from './github';
import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import { HOST, PORT } from '../constant';

/**
 * Generates a unique identifier.
 * @returns {string} The generated unique identifier.
 */
export const generateUniqueId = () => {
  return Math.random().toString(36).substring(7);
}

/**
 * Clones a GitHub repository and builds the project.
 * @param {string} repoUrl - The URL of the GitHub repository.
 * @param {string} deployPath - The deployment path for the cloned repository.
 */
export const cloneRepoAndBuild = async (
  repoUrl: string,
  deployPath: string,
) => {
  try {
    // Clone GitHub repo using simple-git
    await cloneRepository(repoUrl, deployPath);

    // Install dependencies and build React app
    const buildProcess = spawnSync(
      'npm',
      ['install', '&&', 'npm', 'run', 'build'],
      {
        cwd: deployPath,
        stdio: 'inherit',
        shell: true,
      },
    );

    if (buildProcess.status !== 0) {
      console.error(
        'Build process failed:',
        buildProcess.error || buildProcess.stderr.toString(),
      );
      throw new Error('Build process failed');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to clone repository and build');
  }
}

/**
 * Checks the existence and content of the build directory.
 * @param {string} buildDirPath - The path of the build directory.
 * @param {Response} res - The Express response object.
 */
export const checkBuildDirectory = (buildDirPath: string, res: Response) => {
  if (!fs.existsSync(buildDirPath)) {
    return res.status(400).json({ error: 'Build directory not found' });
  }

  const buildDirContents = fs.readdirSync(buildDirPath);
  if (buildDirContents.length === 0) {
    return res.status(400).json({ error: 'Build directory is empty' });
  }
}

/**
 * Generates a deployment URL based on a unique identifier.
 * @param {string} uniqueId - The unique identifier.
 * @returns {string} The deployment URL.
 */
export const generateDeployUrl = (uniqueId: string) => {
  return `${HOST}:${PORT}/${uniqueId}`;
}

/**
 * Renames the build directory.
 * @param {string} buildDirPath - The current path of the build directory.
 * @param {string} deployPath - The deployment path where the build directory should be moved.
 * @returns {Promise<boolean>} A promise that resolves to true if the rename is successful.
 */
export const renameBuildDirectory = (
  buildDirPath: string,
  deployPath: string,
) => {
  return new Promise((resolve, reject) => {
    fs.rename(buildDirPath, path.join(deployPath, 'dist'), (renameError) => {
      if (renameError) {
        console.error('Rename failed:', renameError);
        reject(renameError);
      }
      resolve(true);
    });
  });
}
