import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CardC from "../components/CardC";
import bg from "../assets/marketplace_bg.jpg";
import axios from "axios";

import { getMarketContract } from "../utils/getBlockBid";

export const Marketplace = () => {
  const [activeTab, setActiveTab] = useState("ERC_721");
  const [images, setImages] = useState([]);
  const [images721, setImages721] = useState([]);
  const [images1155, setImages1155] = useState([]);
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.scrollY);
  const [name, setName] = useState([]);
  const [description, setDescription] = useState([]);
  const [price, setPrice] = useState([]);
  const [tokenIDs_721, setTokenIDs_721] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchData = async () => {
    try {
      const marketplace_contract = await getMarketContract();
      const listedTokens = await marketplace_contract.methods
        .getListedTokens()
        .call();
      const numbered_listedTokens = [];
      for (const bigint of listedTokens) {
        numbered_listedTokens.push(Number(bigint));
      }
      const gettingOnSaleBody = { tokenIds: numbered_listedTokens };
      const response = await axios.post(
        "http://localhost:4988/getNftsOnSale",
        gettingOnSaleBody
      );

      const names721 = response.data.map((item) => item.name);
      const descriptions721 = response.data.map((item) => item.description);
      const prices721 = response.data.map((item) => item.price);
      const images721 = response.data.map((item) => item.image_uri);
      const tokenIDs721 = response.data.map((item) => item.token_id);
      setName(names721);
      setDescription(descriptions721);
      setPrice(prices721);
      setImages721(images721);
      setTokenIDs_721(tokenIDs721);
      setImages(images721);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "ERC_721") {
      setImages(images721);
    } else if (tab === "ERC_1155") {
      setImages(images1155);
    }
  };

  return (
    <div>
      <div
        className="relative text-[#47ffe6] h-[500px]"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform: `translateY(${offsetY * 0.5}px)`,
          opacity: 0.8,
        }}
      >
        <div className="max-w-[1200px] max-h-[500px] w-full h-screen mx-auto text-center flex flex-col justify-center">
          <h1 className="md:text-7xl sm:text-6xl text-4xl font-bold md:py-6">
            Explore your favourite !
          </h1>
        </div>
      </div>
      <div className="relative pt-20 w-full h-full bg-black">
        <div className="flex justify-center space-x-6 mb-10 bg-slate-400 py-4 mx-[15%] rounded-3xl bg-opacity-50">
          <Link to="/marketplace/ERC721/Sale">
            <button
              onClick={() => handleTabClick("ERC_721 - Sale")}
              className={`px-4 py-2 rounded-xl transition-all duration-500 transform hover:scale-110 ${
                activeTab === "ERC_721 - Sale"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-white bg-opacity-50"
              }`}
            >
              Sale (ERC-721)
            </button>
          </Link>

          <Link to="/marketplace/ERC721/Auction">
            <button
              onClick={() => handleTabClick("ERC_721 - Auction")}
              className={`px-4 py-2 rounded-xl transition-all duration-500 transform hover:scale-110 ${
                activeTab === "ERC_721 - Auction"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-white bg-opacity-50"
              }`}
            >
              Auction (ERC-721)
            </button>
          </Link>

          <Link to="/marketplace/ERC1155/Sale">
            <button
              onClick={() => handleTabClick("ERC_1155 - Sale")}
              className={`px-4 py-2 rounded-xl transition-all duration-500 transform hover:scale-110 ${
                activeTab === "ERC_1155 - Sale"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-white bg-opacity-50"
              }`}
            >
              Sale (ERC-1155)
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
