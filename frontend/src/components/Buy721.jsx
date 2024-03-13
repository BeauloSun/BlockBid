import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import bg from "../assets/bid_bg.jpg";
import LineChart from "../components/LineChart";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import { getMarketContract } from "../utils/getBlockBid";
import { getContract } from "../utils/getNft721";
import Web3 from "web3";
import axios from "axios";

export default function Buy721() {
  const { id } = useParams();
  const token_id = Number(id);
  const [loadingController, setloadingController] = useState(false);
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [rowData, setRowData] = useState([]);
  const [colName, setColName] = useState("");
  const [colData, setColData] = useState([]);
  const [data, setData] = useState({});
  const [mediaType, setMediaType] = useState("");
  const navigate = useNavigate();
  var isValid = false;

  useEffect(() => {
    const fetchData = async () => {
      let uri = null;
      try {
        const response = await axios.post(
          "http://localhost:4988/api/nfts/getAccessibleSaleNft",
          {
            token_id: token_id,
          }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
        isValid = response.data;
      } catch (err) {
        console.error(err);
      }

      if (isValid.length !== 0) {
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
              album_src: res.album_cover_uri,
              name: res.name,
              description: res.description,
              price: res.price,
            });
            const responseHistory = await axios.post(
              "http://localhost:3666/nft721history/getTokenHistory",
              {
                tokenId: token_id.toString(),
              }
            );
            let price = responseHistory.data["prices"];
            let dates = responseHistory.data["dates"];
            setRowData(dates);
            setColData(price);
            setColName("Price");
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
    const weiprice = Number(Web3.utils.toWei(data.price, "ether"));

    try {
      await marketPlace.methods
        .buyNft721(nftContract.options.address, Number(token_id))
        .send({ from: address, value: weiprice });

      const puttingProfileBody = {
        token_id: Number(token_id),
        nft_address: nftContract.options.address,
        owner: address,
        price: Number(data.price),
      };
      await axios.put(
        "http://localhost:4988/api/nfts/putNftInProfile",
        puttingProfileBody
      );

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
      const day = ("0" + currentDate.getDate()).slice(-2);

      const analyticsBody = {
        tokenId: token_id.toString(),
        price: data.price,
        date: `${year}-${month}-${day}`,
      };

      await axios.post(
        "http://localhost:3666/nft721history/addTokenHistory",
        analyticsBody
      );

      setMessage("Buy out successful!");
      setMessageClass("font-bold text-xl text-[#48f9ff]");
      setloadingController(false);
      navigate("/profile/holdings");
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
          <h2 className="text-white font-bold text-8xl pb-10">Buy NFT</h2>
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
                      backgroundImage: `url(${data.album_src})`,
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
                  <div className="h-10"></div>
                  <span className="text-4xl text-red-500 font-semibold">
                    Price: {data.price} ETH
                  </span>
                </div>
                <div className="text-left flex flex-col mt-[55%] gap-2 w-full">
                  <button
                    type="submit"
                    className="bg-slate-800 flex justify-center items-center w-full  rounded-xl text-3xl font-bold text-white px-4 py-2 hover:scale-105 duration-300"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-5 max-w-7xl bg-slate-500 m-auto bg-opacity-70 rounded-3xl">
        <LineChart
          className="w-full h-full"
          rowData={rowData}
          colName={colName}
          colData={colData}
        />
      </div>
    </div>
  );
}
