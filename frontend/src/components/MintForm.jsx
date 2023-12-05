import nft_mint from "../assets/minting_nft.png";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { pinFileToIPFS, pinJsonToIPFS } from "../utils/pinata";
import { getContract } from "../utils/getNft721";
import axios from "axios";

export default function Example() {
  // all the states
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [buttonLoading, setbuttonLoading] = useState(false);

  const formValid = async () => {
    setNameError(!name.trim() || name.trim().length > 50);
    setDescriptionError(!description.trim() || description.trim().length > 100);

    if (!name.trim() || !description.trim()) {
      setMessage("Name and Description cannot be empty");
      setMessageClass("font-bold text-lg text-red-600");
      return false;
    }

    if (name.trim().length > 50 || description.trim().length > 100) {
      setMessage(
        "Name cannot be longer than 50 characters\nDescription cannot be longer than 100 characters"
      );
      setMessageClass("font-bold text-lg text-red-600");
      return false;
    }
    setMessage("");
    return true;
  };

  const addNft = async (imageuri, walletaddr, imagehash, tokenid) => {
    const nftData = {
      token_id: tokenid,
      name,
      description,
      image_uri: imageuri,
      image_hash: imagehash,
      price: 0,
      owner: walletaddr,
      on_auction: false,
      on_sale: false,
      bids: {},
    };

    try {
      await axios.post("http://localhost:4988/addNfts", nftData);
      setName("");
      setDescription("");
      setImageFile(null);
      setMessage("Submission successful!");
      setMessageClass("font-bold text-lg text-[#48f9ff]");
    } catch (error) {
      console.error(error);
      setMessage("Submission failed!");
      setMessageClass("font-bold text-lg text-red-600");
    }
  };

  const storeFile = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  const pinata_Image = async (file, name) => {
    try {
      const response = await pinFileToIPFS(file);
      const pinataURL =
        "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash;
      return pinataURL;
    } catch (error) {
      console.error(error);
    }
  };

  const pinata_Json = async (name, description, imagehash) => {
    const jsonBody = {
      imageHash: imagehash,
      name: name,
      description: description,
    };
    const response = await pinJsonToIPFS(jsonBody);
    const pinataURL =
      "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash;
    return pinataURL;
  };

  const mintNFT = async (e) => {
    e.preventDefault();
    setbuttonLoading(true);
    if (await formValid()) {
      console.log("valid");
      try {
        const contract = await getContract();
        if (contract !== null) {
          if (window.localStorage.getItem("currentAddr") !== null) {
            // get the image and json hashes
            const imageuri = await pinata_Image(imageFile, name);
            const jsonhash = await pinata_Json(name, description, imageuri);

            const address = window.localStorage.getItem("currentAddr");

            const token_id = await contract.methods.getTokenId().call();
            await contract.methods
              .mintNft(address, jsonhash)
              .send({ from: address });
            const imagehash = "image_hash_placeholder";
            addNft(imageuri, address, imagehash, token_id.toString());
            setbuttonLoading(false);
          } else {
            console.error("wallet is not connected");
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    setTimeout(() => {
      setbuttonLoading(false);
    }, 500);
  };

  return (
    <div>
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
                className={`p-2 mt-8 rounded-xl border ${
                  nameError ? "border-red-500 border-2" : ""
                }`}
                type="name"
                name="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="relative">
                <input
                  className={`p-2 rounded-xl border w-full ${
                    descriptionError ? "border-red-500 border-2" : ""
                  }`}
                  type="description"
                  name="description"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                          onChange={storeFile}
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
              <p className={messageClass}>{message}</p>
              <button
                type="submit"
                className="bg-[#440074] flex justify-center items-center w-full rounded-xl text-3xl font-bold text-white px-4 py-2 hover:scale-105 duration-300"
                onClick={mintNFT}
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
                  "Mint !"
                )}
              </button>
            </form>
          </div>
          <div className="md:block hidden w-1/2">
            <img alt="" className="rounded-2xl" src={nft_mint} />
          </div>
        </div>
      </section>
    </div>
  );
}
