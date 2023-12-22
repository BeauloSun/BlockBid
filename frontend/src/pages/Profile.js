import React, { useState, useEffect, useCallback, useRef } from "react";
import CardC from "../components/CardC";
import { Link } from "react-router-dom";
import Wallet from "../components/Wallet";
import Security from "../components/Security";
import axios from "axios";
import { getContract } from "../utils/getNft721";

export const Profile = () => {
  const [activeTab, setActiveTab] = useState("wallet");
  const [images, setImages] = useState([]);
  const [name, setName] = useState([]);
  const [tokenIds, setTokenIds] = useState([]);
  const [nftAddress, setNftAddress] = useState([]);
  const [description, setDescription] = useState([]);
  const [price, setPrice] = useState([]);

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
    if (tab === "Listed Holdings") {
      setImages(images);
    }
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
      <div className="text-center mt-10 text-3xl font-bold text-white">
        Jiaming Sun
      </div>

      <div className="flex justify-center space-x-6 my-5 bg-slate-400 py-4 mx-auto max-w-[1250px] rounded-3xl bg-opacity-50">
        <Link to="/profile/listed_holdings">
          <button
            onClick={() => handleTabClick("Listed Holdings")}
            className={`px-4 py-2 rounded-xl transition-all duration-500 transform hover:scale-110 ${
              activeTab === "Listed Holdings"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-white bg-opacity-50"
            }`}
          >
            Listed Holdings
          </button>
        </Link>
        <Link to="/profile/holdings">
          <button
            onClick={() => handleTabClick("holdings")}
            className={`px-4 py-2 rounded-xl transition-all duration-500 transform hover:scale-110 ${
              activeTab === "holdings"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-white bg-opacity-50"
            }`}
          >
            Holdings
          </button>
        </Link>
        <button
          onClick={() => handleTabClick("wallet")}
          className={`px-4 py-2 rounded-xl transition-all duration-500 transform hover:scale-110 ${
            activeTab === "wallet"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-white bg-opacity-50"
          }`}
        >
          Wallet
        </button>
        <button
          onClick={() => handleTabClick("security")}
          className={`px-4 py-2 rounded-xl transition-all duration-500 transform hover:scale-110 ${
            activeTab === "security"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-white bg-opacity-50"
          }`}
        >
          Profile & Security
        </button>
      </div>

      {activeTab === "wallet" ? <Wallet /> : <Security />}
    </div>
  );
};
