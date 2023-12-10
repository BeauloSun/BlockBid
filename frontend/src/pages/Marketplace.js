import React, { useEffect, useState } from "react";
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
      console.log(numbered_listedTokens);
      const gettingOnSaleBody = { tokenIds: numbered_listedTokens };
      const response = await axios.post(
        "http://localhost:4988/getNftsOnSale",
        gettingOnSaleBody
      );
      console.log(response.data);

      const names721 = response.data.map((item) => item.name);
      const descriptions721 = response.data.map((item) => item.description);
      const prices721 = response.data.map((item) => item.price);
      const images721 = response.data.map((item) => item.image_uri);
      const tokenIDs721 = response.data.map((item) => item.token_id);
      console.log("tokenIds", tokenIDs721);
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
          <button
            onClick={() => handleTabClick("ERC_721")}
            className={`px-4 py-2 rounded-xl transition-all duration-500 transform hover:scale-110 ${
              activeTab === "ERC_721"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-white bg-opacity-50"
            }`}
          >
            Complete ownership (ERC-721)
          </button>
          <button
            onClick={() => handleTabClick("ERC_1155")}
            className={`px-4 py-2 rounded-xl transition-all duration-500 transform hover:scale-110 ${
              activeTab === "ERC_1155"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-white bg-opacity-50"
            }`}
          >
            Partial ownership (ERC-1155)
          </button>
        </div>
        <div
          className="grid grid-flow-row-dense gap-1 mx-[17%]"
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
                token_id={tokenIDs_721[index]}
                market={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
