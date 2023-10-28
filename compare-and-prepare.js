//Kept in js to avoid unnecessary compilation in github actions

import {
  readdirSync,
  existsSync,
  mkdirSync,
  statSync,
  copyFileSync,
  rmdirSync,
  renameSync,
} from "fs";
import { join, relative, dirname } from "path";

const distDir = "dist";
const cacheDistDir = "cache-dist";
const uploadDir = "upload";

// Ensure upload directory exists
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

// Function to get a list of files in a directory
function getFiles(dir) {
  // Check if the directory exists, create it if not
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  return readdirSync(dir, { withFileTypes: true }).flatMap((dirent) =>
    dirent.isDirectory()
      ? getFiles(join(dir, dirent.name))
      : join(dir, dirent.name),
  );
}

// Get files from dist and cache-dist directories
const distFiles = getFiles(distDir);
const cacheDistFiles = getFiles(cacheDistDir);

// Compare files and prepare the upload directory
distFiles.forEach((file) => {
  const cacheFile = join(cacheDistDir, relative(distDir, file));
  if (
    !existsSync(cacheFile) ||
    statSync(file).size !== statSync(cacheFile).size
  ) {
    // File is new or changed, copy to upload directory
    const uploadFile = join(uploadDir, relative(distDir, file));
    mkdirSync(dirname(uploadFile), { recursive: true });
    copyFileSync(file, uploadFile);
  }
});

// Update the cache for next run
rmdirSync(cacheDistDir, { recursive: true });
renameSync(distDir, cacheDistDir);
