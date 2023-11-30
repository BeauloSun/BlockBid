import nft_mint from "../assets/minting_nft.png";
import { PhotoIcon } from "@heroicons/react/24/solid";
import nftcontract from "../backend-constants/nft721.json";
import { ethers } from "ethers";
import Web3 from "web3";

export default function Example() {
  const tryConnection = async () => {
    try {
      const contractAddress = nftcontract.address;
      const contractAbi = nftcontract.abi;
      const web3 = new Web3(window.ethereum);

      const contract = new web3.eth.Contract(contractAbi, contractAddress);

      const isConnected = await contract.methods.getTokenId().call();
      console.log(isConnected);
      if (isConnected != "undefined") {
        console.log("Connected to smart contract");
        // Proceed with contract interaction
      } else {
        console.error("Not connected to smart contract");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="bg-[#0f103e] min-h-screen flex items-center justify-center">
      <div className="bg-[#724fff] flex rounded-2xl shadow-lg max-w-[1100px] p-5 items-center">
        <div className="md:w-1/2 px-6 md:px-10">
          <h2 className="font-bold text-8xl text-[#ffffff] font-shadows">
            Minting
          </h2>
          <p className="text-3xl mt-4 pt-4 text-[#ffffff]">
            Take your first step to mint your own NFT !
          </p>

          <form action="" className="flex flex-col gap-4">
            <input
              className="p-2 mt-8 rounded-xl border"
              type="name"
              name="name"
              placeholder="Name"
            />
            <div className="relative">
              <input
                className="p-2 rounded-xl border w-full"
                type="description"
                name="description"
                placeholder="Description"
              />
            </div>

            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-xl font-medium leading-6 text-white"
              >
                Upload Image
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white px-6 py-10">
                <div className="text-center">
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-white font-bold">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-blue-500 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-red-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-white font-bold">
                    PNG, JPG, GIF up to 200MB
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={tryConnection}
              className="bg-[#440074] rounded-xl text-3xl font-bold text-white py-2 hover:scale-105 duration-300"
            >
              Mint !
            </button>
          </form>
          <button
            onClick={tryConnection}
            className="bg-[#440074] rounded-xl text-3xl font-bold text-white py-2 hover:scale-105 duration-300"
          >
            Mint !
          </button>
        </div>
        <div className="md:block hidden w-1/2">
          <img alt="" className="rounded-2xl" src={nft_mint} />
        </div>
      </div>
    </section>
  );
}
