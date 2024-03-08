import simpleGit, { SimpleGit } from "simple-git"

// Helper function to clone a GitHub repository using simple-git
export const cloneRepository = async (
    repoUrl: string,
    targetPath: string,
  ): Promise<void> => {
    const git: SimpleGit = simpleGit()
    await git.clone(repoUrl, targetPath)
  }