const CryptoJS = require("crypto-js");

export async function getImageHash(imageFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = new Uint8Array(event.target.result);
      let binary = "";
      arrayBuffer.forEach((byte) => {
        binary += String.fromCharCode(byte);
      });
      const hash = CryptoJS.SHA256(
        CryptoJS.enc.Latin1.parse(binary)
      ).toString();
      resolve(hash);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(imageFile);
  });
}
