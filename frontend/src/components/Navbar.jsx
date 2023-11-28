import React, { useState, useEffect } from "react";
import Web3, { eth } from "web3";
import logo from "../assets/logo.svg";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { disconnect } from "mongoose";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [allAccounts, setAllAcounts] = useState([]);
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
      if (accounts.length > 0) {
        setAllAcounts(accounts);
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

  const switchWallet = () => {
    window.localStorage.removeItem("wallet");
    setCurrentAccount(allAccounts[1]);
    window.localStorage.setItem("wallet", JSON.stringify(allAccounts[1]));
  };

  const handleNav = () => {
    setNav(!nav);
  };
  return (
    <div className="flex justify-between items-center h-24 max-w-[1300px] mx-auto px-4 text-white">
      <Link to="/">
        <img src={logo} alt="blockbid" className="w-[200px] h-[80px]" />
      </Link>
      <ul className="hidden md:flex">
        <Link className="p-4" to="/about">
          About
        </Link>
        <li className="p-4">Marketplace</li>
        <li className="p-4">Financials</li>
        <li className="p-4">
          {currentAccount ? (
            <div>
              <p>{currentAccount}</p>
              <button onClick={disconnectWallet}>Disconnect Wallet</button>
              {allAccounts.length > 1 ? (
                <button onClick={switchWallet}>Switch Wallet</button>
              ) : (
                <p>dont have additional accounts</p>
              )}
            </div>
          ) : (
            <button onClick={connectWallet}>Connect Wallet</button>
          )}
        </li>
        <li className="p-4">Profile</li>
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
