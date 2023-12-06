const CryptoJS = require("crypto-js");

export function getImageHash(imageData) {
  const hash = CryptoJS.MD5(imageData).toString();
  return hash;
}
