import React, { useState, useEffect, useCallback, useRef } from "react";
import CardC from "../components/CardC";
import { Link } from "react-router-dom";
import axios from "axios";
import { getContract } from "../utils/getNft721";

export const ListedHoldings = () => {
  const [images, setImages] = useState([]);
  const [album_src, setAlbum_src] = useState([]);
  const [name, setName] = useState([]);
  const [tokenIds, setTokenIds] = useState([]);
  const [description, setDescription] = useState([]);
  const [price, setPrice] = useState([]);
  const [onSale, setOnSale] = useState([]);
  const [onAuction, setOnAuction] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [images1155, setImages1155] = useState([]);
  const [album_src1155, setAlbum_src1155] = useState([]);
  const [name1155, setName1155] = useState([]);
  const [tokenIds1155, setTokenIds1155] = useState([]);
  const [listingIds1155, setListingIds1155] = useState([]);
  const [description1155, setDescription1155] = useState([]);
  const [price1155, setPrice1155] = useState([]);
  const [onAuction1155, setOnAuction1155] = useState([]);
  const [totalAmount, setTotalAmount] = useState([]);
  const [amountOnSale, setAmountOnSale] = useState([]);

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

  const fetchData = useCallback(async () => {
    try {
      const tokens = await getOwnerNfts();
      const response = await axios.post(
        "http://localhost:4988/api/nfts/getListedOwnedNft",
        {
          tokenIds: tokens,
        }
      );
      const names = response.data.map((item) => item.name);
      const descriptions = response.data.map((item) => item.description);
      const prices = response.data.map((item) => item.price);
      const images = response.data.map((item) => item.image_uri);
      const albums = response.data.map((item) => item.album_cover_uri);
      const tokenids = response.data.map((item) => item.token_id);
      const onSales = response.data.map((item) => item.on_sale);
      const onAuctions = response.data.map((item) => item.on_auction);

      setName(names);
      setDescription(descriptions);
      setPrice(prices);
      setImages(images);
      setAlbum_src(albums);
      setTokenIds(tokenids);
      setOnSale(onSales);
      setOnAuction(onAuctions);

      const address = window.localStorage.getItem("currentAddr");

      const response1155 = await axios.post(
        "http://localhost:4988/api/nfts1155market/getNftOwnedByUser",
        { user: address }
      );

      const name1155 = response1155.data.map((item) => item.name);
      const description1155 = response1155.data.map((item) => item.description);
      const price1155 = response1155.data.map((item) => item.description);
      const images1155 = response1155.data.map((item) => item.image_uri);
      const albums1155 = response.data.map((item) => item.album_cover_uri);
      const listingIds1155 = response1155.data.map((item) => item.listing_id);
      const onAuction1155 = response1155.data.map((item) => item.on_auction);
      console.log(onAuction1155);
      const amountOnsale = response1155.data.map(
        (item) => item.available_quantity
      );
      const tokenIds1155 = response1155.data.map((item) => item.token_id);
      const response1155Total = await axios.post(
        "http://localhost:4988/api/nfts1155/getOwnedNft",
        {
          tokenIds: tokenIds1155,
        }
      );
      const totalAmount = response1155Total.data.map(
        (item) => item.total_quantity
      );

      setName1155(name1155);
      setDescription1155(description1155);
      setPrice1155(price1155);
      setImages1155(images1155);
      setAlbum_src1155(albums1155);
      setTokenIds1155(tokenIds1155);
      setListingIds1155(listingIds1155);
      setTotalAmount(totalAmount);
      setOnAuction1155(onAuction1155);
      setAmountOnSale(amountOnsale);
      console.log("amount on sale", totalAmount);
    } catch (error) {
      console.error(error);
    }
  }, [setName, setDescription, setPrice, setImages, setTokenIds]);

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
      ) : (tokenIds.length > 0) | (tokenIds1155.length > 0) ? (
        <div>
          <div className="flex justify-center bg-slate-400 space-x-6 py-3 mx-auto mt-15 max-w-[1000px] rounded-3xl bg-opacity-50">
            <div className="flex items-center">
              <div className="w-10 h-6 bg-blue-300 mr-2 rounded-xl"></div>
              <span className="font-semibold text-white text-lg">
                On Sale ERC721
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-6 bg-yellow-300 mr-2 rounded-xl"></div>
              <span className="font-semibold text-white text-lg">
                On Auction ERC721
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-6 bg-green-300 mr-2 rounded-xl"></div>
              <span className="font-semibold text-white text-lg">
                On Sale ERC1155
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-6 bg-red-300 mr-2 rounded-xl"></div>
              <span className="font-semibold text-white text-lg">
                On Auction ERC1155
              </span>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 mx-[5%]">
              {images.map((img_src, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center py-4 hover:scale-105 duration-300"
                >
                  <Link
                    to={
                      onAuction[index]
                        ? `/marketplace/ERC721/Auction/${tokenIds[index]}`
                        : `/profile/listed_holdings/${tokenIds[index]}`
                    }
                    key={tokenIds[index]}
                  >
                    <CardC
                      img_src={img_src}
                      album_src={album_src[index]}
                      name={name[index]}
                      description={description[index]}
                      price={price[index]}
                      onSale={onSale[index]}
                      onAuction={onAuction[index]}
                    />
                  </Link>
                </div>
              ))}
              {images1155.map((img_src, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center py-4 hover:scale-105 duration-300"
                >
                  <Link
                    to={
                      onAuction1155[index]
                        ? `/marketplace/ERC1155/Auction/${tokenIds1155[index]}`
                        : `/profile/listed_holdings/1155/${listingIds1155[index]}`
                    }
                    key={tokenIds1155[index]}
                  >
                    <CardC
                      img_src={img_src}
                      album_src={album_src1155[index]}
                      name={name1155[index]}
                      description={description1155[index]}
                      price={price1155[index]}
                      is1155={true}
                      onSale={true}
                      onAuction={onAuction1155[index]}
                      owned={(
                        (amountOnSale[index] / totalAmount[index]) *
                        100
                      ).toFixed(2)}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-[#b3b3b3] text-4xl mt-20 flex justify-center">
          You currently have no listings.
        </div>
      )}
    </div>
  );
};
