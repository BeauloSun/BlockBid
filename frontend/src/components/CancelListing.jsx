import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import bg from "../assets/sell_bg.jpg";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import { getMarketContract } from "../utils/getBlockBid";
import { getContract } from "../utils/getNft721";
import axios from "axios";
import Web3 from "web3";

export default function CancelListing() {
  const { id } = useParams();
  const token_id = Number(id);
  const [loadingController, setloadingController] = useState(false);
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [updateButtonLoading, setUpdateButtonLoading] = useState(false);
  const [updatePrice, setUpdatePrice] = useState(null);
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [data, setData] = useState({});
  const [mediaType, setMediaType] = useState("");
  const navigate = useNavigate();
  var isValid = false;
  let uri = null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4988/api/nfts/getAccessibleProfileNft",
          {
            tokenId: token_id,
            marketplace: true,
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
            uri = res.image_uri;
            setData({
              img_src: res.image_uri,
              albumUri: res.album_cover_uri,
              name: res.name,
              price: res.price,
              description: res.description,
            });
            response = await fetch(uri);
            let contentType = response.headers.get("Content-Type");
            setMediaType(contentType.split("/")[0]);
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

  const buttonHandler = async (e) => {
    e.preventDefault();

    setbuttonLoading(true);
    setloadingController(true);
    try {
      //get the nft contract
      const nftContract = await getContract();

      // get the market place contract
      const marketPlace = await getMarketContract();

      // sell add the nft to the market place
      const address = window.localStorage.getItem("currentAddr");

      await marketPlace.methods
        .cancelListing721(nftContract.options.address, Number(token_id))
        .send({ from: address });

      const puttingProfileBody = {
        token_id: token_id,
        nft_address: nftContract.options.address,
      };
      await axios.put(
        "http://localhost:4988/api/nfts/cancelListing",
        puttingProfileBody
      );

      setMessage("Cancel Successful");
      setMessageClass("font-bold text-xl text-[#48f9ff]");
      setloadingController(false);
      setTimeout(() => {
        setbuttonLoading(false);
        navigate("/profile/holdings");
      }, 800);
    } catch (error) {
      console.error(error);
      setMessage("Cancel failed!");
      setMessageClass("font-bold text-lg text-red-600");
      setloadingController(false);
      setTimeout(() => {
        setbuttonLoading(false);
      }, 500);
    }
  };

  const updatePriceHandler = async (e) => {
    e.preventDefault();
    setUpdateButtonLoading(true);
    console.log(updatePrice);
    try {
      const nftContract = await getContract();
      const marketPlace = await getMarketContract();
      const address = window.localStorage.getItem("currentAddr");
      const updatePriceNum = Number(Web3.utils.toWei(updatePrice, "ether"));

      await marketPlace.methods
        .updateListing(nftContract.options.address, token_id, updatePriceNum)
        .send({ from: address });

      await axios.post("http://localhost:4988/api/nfts/updatePrice", {
        tokenId: token_id,
        price: updatePrice,
      });
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      setUpdateButtonLoading(false);
      navigate("/marketplace/ERC721/Sale");
    }, 800);
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

      <div className="flex justify-center p-4 max-w-7xl bg-slate-400 m-auto bg-opacity-50 rounded-3xl">
        <div className="w-full text-center">
          <h2 className="text-white font-bold text-8xl pb-5">
            Manage Your Listing
          </h2>
        </div>
      </div>

      <div className="flex justify-center p-4 mt-5 max-w-7xl bg-slate-400 m-auto bg-opacity-50 rounded-3xl">
        <div className="my-6 sm:my-10">
          <div>
            <div className="grid gird-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-6 h-max">
              <div className="overflow-hidden rounded-xl">
                {mediaType === "image" && (
                  <img src={data.img_src} alt="" className="w-full" />
                )}

                {mediaType === "video" && (
                  <video className="w-full h-full" controls>
                    <source src={data.img_src} type="video/mp4" />
                  </video>
                )}

                {mediaType === "audio" && (
                  <div
                    className="pt-[80%] w-full h-full"
                    style={{
                      backgroundImage: `url(${data.albumUri})`,
                      backgroundSize: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <audio className="w-[99%] pl-[1%]" controls>
                      <source src={data.img_src} type="audio/mpeg" />
                    </audio>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-between pl-5">
                <div>
                  <h1 className="text-5xl text-white my-5 font-semibold ">
                    {data.name}
                  </h1>
                  <p className="my-3 text-slate-400 text-3xl leading-6 text-justify sm:text-left sm:mt-4">
                    Description: {data.description}
                  </p>
                  <p class="text-3xl mt-4 pt-4 text-red-500 font-bold">
                    Price {data.price} ETH
                  </p>
                </div>

                <form action="" class="flex flex-col gap-4 mt-10">
                  <label
                    for="Price"
                    className="block text-left text-2xl font-bold text-white"
                  >
                    Update your price
                  </label>
                  <div className="flex justify-between items-center">
                    <input
                      className="p-2 rounded-xl border mb-3 pl-4 text-xl w-[60%]"
                      type="number"
                      name="Price"
                      placeholder="Enter price"
                      value={updatePrice}
                      onChange={(e) => setUpdatePrice(e.target.value)}
                    />
                    <div className="font-bold text-3xl text-white pr-10 mb-4">
                      ETH
                    </div>
                  </div>
                  <div className={messageClass}>{message}</div>
                  <button
                    className="flex justify-center text-2xl items-center gap-2 w-full py-3 px-4 bg-blue-400 text-white font-bold rounded-xl ease-in-out duration-300 shadow-slate-600 hover:scale-105  lg:m-0 md:px-6"
                    type="submit"
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
                      <span>Cancel Listing !</span>
                    )}
                  </button>
                  <button
                    className="flex justify-center text-2xl items-center gap-2 w-full py-3 px-4 bg-green-400 text-gray-600 font-bold rounded-xl ease-in-out duration-300 shadow-slate-600 hover:scale-105  lg:m-0 md:px-6"
                    type="submit"
                    onClick={updatePriceHandler}
                  >
                    {updateButtonLoading ? (
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
                      <span>Update Price !</span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
