import metamask from "../assets/metamask_icon.png";
import wallet_bg from "../assets/wallet_bg.jpg";

import React, { useState, useEffect } from "react";
import { getMarketContract } from "../utils/getBlockBid";

export default function Wallet() {
  const bg = wallet_bg;

  const [data, setData] = useState({
    address: "",
    balance: null,
    isConnected: false,
  });

  const [userFund, setUserFund] = useState(0);

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
    const address = window.localStorage.getItem("currentAddr");

    const funds = await contract.methods.getUserFunds(address).call();
    setUserFund(Number(funds));
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
    const address = window.localStorage.getItem("currentAddr");

    try {
      await contract.methods.getFundBack(address).send({ from: address });
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
            style={{ backgroundImage: `url(${bg})` }}
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
        <div className="flex max-w-[1200px] w-full mx-auto px-4 mb-6 break-words bg-transparent border-0 border-transparent border-solid shadow-xl rounded-2xl bg-clip-border">
          <div className="flex justify-center w-full">
            <div className="w-2/3 h-[500px] mr-5 relative flex flex-col min-w-0 break-words bg-slate-400 border-0 shadow-xl rounded-2xl bg-clip-border flex-none">
              <h3 className="mb-0 text-white pl-5 pt-5 font-bold text-3xl">
                {userFund}
              </h3>
              <button
                onClick={returnUserFunds}
                class="flex items-center rounded-full py-2 px-4 bg-blue-500 hover:bg-gradient-to-r hover:scale-105 duration-300 from-blue-500 to-green-500 text-white font-bold"
              >
                Retrieve Funds
              </button>
            </div>
            <div className="w-1/3 h-[500px] ml-5 relative flex flex-col min-w-0 break-words bg-slate-400 border-0 shadow-xl rounded-2xl bg-clip-border flex-none">
              <h3 className="mb-0 text-white pl-5 pt-5 font-bold text-3xl">
                Your Transactions
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
