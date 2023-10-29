import { readdirSync, existsSync, mkdirSync, statSync, copyFileSync } from "fs";
import { join, relative, dirname } from "path";

const distDir = "dist"; // Define distDir here
const cacheDistDir = "cache-dist";
const uploadDir = "upload";

// Function to get a list of files and folders directly in a directory
function getFilesAndFolders(dir) {
  // Check if the directory exists, create it if not
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  return readdirSync(dir, { withFileTypes: true }).map((dirent) => ({
    name: dirent.name,
    type: dirent.isDirectory() ? "directory" : "file",
    path: join(dir, dirent.name),
  }));
}

// Get files and folders from dist and cache-dist directories
const distItems = getFilesAndFolders(distDir);
const cacheDistItems = getFilesAndFolders(cacheDistDir);

// Compare files and folders and prepare the upload directory
distItems.forEach((item) => {
  const cacheItem = cacheDistItems.find(
    (i) => i.name === item.name && i.type === item.type,
  );
  if (
    !cacheItem ||
    (item.type === "file" &&
      statSync(item.path).size !== statSync(cacheItem.path).size)
  ) {
    // Item is new or changed or the file size is different, copy to upload directory
    const uploadItemPath = join(uploadDir, item.name);
    if (item.type === "file") {
      mkdirSync(dirname(uploadItemPath), { recursive: true });
      copyFileSync(item.path, uploadItemPath);
    } else {
      if (!existsSync(uploadItemPath)) {
        mkdirSync(uploadItemPath);
      }
    }
  }
});
