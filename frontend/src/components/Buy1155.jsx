import React from "react";
import bg from "../assets/bid_bg.jpg";
import { HiOutlineArrowCircleRight } from "react-icons/hi";
export default function Buy1155() {
  return (
    <div>
      <div
        className="py-[5%]"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex justify-center p-4 max-w-7xl bg-slate-400 m-auto bg-opacity-50 rounded-3xl">
          <div className="my-6 sm:my-10">
            <div>
              <div className="grid gird-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-6 h-max">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="https://i.imgur.com/zryxaH8.jpg" //IMAGE PLACEHOLDER
                    alt=""
                    className="w-full"
                  />
                  <div className="bg-yellow-300"></div>
                </div>
                <div className="flex flex-col justify-between pl-10">
                  <div>
                    <h1 className="text-5xl text-white my-5 font-semibold ">
                      NFT NAME PLACEHOLDER
                    </h1>
                    <p className="my-3 text-slate-400 text-3xl leading-6 text-justify sm:text-left sm:mt-4">
                      DESCRIPTION PLACEHOLDER
                    </p>

                    <div className="my-5">
                      <span className="text-xl text-red-500 font-semibold sm:text-2xl">
                        Available tokens: NUMBER OF TOTAL TOKEN ON SALE
                      </span>
                      <br></br>
                      <span className="text-xl text-red-500 font-semibold sm:text-2xl">
                        Price: PRICE PLACE HOLDER ETH / Token
                      </span>
                    </div>
                  </div>
                  <div className=" ">
                    <div className="text-left flex flex-col gap-2 w-full">
                      <label className="text-white text-xl font-semibold">
                        Quantity you want to buy:
                      </label>
                      <input
                        className="border border-gray-300 text-sm font-semibold mb-1 max-w-full w-full outline-none rounded-md m-0 py-3 px-4 md:py-3 md:px-4 md:mb-0 focus:border-blue-300"
                        type="number"
                        placeholder="Enter the quantity"
                        required
                      />
                    </div>

                    <div className="w-full text-left my-4">
                      <button
                        className="flex justify-center text-2xl items-center gap-2 w-full py-3 px-4 bg-blue-400 text-white font-bold rounded-lg ease-in-out duration-300 shadow-slate-600 hover:scale-105  lg:m-0 md:px-6"
                        title="Confirm Order"
                      >
                        <span>Buy !</span>
                        <HiOutlineArrowCircleRight />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-4 max-w-7xl bg-slate-400 m-auto mt-5 bg-opacity-50 rounded-3xl">
          <h1 className="text-5xl text-white my-5 font-semibold ">
            Owners List
          </h1>
          <div className="px-8 pb-1 border-b-2 border-white mb-4 flex justify-between w-[100%] bg-opacity-0 ">
            <span className="text-white text-2xl font-bold">Owner Address</span>
            <span className="text-white text-2xl font-bold">Quantity</span>
          </div>
          <div className="bg-[#a2a2a2] py-4 px-10 mb-4 flex justify-between w-[100%] bg-opacity-50 rounded-2xl">
            <span className="text-white text-2xl font-bold">
              OWNER ADDRESS PLACEHOLDER
            </span>
            <span className="text-white text-2xl font-bold">
              OWNER QUANTITY PLACEHOLDER
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
