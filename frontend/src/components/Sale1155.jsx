import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CardC from "../components/CardC";
import axios from "axios";

import { getMarketContract } from "../utils/getBlockBid";

export const Sale1155 = () => {
  const [images, setImages] = useState([]);
  const [name, setName] = useState([]);
  const [description, setDescription] = useState([]);
  const [price, setPrice] = useState([]);
  const [tokenIDs_721, setTokenIDs_721] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const marketplace_contract = await getMarketContract();
      const listedTokens = await marketplace_contract.methods
        .getListedTokens()
        .call();
      const numbered_listedTokens = [];
      for (const bigint of listedTokens) {
        numbered_listedTokens.push(Number(bigint));
      }
      const gettingOnSaleBody = { tokenIds: numbered_listedTokens };
      const response = await axios.post(
        "http://localhost:4988/api/nfts1155market/getNftsOnSale",
        gettingOnSaleBody
      );

      const names721 = response.data.map((item) => item.name);
      const descriptions721 = response.data.map((item) => item.description);
      const prices721 = response.data.map((item) => item.price);
      const images721 = response.data.map((item) => item.image_uri);
      const tokenIDs721 = response.data.map((item) => item.token_id);
      setName(names721);
      setDescription(descriptions721);
      setPrice(prices721);
      setTokenIDs_721(tokenIDs721);
      setImages(images721);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div
        className="grid grid-flow-row-dense gap-1 mx-[17%]"
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
              to={`/marketplace/ERC721/Sale/${tokenIDs_721[index]}`}
              key={tokenIDs_721[index]}
            >
              <CardC
                img_src={img_src}
                name={name[index]}
                description={description[index]}
                price={price[index]}
                market={true}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
