# This weekend todo:

1. Profile page listed holdings for 1155 ✅
2. Contract validation for selling more than you have ✅
3. Sell1155 page handling contract error for selling more than you have (setMessage) ✅
4. Page for all listing for one token (backend) 
5. Page for particular listing (backend) 
6. SQL to react (backend) 

---

7. Page for all listing for one token (frontend)
8. Page for particular listing (frontend)
9. Sell1155 page viewing other owners
10. Improve mint selection page layout + add explanation to what is what
11. Graph frontend display

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

- Tests for Contracts
- Tests for React
- Tests for DB
- Minting Contract for ERC1155 (BackEnd)
- Minting page for ERC1155 (FrontEnd)
- Marketplace for ERC1155 (FrontEnd)
- Buy/Sell Contract for ERC1155 (FrontEnd)
