import { Client } from "basic-ftp";
import { config } from "dotenv";
config();

// FTP Access
async function listFtpFiles() {
  const client = new Client();
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
    });
    console.log(await client.list());
  } catch (error) {
    console.error(error);
  }
  client.close();
}

//Call the function to list FTP files
listFtpFiles();

