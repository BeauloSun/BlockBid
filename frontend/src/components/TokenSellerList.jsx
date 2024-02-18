import React, { useEffect, useState } from "react";
import bg from "../assets/seller_list_bg.jpg";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function TokenSellerList() {
  const { tokenid } = useParams();
  const tokenId = Number(tokenid);
  const [seller, setSeller] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const [price, setPrice] = useState([]);
  const [listingIds, setListingIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [tokenid, tokenId]);

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

        console.log(listingIds);
      } else {
        navigate("/NotFound");
      }
    } catch (error) {
      console.error(error);
    }
  };
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
              Seller list for Token ID_PLACEHOLDER
            </h1>
          </div>
          {listingIds.length <= 0 ? (
            <h1>No data</h1>
          ) : (
            <div className="flex justify-center w-2/3 bg-slate-600 bg-opacity-80 mx-auto rounded-3xl">
              <ul class="divide-y divide-gray-100 w-full mx-[5%]">
                {listingIds.map((item, index) => (
                  <li class="flex justify-between  py-5">
                    <Link
                      to={`/marketplace/ERC1155/Sale/${tokenId}/${listingIds[index]}`}
                      key={listingIds[index]}
                    >
                      <div key={index} class="flex min-w-0 gap-x-4">
                        <img
                          class="h-12 w-12 flex-none rounded-full bg-gray-50"
                          src="https://picsum.photos/50"
                          alt=""
                        />
                        <div class="min-w-0 mr-[30%]">
                          <p class="text-xl font-bold leading-6 text-white">
                            {seller[index]}
                          </p>
                        </div>
                      </div>
                      <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                        <p class="text-xl font-bold leading-6 text-white">
                          {quantity[index]}
                        </p>
                        <p class="text-lg font-semibold leading-6 text-blue-300">
                          {price[index]} / 1
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
