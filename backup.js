const lighthouse = require('@lighthouse-web3/sdk');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

async function main() {
  const apiKey = process.env.LIGHTHOUSE_API_KEY;

  // Create a ZIP archive of the repository
  const zipFilePath = 'repository.zip';
  await createZipArchive(zipFilePath);

  // Upload the ZIP archive to Lighthouse.storage
  const uploadResponse = await lighthouse.upload(zipFilePath, apiKey);

  // Delete the temporary ZIP file
  fs.unlinkSync(zipFilePath);

  const cid = uploadResponse.data.Hash;
  console.log(`Uploaded to Lighthouse.storage: ${cid}`);
  process.stdout.write(`::set-output name=cid::${cid}`);
}

function createZipArchive(zipFilePath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`Created ZIP archive: ${zipFilePath} (${archive.pointer()} bytes)`);
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory('./', false);
    archive.finalize();
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
