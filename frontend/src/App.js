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
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Selling />} />
          <Route path="/marketplace/:id" element={<Bidding />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route
            path="/marketplace/ERC721/Sale"
            element={<Marketplace721Sale />}
          />
          <Route path="/marketplace/ERC721/Sale/:id" element={<Bidding />} />
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
