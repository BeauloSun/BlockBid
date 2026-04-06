<p align="center">
  <img src="frontend/src/assets/logo.svg" alt="BlockBid Logo" width="80" />
</p>

<h1 align="center">BlockBid</h1>

<p align="center">
  <strong>A decentralized NFT marketplace for minting, trading, and auctioning digital assets on Ethereum.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> &bull;
  <a href="#tech-stack">Tech Stack</a> &bull;
  <a href="#architecture">Architecture</a> &bull;
  <a href="#getting-started">Getting Started</a> &bull;
  <a href="#smart-contracts">Smart Contracts</a> &bull;
  <a href="#api-reference">API Reference</a> &bull;
  <a href="#testing">Testing</a> &bull;
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Solidity-0.8.20-363636?logo=solidity" alt="Solidity" />
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Hardhat-2.x-FFF100?logo=hardhat" alt="Hardhat" />
  <img src="https://img.shields.io/badge/MongoDB-8.x-47A248?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.3-06B6D4?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## Overview

BlockBid is a full-stack decentralized application (dApp) that enables users to mint, buy, sell, and auction NFTs on the Ethereum blockchain. It supports both **ERC-721** (unique, one-of-a-kind tokens) and **ERC-1155** (multi-edition / fractional tokens), giving creators and collectors flexibility in how they tokenize and trade digital assets.

The platform connects a React frontend to Solidity smart contracts via Ethers.js, with Express/MongoDB handling off-chain metadata and SQLite powering price analytics.

---

## Features

### Minting
- Mint **ERC-721** NFTs (single-edition, unique tokens)
- Mint **ERC-1155** NFTs (multi-edition, fractional ownership)
- Upload images and media to **IPFS via Pinata**
- Duplicate image detection via content hashing

### Marketplace
- **Fixed-price sales** &mdash; list and buy NFTs at a set ETH price
- **Timed auctions** &mdash; set a minimum price and end time, accept bids, and transfer to the highest bidder
- Cancel active listings at any time
- Full support for both ERC-721 and ERC-1155 token standards

### Portfolio & Analytics
- **Profile dashboard** &mdash; view owned NFTs, listed holdings, and wallet info
- **Price history charts** &mdash; line and bar charts tracking token prices over time
- Separate analytics views for ERC-721 and ERC-1155 tokens

### Wallet Integration
- MetaMask authentication (no username/password required)
- Automatic account change detection
- Persistent sessions via localStorage

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Smart Contracts** | Solidity 0.8.20, OpenZeppelin, Hardhat |
| **Blockchain** | Ethereum (Ganache local / Sepolia testnet) |
| **Frontend** | React 18, Tailwind CSS, Ethers.js v6, Web3.js |
| **Backend** | Express.js, Mongoose ODM |
| **Databases** | MongoDB (NFT metadata), SQLite (price history) |
| **File Storage** | IPFS via Pinata SDK |
| **Charts** | ApexCharts, Chart.js |
| **Testing** | Hardhat + Chai (contracts), Mocha (API), Jest (frontend) |

---

## Architecture

```
                       +------------------+
                       |   React Frontend |
                       |   (port 3000)    |
                       +--------+---------+
                                |
              +-----------------+------------------+
              |                 |                   |
    +---------v------+  +------v--------+  +-------v--------+
    | Smart Contracts|  | Express API   |  | SQLite Server  |
    | (Ethereum)     |  | MongoDB       |  | (port 3666)    |
    | via Ethers.js  |  | (port 4988)   |  | Price History  |
    +----------------+  +---------------+  +----------------+
```

### Project Structure

```
BlockBid/
├── contracts/           # Solidity smart contracts (ERC-721, ERC-1155, Marketplaces)
├── deploy/              # Hardhat deployment scripts
├── test/                # Smart contract test suites
├── frontend/            # React application
│   ├── src/
│   │   ├── pages/       # 18 page components (Home, Marketplace, Mint, etc.)
│   │   ├── components/  # 20+ reusable UI components
│   │   ├── utils/       # Contract interaction helpers, Pinata uploads
│   │   ├── constants/   # Contract ABIs and addresses
│   │   └── assets/      # Images, backgrounds, SVGs
│   └── tailwind.config.js
├── db/                  # Express + MongoDB backend
│   ├── models/          # Mongoose schemas (NFT metadata)
│   ├── routes/          # REST API routes (80+ endpoints)
│   └── test/            # API test suites
├── sqlDb/               # Express + SQLite analytics server
│   └── tables/          # Price history table definitions
├── start.js             # One-command startup for all services
├── hardhat.config.js    # Network & compiler configuration
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** (v16+) and **Yarn**
- **MetaMask** browser extension
- **Ganache** (for local development) or a Sepolia testnet account
- **MongoDB** connection (Atlas or local)

### Installation

```bash
# Clone the repository
git clone https://github.com/BeauloSun/BlockBid.git
cd BlockBid

