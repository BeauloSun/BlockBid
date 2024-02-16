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
  const [tokenIDs_1155, setTokenIDs_1155] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

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

      const names1155 = response.data.map((item) => item.name);
      const descriptions1155 = response.data.map((item) => item.description);
      const prices1155 = response.data.map((item) => item.price);
      const images1155 = response.data.map((item) => item.image_uri);
      const tokenIDs1155 = response.data.map((item) => item.token_id);
      setName(names1155);
      setDescription(descriptions1155);
      setPrice(prices1155);
      setTokenIDs_1155(tokenIDs1155);
      setImages(images1155);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="text-[#b3b3b3] text-4xl mt-20 flex justify-center">
          Loading...
        </div>
      ) : tokenIDs_1155.length > 0 ? (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 mx-[5%]">
            {images.map((img_src, index) => (
              <div
                key={index}
                className="flex flex-col items-center py-4 hover:scale-105 duration-300"
              >
                <Link
                  to={`/marketplace/ERC721/Sale/${tokenIDs_1155[index]}`}
                  key={tokenIDs_1155[index]}
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
      ) : (
        <div className="text-[#b3b3b3] text-4xl mt-20 flex justify-center">
          The marketplace is so quiet! Nobody is selling!
        </div>
      )}
    </div>
  );
};
