import React from "react";
import Typed from "react-typed";
import bg from "../assets/landing_bg.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className="text-white"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-[1200px] max-h-[700px] w-full h-screen mx-auto text-center flex flex-col justify-center">
        <p className="text-[#fff537] font-bold p-2">Third year project</p>
        <h1 className="md:text-7xl sm:text-6xl text-4xl font-bold md:py-6">
          The All-in-one De-Fi Marketplace
        </h1>
        <div className="flex justify-center items-center">
          <p className="md:text-5xl sm:text-4xl text-xl font-bold py-4">
            Unique, Flexible, Secure trading for
          </p>
          <Typed
            className="md:text-5xl sm:text-4xl text-xl font-bold md:pl-4 pl-2 text-[#48f9ff]"
            strings={["NFTS", "MUSIC", "ART", "ASSETS"]}
            typeSpeed={120}
            backSpeed={140}
            loop
          />
        </div>
        <p className="md:text-2xl text-xl font-bold text-[#46ff65]">
          Connect to your own crypto wallet, Start trading today to earn!
        </p>
        <Link
          to="/marketplace/ERC721/Sale"
          className="bg-[#fff537] w-[200px] hover:scale-105 duration-200 rounded-md font-medium my-6 mx-auto py-3 text-black"
        >
          Explore Marketplace
        </Link>
        <Link
          to="/mint"
          className="bg-[#bc37ff] w-[200px] hover:scale-105 duration-200 rounded-md font-medium my-6 mx-auto py-3 text-black"
        >
          Mint Your Own NFT
        </Link>
      </div>
    </div>
  );
};

export default Hero;
