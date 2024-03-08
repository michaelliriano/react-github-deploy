import express, { Application } from "express";
import { readFileSync, writeFileSync } from "fs";

/**
 * Serves a modified HTML file by updating relative paths and adding a data attribute.
 * @param {Application} app - The Express application instance.
 * @param {Map<string, string>} staticRoutes - Map to store static routes.
 * @param {string} indexPath - The path to the original HTML file.
 * @param {string} folderId - The unique identifier for the folder.
 * @param {string} staticPath - The path to the static files directory.
 * @returns {Promise<string | null>} A promise that resolves to the path of the modified HTML file or null on error.
 */
export const serveModifiedHtml = async (
  app: Application,
  staticRoutes: Map<string, string>,
  indexPath: string,
  folderId: string,
  staticPath: string,
): Promise<string | null> => {
  // Read the content of the HTML file
  try {
    const htmlContent = readFileSync(indexPath, 'utf-8');

    // Check if modification has been made
    const modificationFlag = 'data-modified="true"';
    if (!htmlContent.includes(modificationFlag)) {
      // Prepend relative paths with the base URL
      const modifiedHtmlContent = htmlContent.replace(
        /(src|href)="(\/|[^h](?!ttps?:\/\/)([^"]+))"/g,
        `$1="/${folderId}/$2"`,
      );

      // Add a data attribute to indicate modification
      const finalHtmlContent = modifiedHtmlContent.replace(
        /<head>/,
        `<head ${modificationFlag}>`,
      );

      // Write the modified content back to the file
      writeFileSync(indexPath, finalHtmlContent, 'utf-8');

      // Create a new static route if it doesn't exist
      if (!staticRoutes.has(folderId)) {
        const staticRoute = `/${folderId}`;
        app.use(staticRoute, express.static(staticPath));
        staticRoutes.set(folderId, staticRoute);
        console.log(staticRoutes);
      }
    }

    return indexPath;
  } catch (error) {
    console.error(error);
    return null;
  }
};
