import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CardC from "../components/CardC";
import axios from "axios";

import { getMarketContract } from "../utils/getBlockBid";

export const Auction721 = () => {
  const [images, setImages] = useState([]);
  const [name, setName] = useState([]);
  const [description, setDescription] = useState([]);
  const [price, setPrice] = useState([]);
  const [tokenIDs_721, setTokenIDs_721] = useState([]);
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

  const fetchData = async () => {
    try {
      const marketplace_contract = await getMarketContract();
      const listedTokens = await marketplace_contract.methods
        .getListedAuctionTokens721()
        .call();
      const numbered_listedTokens = [];
      for (const bigint of listedTokens) {
        numbered_listedTokens.push(Number(bigint));
      }
      const gettingOnSaleBody = { tokenIds: numbered_listedTokens };
      const response = await axios.post(
        "http://localhost:4988/api/nfts/getNftsOnAuction",
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
      {isLoading ? (
        <div className="text-[#b3b3b3] text-4xl mt-20 flex justify-center">
          Loading...
        </div>
      ) : tokenIDs_721.length > 0 ? (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 mx-[5%]">
            {images.map((img_src, index) => (
              <div
                key={index}
                className="flex flex-col items-center py-4 hover:scale-105 duration-300"
              >
                <Link
                  to={`/marketplace/ERC721/Auction/${tokenIDs_721[index]}`}
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
      ) : (
        <div className="text-[#b3b3b3] text-4xl mt-20 flex justify-center">
          No ongoing auction! Come back later or start your own!
        </div>
      )}
    </div>
  );
};
