import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import bg from "../assets/sell_bg.jpg";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import { getMarketContract1155 } from "../utils/getBlockBid1155";
import { getContract1155 } from "../utils/getNft1155";
import Web3 from "web3";
import axios from "axios";
import img_tmp1 from "../assets/nft1.jpg";

export default function Sell1155() {
  const { id } = useParams();
  const token_id = Number(id);
  const [loadingController, setloadingController] = useState(false);
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [price, setPrice] = useState(null);
  const [priceMsg, setPriceMsg] = useState("Set Your Price");
  const [quantity, setQuantity] = useState(null);
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [data, setData] = useState({});
  const navigate = useNavigate();
  var isValid = false;

  useEffect(() => {
    const fetchData = async () => {
      let isValid = false;
      let response = null;
      try {
        response = await axios.post(
          "http://localhost:4988/api/nfts1155/getANft",
          {
            tokenId: token_id,
            ownerAddress: window.localStorage.getItem("currentAddr"),
          }
        );
        if (response.data) {
          isValid = true;
        }
      } catch (err) {
        console.error(err);
      }
      if (isValid) {
        const res = response.data;
        setData({
          img_src: res.image_uri,
          name: res.name,
          description: res.description,
          image_hash: res.image_hash,
        });
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

    if (!quantity || quantity <= 0) {
      setMessage("Quantity needs to be greater than 0");
      setMessageClass("font-bold text-xl text-red-600");
      return false;
    }

    setMessage("");
    setMessageClass("");
    return true;
  };

  const sellHandler = async (e) => {
    e.preventDefault();

    setbuttonLoading(true);
    if (await formValid()) {
      setloadingController(true);
      try {
        //get the nft contract
        const nftContract = await getContract1155();

        // get the market place contract
        const marketPlace = await getMarketContract1155();

        // sell add the nft to the market place
        const address = window.localStorage.getItem("currentAddr");

        await nftContract.methods
          .setApprovalForAll(marketPlace.options.address, true)
          .send({ from: address });

        const weiprice = Number(Web3.utils.toWei(price, "ether"));

        const txnDetails = await marketPlace.methods
          .SellNft1155(
            nftContract.options.address,
            Number(token_id),
            weiprice,
            quantity
          )
          .send({ from: address });

        const listingId = Number(txnDetails.events.ListedNft1155.data);

        console.log("Listing ID ", listingId);

        const puttingMarketplaceBody = {
          token_id: token_id,
          listing_id: listingId,
          nft_address: nftContract.options.address,
          name: data.name,
          description: data.description,
          available_quantity: quantity,
          image_uri: data.img_src,
          image_hash: data.image_hash,
          price: weiprice,
          owner: address,
          buyers: {},
        };
        const res = await axios.post(
          "http://localhost:4988/api/nfts1155market/addNfts1155",
          puttingMarketplaceBody
        );
        console.log(res);

        setMessage("Sell successful!");
        setMessageClass("font-bold text-xl text-[#48f9ff]");
        setPrice("");
        setloadingController(false);
        setTimeout(() => {
          setbuttonLoading(false);
          // navigate("/marketplace/ERC721/Sale");
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

  return (
    <section
      className="bg-[#1e1e1e] min-h-screen flex items-center justify-center"
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

      <div className="bg-slate-400 bg-opacity-50 flex flex-col rounded-2xl shadow-lg max-w-[60%] p-5 items-center">
        <div className="w-full text-center">
          <h2 className="text-white font-bold text-8xl pb-10">Sell your NFT</h2>
        </div>
        <div className="flex w-full">
          <div className="md:w-1/2 px-6 md:px-10">
            <img alt="" className="rounded-2xl" src={data.img_src} />
          </div>
          <div className="md:w-1/2 px-3 md:px-10">
            <h2 className="font-bold text-8xl text-[#ffffff] font-shadows">
              {data.name}
            </h2>
            <p className="text-3xl mt-4 pt-4 text-[#ffffff]">
              {data.description}
            </p>

            <form action="" className="flex flex-col gap-4 mt-10">
              <label
                for="Price"
                className="block text-left text-2xl font-bold text-white"
              >
                Set Your Quantity
              </label>
              <div className="flex justify-between items-center">
                <input
                  className="p-2 rounded-xl border mb-3 pl-4 text-xl w-[60%]"
                  type="number"
                  name="Quantity"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <div className="font-bold text-3xl text-white pr-10 mb-4">
                  Tokens
                </div>
              </div>
              <label
                for="Price"
                className="block text-left text-2xl font-bold text-white"
              >
                Set Your Price Per Token
              </label>
              <div className="flex justify-between items-center">
                <input
                  className="p-2 rounded-xl border mb-3 pl-4 text-xl w-[60%]"
                  type="number"
                  name="Price"
                  placeholder="Enter price per token"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <div className="font-bold text-3xl text-white pr-10 mb-4">
                  ETH
                </div>
              </div>

              <p className={messageClass}>{message}</p>

              <button
                type="submit"
                className="bg-slate-800 flex justify-center items-center w-full rounded-xl text-3xl font-bold text-white px-4 py-2 hover:scale-105 duration-300"
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
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}