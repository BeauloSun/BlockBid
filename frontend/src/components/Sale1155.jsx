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
  const [tokenIDs, setTokenIDs] = useState([]);
  const [listingIds, setListingIds] = useState([]);
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
      const response = await axios.post(
        "http://localhost:4988/api/nfts1155market/getNftsOnSale"
      );

      const names = response.data.map((item) => item.name);
      const descriptions = response.data.map((item) => item.description);
      const prices = response.data.map((item) => item.price);
      const images = response.data.map((item) => item.image_uri);
      const tokenIDs = response.data.map((item) => item.token_id);
      const listingIds = response.data.map((item) => item.listing_id);
      setName(names);
      setDescription(descriptions);
      setPrice(prices);
      setTokenIDs(tokenIDs);
      setImages(images);
      setListingIds(listingIds);
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
      ) : tokenIDs.length > 0 ? (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 mx-[5%]">
            {images.map((img_src, index) => (
              <div
                key={index}
                className="flex flex-col items-center py-4 hover:scale-105 duration-300"
              >
                <Link
                  to={`/marketplace/ERC1155/Sale/${tokenIDs[index]}/${listingIds[index]}`}
                  key={tokenIDs[index]}
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
