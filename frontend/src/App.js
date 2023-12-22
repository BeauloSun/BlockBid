import React from "react";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Mint } from "./pages/Mint";
import { Profile } from "./pages/Profile";
import { NotFound } from "./pages/NotFound";
import { Marketplace } from "./pages/Marketplace";
import { Bidding } from "./pages/Bidding";
import { Selling } from "./pages/Selling";
import { Marketplace721Sale } from "./pages/Marketplace721Sale";
import { Marketplace721Auction } from "./pages/Marketplace721Auction";
import { Holdings } from "./pages/Holdings";
import { UserListedHoldings } from "./pages/UserListedHoldings";
import { CancelListings } from "./pages/CancelListings";
import { BuyNft721 } from "./pages/BuyNft721";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const accountChangeHandler = (account) => {
    window.localStorage.setItem("currentAddr", account);
  };

  useEffect(() => {
    if (window.ethereum) {
      const handler = function (accounts) {
        accountChangeHandler(accounts[0]);
      };

      window.ethereum.on("accountsChanged", handler);
      return () => {
        window.ethereum.off("accountsChanged", handler); // Clean up the event listener
      };
    }
    const cur_acc = window.localStorage.getItem("currentAddr");
    if (cur_acc !== null && cur_acc !== "undefined") {
      accountChangeHandler(cur_acc);
    }
  }, []);
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/holdings" element={<Holdings />} />
          <Route
            path="/profile/listed_holdings"
            element={<UserListedHoldings />}
          />
          <Route
            path="/profile/listed_holdings/:id"
            element={<CancelListings />}
          />
          <Route path="/profile/holdings/:id" element={<Selling />} />
          <Route
            path="/marketplace/ERC721/Sale"
            element={<Marketplace721Sale />}
          />
          <Route path="/marketplace/ERC721/Sale/:id" element={<BuyNft721 />} />
          <Route
            path="/marketplace/ERC721/Auction"
            element={<Marketplace721Auction />}
          />
          <Route path="/marketplace/ERC721/Auction/:id" element={<Bidding />} />

          <Route path="/mint" element={<Mint />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
