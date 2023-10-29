import { Client } from "basic-ftp";
import { config } from "dotenv";
import { writeFileSync } from "fs";
config();

async function fetchServerFiles() {
  const client = new Client();
  try {
    console.log("Attempting to connect to FTP server...");
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
    });
    console.log("Connected to FTP server. Fetching file list...");
    let serverFiles = await client.list();
    console.log(`Fetched ${serverFiles.length} items from server.`);
    // Filter out the specified files and directories
    serverFiles = serverFiles.filter((file) => {
      return !(
        file.name === ".htaccess" ||
        file.name === ".ftpquota" ||
        (file.name === "wordpress" && file.type === 1)
      );
    });
    console.log(`Filtered list has ${serverFiles.length} items.`);
    // Optionally, you could download the files instead of just listing them.
    // For simplicity, we're just going to save the metadata to a file.
    console.log("Writing server file metadata to server-files.json...");
    writeFileSync("server-files.json", JSON.stringify(serverFiles, null, 2));
    console.log("server-files.json written successfully.");
  } catch (error) {
    console.error("Error encountered:", error);
  }
  client.close();
  console.log("FTP client closed.");
}

// Call the function to fetch server files
fetchServerFiles();
