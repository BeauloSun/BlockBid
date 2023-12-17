import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import bg from "../assets/sell_bg.jpg";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import { getMarketContract } from "../utils/getBlockBid";
import { getContract } from "../utils/getNft721";
import Web3 from "web3";
import axios from "axios";

export default function Sell() {
  const { id } = useParams();
  const token_id = Number(id);
  const [loadingController, setloadingController] = useState(false);
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [timeSetterbox, setTimeSetterbox] = useState(true);
  const [price, setPrice] = useState(null);
  const [timeSetterboxStyle, setTimeSetterboxStyle] = useState("bg-gray-500");
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:4988/getNftById", {
          tokenId: token_id,
        });
        if (response.data && response.data.length > 0) {
          const res = response.data[0];
          setData({
            img_src: res.image_uri,
            name: res.name,
            description: res.description,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

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

  const buttonHandler = async (e) => {
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
          "http://localhost:4988/putNftInMarketplace",
          puttingMarketplaceBody
        );

        setMessage("Sell successful!");
        setMessageClass("font-bold text-xl text-[#48f9ff]");
        setPrice("");
        setloadingController(false);
        setTimeout(() => {
          setbuttonLoading(false);
          navigate("/marketplace");
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
            <img alt="" class="rounded-2xl" src={data.img_src} />
          </div>
          <div class="md:w-1/2 px-3 md:px-10">
            <h2 class="font-bold text-8xl text-[#ffffff] font-shadows">
              {data.name}
            </h2>
            <p class="text-3xl mt-4 pt-4 text-[#ffffff]">{data.description}</p>

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
              <div class="flex justify-between items-center">
                <input
                  class="p-2 rounded-xl border mb-3 pl-4 text-xl w-[60%]"
                  type="number"
                  name="Price"
                  value={price}
                  placeholder="Enter price"
                  onChange={(e) => setPrice(e.target.value)}
                />
                <div class="font-bold text-3xl text-white pr-10 mb-4">ETH</div>
              </div>
              <p className={messageClass}>{message}</p>
              <button
                type="submit"
                className="bg-slate-800 flex justify-center items-center w-full rounded-xl text-3xl font-bold text-white px-4 py-2 hover:scale-105 duration-300"
                onClick={buttonHandler}
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
                  "Sell !"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
