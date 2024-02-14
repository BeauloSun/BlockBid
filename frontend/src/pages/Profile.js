import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { getContract } from "../utils/getNft721";

export const Profile = () => {
  const [activeTab, setActiveTab] = useState("wallet");

  const getOwnerNfts = async () => {
    const contract = await getContract();
    const address = window.localStorage.getItem("currentAddr");
    const tokens = await contract.methods.getOwnerNFTs(address).call();
    const tokens_integers = [];
    for (const bigint of tokens) {
      tokens_integers.push(Number(bigint));
    }
    if (tokens_integers.length > 0) {
      return tokens_integers;
    } else {
      console.error("no nft owned");
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="mt-5 px-5 shadow">
      <div className="relative h-96 rounded-b flex justify-center">
        <img
          src="https://picsum.photos/id/468/2980"
          className="object-cover w-full h-full rounded-b"
          alt="cover"
        />
        <div className="absolute -bottom-6">
          <img
            src="https://picsum.photos/seed/picsum/300/302"
            className="object-cover border-4 border-white w-40 h-40 rounded-full"
            alt="cover"
          />
        </div>
      </div>

      <div className="flex justify-center space-x-6 mt-12 mb-5 bg-slate-400 py-4 mx-auto max-w-[1250px] rounded-3xl bg-opacity-50">
        <Link to="/profile/listed_holdings">
          <button
            onClick={() => handleTabClick("Listed Holdings")}
            className={`px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-110 ${
              activeTab === "Listed Holdings"
                ? "bg-[#47ff9d] text-black font-bold"
                : "bg-gray-300 text-white bg-opacity-50 font-bold"
            }`}
          >
            Listed Holdings
          </button>
        </Link>
        <Link to="/profile/holdings">
          <button
            onClick={() => handleTabClick("holdings")}
            className={`px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-110 ${
              activeTab === "holdings"
                ? "bg-[#47ff9d] text-black font-bold"
                : "bg-gray-300 text-white bg-opacity-50 font-bold"
            }`}
          >
            Holdings
          </button>
        </Link>
        <Link to="/profile/wallet">
          <button
            onClick={() => handleTabClick("wallet")}
            className={`px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-110 ${
              activeTab === "wallet"
                ? "bg-[#47ff9d] text-black font-bold"
                : "bg-gray-300 text-white bg-opacity-50 font-bold"
            }`}
          >
            Wallet
          </button>
        </Link>
      </div>
      <Outlet />
    </div>
  );
};
