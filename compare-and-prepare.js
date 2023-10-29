import {
  readdirSync,
  existsSync,
  mkdirSync,
  statSync,
  copyFileSync,
  readFileSync,
} from "fs";
import { join, dirname } from "path";

const distDir = "dist";
const uploadDir = "upload";
const serverFilesJSON = "server-files.json";

// Function to get a list of files and folders directly in a directory
function getFilesAndFolders(dir) {
  // ... (same as before)
}

// Ensure the upload directory exists
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

// Get server files and folders metadata
const serverFiles = JSON.parse(readFileSync(serverFilesJSON, "utf8"));

console.log('SERVER FILES', serverFiles);
// Get files and folders from dist directory
const distItems = getFilesAndFolders(distDir);

// Compare files and folders and prepare the upload directory
distItems.forEach((distItem) => {
  const serverItem = serverFiles.find(
    (file) =>
      file.name === distItem.name &&
      (file.type === 1) === (distItem.type === "directory"),
  );
  if (
    !serverItem ||
    (distItem.type === "file" &&
      statSync(distItem.path).size !== serverItem.size) // Assuming serverItem.size holds the file size
  ) {
    // Item is new or changed or the file size is different, copy to upload directory
    const uploadItemPath = join(uploadDir, distItem.name);
    if (distItem.type === "file") {
      mkdirSync(dirname(uploadItemPath), { recursive: true });
      copyFileSync(distItem.path, uploadItemPath);
    } else {
      if (!existsSync(uploadItemPath)) {
        mkdirSync(uploadItemPath, { recursive: true });
      }
    }
  }
});
