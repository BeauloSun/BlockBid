import React from "react";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Mint } from "./pages/Mint";
import { Mint721 } from "./pages/Mint721";
import { Mint1155 } from "./pages/Mint1155";
import { Profile } from "./pages/Profile";
import { NotFound } from "./pages/NotFound";
import { Marketplace } from "./pages/Marketplace";
import { Sale721 } from "./components/Sale721";
import { Auction721 } from "./components/Auction721";
import { Sale1155 } from "./components/Sale1155";
import { Bidding } from "./pages/Bidding";
import { Selling } from "./pages/Selling";
import { Selling1155 } from "./pages/Selling1155";
import { Selling1155List } from "./pages/Selling1155List";
import { Holdings } from "./components/Holdings";
import Wallet from "./components/Wallet";
import { ListedHoldings } from "./components/ListedHoldings";
import { CancelListings } from "./pages/CancelListings";
import { CancelListing1155 } from "./pages/CancelListing1155";
import { BuyNft721 } from "./pages/BuyNft721";
import { BuyNft1155 } from "./pages/BuyNft1155";
import { Splitting } from "./pages/Splitting_learning";
import { Analytics } from "./pages/Analytics";
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

          <Route
            path="/profile/listed_holdings/:id"
            element={<CancelListings />}
          />
          <Route
            path="/profile/listed_holdings/1155/:id"
            element={<CancelListing1155 />}
          />
          <Route path="/profile/holdings/721/:id" element={<Selling />} />
          <Route path="/profile/holdings/1155/:id" element={<Selling1155 />} />
          <Route path="/marketplace/ERC721/Sale/:id" element={<BuyNft721 />} />
          <Route path="/marketplace/ERC721/Auction/:id" element={<Bidding />} />
          <Route
            path="/marketplace/ERC1155/Sale/:tokenid"
            element={<Selling1155List />}
          />
          <Route
            path="/marketplace/ERC1155/Sale/:tokenid/:id"
            element={<BuyNft1155 />}
          />

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

          <Route path="/haha" element={<Splitting />} />

          <Route path="/analytics" element={<Analytics />} />

          <Route path="/mint" element={<Mint />} />
          <Route path="/mint/721" element={<Mint721 />} />
          <Route path="/mint/1155" element={<Mint1155 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
