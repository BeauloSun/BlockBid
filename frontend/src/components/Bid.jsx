import { useLocation } from "react-router-dom";
import bg from "../assets/bid_bg.jpg";
import { getMarketContract } from "../utils/getBlockBid";
import { getContract } from "../utils/getNft721";
import Web3 from "web3";
import axios from "axios";

export default function Bid() {
  const location = useLocation();
  const { img_src, name, description, price, token_id, nft_address } =
    location.state;

  const buyNft = async (e) => {
    e.preventDefault();
    //get the nft contract
    const nftContract = await getContract();
    // get the market place contract
    const marketPlace = await getMarketContract();
    // sell add the nft to the market place
    const address = window.localStorage.getItem("currentAddr");
    const weiprice = Number(Web3.utils.toWei(price, "ether"));

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
              Current Price: {price}
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

              <button class="bg-slate-800 rounded-xl text-3xl font-bold text-white py-2 hover:scale-105 duration-300">
                Place Bid
              </button>

              <button
                class="bg-slate-800 rounded-xl text-3xl font-bold text-white py-2 hover:scale-105 duration-300"
                onClick={buyNft}
              >
                Buy Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
