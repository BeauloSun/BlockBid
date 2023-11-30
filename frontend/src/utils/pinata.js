const pinataSDK = require("@pinata/sdk");
const fs = require("fs");

const pinata = new pinataSDK({
  pinataJWTKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiMjAxODU0ZS1lZjZlLTQ3ZWItYTI4Mi1mOWMxOWJmY2JmMGIiLCJlbWFpbCI6InNhdHdpay5nb3lhbC4yNkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiODY1MmI4NTlmMjcwYjkwNTIyYzkiLCJzY29wZWRLZXlTZWNyZXQiOiI1MzEwMTBkNTk5M2Y2M2YwZGE3Njg3MWQ0MTU4ZDQyZmI5ODBlODgxMzgwYTNjZWI1MDc0NjBmMDhiYWM5MjM3IiwiaWF0IjoxNzAxMDgzMzU3fQ.LpJnmfnzEBOAiNLSESk0V8as9WijfZTqf2JOJjtR-IY",
});

let imageHash = null;
let metatdataHash = null;

async function pinImages(imageurl) {
  const readableStreamForFile = fs.createReadStream(imageurl);
  const options = {
    pinataMetadata: {
      name: "MyCustomName",
    },
  };
  const res = await pinata.pinFileToIPFS(readableStreamForFile, options);
  imageHash = res.IpfsHash;
  console.log(imageHash);
  return imageHash;
}

async function pinJSON(name, description) {
  const body = {
    name: name,
    description: description,
    ImageHash: imageHash,
  };
  const res = await pinata.pinJSONToIPFS(body, options);
  metatdataHash = res.IpfsHash;
  return metatdataHash;
}

pinImages("../assets/minting_nft.png");
