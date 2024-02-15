import React, { useState, useEffect, useCallback, useRef } from "react";
import CardC from "./CardC";
import { Link } from "react-router-dom";
import axios from "axios";
import { getContract } from "../utils/getNft721";
import { getContract1155 } from "../utils/getNft1155";

export const Holdings = () => {
  const [images, setImages] = useState([]);
  const [name, setName] = useState([]);
  const [tokenIds, setTokenIds] = useState([]);
  const [description, setDescription] = useState([]);
  const [price, setPrice] = useState([]);
  const [images1155, setImages1155] = useState([]);
  const [name1155, setName1155] = useState([]);
  const [tokenIds1155, setTokenIds1155] = useState([]);
  const [description1155, setDescription1155] = useState([]);
  const [price1155, setPrice1155] = useState([]);
  const [totalAmount, setTotalAmount] = useState([]);
  const [amountOwned, setAmountOwned] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const getOwnerNfts = async () => {
    const contract = await getContract();
    const address = window.localStorage.getItem("currentAddr");
    const tokens = await contract.methods.getOwnerNFTs(address).call();
    const tokens_integers = [];
    for (const bigint of tokens) {
      tokens_integers.push(Number(bigint));
    }
    if (tokens_integers.length > 0) {
      return tokens_integers;
    }
  };

  const getOwnerNfts1155 = async () => {
    const contract = await getContract1155();
    const address = window.localStorage.getItem("currentAddr");
    const tokens = await contract.methods.getOwnerNFTs(address).call();
    const tokens_integers = [];
    for (const bigint of tokens) {
      tokens_integers.push(Number(bigint));
    }
    if (tokens_integers.length > 0) {
      return tokens_integers;
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const tokens = await getOwnerNfts();
      const response = await axios.post(
        "http://localhost:4988/api/nfts/getOwnedNft",
        {
          tokenIds: tokens,
        }
      );
      const names = response.data.map((item) => item.name);
      const descriptions = response.data.map((item) => item.description);
      const prices = response.data.map((item) => item.price);
      const images = response.data.map((item) => item.image_uri);
      const tokenids = response.data.map((item) => item.token_id);

      setName(names);
      setDescription(descriptions);
      setPrice(prices);
      setImages(images);
      setTokenIds(tokenids);

      // data for erc1155 token
      const tokens1155 = await getOwnerNfts1155();
      const response1155 = await axios.post(
        "http://localhost:4988/api/nfts1155/getOwnedNft",
        {
          tokenIds: tokens1155,
        }
      );
      const address = window.localStorage.getItem("currentAddr");

      const name1155 = response1155.data.map((item) => item.name);
      const description1155 = response1155.data.map((item) => item.description);
      const price1155 = response1155.data.map((item) => item.description);
      const images1155 = response1155.data.map((item) => item.image_uri);
      const tokenIds1155 = response1155.data.map((item) => item.token_id);
      const totalAmount = response1155.data.map((item) => item.total_quantity);
      const amountOwned = [];

      for (let i = 0; i < response1155.data.length; i++) {
        if (response1155.data[i].owners[address] > 0) {
          amountOwned.push(response1155.data[i].owners[address]);
        }
      }
      setName1155(name1155);
      setDescription1155(description1155);
      setPrice1155(price1155);
      setImages1155(images1155);
      setTokenIds1155(tokenIds1155);
      setTotalAmount(totalAmount);
      setAmountOwned(amountOwned);
    } catch (error) {
      console.error(error);
    }
  }, [
    setName,
    setDescription,
    setPrice,
    setImages,
    setTokenIds,
    setName1155,
    setDescription,
    setPrice1155,
    setTokenIds1155,
  ]);

  const accountChangeHandler = (account) => {
    window.localStorage.setItem("currentAddr", account);
    fetchDataRef.current();
  };

  const fetchDataRef = useRef(fetchData);

  useEffect(() => {
    fetchDataRef.current = fetchData;
  }, [fetchData]);

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      {isLoading ? (
        <div className="text-[#b3b3b3] text-4xl mt-20 flex justify-center">
          Loading...
        </div>
      ) : tokenIds.length > 0 ? (
        <div
          className="grid grid-flow-row-dense gap-1 mt-20 mx-[17%]"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          }}
        >
          {images.map((img_src, index) => (
            <div
              key={index}
              className="flex flex-col items-center py-4 hover:scale-105 duration-300"
            >
              <Link
                to={`/profile/holdings/${tokenIds[index]}`}
                key={tokenIds[index]}
              >
                <CardC
                  img_src={img_src}
                  name={name[index]}
                  description={description[index]}
                  price={price[index]}
                  market={false}
                />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-[#b3b3b3] text-4xl mt-20 flex justify-center">
          You currently have no holdings.
        </div>
      )}
      <div
        className="grid grid-flow-row-dense gap-1 mt-20 mx-[17%]"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        }}
      >
        {images1155.map((img_src, index) => (
          <div
            key={index}
            className="flex flex-col items-center py-4 hover:scale-105 duration-300"
          >
            <Link
              to={`/profile/holdings/1155/${tokenIds1155[index]}`}
              key={tokenIds1155[index]}
            >
              <CardC
                img_src={img_src}
                name={name1155[index]}
                description={description1155[index]}
                price={price1155[index]}
                is1155={true}
                owned={(amountOwned[index] / totalAmount[index]) * 100}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
