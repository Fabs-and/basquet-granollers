import { Client } from "basic-ftp";
import { config } from "dotenv";
config();

async function uploadFiles() {
  const client = new Client();
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
    });
    // Upload the contents of the upload directory to the root directory on the server
    await client.uploadFrom("upload/*", "/");
  } catch (error) {
    console.error(error);
  }
  client.close();
}

// Call the function to upload files
uploadFiles();
