import nftcontract from "../backend-constants/nft1155.json";
import Web3 from "web3";

export const getContract = async () => {
  return new Promise(async (resolve, reject) => {
    const contractAddress = nftcontract.address;
    const contractAbi = nftcontract.abi;
    if (window.ethereum !== "undefined") {
      if (window.localStorage.getItem("currentAddr") !== null) {
        // getting the contract and setting the message sender to the address connected to the frontend
        const web3 = new Web3(window.ethereum);
        const mintcontract = new web3.eth.Contract(
          contractAbi,
          contractAddress
        );

        const token_id = await mintcontract.methods.getTokenId().call();

        // checking if the contract is connected successfully
        if (token_id !== null || token_id !== "undefined") {
          resolve(mintcontract);
        } else {
          console.error("Not connected to smart contract");
          reject("not connected to smart contract");
        }
      } else {
        console.log("wallet not connected");
      }
    } else {
      reject("Ethereum provider not found");
    }
  });
};
