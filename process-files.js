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
    console.log("Attempting to connect to FTP server...");
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
    });
    console.log("Connected to FTP server.");

    console.log("Fetching list of files from server...");
    let serverFiles = await client.list();

    // Filter out specified files and directories from server files list
    serverFiles = serverFiles.filter((file) => {
      return !(
        file.name === ".htaccess" ||
        file.name === ".ftpquota" ||
        (file.name === "wordpress" && file.type === 1)
      );
    });

    console.log("Fetched list of files from server: ", serverFiles);
    console.log("Fetching list of files from dist directory...");
    const distFiles = getFiles(distDir);
    console.log("Fetched list of files from dist directory.");

    for (const distFile of distFiles) {
      const serverFile = serverFiles.find(
        (file) => file.name === distFile.name,
      );

      if (!serverFile || distFile.size !== serverFile.size) {
        // File is new or has a different size, upload it
        console.log(`Uploading file: ${distFile.path}...`);
        const uploadPath = join("/", distFile.path); // Adjust path as needed
        await client.uploadFrom(distFile.path, uploadPath);
        console.log(`Uploaded file: ${distFile.path}.`);
      }
    }
  } catch (error) {
    console.error("Error encountered:", error);
    process.exit(1);
  } finally {
    console.log("Closing FTP client...");
    client.close();
    console.log("FTP client closed.");
  }

  console.log("Closing FTP client...");
  client.close();
  console.log("FTP client closed.");
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
