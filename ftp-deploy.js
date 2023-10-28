import { Client } from "basic-ftp";

// FTP Access
async function listFtpFiles() {
  const client = new Client();
  try {
    await client.access({
      host: import.meta.env.FTP_HOST,
      user: import.meta.env.FTP_USER,
      password: import.meta.env.FTP_PASSWORD,
    });
    console.log(await client.list());
  } catch (error) {
    console.error(error);
  }
  client.close();
}

// Call the function to list FTP files
listFtpFiles();
