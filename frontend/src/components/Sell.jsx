import { useLocation } from "react-router-dom";
import { useState } from "react";
import bg from "../assets/sell_bg.jpg";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import { getMarketContract } from "../utils/getBlockBid";
import { getContract } from "../utils/getNft721";
import Web3 from "web3";
import axios from "axios";

export default function Sell() {
  const location = useLocation();
  const { img_src, name, description, token_id, nft_address } = location.state;
  const [loadingController, setloadingController] = useState(false);
  const [timeSetterbox, setTimeSetterbox] = useState(true);
  const [price, setPrice] = useState(null);
  const [timeSetterboxStyle, setTimeSetterboxStyle] = useState("bg-gray-500");

  const buttonHandler = async (e) => {
    e.preventDefault();
    setloadingController(true);

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
    console.log(puttingMarketplaceBody);
    const response = await axios.put(
      "http://localhost:4988/putNftInMarketplace",
      puttingMarketplaceBody
    );

    setloadingController(false);
  };

  const auctionTick = () => {
    setTimeSetterbox(!timeSetterbox);
    if (timeSetterboxStyle === "bg-gray-500") {
      setTimeSetterboxStyle("");
    } else {
      setTimeSetterboxStyle("bg-gray-500");
    }
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

      <div class="bg-slate-400 bg-opacity-50 flex flex-col rounded-2xl shadow-lg max-w-[60%] p-5 items-center">
        <div class="w-full text-center">
          <h2 class="text-white font-bold text-8xl pb-10">Sell your NFT</h2>
        </div>
        <div class="flex w-full">
          <div class="md:w-1/2 px-6 md:px-10">
            <img alt="" class="rounded-2xl" src={img_src} />
          </div>
          <div class="md:w-1/2 px-3 md:px-10">
            <h2 class="font-bold text-8xl text-[#ffffff] font-shadows">
              {name}
            </h2>
            <p class="text-3xl mt-4 pt-4 text-[#ffffff]">{description}</p>

            <form action="" class="flex flex-col gap-4 mt-10">
              <div class="flex items-center justify-left gap-2 pt-3">
                <input
                  id="enableInput"
                  type="checkbox"
                  value=""
                  onClick={auctionTick}
                  class="w-6 h-6 text-yellow-400 bg-white border-green-600 rounded focus:ring-blue-400 focus:ring-2"
                />
                <label
                  htmlFor="enableInput"
                  class="font-bold text-xl text-white"
                >
                  Selling for auction?
                </label>
              </div>
              <label
                for="Time"
                class="block text-left font-bold text-2xl text-white"
              >
                Duration of the auction
              </label>
              <div class="flex justify-between items-center gap-2">
                <input
                  class={`p-2 rounded-xl border w-1/3 pl-2 text-xl ${timeSetterboxStyle} duration-300`}
                  type="number"
                  name="Day"
                  disabled={timeSetterbox}
                />
                <div class="font-bold text-xl text-white">Day(s)</div>
                <input
                  class={`p-2 rounded-xl border w-1/3 pl-2 text-xl ${timeSetterboxStyle} duration-300`}
                  type="number"
                  name="Hour"
                  disabled={timeSetterbox}
                />
                <div class="font-bold text-xl text-white">Min(s)</div>
                <input
                  class={`p-2 rounded-xl border w-1/3 pl-2 text-xl ${timeSetterboxStyle} duration-300`}
                  type="number"
                  name="Minute"
                  disabled={timeSetterbox}
                />
                <div class="font-bold text-xl text-white">Sec(s)</div>
              </div>
              <label
                for="Price"
                class="block text-left text-2xl font-bold text-white"
              >
                Set Your Price:
              </label>
              <input
                class="p-2 rounded-xl border mb-5"
                type="number"
                name="Price"
                placeholder="Enter price you want to sell for"
                onChange={(e) => setPrice(e.target.value)}
              />
              <button
                onClick={buttonHandler}
                class="bg-slate-800 rounded-xl text-3xl font-bold text-white py-2 mb-5 hover:scale-105 duration-300"
              >
                Sell !
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
