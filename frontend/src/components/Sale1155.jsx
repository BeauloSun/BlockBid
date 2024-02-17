import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CardC from "../components/CardC";
import axios from "axios";

export const Sale1155 = () => {
  const [images, setImages] = useState([]);
  const [name, setName] = useState([]);
  const [description, setDescription] = useState([]);
  const [price, setPrice] = useState([]);
  const [tokenIDs, setTokenIDs] = useState([]);
  const [listingIds, setListingIds] = useState([]);
  const [percentageQuantities, setPercentageQuantities] = useState([]);
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
      const available_quantities = response.data.map(
        (item) => item.available_quantity
      );
      const quantityResponse = await axios.post(
        "http://localhost:4988/api/nfts1155/getTotalQuantity",
        {
          tokenIds: tokenIDs,
        }
      );
      const total_quantities = quantityResponse.data.quantity;
      let percentage_quantities = available_quantities.map(
        (available_quantity, index) => {
          let total_quantity = total_quantities[index];
          if (total_quantity === 0) {
            return 0;
          } else {
            let percentage = (available_quantity / total_quantity) * 100;
            return Number(percentage.toFixed(2));
          }
        }
      );

      const listingIds = response.data.map((item) => item.listing_id);
      setName(names);
      setDescription(descriptions);
      setPrice(prices);
      setTokenIDs(tokenIDs);
      setImages(images);
      setListingIds(listingIds);
      setPercentageQuantities(percentage_quantities);
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
                    is1155={true}
                    onSale={true}
                    owned={percentageQuantities[index]}
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
