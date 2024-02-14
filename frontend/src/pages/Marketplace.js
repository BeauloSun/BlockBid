import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bg from "../assets/marketplace_bg.jpg";
import { Outlet } from "react-router-dom";

export const Marketplace = () => {
  const [activeTab, setActiveTab] = useState("ERC_721 - Sale");
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.scrollY);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div
        className="relative text-[#ebff9c] h-[500px]"
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
              className={`px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-110 ${
                activeTab === "ERC_721 - Sale"
                  ? "bg-[#47ff9d] text-black font-bold"
                  : "bg-gray-300 text-white bg-opacity-50 font-bold"
              }`}
            >
              Sale (ERC-721)
            </button>
          </Link>

          <Link to="/marketplace/ERC721/Auction">
            <button
              onClick={() => handleTabClick("ERC_721 - Auction")}
              className={`px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-110 ${
                activeTab === "ERC_721 - Auction"
                  ? "bg-[#47ff9d] text-black font-bold"
                  : "bg-gray-300 text-white bg-opacity-50 font-bold"
              }`}
            >
              Auction (ERC-721)
            </button>
          </Link>

          <Link to="/marketplace/ERC1155/Sale">
            <button
              onClick={() => handleTabClick("ERC_1155 - Sale")}
              className={`px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-110 ${
                activeTab === "ERC_1155 - Sale"
                  ? "bg-[#47ff9d] text-black font-bold"
                  : "bg-gray-300 text-white bg-opacity-50 font-bold"
              }`}
            >
              Sale (ERC-1155)
            </button>
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
