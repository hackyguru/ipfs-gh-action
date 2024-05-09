const lighthouse = require('@lighthouse-web3/sdk');

async function main() {
  const apiKey = process.env.LIGHTHOUSE_API_KEY;
  const uploadResponse = await lighthouse.upload('../', apiKey);

  const cid = uploadResponse.data.Hash;
  console.log(`Uploaded to IPFS : ${cid}`);
  process.stdout.write(`::set-output name=cid::${cid}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
