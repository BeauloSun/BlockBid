import axios from "axios";
import FormData from "form-data";
const JWT =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiMjAxODU0ZS1lZjZlLTQ3ZWItYTI4Mi1mOWMxOWJmY2JmMGIiLCJlbWFpbCI6InNhdHdpay5nb3lhbC4yNkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiODY1MmI4NTlmMjcwYjkwNTIyYzkiLCJzY29wZWRLZXlTZWNyZXQiOiI1MzEwMTBkNTk5M2Y2M2YwZGE3Njg3MWQ0MTU4ZDQyZmI5ODBlODgxMzgwYTNjZWI1MDc0NjBmMDhiYWM5MjM3IiwiaWF0IjoxNzAxMDgzMzU3fQ.LpJnmfnzEBOAiNLSESk0V8as9WijfZTqf2JOJjtR-IY";

// pins image files to ipfs and returns hash
export const pinFileToIPFS = async (file, name) => {
  const formData = new FormData();
  formData.append("file", file);

  const pinataMetadata = JSON.stringify({
    name: "name",
  });
  formData.append("pinataMetadata", pinataMetadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", pinataOptions);

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT,
        },
      }
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};

// takes the images hash and other metadata and build returns another has
export const pinJsonToIPFS = async (jsonObject) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  try {
    const res = await axios.post(url, jsonObject, {
      maxBodyLength: "Infinity",
      headers: {
        Authorization: JWT,
      },
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};
