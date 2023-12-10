import { useLocation } from "react-router-dom";
import { useState } from "react";
import bg from "../assets/bid_bg.jpg";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import { getMarketContract } from "../utils/getBlockBid";
import { getContract } from "../utils/getNft721";
import Web3 from "web3";
import axios from "axios";

export default function Bid() {
  const location = useLocation();
  const { img_src, name, description, price, token_id, nft_address } =
    location.state;
  const [loadingController, setloadingController] = useState(false);
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");

  const buyNft = async (e) => {
    e.preventDefault();

    setbuttonLoading(true);
    setloadingController(true);

    //get the nft contract
    const nftContract = await getContract();
    // get the market place contract
    const marketPlace = await getMarketContract();
    // sell add the nft to the market place
    const address = window.localStorage.getItem("currentAddr");
    const weiprice = Number(Web3.utils.toWei(price, "ether"));

    try {
      await marketPlace.methods
        .buyNft721(nftContract.options.address, Number(token_id))
        .send({ from: address, value: weiprice });

      const puttingProfileBody = {
        token_id: Number(token_id),
        nft_address: nftContract.options.address,
        owner: address,
        price: Number(price),
      };
      await axios.put(
        "http://localhost:4988/putNftInProfile",
        puttingProfileBody
      );
      setMessage("Buy out successful!");
      setMessageClass("font-bold text-xl text-[#48f9ff]");
      setloadingController(false);
    } catch (error) {
      console.error(error);
      setMessage("Buy out failed!");
      setMessageClass("font-bold text-lg text-red-600");
      setloadingController(false);
    }
    setTimeout(() => {
      setbuttonLoading(false);
    }, 500);
  };

  return (
    <section
      class="bg-[#1e1e1e] min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {loadingController ? (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="w-[150px] h-[150px]">
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
      <div class="bg-slate-400 flex flex-col rounded-2xl shadow-lg py-10 max-w-[1100px] p-5 items-center bg-opacity-50">
        <div class="w-full text-center">
          <h2 class="text-white font-bold text-8xl pb-10">Place your bid</h2>
        </div>
        <div class="flex w-full">
          <div class="md:w-1/2 px-6 md:px-10">
            <img alt="" class="rounded-2xl" src={img_src} />
          </div>
          <div class="md:w-1/2 px-6 md:px-10">
            <h2 class="font-bold text-5xl text-[#ffffff] font-shadows">
              {name}
              {token_id}
            </h2>
            <p class="text-3xl mt-4 pt-4 text-[#ffffff]">
              Current Price: {price} ETH
            </p>
            <p class="text-3xl mt-4 pt-4 text-[#ffffff]">{description}</p>
            <p class="text-3xl mt-4 pt-4 text-[#ffffff]">
              Time Left: 10 minutes
            </p>

            <form action="" class="flex flex-col gap-4">
              <input
                class="p-2 mt-8 rounded-xl border"
                type="number"
                name="bid"
                placeholder="Enter your bid"
              />
              <p className={messageClass}>{message}</p>
              <button class="bg-slate-800 rounded-xl text-3xl font-bold text-white py-2 hover:scale-105 duration-300">
                Place Bid
              </button>

              <button
                type="submit"
                className="bg-slate-800 flex justify-center items-center w-full rounded-xl text-3xl font-bold text-white px-4 py-2 hover:scale-105 duration-300"
                onClick={buyNft}
              >
                {buttonLoading ? (
                  <>
                    <svg
                      class="mr-5 h-6 w-6 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span> Processing... </span>
                  </>
                ) : (
                  "Buy Out!"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
