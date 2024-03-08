# React-GitHub-Deploy

React-GitHub-Deploy is a TypeScript project that allows you to deploy GitHub repositories dynamically using Express.

## Installation

Ensure you have Node.js and pnpm installed. Then, run:

```bash
pnpm install
```

## Configuration

Adjust configuration options in the `.env` file located at the root of your project. The following environment variables are required:

- **PORT:** The port on which your Express server will run. Example: `PORT=8080`

- **HOST:** The base URL for your server. Example: `HOST=http://localhost`

These variables are essential for the correct operation of your React-GitHub-Deploy project. Adjust them according to your project's needs.

## Scripts

- **pnpm start:** Start the Express server.
  
```bash
pnpm start
```

- **pnpm dev:** Start the Express development server.
  
```bash
pnpm dev
```

- **pnpm build:** Build the Express server.
  
```bash
pnpm build
```

- **pnpm deploy:** Deploy the Express server with Docker & Docker-Compose.
  
```bash
pnpm deploy
```


## Project Structure

- **src/:** Contains the source of the project.
- **public/:** React static files are organized here.
- **dist/:** Output directory for compiled TypeScript code.
- **.env:** Environment variables configuration.

## API Reference

### GET /:id

Serves modified HTML files based on the provided id.

**Parameters:**

- `id` (string): The unique identifier.

### POST /deploy

Deploy a GitHub repository dynamically.

**Request Body:**

- `githubUrl` (string): GitHub repository URL.
- `outDir` (string, optional): Output directory (defaults to 'dist').

**Response:**

- `url` (string): The deployment URL.


## Contributing

If you'd like to contribute to this project, please follow these guidelines:

1. Fork the repository.
2. Create a new branch: `pnpm git checkout -b feature-name`.
3. Make your changes and commit them: `pnpm git commit -m 'Add some feature'`.
4. Push to the branch: `pnpm git push origin feature-name`.
5. Submit a pull request.

Your contributions are highly appreciated! Please make sure to follow best practices and adhere to the project's coding standards.
