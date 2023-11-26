import React, { useState, useEffect } from "react";
import Web3, { eth } from "web3";
import logo from "../assets/logo.svg";
import SearchBar from "./SearchBar.jsx";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { disconnect } from "mongoose";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [currentAccount, setCurrentAccount] = useState("");

  useEffect(() => {
    if (web3) return;
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("wallet")) {
        connectWallet();
      }
    }
    console.log("Hi");
    console.log(web3);
  }, [web3]);

  // if you don't give an array it will rerender everytime there is something on the site changing
  // if you give emptylist it will only run once at the start of the application
  // if you give an array with some variables it will run when that variable changes

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      const ethereum = window.ethereum;
      console.log("inside connetwallet");
      // Check if there is an existing connection stored in local storage
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        setWeb3(true);
        window.localStorage.setItem("wallet", JSON.stringify(accounts[0]));
      }
    } else {
      console.warn("MetaMask is not installed");
    }
  };

  const disconnectWallet = () => {
    if (window != "undefined") {
      window.localStorage.removeItem("wallet");
      setCurrentAccount("");
      setWeb3(false);
    }
  };

  const handleNav = () => {
    setNav(!nav);
  };
  return (
    <div className="grid grid-cols-3 items-center h-24 max-w-[1800px] mx-auto px-4 text-white">
      <Link to="/" className="justify-self-start">
        <img src={logo} alt="blockbid" className="w-[200px] h-[80px]" />
      </Link>

      <div className="justify-self-center w-full md:max-w-[500px] lg:max-w-[500px] mx-4">
        <SearchBar />
      </div>

      <ul className="hidden md:flex justify-self-end text-xl">
        <Link
          className="p-4 transition-all duration-500 ease-in-out font-bold hover:text-[#46ff65]"
          to="/about"
        >
          About
        </Link>
        <Link
          className="p-4 transition-all duration-500 ease-in-out font-bold hover:text-[#46ff65]"
          to="/about"
        >
          Marketplace
        </Link>
        <Link
          className="p-4 transition-all duration-500 ease-in-out font-bold hover:text-[#46ff65]"
          to="/about"
        >
          Financials
        </Link>
        <Link
          className="p-4 transition-all duration-500 ease-in-out font-bold hover:text-[#46ff65]"
          to="/about"
        >
          Profile
        </Link>
      </ul>

      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <ul
        className={
          nav
            ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500"
            : "ease-in-out duration-500 fixed left-[-100%]"
        }
      >
        <img src={logo} alt="blockbid" className="w-[200px] h-[80px]" />
        <li className="p-4 border-b border-gray-600">About</li>
        <li className="p-4 border-b border-gray-600">Marketplace</li>
        <li className="p-4 border-b border-gray-600">Financials</li>
        <li className="p-4 border-b border-gray-600">Wallet</li>
        <li className="p-4 border-b border-gray-600">Profile</li>
      </ul>
    </div>
  );
};

export default Navbar;
