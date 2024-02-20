# Report/Video split:
- 1155 front + mongo' + 1155 mongo test
- 721 back + 721 contract testing
- analytics back
- 721 -> 1155
-------------------------
- 1155 back + 1155 contract testing
- 721 front + mongo + 721 mongo test
- analytics front + SQL'
- 721 -> 1155
------------------------
- Pinata
- Ganache
- Hardhat
- Metamask
- Ethereum
- React
- Testing & Evaluation (Quantitative UX ; Qualitative UX )

# Next week todo:

1. Fractionalization (button in sell page 721->1155)
2. Analytics (Line graph for
   721: Price/Time
   1155: Price/Time
   )
3. \*Fractionalization (button in sell page 1155->721)

```shell
yarn install
```

To add packages with yarn

```shell
yarn add --dev package name
```

Adding collections to the database:
\*\*
ALL LOWER CASE AND MAKE SURE TO KEEP THE FOLLOWING TWO CONSISTENT:

1. File name of model
2. First parameter when creating model when using mongoose.model
   \*\*

To start frontend server (in corresponding folder)

```shell
yarn start
```

To start backend server (in corresponding folder)

```shell
npm start
```

To deploy contract (in main folder)

```shell
hh deploy --network ganache
yarn hardhat deploy --network ganache
```

Start Project

```shell
node start .js
```

Project Planning (by 9th Feb)

- Tests for Contracts ✅
- Tests for React
- Tests for DB✅
- Minting Contract for ERC1155 (BackEnd)✅
- Minting page for ERC1155 (FrontEnd)✅
- Marketplace for ERC1155 (FrontEnd)✅
- Buy/Sell Contract for ERC1155 (FrontEnd)✅
