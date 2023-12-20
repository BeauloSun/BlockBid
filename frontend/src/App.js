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
import { Holdings } from "./pages/Holdings";
import { UserListedHoldings } from "./pages/UserListedHoldings";
import { CancelListings } from "./pages/CancelListings";
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
          <Route path="/marketplace/:id" element={<Bidding />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
