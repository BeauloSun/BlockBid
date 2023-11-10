//import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="left">
        <i className="icon">🔒</i>
        <h1>BlockBid</h1>
      </div>
      <div className="center">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="right">
        <a href="#">Account</a>
        <a href="#">Marketplace</a>
        <a href="#">Wallet</a>
        <a href="#">About</a>
      </div>
    </header>
  );
};

export default Header;
