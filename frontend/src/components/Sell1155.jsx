import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import bg from "../assets/sell_bg.jpg";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import { getMarketContract1155 } from "../utils/getBlockBid1155";
import { getContract1155 } from "../utils/getNft1155";
import Web3 from "web3";
import axios from "axios";

export default function Sell1155() {
  const { id } = useParams();
  const token_id = Number(id);
  const [loadingController, setloadingController] = useState(false);
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [price, setPrice] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [owners, setOwners] = useState({});
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [data, setData] = useState({});
  const navigate = useNavigate();

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
          owned_quantity:
            res.owners[window.localStorage.getItem("currentAddr")],
          total_quantity: res.total_quantity,
        });
        let responseOwners = await axios.post(
          "http://localhost:4988/api/nfts1155/getOwners",
          {
            tokenId: token_id,
          }
        );
        setOwners(responseOwners.data);
      } else {
        navigate("/NotFound");
      }
    };

    fetchData();
  }, [navigate, token_id]);

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

        const puttingMarketplaceBody = {
          token_id: token_id,
          listing_id: listingId,
          nft_address: nftContract.options.address,
          name: data.name,
          description: data.description,
          available_quantity: quantity,
          image_uri: data.img_src,
          image_hash: data.image_hash,
          price: price,
          seller: address,
          buyers: {},
        };
        const res = await axios.post(
          "http://localhost:4988/api/nfts1155market/addNfts1155",
          puttingMarketplaceBody
        );

        setMessage("Sell successful!");
        setMessageClass("font-bold text-xl text-[#48f9ff]");
        setPrice("");
        setloadingController(false);
        setTimeout(() => {
          setbuttonLoading(false);
          navigate("/marketplace/ERC1155/Sale");
        }, 1500);
      } catch (error) {
        console.error(error);
        setMessage(
          "Sell failed! You cannot sell more token than you own, or you need to cancel your current listing on this token to post a new one."
        );
        setMessageClass("font-bold text-lg text-red-600");
        setloadingController(false);
        setTimeout(() => {
          setbuttonLoading(false);
        }, 500);
      }
    }
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

      <div className="flex justify-center p-4 mb-4 max-w-7xl bg-slate-400 m-auto bg-opacity-50 rounded-3xl">
        <div className="w-full text-center">
          <h2 className="text-white font-bold text-8xl pb-4">Sell your NFT</h2>
        </div>
      </div>

      <div className="flex justify-center p-4 max-w-7xl bg-slate-400 m-auto bg-opacity-50 rounded-3xl">
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
                    {data.description}
                  </p>
                </div>
                <div className=" ">
                  <div className="text-left flex flex-col gap-2 w-full">
                    <div className="my-5">
                      <span className="text-xl text-red-500 font-semibold sm:text-2xl">
                        You have: {data.owned_quantity} / {data.total_quantity}{" "}
                        tokens
                      </span>
                    </div>
                    <label className="text-white text-xl font-semibold">
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
                  </div>
                  <label className="text-white text-xl font-semibold">
                    Set The Price Per Token
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
                      ETH / Token
                    </div>
                  </div>
                  <p className={messageClass}>{message}</p>

                  <div className="w-full text-left my-4 mr-4">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-4 max-w-7xl bg-slate-400 m-auto mt-5 bg-opacity-50 rounded-3xl">
        <h1 className="text-5xl text-white my-5 font-semibold ">Owners List</h1>
        <div className="px-8 pb-1 border-b-2 border-white mb-4 flex justify-between w-[100%] bg-opacity-0 ">
          <span className="text-white text-2xl font-bold">Owner Address</span>
          <span className="text-white text-2xl font-bold">Quantity</span>
        </div>
        {Object.entries(owners).map(([address, quantity]) => (
          <div
            className="bg-[#a2a2a2] py-4 px-10 mb-4 flex justify-between w-[100%] bg-opacity-50 rounded-2xl"
            key={address}
          >
            <span className="text-white text-2xl font-bold">{address}</span>
            <span className="text-white text-2xl font-bold">{quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
