import metamask from "../assets/metamask_icon.png";
import wallet_bg from "../assets/wallet_bg.jpg";
import retrieve_fund_bg from "../assets/retrieve_fund_bg.jpg";
import React, { useState, useEffect } from "react";
import { getMarketContract } from "../utils/getBlockBid";
import { getMarketContract1155 } from "../utils/getBlockBid1155";
import Web3 from "web3";

export default function Wallet() {
  const [data, setData] = useState({
    address: "",
    balance: null,
    isConnected: false,
  });

  const [userFund, setUserFund] = useState(0);
  const [userFund721, setUserFund721] = useState(0);
  const [userFund1155, setUserFund1155] = useState(0);

  useEffect(() => {
    getUserFunds();
  });

  useEffect(() => {
    if (window.ethereum) {
      const handler = function (accounts) {
        accountChangeHandler(accounts[0]);
      };

      window.ethereum.on("accountsChanged", handler);
    }
    const cur_acc = window.localStorage.getItem("currentAddr");
    if (cur_acc !== null && cur_acc !== "undefined") {
      accountChangeHandler(cur_acc);
    }
  }, []);

  useEffect(() => {
    const cur_acc = window.localStorage.getItem("currentAddr");
    if (cur_acc === "undefined") {
      disconnectWallet();
    }
  }, [data]);

  const btnHandler = () => {
    if (window.ethereum) {
      if (!data.isConnected) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((res) => accountChangeHandler(res[0]));
      } else {
        disconnectWallet();
      }
    } else {
      alert("Please install the MetaMask extension!");
    }
  };

  const accountChangeHandler = (account) => {
    setData({
      address: account,
      balance: null,
      isConnected: true,
    });
    window.localStorage.setItem("currentAddr", account);
  };

  const getUserFunds = async () => {
    const contract = await getMarketContract();
    const contract1155 = await getMarketContract1155();
    const address = window.localStorage.getItem("currentAddr");

    const funds = await contract.methods.getUserFunds(address).call();
    setUserFund721(funds);
    const funds1155 = await contract1155.methods.getUserFunds(address).call();
    setUserFund1155(funds1155);
    setUserFund(
      (
        Number(Web3.utils.fromWei(funds, "ether")) +
        Number(Web3.utils.fromWei(funds1155, "ether"))
      ).toFixed(2)
    );
  };

  const disconnectWallet = () => {
    setData({
      address: "",
      balance: null,
      isConnected: false,
    });
    window.localStorage.removeItem("currentAddr");
  };

  const returnUserFunds = async () => {
    const contract = await getMarketContract();
    const contract1155 = await getMarketContract1155();
    const address = window.localStorage.getItem("currentAddr");

    try {
      if (userFund721 > 0) {
        await contract.methods.getFundBack(address).send({ from: address });
      }
      if (userFund1155 > 0) {
        await contract1155.methods.getFundBack(address).send({ from: address });
      }

      setUserFund1155(0);
      setUserFund721(0);
      setUserFund(0);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div className="flex justify-center max-w-[1250px] mx-auto">
        <div className="flex mx-auto px-4 mb-6 break-words bg-transparent border-0 border-transparent border-solid shadow-xl rounded-2xl bg-clip-border">
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{ backgroundImage: `url(${wallet_bg})` }}
          >
            <span className="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-gradient-to-tl from-zinc-800 to-zinc-700 opacity-70"></span>
            <div className="relative z-10 p-4">
              <div className="flex justify-between items-center">
                <p className="pb-2 mt-3 mb-3 text-white text-4xl font-bold ">
                  Wallet Address:
                </p>
                <button
                  onClick={btnHandler}
                  className="flex items-center rounded-full py-2 px-4 bg-blue-500 hover:bg-gradient-to-r hover:scale-105 duration-300 from-blue-500 to-green-500 text-white font-bold"
                >
                  <span>
                    {data.isConnected ? "Disconnect Wallet" : "Connect Wallet"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 ml-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                    />
                  </svg>
                </button>
              </div>

              <div className="pb-2 mb-5 text-green-300 text-3xl font-bold ">
                {data.isConnected ? data.address : "Wallet not connected"}
              </div>
              <div className="flex items-center">
                <div>
                  <p className="pb-2 mt-3 mb-3 text-white text-4xl font-bold ">
                    Wallet Provider:
                  </p>
                  <p className="pb-2 mb-5 text-green-300 text-3xl font-bold ">
                    Metamask
                  </p>
                </div>
                <div className="flex items-end justify-end w-1/5 ml-auto">
                  <img className="w-3/5 mt-2" src={metamask} alt="logo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex max-w-[1250px] w-full mx-auto px-4 mb-6 break-words bg-transparent border-0 border-transparent border-solid shadow-xl rounded-2xl bg-clip-border">
          <div className="flex justify-center w-full">
            <div
              style={{
                backgroundImage: `url(${retrieve_fund_bg})`,
                backgroundSize: "cover",
                backgroundPositionY: "-100px",
              }}
              className="justify-center min-h-[300px] relative flex pb-5 px-20 flex-col min-w-0 w-full break-words bg-slate-400 border-0 shadow-xl rounded-2xl bg-clip-border flex-none"
            >
              <span className="absolute top-0 left-0 w-full h-full bg-center bg-cover rounded-2xl bg-gradient-to-tl from-zinc-800 to-zinc-700 opacity-60 z-0"></span>
              <h3 className="mb-0 text-white text-center pl-5 pt-5 font-bold text-3xl z-10">
                Your current pending fund stored in contract:
              </h3>
              <h3 className="mb-5 text-white text-center pl-5 pt-5 font-bold text-3xl z-10">
                {userFund} ETH
              </h3>
              <div className="flex justify-center">
                <button
                  onClick={returnUserFunds}
                  className="flex items-center ml-5 justify-center max-w-[190px] text-md rounded-full py-1 px-4 bg-blue-500 hover:bg-gradient-to-r hover:scale-105 duration-300 from-blue-500 to-green-500 text-white font-bold z-10"
                >
                  Retrieve Funds
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-8 h-8 ml-3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
