import React, { useState } from "react";
import CardC from "../components/CardC";

import nft2 from "../assets/nft2.jpg";
import nft3 from "../assets/nft3.jpg";
import nft6 from "../assets/nft6.jpg";
import Wallet from "../components/Wallet";
import Security from "../components/Security";

export const Profile = () => {
  const holdings = [nft2, nft3, nft6];
  const [activeTab, setActiveTab] = useState("holdings");
  const [images, setImages] = useState(holdings);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "holdings") {
      setImages(holdings);
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
              <CardC img_src={img_src} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
