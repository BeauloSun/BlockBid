import React, { useState } from "react";
import logo from "../assets/logo.svg";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [nav, setNav] = useState(false);
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
        <li className="p-4">Wallet</li>
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
