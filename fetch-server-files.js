import { Client } from "basic-ftp";
import { config } from "dotenv";
import { writeFileSync } from "fs";
config();

async function fetchServerFiles() {
  const client = new Client();
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
    });
    let serverFiles = await client.list();
    // Filter out the specified files and directories
    serverFiles = serverFiles.filter((file) => {
      return !(
        file.name === ".htaccess" ||
        file.name === ".ftpquota" ||
        (file.name === "wordpress" && file.type === 1)
      );
    });
    // Optionally, you could download the files instead of just listing them.
    // For simplicity, we're just going to save the metadata to a file.
    writeFileSync("server-files.json", JSON.stringify(serverFiles, null, 2));
  } catch (error) {
    console.error(error);
  }
  client.close();
}

// Call the function to fetch server files
fetchServerFiles();
