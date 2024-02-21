import React, { useEffect, useState } from "react";
import bg from "../assets/bid_bg.jpg";
import { HiOutlineArrowCircleRight } from "react-icons/hi";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getMarketContract1155 } from "../utils/getBlockBid1155";
import { getContract1155 } from "../utils/getNft1155";
import LineChart from "../components/LineChart";
import Web3 from "web3";

export default function Buy1155() {
  const { tokenid, id } = useParams();
  const tokenId = Number(tokenid);
  const listingId = Number(id);
  const [buyData, setBuyData] = useState({});
  const [ownersData, setOnwersData] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [colName, setColName] = useState("");
  const [colData, setColData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [listingId, tokenId]);

  const fetchData = async () => {
    try {
      const marketResponse = await axios.post(
        "http://localhost:4988/api/nfts1155market/getOneNftByTokenIdAndListingId",
        {
          tokenId: tokenId,
          listingId: listingId,
        }
      );
      if (marketResponse.data) {
        setBuyData({
          image: marketResponse.data.image_uri,
          name: marketResponse.data.name,
          description: marketResponse.data.description,
          quantity: marketResponse.data.available_quantity,
          price: marketResponse.data.price,
          seller: marketResponse.data.seller,
        });
      }

      const nftResponse = await axios.post(
        "http://localhost:4988/api/nfts1155/getOneNft",
        {
          token_id: tokenId,
        }
      );

      if (nftResponse.data) {
        const res = nftResponse.data.owners;
        setOnwersData(res);
      }

      const responseHistory = await axios.post(
        "http://localhost:3666/nft1155history/getTokenHistory",
        {
          tokenId: tokenId.toString(),
        }
      );
      console.log(responseHistory);
      let price = responseHistory.data["prices"];
      let dates = responseHistory.data["dates"];
      setRowData(dates);
      setColData(price);
      setColName("Price");
    } catch (err) {
      console.log(err);
    }
  };

  const checkUserNotOwner = (address) => {
    if (buyData.seller === address) {
      return false;
    }
    return true;
  };

  const changeNft1155Database = async (buyerAddress) => {
    try {
      await axios.post(
        "http://localhost:4988/api/nfts1155/updateOwnerAndQuantity",
        {
          token_id: tokenId,
          quantity: quantity,
          address: buyerAddress,
          seller_address: buyData.seller,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const changeNft1155MarketDatabase = async (address) => {
    try {
      await axios.post("http://localhost:4988/api/nfts1155market/buyNFT", {
        buyerAddress: address,
        quantity: quantity,
        listingId: listingId,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const BuyNft = async (e) => {
    e.preventDefault();
    let txn = null;
    try {
      //get the nft contract
      const nftContract = await getContract1155();

      // get the market place contract
      const marketPlace = await getMarketContract1155();

      // sell add the nft to the market place
      const address = window.localStorage.getItem("currentAddr");
      const weiprice = Number(
        Web3.utils.toWei(buyData.price * quantity, "ether")
      );

      if (checkUserNotOwner(address)) {
        console.log(quantity, listingId);
        txn = await marketPlace.methods
          .BuyNft1155(nftContract.options.address, quantity, listingId)
          .send({ from: address, value: weiprice });

        if (txn) {
          changeNft1155Database(address);
          changeNft1155MarketDatabase(address);
        }
        // updating the databases

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        const day = ("0" + currentDate.getDate()).slice(-2);

        const analyticsBody = {
          tokenId: tokenId.toString(),
          price: buyData.price,
          date: `${year}-${month}-${day}`,
        };

        await axios.post(
          "http://localhost:3666/nft1155history/addTokenHistory",
          analyticsBody
        );
      }
      navigate("/profile/holdings");
    } catch (error) {
      console.log("This is transaction", txn);
      console.error(error);
    }
  };

  return (
    <div>
      <div
        className="py-[5%]"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex justify-center p-4 max-w-7xl bg-slate-400 m-auto bg-opacity-50 rounded-3xl">
          <div className="my-6 sm:my-10">
            <div>
              <div className="grid gird-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-6 h-max">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={buyData.image} //IMAGE PLACEHOLDER
                    alt=""
                    className="w-full"
                  />
                  <div className="bg-yellow-300"></div>
                </div>
                <div className="flex flex-col justify-between pl-10">
                  <div>
                    <h1 className="text-5xl text-white my-5 font-semibold ">
                      Name: {buyData.name}
                    </h1>
                    <p className="my-3 text-slate-400 text-3xl leading-6 text-justify sm:text-left sm:mt-4">
                      Description: {buyData.description}
                    </p>

                    <div className="my-5">
                      <span className="text-xl text-red-500 font-semibold sm:text-2xl">
                        Quantity: {buyData.quantity}
                      </span>
                      <br></br>
                      <span className="text-xl text-red-500 font-semibold sm:text-2xl">
                        Price: {buyData.price} ETH / token
                      </span>
                    </div>
                  </div>
                  <div className=" ">
                    <div className="text-left flex flex-col gap-2 w-full">
                      <label className="text-white text-xl font-semibold">
                        Quantity you want to buy:
                      </label>
                      <input
                        className="border border-gray-300 text-sm font-semibold mb-1 max-w-full w-full outline-none rounded-md m-0 py-3 px-4 md:py-3 md:px-4 md:mb-0 focus:border-blue-300"
                        type="number"
                        placeholder="Enter the quantity"
                        required
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>

                    <div className="w-full text-left my-4">
                      <button
                        onClick={BuyNft}
                        className="flex justify-center text-2xl items-center gap-2 w-full py-3 px-4 bg-blue-400 text-white font-bold rounded-lg ease-in-out duration-300 shadow-slate-600 hover:scale-105  lg:m-0 md:px-6"
                        title="Confirm Order"
                      >
                        <span>Buy !</span>
                        <HiOutlineArrowCircleRight />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center max-w-7xl bg-slate-400 m-auto mt-5 bg-opacity-50 rounded-3xl">
          <LineChart
            className="w-full h-full"
            rowData={rowData}
            colName={colName}
            colData={colData}
          />
        </div>

        <div className="flex flex-col items-center justify-center p-4 max-w-7xl bg-slate-400 m-auto mt-5 bg-opacity-50 rounded-3xl">
          <h1 className="text-5xl text-white my-5 font-semibold ">
            Owners List
          </h1>
          <div className="px-8 pb-1 border-b-2 border-white mb-4 flex justify-between w-[100%] bg-opacity-0 ">
            <span className="text-white text-2xl font-bold">Owner Address</span>
            <span className="text-white text-2xl font-bold">Quantity</span>
          </div>
          {Object.entries(ownersData).map(([address, quantity], index) => (
            <div
              key={index}
              className="bg-[#a2a2a2] py-4 px-10 mb-4 flex justify-between w-[100%] bg-opacity-50 rounded-2xl"
            >
              <span className="text-white text-2xl font-bold">{address}</span>
              <span className="text-white text-2xl font-bold">{quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
