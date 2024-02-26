import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import bg from "../assets/bid_bg.jpg";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import { getMarketContract } from "../utils/getBlockBid";
import { getContract } from "../utils/getNft721";
import LineChart from "../components/LineChart";
import Web3 from "web3";
import axios from "axios";

export default function Bid1155() {
  const { id } = useParams();
  const token_id = Number(id);
  const [loadingController, setloadingController] = useState(false);
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [bid, setBid] = useState(null);
  const [prevBid, setPrevBid] = useState(0);
  const [bidInformation, setBidInformation] = useState("");
  const [hour, setHour] = useState(10);
  const [minute, setMinute] = useState(30);
  const [second, setSecond] = useState(30);
  const [rowData, setRowData] = useState([]);
  const [colName, setColName] = useState("");
  const [colData, setColData] = useState([]);
  const [auctionEndTime, setAuctionEndTime] = useState(null);
  const [data, setData] = useState({});
  const [bidHistory, setBidHistory] = useState({});
  const navigate = useNavigate();
  var isValid = false;
  const firstUpdate = useRef(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4988/api/nfts/getAccessibleAuctionNft",
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
            setData({
              img_src: res.image_uri,
              name: res.name,
              description: res.description,
              price: res.price,
            });
            var cur_highest_bid = res.price;
            const now = Math.floor(Date.now() / 1000); // Current Unix timestamp
            let timeLeft = res.auction_time - now; // Time left in seconds

            if (timeLeft < 0) timeLeft = 0; // If the end time has passed, set timeLeft to 0
            setAuctionEndTime(res.auction_time);
            setHour(Math.floor(timeLeft / 3600));
            setMinute(Math.floor((timeLeft % 3600) / 60));
            setSecond(timeLeft % 60);
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
          }

          try {
            const bids = await axios.post(
              "http://localhost:4988/api/nfts/getBids",
              {
                token_id: token_id,
              }
            );
            // sort the bids for display
            const obj = bids.data;
            let sortedKeys = Object.keys(obj).sort((a, b) => obj[b] - obj[a]);
            let sortedBids = {};
            for (let key of sortedKeys) {
              sortedBids[key] = obj[key];
            }
            setBidHistory(sortedBids);

            const highest_bids = await axios.post(
              "http://localhost:4988/api/nfts/getHighestBid",
              {
                token_id: token_id,
              }
            );
            if (highest_bids.data) {
              cur_highest_bid = highest_bids.data.price;
            }
            var bidded = sortedBids[window.localStorage.getItem("currentAddr")];
            var difference = 0;
            if (bidded) {
              difference = (cur_highest_bid - bidded).toFixed(5);
              setPrevBid(bidded);
            } else {
              difference = cur_highest_bid;
              setPrevBid(0);
            }
            const information = `Current highest bid is: ${cur_highest_bid} ETH. You need to bid more than ${difference} ETH.`;
            setBidInformation(information);
          } catch (err) {
            console.error(err);
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

  useEffect(() => {
    const countdown = setInterval(() => {
      if (second > 0) {
        setSecond(second - 1);
      }
      if (second === 0) {
        if (minute === 0) {
          if (hour === 0) {
            clearInterval(countdown);
          } else {
            setHour(hour - 1);
            setMinute(59);
            setSecond(59);
          }
        } else {
          setMinute(minute - 1);
          setSecond(59);
        }
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [hour, minute, second]);

  const formatTime = (time) => String(time).padStart(2, "0");

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const stop_auction = async () => {
      const now = Math.floor(Date.now() / 1000);
      let timeLeft = auctionEndTime - now;
      if (timeLeft < 0) {
        const nftContract = await getContract();
        const marketPlace = await getMarketContract();
        const nft_address = nftContract.options.address;
        const address = window.localStorage.getItem("currentAddr");
        try {
          await marketPlace.methods
            .auctionEnd(nft_address, Number(token_id))
            .send({ from: address });

          const highest_bid = await axios.post(
            "http://localhost:4988/api/nfts/getHighestBid",
            {
              token_id: Number(token_id),
            }
          );

          var highest_bidder = null;
          if (highest_bid.data) {
            highest_bidder = highest_bid.data.bidder;
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
            const day = ("0" + currentDate.getDate()).slice(-2);

            const analyticsBody = {
              tokenId: token_id.toString(),
              price: highest_bid.data.price,
              date: `${year}-${month}-${day}`,
            };

            await axios.post(
              "http://localhost:3666/nft721history/addTokenHistory",
              analyticsBody
            );
          }
          const auctionEndBody = {
            token_id: Number(token_id),
            nft_address: nftContract.options.address,
            owner: highest_bidder,
          };

          await axios.post(
            "http://localhost:4988/api/nfts/endAuction",
            auctionEndBody
          );

          setTimeout(() => {
            navigate("/NotFound");
          }, 1500);
        } catch (err) {
          console.error(err);
        }
      }
    };

    setTimeout(() => {
      stop_auction();
    }, 500);
  }, [auctionEndTime, token_id, navigate]);

  const formValid = async () => {
    if (!bid) {
      setMessage("Bid cannot be empty");
      setMessageClass("font-bold text-xl text-red-600");
      return false;
    }

    if (Number(bid) <= 0) {
      setMessage("Bid cannot be negative");
      setMessageClass("font-bold text-xl text-red-600");
      return false;
    }

    if (Number(bid) <= data.price) {
      setMessage("Bid needs to be greater than the current highest bids");
      setMessageClass("font-bold text-xl text-red-600");
      return false;
    }

    setMessage("");
    setMessageClass("");
    return true;
  };

  const bidNft = async (e) => {
    e.preventDefault();

    setbuttonLoading(true);

    if (await formValid()) {
      setloadingController(true);

      //get the nft contract
      const nftContract = await getContract();
      // get the market place contract
      const marketPlace = await getMarketContract();
      // sell add the nft to the market place
      const address = window.localStorage.getItem("currentAddr");
      const weiprice = Number(Web3.utils.toWei(bid - prevBid, "ether"));

      try {
        await marketPlace.methods
          .bid(Number(token_id))
          .send({ from: address, value: weiprice });

        const recordBidBody = {
          token_id: Number(token_id),
          nft_address: nftContract.options.address,
          bidder: address,
          price: Number(bid),
        };
        await axios.put(
          "http://localhost:4988/api/nfts/recordBid",
          recordBidBody
        );

        setMessage("Bid successful!");
        setMessageClass("font-bold text-xl text-[#48f9ff]");
        setloadingController(false);
        setTimeout(() => {
          setbuttonLoading(false);
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error(error);
        setMessage("Bid failed!");
        setMessageClass("font-bold text-lg text-red-600");
        setloadingController(false);
        setbuttonLoading(false);
      }
    } else {
      setTimeout(() => {
        setbuttonLoading(false);
      }, 500);
    }
  };

  return (
    <section
      class="bg-[#1e1e1e] min-h-screen flex flex-col items-center justify-center py-20"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "repeat-y",
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
            <img alt="" class="rounded-2xl" src={data.img_src} />
          </div>
          <div class="md:w-1/2 px-6 md:px-10">
            <h2 class="font-bold text-5xl text-[#ffffff] font-shadows">
              {data.name}
            </h2>
            <p class="text-3xl mt-4 pt-4 text-[#ffffff]">
              Current Price: {data.price} ETH
            </p>
            <p class="text-3xl mb-4 pt-4 text-[#ffffff]">
              Description: {data.description}
            </p>
            <p class="text-3xl mb-4 pt-4 text-[#ffffff]">Time remaining:</p>
            <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
              <div className="flex flex-col p-2 bg-slate-800 text-white rounded-xl">
                <span className="countdown font-mono text-5xl ">
                  <span>{formatTime(hour)}</span>
                </span>
                hours
              </div>
              <div className="flex flex-col p-2 bg-slate-800 text-white rounded-xl">
                <span className="countdown font-mono text-5xl ">
                  <span>{formatTime(minute)}</span>
                </span>
                min
              </div>
              <div className="flex flex-col p-2 bg-slate-800 text-white rounded-xl">
                <span className="countdown font-mono text-5xl">
                  <span>{formatTime(second)}</span>
                </span>
                sec
              </div>
            </div>

            <form action="" class="flex flex-col gap-4">
              <p className="font-bold text-xl mt-8 text-[#6dff48]">
                {bidInformation}
              </p>
              <p className="font-bold text-xl text-[#6dff48]">
                {bid ? (
                  bid >= prevBid ? (
                    `You will be paying ${(bid - prevBid).toFixed(
                      5
                    )} ETH for the new bid.`
                  ) : (
                    <span className="text-red-500">
                      Please enter a larger bid
                    </span>
                  )
                ) : (
                  ""
                )}
              </p>
              <input
                class="p-2 rounded-xl border"
                type="number"
                name="bid"
                placeholder="Enter your bid"
                value={bid}
                onChange={(e) => setBid(e.target.value)}
              />

              <p className={messageClass}>{message}</p>
              <button
                type="submit"
                className="bg-slate-800 flex justify-center items-center w-full rounded-xl text-3xl font-bold text-white px-4 py-2 hover:scale-105 duration-300"
                onClick={bidNft}
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
                  "Place Bid!"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="bg-slate-400 flex flex-col rounded-2xl mt-6 shadow-lg max-w-[1100px] w-[100%] items-center bg-opacity-50">
        <div class="w-full text-center">
          <LineChart
            className="w-full h-full"
            rowData={rowData}
            colName={colName}
            colData={colData}
          />
        </div>
      </div>

      <div class="bg-slate-400 flex flex-col rounded-2xl mt-6 shadow-lg py-10 max-w-[1100px] p-5 w-[100%] items-center bg-opacity-50">
        <div class="w-full text-center">
          <h2 class="text-white font-bold text-6xl pb-10">Bidding History</h2>
        </div>
        {Object.entries(bidHistory).map(([wallet_id, price], index) => (
          <div
            key={index}
            className="bg-[#a2a2a2] p-4 mb-4 flex justify-between w-[100%] bg-opacity-50 rounded-2xl"
          >
            <span className="text-white text-2xl font-bold">{wallet_id}</span>
            <span className="text-white text-2xl font-bold">{price} ETH</span>
          </div>
        ))}
      </div>
    </section>
  );
}
