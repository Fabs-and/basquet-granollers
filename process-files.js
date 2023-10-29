import { Client } from "basic-ftp";
import { config } from "dotenv";
import { readdirSync, statSync } from "fs";
import { join } from "path";

config(); // Load environment variables from .env file
const distDir = "dist";

// Main function to process files
async function processFiles() {
  const client = new Client();

  try {
    console.log(
      `[${new Date().toISOString()}] Attempting to connect to FTP server...`,
    );
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
    });
    console.log(`[${new Date().toISOString()}] Connected to FTP server.`);

    console.log(
      `[${new Date().toISOString()}] Fetching list of files from server...`,
    );
    let serverFiles = await client.list();
    serverFiles = serverFiles.filter((file) => {
      return !(
        file.name === ".htaccess" ||
        file.name === ".ftpquota" ||
        (file.name === "wordpress" && file.type === 1)
      );
    });

    console.log(
      `[${new Date().toISOString()}] Fetching list of files from dist directory...`,
    );
    const distFiles = getFiles(distDir);

    // Sequentially upload files
    for (const distFile of distFiles) {
      const serverFile = serverFiles.find(
        (file) => file.name === distFile.name,
      );

      if (!serverFile || distFile.size !== serverFile.size) {
        const uploadPath = distFile.path.replace(/^dist\//, "/");
        const directoryPath = uploadPath.substring(
          0,
          uploadPath.lastIndexOf("/"),
        );
        try {
          await client.ensureDir(directoryPath); // Ensure the directory exists
          const startTime = Date.now();
          await client.uploadFrom(distFile.path, uploadPath);
          const elapsedMs = Date.now() - startTime;
          console.log(`[${elapsedMs} ms] Uploaded file: ${distFile.name}.`);
        } catch (error) {
          console.error(
            `[${new Date().toISOString()}] Failed to upload file: ${
              distFile.name
            }.`,
            error,
          );
        }
      }
    }

    // Identify extra files on server
    const serverFileNames = serverFiles.map((file) => file.name);
    const distFileNames = distFiles.map((file) => file.name);
    const filesToDelete = serverFileNames.filter(
      (file, index) =>
        !distFileNames.includes(file) &&
        !(
          (file === ".htaccess" && serverFiles[index].type === 0) ||
          (file === ".ftpquota" && serverFiles[index].type === 0) ||
          (file === "wordpress" && serverFiles[index].type === 1)
        ),
    );

    // Sequentially delete extra files from server
    for (const file of filesToDelete) {
      console.log(`[${new Date().toISOString()}] Deleting file: ${file}...`);
      try {
        const isDirectory = serverFiles.find(
          (f) => f.name === file && f.type === 1,
        );
        if (isDirectory) {
          await client.removeDir(file);
        } else {
          await client.remove(file);
        }
        console.log(`[${new Date().toISOString()}] Deleted file: ${file}.`);
      } catch (error) {
        console.error(
          `[${new Date().toISOString()}] Failed to delete file: ${file}.`,
          error,
        );
      }
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error encountered:`, error);
    process.exit(1);
  } finally {
    console.log(`[${new Date().toISOString()}] Closing FTP client...`);
    await client.close();
    console.log(`[${new Date().toISOString()}] FTP client closed.`);
  }
}

// Helper function to recursively list all files in specified directory
function getFiles(dir) {
  console.log(`Listing files in directory: ${dir}...`);
  const dirents = readdirSync(dir, { withFileTypes: true });
  const files = dirents.flatMap((dirent) => {
    const path = join(dir, dirent.name);
    return dirent.isDirectory()
      ? getFiles(path)
      : { name: dirent.name, path, size: statSync(path).size };
  });
  console.log(`Listed files in directory: ${dir}.`);
  return files;
}

// Call the function to process files
processFiles();
