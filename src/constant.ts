import dotenv from 'dotenv';
import path from 'path';

/**
 * Loads environment variables from a specified path or the default location.
 * @type {dotenv.DotenvConfigOutput}
 */
dotenv.config({
  path: path.join(__dirname, '..', '.env'),
});

/**
 * The port on which the server will listen.
 * @type {number}
 */
const PORT = process.env.PORT || 8080;

/**
 * The host URL for the server.
 * @type {string}
 */
const HOST = process.env.HOST || 'http://localhost';

/**
 * The directory path for public files.
 * @type {string}
 */
const PUBLIC_DIR = path.join(__dirname, 'public');

export { PORT, HOST, PUBLIC_DIR };
