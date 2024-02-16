import bbidcontract from "../backend-constants/BlockBid1155.json";
import Web3 from "web3";

export const getMarketContract1155 = async () => {
  return new Promise(async (resolve, reject) => {
    // Read the contract address and abi from the json files
    const contractAddress = bbidcontract.address;
    const contractAbi = bbidcontract.abi;
    if (window.ethereum !== "undefined") {
      if (window.localStorage.getItem("currentAddr") !== null) {
        // getting the contract and setting the message sender to the address connected to the frontend
        const web3 = new Web3(window.ethereum);
        const marketPlacecontract = new web3.eth.Contract(
          contractAbi,
          contractAddress
        );

        // checking if the contract is connected successfully
        if (marketPlacecontract !== null) {
          resolve(marketPlacecontract);
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
