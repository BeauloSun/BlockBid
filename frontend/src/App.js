import React from "react";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Mint } from "./pages/Mint";
import { Profile } from "./pages/Profile";
import { NotFound } from "./pages/NotFound";
import { Marketplace } from "./pages/Marketplace";
import { Sale721 } from "./components/Sale721";
import { Auction721 } from "./components/Auction721";
import { Sale1155 } from "./components/Sale1155";
import { Bidding } from "./pages/Bidding";
import { Selling } from "./pages/Selling";
import { Holdings } from "./components/Holdings";
import Wallet from "./components/Wallet";
import { ListedHoldings } from "./components/ListedHoldings";
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

          <Route path="/profile" element={<Profile />}>
            <Route path="listed_holdings" element={<ListedHoldings />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="holdings" element={<Holdings />} />
          </Route>

          <Route path="/marketplace" element={<Marketplace />}>
            <Route path="ERC721/Sale" element={<Sale721 />} />
            <Route path="ERC721/Auction" element={<Auction721 />} />
            <Route path="ERC1155/Sale" element={<Sale1155 />} />
          </Route>

          <Route
            path="/profile/listed_holdings/:id"
            element={<CancelListings />}
          />
          <Route path="/profile/holdings/:id" element={<Selling />} />
          <Route path="/marketplace/ERC721/Sale/:id" element={<BuyNft721 />} />
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
