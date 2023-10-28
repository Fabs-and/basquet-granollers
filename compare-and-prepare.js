const fs = require("fs");
const path = require("path");

const distDir = "dist";
const cacheDistDir = "cache-dist";
const uploadDir = "upload";

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Function to get a list of files in a directory
function getFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((dirent) =>
      dirent.isDirectory()
        ? getFiles(path.join(dir, dirent.name))
        : path.join(dir, dirent.name),
    );
}

// Get files from dist and cache-dist directories
const distFiles = getFiles(distDir);
const cacheDistFiles = getFiles(cacheDistDir);

// Compare files and prepare the upload directory
distFiles.forEach((file) => {
  const cacheFile = path.join(cacheDistDir, path.relative(distDir, file));
  if (
    !fs.existsSync(cacheFile) ||
    fs.statSync(file).size !== fs.statSync(cacheFile).size
  ) {
    // File is new or changed, copy to upload directory
    const uploadFile = path.join(uploadDir, path.relative(distDir, file));
    fs.mkdirSync(path.dirname(uploadFile), { recursive: true });
    fs.copyFileSync(file, uploadFile);
  }
});

// Update the cache for next run
fs.rmdirSync(cacheDistDir, { recursive: true });
fs.renameSync(distDir, cacheDistDir);
