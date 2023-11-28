import React, { useEffect, useState } from "react";
import CardC from "../components/CardC";
import bg from "../assets/marketplace_bg.jpg";

import nft1 from "../assets/nft1.jpg";
import nft2 from "../assets/nft2.jpg";
import nft3 from "../assets/nft3.jpg";
import nft4 from "../assets/nft4.jpg";
import nft5 from "../assets/nft5.jpg";
import nft6 from "../assets/nft6.jpg";
import nft7 from "../assets/nft7.jpg";
import nft8 from "../assets/nft8.jpg";
import nft9 from "../assets/nft9.jpg";
import nft10 from "../assets/nft10.jpg";

export const Marketplace = () => {
  const ERC_721 = [nft1, nft2, nft3, nft4, nft5];
  const ERC_1155 = [nft6, nft7, nft8, nft9, nft10];
  const [activeTab, setActiveTab] = useState("ERC_721");
  const [images, setImages] = useState(ERC_721);
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.scrollY);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "ERC_721") {
      setImages(ERC_721);
    } else if (tab === "ERC_1155") {
      setImages(ERC_1155);
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
        <div className="flex justify-left pl-[20px] space-x-6 mb-10 bg-slate-400 py-4 mx-[15%] rounded-3xl bg-opacity-50">
          <button
            onClick={() => handleTabClick("ERC_721")}
            className={`px-4 py-2 rounded-xl transition-colors duration-500 ${
              activeTab === "ERC_721"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-white bg-opacity-50"
            }`}
          >
            Complete ownership (ERC-721)
          </button>
          <button
            onClick={() => handleTabClick("ERC_1155")}
            className={`px-4 py-2 rounded-xl transition-colors duration-500 ${
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
              <CardC img_src={img_src} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
