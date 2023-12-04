import React, { useState, useEffect } from "react";
import CardC from "../components/CardC";

import Wallet from "../components/Wallet";
import Security from "../components/Security";
import axios from "axios";
import { getContract } from "../utils/getNft721";

export const Profile = () => {
  // const holdings = [nft2, nft3, nft6];
  const [TokenIDs, setTokenIDs] = useState([]);
  const [activeTab, setActiveTab] = useState("holdings");
  const [images, setImages] = useState([]);
  const [name, setName] = useState([]);
  const [description, setDescription] = useState([]);
  const [price, setPrice] = useState([]);
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    const getOwnerNfts = async () => {
      const contract = await getContract();
      const address = window.localStorage.getItem("currentAddr");

      const Token_Ids = await contract.methods.getOwnerNFTs(address).call();
      const tokens_integers = [];
      for (const bigint of Token_Ids) {
        tokens_integers.push(Number(bigint));
      }
      setTokenIDs(tokens_integers);
      setUserAddress(address);

      console.log("tokens ", tokens_integers);
      console.log("address ", userAddress);
    };
    const fetchData = async () => {
      try {
        console.log("inside db request ", TokenIDs);
        const response = await axios.get(
          "http://localhost:4988/ownerNftNotOnSale",
          { TokenIDs: TokenIDs }
        );
        console.log("response from db", response.data);

        const names = response.data.map((item) => item.name);
        const descriptions = response.data.map((item) => item.description);
        const prices = response.data.map((item) => item.price);
        const images = response.data.map((item) => item.image_uri);

        setName(names);
        setDescription(descriptions);
        setPrice(prices);
        setImages(images);
      } catch (error) {
        console.error(error);
      }
    };
    getOwnerNfts();
    fetchData();
  }, []);

  const getOwnerNfts = async () => {
    const contract = await getContract();
    const address = window.localStorage.getItem("currentAddr");
    const TokenIds = await contract.methods.getOwnerNFTs(address).call();
    return TokenIds;
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "holdings") {
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

      {activeTab === "wallet" ? (
        <Wallet />
      ) : activeTab === "security" ? (
        <Security />
      ) : (
        <div
          className="grid grid-flow-row-dense gap-1 mt-20 mx-[17%]"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          }}
        >
          {images.map((img_src, index) => (
            <div
              key={index}
              className="flex flex-col items-center py-4 hover:scale-105 duration-300"
            >
              <CardC
                img_src={img_src}
                name={name[index]}
                description={description[index]}
                price={price[index]}
                market={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
