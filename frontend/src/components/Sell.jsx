import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import bg from "../assets/sell_bg.jpg";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import { getMarketContract } from "../utils/getBlockBid";
import { getContract } from "../utils/getNft721";
import { getContract1155 } from "../utils/getNft1155";
import Web3 from "web3";
import axios from "axios";

export default function Sell() {
  const { id } = useParams();
  const token_id = Number(id);
  const [loadingController, setloadingController] = useState(false);
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [fractionBool, setFractionBool] = useState(false);
  const [fractionalizeButtonLoading, setFractionalizeButtonLoading] =
    useState(false);
  const [timeSetterbox, setTimeSetterbox] = useState(true);
  const [price, setPrice] = useState(null);
  const [priceMsg, setPriceMsg] = useState("Set Your Price");
  const [fractions, setFractions] = useState(null);
  const [days, setDays] = useState(null);
  const [hours, setHours] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [timeSetterboxStyle, setTimeSetterboxStyle] = useState("bg-gray-500");
  const [auctionBool, setAuctionBool] = useState(false);
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [data, setData] = useState({});
  const navigate = useNavigate();
  var isValid = false;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4988/api/nfts/getAccessibleProfileNft",
          {
            tokenId: token_id,
            marketplace: false,
            walletaddress: window.localStorage.getItem("currentAddr"),
          }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
        isValid = response.data;
      } catch (err) {
        console.error(err);
      }
      if (isValid) {
        try {
          const response = await axios.post(
            "http://localhost:4988/api/nfts/getNftById",
            {
              tokenId: token_id,
            }
          );
          if (response.data && response.data.length > 0) {
            const res = response.data[0];
            setData({
              img_src: res.image_uri,
              name: res.name,
              image_hash: res.image_hash,
              description: res.description,
            });
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        navigate("/NotFound");
      }
    };

    fetchData();
  }, [id, token_id]);

  const formValid = async () => {
    if (!price) {
      setMessage("Price cannot be empty");
      setMessageClass("font-bold text-xl text-red-600");
      return false;
    }

    if (Number(price) <= 0) {
      setMessage("Price cannot be negative");
      setMessageClass("font-bold text-xl text-red-600");
      return false;
    }

    setMessage("");
    setMessageClass("");
    return true;
  };

  const formValidFractions = async () => {
    if (fractions == null || Number(fractions) <= 0) {
      setMessage("Fractions cannot be null or less than 0");
      setMessageClass("font-bold text-xl text-red-600");
      return false;
    }
    return true;
  };

  const sellHandler = async (e) => {
    e.preventDefault();

    setbuttonLoading(true);
    if (await formValid()) {
      setloadingController(true);
      try {
        //get the nft contract
        const nftContract = await getContract();

        // get the market place contract
        const marketPlace = await getMarketContract();

        // sell add the nft to the market place
        const address = window.localStorage.getItem("currentAddr");

        await nftContract.methods
          .approve(marketPlace.options.address, token_id)
          .send({ from: address });

        const weiprice = Number(Web3.utils.toWei(price, "ether"));

        await marketPlace.methods
          .sellNft721(nftContract.options.address, Number(token_id), weiprice)
          .send({ from: address });

        const puttingMarketplaceBody = {
          token_id: token_id,
          nft_address: nftContract.options.address,
          owner: address,
          price: Number(price),
        };
        await axios.put(
          "http://localhost:4988/api/nfts/putNftInMarketplace",
          puttingMarketplaceBody
        );

        setMessage("Sell successful!");
        setMessageClass("font-bold text-xl text-[#48f9ff]");
        setPrice("");
        setloadingController(false);
        setTimeout(() => {
          setbuttonLoading(false);
          navigate("/marketplace/ERC721/Sale");
        }, 1500);
      } catch (error) {
        console.error(error);
        setMessage("Sell failed!");
        setMessageClass("font-bold text-lg text-red-600");
        setloadingController(false);
        setTimeout(() => {
          setbuttonLoading(false);
        }, 500);
      }
    }
  };

  const franctionalizeHandler = async (e) => {
    e.preventDefault();
    if ((await formValidFractions()) == true) {
      setloadingController(true);
      const address = window.localStorage.getItem("currentAddr");
      try {
        const nftContract = await getContract();

        const txn = await nftContract.methods
          .burnToken(token_id)
          .send({ from: address });

        if (txn) {
          await axios.delete(
            `http://localhost:4988/api/nfts/deleteNft/${token_id}`
          );
        }
      } catch (err) {
        console.log(err);
      }
      try {
        const nft1155 = await getContract1155();
        const nftAddress = await nft1155.options.address;

        const quantity = Number(fractions);
        const imageUri = data.img_src;

        const tokenId = await nft1155.methods.getTokenId().call();
        await nft1155.methods
          .mint(address, quantity, imageUri, [])
          .send({ from: address });

        const imageHash = data.image_hash;

        const nftData = {
          token_id: Number(tokenId),
          nft_address: nftAddress,
          name: data.name,
          description: data.description,
          total_quantity: quantity,
          image_uri: imageUri,
          image_hash: imageHash,
          price: 0,
          owners: { [address]: quantity },
        };
        await axios.post(
          "http://localhost:4988/api/nfts1155/addNfts1155",
          nftData
        );
        setloadingController(false);
        navigate("/profile/holdings");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const auctionHandler = async (e) => {
    e.preventDefault();

    setbuttonLoading(true);
    if (await formValid()) {
      setloadingController(true);
      try {
        //get the nft contract
        const nftContract = await getContract();

        // get the market place contract
        const marketPlace = await getMarketContract();

        // sell add the nft to the market place
        const address = window.localStorage.getItem("currentAddr");

        await nftContract.methods
          .approve(marketPlace.options.address, token_id)
          .send({ from: address });

        const weiprice = Number(Web3.utils.toWei(price, "ether"));
        const duration = days * 24 * 3600 + hours * 3600 + minutes * 60;

        await marketPlace.methods
          .auctionNft721(
            nftContract.options.address,
            Number(token_id),
            weiprice,
            duration
          )
          .send({ from: address });

        const time = await marketPlace.methods
          .getAuctionEndTime(Number(token_id))
          .call();

        const puttingAuctionMarketplaceBody = {
          token_id: token_id,
          nft_address: nftContract.options.address,
          owner: address,
          price: Number(price),
          time: Number(time),
        };

        await axios.put(
          "http://localhost:4988/api/nfts/putNftAuctionInMarketplace",
          puttingAuctionMarketplaceBody
        );

        setMessage("Sell successful!");
        setMessageClass("font-bold text-xl text-[#48f9ff]");
        setPrice("");
        setloadingController(false);
        setTimeout(() => {
          setbuttonLoading(false);
          navigate("/marketplace/ERC721/Auction");
        }, 800);
      } catch (error) {
        console.error(error);
        setMessage("Sell failed!");
        setMessageClass("font-bold text-lg text-red-600");
        setloadingController(false);
        setTimeout(() => {
          setbuttonLoading(false);
        }, 500);
      }
    }
  };

  const auctionTick = () => {
    setTimeSetterbox(!timeSetterbox);
    setAuctionBool(!auctionBool);
    if (timeSetterboxStyle === "bg-gray-500") {
      setTimeSetterboxStyle("");
      setPriceMsg("Set your starting price:");
    } else {
      setTimeSetterboxStyle("bg-gray-500");
      setPriceMsg("Set your price:");
    }
  };

  const fractionTick = () => {
    setFractionBool(!fractionBool);
  };

  return (
    <div
      className="py-[5%]"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {loadingController ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-[150px] h-[150px]">
            <DotLottiePlayer
              src="https://lottie.host/8a351e58-efa2-424e-a738-bf8a7ad5c16e/nyVDUynd67.lottie"
              autoplay
              loop
              playMode="bounce"
            />
          </div>
        </div>
      ) : (
        <span></span>
      )}

      <div className="flex justify-center p-4 max-w-7xl bg-slate-400 m-auto bg-opacity-50 rounded-3xl">
        <div className="w-full text-center">
          <h2 className="text-white font-bold text-8xl pb-10">Sell your NFT</h2>
        </div>
      </div>

      <div className="flex justify-center p-4 mt-5 max-w-7xl bg-slate-400 m-auto bg-opacity-50 rounded-3xl">
        <div className="my-6 sm:my-10">
          <div>
            <div className="grid gird-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-6 h-max">
              <div className="overflow-hidden rounded-xl">
                <img src={data.img_src} alt="" className="w-full" />
                <div className="bg-yellow-300"></div>
              </div>
              <div className="flex flex-col justify-between pl-5">
                <div>
                  <h1 className="text-5xl text-white my-5 font-semibold ">
                    {data.name}
                  </h1>
                  <p className="my-3 text-slate-400 text-3xl leading-6 text-justify sm:text-left sm:mt-4">
                    Description: {data.description}
                  </p>
                </div>

                <form action="" className="flex flex-col gap-4 mt-10">
                  <div className="flex items-center justify-left gap-2 pt-3">
                    <input
                      id="enableInput"
                      type="checkbox"
                      value=""
                      onClick={auctionTick}
                      class="w-6 h-6 text-yellow-400 bg-white border-green-600 rounded focus:ring-blue-400 focus:ring-2"
                    />
                    <label
                      htmlFor="enableInput"
                      className="font-bold text-xl text-white"
                    >
                      Selling for auction?
                    </label>
                  </div>
                  <div className="flex items-center justify-left gap-2 pt-3">
                    <input
                      id="enableInput"
                      type="checkbox"
                      value=""
                      onClick={fractionTick}
                      class="w-6 h-6 text-yellow-400 bg-white border-green-600 rounded focus:ring-blue-400 focus:ring-2"
                    />
                    <label
                      htmlFor="enableInput"
                      className="font-bold text-xl text-white"
                    >
                      Fractionalize it into 1155?
                    </label>
                  </div>

                  <label
                    for="Price"
                    className="block text-left text-2xl font-bold text-white"
                  >
                    {priceMsg}
                  </label>
                  <div className="flex justify-between items-center">
                    <input
                      className="p-2 rounded-xl border mb-3 pl-4 text-xl w-[60%]"
                      type="number"
                      name="Price"
                      placeholder="Enter price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <div className="font-bold text-3xl text-white pr-10 mb-4">
                      ETH
                    </div>
                  </div>
                  <label
                    for="Time"
                    className="block text-left font-bold text-2xl text-white"
                  >
                    Duration of the auction
                  </label>
                  <div className="flex justify-between items-center gap-2">
                    <input
                      className={`p-2 rounded-xl border w-1/3 pl-2 text-xl ${timeSetterboxStyle} duration-300`}
                      type="number"
                      name="Day"
                      disabled={timeSetterbox}
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                    />
                    <div className="font-bold text-xl text-white">Day(s)</div>
                    <input
                      className={`p-2 rounded-xl border w-1/3 pl-2 text-xl ${timeSetterboxStyle} duration-300`}
                      type="number"
                      name="Hour"
                      disabled={timeSetterbox}
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                    />
                    <div className="font-bold text-xl text-white">Hour(s)</div>
                    <input
                      className={`p-2 rounded-xl border w-1/3 pl-2 text-xl ${timeSetterboxStyle} duration-300`}
                      type="number"
                      name="Minute"
                      disabled={timeSetterbox}
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                    />
                    <div className="font-bold text-xl text-white">Min(s)</div>
                  </div>
                  <p className={messageClass}>{message}</p>
                  {auctionBool ? (
                    <button
                      className="flex justify-center text-2xl items-center gap-2 w-full py-3 px-4 bg-blue-400 text-white font-bold rounded-xl ease-in-out duration-300 shadow-slate-600 hover:scale-105  lg:m-0 md:px-6"
                      type="submit"
                      onClick={auctionHandler}
                    >
                      {buttonLoading ? (
                        <>
                          <svg
                            className="mr-5 h-6 w-6 animate-spin text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              stroke-width="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span> Processing... </span>
                        </>
                      ) : (
                        <span>Auction !</span>
                      )}
                    </button>
                  ) : (
                    <button
                      className="flex justify-center text-2xl items-center gap-2 w-full py-3 px-4 bg-blue-400 text-white font-bold rounded-xl ease-in-out duration-300 shadow-slate-600 hover:scale-105  lg:m-0 md:px-6"
                      type="submit"
                      onClick={sellHandler}
                    >
                      {buttonLoading ? (
                        <>
                          <svg
                            className="mr-5 h-6 w-6 animate-spin text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              stroke-width="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span> Processing... </span>
                        </>
                      ) : (
                        <span>Sell !</span>
                      )}
                    </button>
                  )}
                  {fractionBool ? (
                    <div>
                      <label
                        for="Price"
                        className="block text-left mb-2 text-2xl font-bold text-white"
                      >
                        The amount of token you want to fractionalize
                      </label>

                      <div className="flex justify-between items-center">
                        <input
                          className="p-2 rounded-xl border mb-3 pl-4 text-xl w-[60%]"
                          type="number"
                          name="Price"
                          placeholder="Enter Fractions"
                          value={fractions}
                          onChange={(e) => setFractions(e.target.value)}
                        />
                        <div className="font-bold text-3xl text-white pr-10 mb-4">
                          Tokens
                        </div>
                      </div>
                      <button
                        className="flex justify-center text-2xl items-center gap-2 w-full py-3 px-4 bg-green-400 text-gray-600 font-bold rounded-xl ease-in-out duration-300 shadow-slate-600 hover:scale-105  lg:m-0 md:px-6"
                        type="submit"
                        onClick={franctionalizeHandler}
                      >
                        {fractionalizeButtonLoading ? (
                          <>
                            <svg
                              className="mr-5 h-6 w-6 animate-spin text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span> Processing... </span>
                          </>
                        ) : (
                          <span>Fractionalize !</span>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
