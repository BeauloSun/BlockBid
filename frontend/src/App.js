import React from "react";
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
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/bid" element={<Bidding />} />
          <Route path="/sell" element={<Selling />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
