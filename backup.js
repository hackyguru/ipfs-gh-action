const lighthouse = require('@lighthouse-web3/sdk');
const fs = require('fs');
const path = require('path');

async function main() {
  const apiKey = process.env.LIGHTHOUSE_API_KEY;
  
  // Function to recursively get all files in a directory
  function getAllFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(getAllFiles(file));
      } else {
        results.push(file);
      }
    });
    return results;
  }

  // Get all files in the current directory
  const files = getAllFiles('.');

  // Create an array of file objects for lighthouse.upload
  const fileObjects = files.map(file => ({
    path: file,
    content: fs.readFileSync(file)
  }));

  // Upload files to Lighthouse
  const uploadResponse = await lighthouse.upload(fileObjects, apiKey);

  const cid = uploadResponse.data.Hash;
  console.log(`Uploaded to IPFS: ${cid}`);
  console.log(`::set-output name=cid::${cid}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
