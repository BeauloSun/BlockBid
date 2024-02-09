# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

To install all the dependencies

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
