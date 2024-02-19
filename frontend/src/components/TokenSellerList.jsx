import React, { useEffect, useState } from "react";
import bg from "../assets/seller_list_bg.jpg";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function TokenSellerList() {
  const { tokenid } = useParams();
  const tokenId = Number(tokenid);
  const [hoveredIndex, setHoveredIndex] = useState(false);
  const [seller, setSeller] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const [price, setPrice] = useState([]);
  const [listingIds, setListingIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4988/api/nfts1155market/getNftsOnSaleByTokenId",
          { tokenId: tokenId }
        );

        if (response.data) {
          const seller = response.data.map((item) => item.seller);
          const quantity = response.data.map((item) => item.available_quantity);
          const price = response.data.map((item) => item.price);
          const listingIds = response.data.map((item) => item.listing_id);

          setSeller(seller);
          setQuantity(quantity);
          setPrice(price);
          setListingIds(listingIds);
        } else {
          navigate("/NotFound");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [navigate, tokenId]);
  return (
    <div>
      <div
        className="bg-yellow-300 py-10"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "150vh",
        }}
      >
        <div className="flex flex-col items-center w-full">
          <div className="flex justify-center w-2/3 bg-slate-600 bg-opacity-80 mx-auto rounded-3xl mb-5 py-3">
            <h1 className="text-white text-4xl font-bold">
              Seller list for Token
            </h1>
          </div>
          {listingIds.length <= 0 ? (
            <h1>No data</h1>
          ) : (
            <div className="flex justify-center w-2/3 bg-slate-600 bg-opacity-80 mx-auto rounded-3xl">
              <ul className="divide-y divide-gray-100 w-full mx-[5%]">
                {listingIds.map((item, index) => (
                  <Link
                    to={`/marketplace/ERC1155/Sale/${tokenId}/${listingIds[index]}`}
                    key={listingIds[index]}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <li className={`flex justify-between py-4 mx-[5%]`}>
                      <div className="flex flex-wrap min-w-0 pt-3 gap-x-4">
                        <img
                          className={`h-12 w-12 flex-none rounded-full bg-gray-50 ${
                            hoveredIndex === index
                              ? "scale-105 duration-300"
                              : ""
                          }`}
                          src="https://picsum.photos/50"
                          alt=""
                        />
                        <p
                          className={`text-xl font-bold pt-3 leading-6 ${
                            hoveredIndex === index
                              ? "text-yellow-400 scale-105 duration-300"
                              : "text-white"
                          } `}
                        >
                          {seller[index]}
                        </p>
                      </div>
                      <div
                        className={`hidden shrink-0 pt-3 sm:flex sm:flex-col sm:items-end ${
                          hoveredIndex === index ? "scale-110 duration-300" : ""
                        } `}
                      >
                        <p className="text-xl font-bold leading-6 text-white">
                          {quantity[index]} Tokens
                        </p>
                        <p className="text-lg font-semibold leading-6 text-blue-300">
                          {price[index]} ETH / Token
                        </p>
                      </div>
                    </li>
                    <div className="h-1 bg-slate-200"></div>
                  </Link>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
