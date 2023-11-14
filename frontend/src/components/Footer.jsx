import React from "react";
import {
  FaFacebookSquare,
  FaGithubSquare,
  FaInstagram,
  FaTwitterSquare,
} from "react-icons/fa";
import logo from "../assets/logo.svg";

const Footer = () => {
  return (
    <div className="max-w-[1240px] mx-auto py-5 px-4 grid lg:grid-cols-3 gap-8 text-gray-300">
      <div>
        <img src={logo} alt="blockbid" className="w-[200px] h-[80px]" />
        <p className="py-4">Copyright Ⓒ 2023 BlockBid. All Rights Reserved.</p>
        <div className="flex justify-between md:w-[75%] my-6">
          <FaFacebookSquare size={30} />
          <FaInstagram size={30} />
          <FaTwitterSquare size={30} />
          <FaGithubSquare size={30} />
        </div>
      </div>
      <div className="lg:col-span-2 flex justify-between mt-5 mx-[180px]">
        <div>
          <h6 className="font-medium text-gray-400">Useful Links</h6>
          <ul>
            <li className="py-2 text-sm">Analytics & Financials</li>
            <li className="py-2 text-sm">Profile</li>
            <li className="py-2 text-sm">Marketplace</li>
            <li className="py-2 text-sm">Wallet</li>
          </ul>
        </div>
        <div>
          <h6 className="font-medium text-gray-400">Us</h6>
          <ul>
            <li className="py-2 text-sm">About</li>
            <li className="py-2 text-sm">Careers</li>
          </ul>
        </div>
        <div>
          <h6 className="font-medium text-gray-400">Legal</h6>
          <ul>
            <li className="py-2 text-sm">Policy</li>
            <li className="py-2 text-sm">Terms</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
