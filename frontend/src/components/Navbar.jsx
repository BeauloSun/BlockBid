import React, { useState, useEffect, useRef } from "react";

import logo from "../assets/logo.svg";
import SearchBar from "./SearchBar.jsx";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [nav, setNav] = useState(false);
  const navRef = useRef(null);

  const handleNav = () => {
    setNav(!nav);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setNav(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navRef]);

  return (
    <div className="grid grid-cols-3 items-center h-24 max-w-[1800px] mx-auto px-4 text-white bg-black">
      <Link to="/" className="justify-self-start">
        <img src={logo} alt="blockbid" className="w-[200px] h-[80px]" />
      </Link>

      <div className="justify-self-center w-full md:max-w-[500px] lg:max-w-[500px] mx-4">
        <SearchBar />
      </div>

      <ul className="hidden navbar:flex justify-self-end text-xl">
        <Link
          className="p-4 transition-all duration-300 ease-in-out font-bold hover:text-[#46ff65] hover:bg-slate-800 rounded-xl"
          to="/mint"
        >
          Mint
        </Link>
        <Link
          className="p-4 transition-all duration-300 ease-in-out font-bold hover:text-[#46ff65] hover:bg-slate-800 rounded-xl"
          to="/marketplace/ERC721/Sale"
        >
          Marketplace
        </Link>
        <Link
          className="p-4 transition-all duration-300 ease-in-out font-bold hover:text-[#46ff65] hover:bg-slate-800 rounded-xl"
          to="/profile/wallet"
        >
          Profile
        </Link>
      </ul>

      <div
        onClick={handleNav}
        className="top-3 right-0 m-4 z-50 block justify-self-end navbar:hidden bg-black"
      >
        {nav ? <AiOutlineClose size={35} /> : <AiOutlineMenu size={35} />}
      </div>
      <ul
        ref={navRef}
        className={
          nav
            ? "flex flex-col fixed right-0 top-4 w-[30%] h-full border-r border-r-gray-900 bg-[#000300] transition-transform duration-500 ease-in-out transform translate-x-0 z-40"
            : "flex flex-col fixed right-0 top-4 w-[30%] h-full border-r border-r-gray-900 bg-[#000300] transition-transform duration-500 ease-in-out transform translate-x-full z-40"
        }
      >
        <img src={logo} alt="blockbid" className="w-[200px] h-[80px]" />
        <Link
          onClick={handleNav}
          className="p-4 transition-all duration-500 ease-in-out font-bold hover:text-[#46ff65] border-b border-white"
          to="/mint"
        >
          Mint
        </Link>
        <Link
          onClick={handleNav}
          className="p-4 transition-all duration-500 ease-in-out font-bold hover:text-[#46ff65] border-b border-white"
          to="/marketplace/ERC721/Sale"
        >
          Marketplace
        </Link>
        <Link
          onClick={handleNav}
          className="p-4 transition-all duration-500 ease-in-out font-bold hover:text-[#46ff65] border-b border-white"
          to="/profile/wallet"
        >
          Profile
        </Link>
      </ul>
    </div>
  );
};
