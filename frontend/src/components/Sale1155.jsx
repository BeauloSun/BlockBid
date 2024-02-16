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
  );
};