# Install root dependencies (smart contracts & Hardhat)
yarn install

# Install backend dependencies
cd db && npm install && cd ..

# Install SQLite server dependencies
cd sqlDb && npm install && cd ..

# Install frontend dependencies
cd frontend && yarn install && cd ..
```

### Environment Variables

Create a `.env` file in the project root:

```env
PRIVATE_ADDRESS=<your-wallet-private-key>
ETHERSCAN_API_KEY=<etherscan-api-key>
COINMARKET_API_KEY=<coinmarketcap-api-key>
```

### Deploy Smart Contracts

```bash
# Local (Ganache - make sure Ganache is running on port 7545)
yarn hardhat deploy --network ganache

# Testnet (Sepolia)
yarn hardhat deploy --network sepolia
```

### Run the Application

**Option 1: All-in-one startup**

```bash
node start.js
```

**Option 2: Start each service manually** (in separate terminals)

```bash
# Terminal 1 - MongoDB API server (port 4988)
cd db && npm start

# Terminal 2 - SQLite analytics server (port 3666)
cd sqlDb && npm start

# Terminal 3 - React frontend (port 3000)
cd frontend && yarn start
```

Then open [http://localhost:3000](http://localhost:3000) and connect your MetaMask wallet.

---

## Smart Contracts

| Contract | Standard | Description |
|----------|----------|-------------|
| `nft721.sol` | ERC-721 | Minting unique, single-edition NFTs with token URI metadata |
| `nft1155.sol` | ERC-1155 | Minting multi-edition NFTs with quantity tracking |
| `BlockBid.sol` | &mdash; | Marketplace for ERC-721: fixed-price sales and timed auctions |
| `BlockBid1155.sol` | &mdash; | Marketplace for ERC-1155: sales and auctions with quantity management |

### Key Security Features

- **ReentrancyGuard** on all purchase and bid functions
- Ownership validation via `ownerOf()` / `balanceOf()`
- Price and approval checks before listing
- Prevention of double-listing and over-selling

---

## API Reference

### MongoDB API (port 4988)

**ERC-721 NFTs** &mdash; `/api/nfts/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/getNfts` | Get all NFTs |
| `POST` | `/addNfts` | Mint a new NFT |
| `POST` | `/getOwnedNft` | Get NFTs owned by address |
| `POST` | `/getNftsOnSale` | Get all NFTs listed for sale |
| `POST` | `/getNftsOnAuction` | Get all NFTs in auction |
| `PUT` | `/putNftInMarketplace` | List NFT for fixed-price sale |
| `PUT` | `/putNftAuctionInMarketplace` | List NFT for auction |
| `PUT` | `/recordBid` | Record a bid on an auction |
| `PUT` | `/cancelListing` | Cancel an active listing |
| `POST` | `/checkIfHashExists` | Check for duplicate images |

**ERC-1155 NFTs** &mdash; `/api/nfts1155/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/getNfts` | Get all ERC-1155 NFTs |
| `POST` | `/addNfts1155` | Mint a new ERC-1155 NFT |
| `POST` | `/getOwnersNft` | Get NFTs by owner address |
| `DELETE` | `/burnNft/:tokenId` | Burn an NFT |

### SQLite Analytics API (port 3666)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/nft721history` | All ERC-721 price history |
| `POST` | `/nft721history/getTokenHistory` | Price history for a specific token |
| `POST` | `/nft721history/addTokenHistory` | Record a price event |
| `POST` | `/nft1155history/getTokenHistory` | ERC-1155 token price history |

---

## Testing

### Smart Contract Tests

```bash
yarn hardhat test
```

Covers all four contracts: minting, listing, buying, bidding, auction lifecycle, cancellation, and edge cases.

### Backend API Tests

```bash
cd db
npm test            # Run tests
npm run coverage    # Generate coverage report
```

Tests all MongoDB CRUD operations for ERC-721, ERC-1155, and marketplace routes (80%+ coverage).

### Frontend Tests

```bash
cd frontend
yarn test           # Run Jest tests
yarn coverage       # Generate coverage report
```

Includes unit and integration tests for core components.

---

## Screenshots

<table>
  <tr>
    <td align="center"><strong>Landing Page</strong></td>
    <td align="center"><strong>Marketplace</strong></td>
  </tr>
  <tr>
    <td><img src="frontend/src/assets/landing_bg.png" width="400" /></td>
    <td><img src="frontend/src/assets/marketplace_bg.jpg" width="400" /></td>
  </tr>
  <tr>
    <td align="center"><strong>Minting (ERC-721)</strong></td>
    <td align="center"><strong>Minting (ERC-1155)</strong></td>
  </tr>
  <tr>
    <td><img src="frontend/src/assets/minting_nft_721.png" width="400" /></td>
    <td><img src="frontend/src/assets/minting_nft_1155.jpg" width="400" /></td>
  </tr>
</table>

---

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

Copyright (c) 2023 Beaulo
