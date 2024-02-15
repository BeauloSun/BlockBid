import nft_mint from "../assets/minting_nft_1155.jpg";
import bg from "../assets/mint_bg_1155.jpg";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { pinFileToIPFS, pinJsonToIPFS } from "../utils/pinata";
import { getContract } from "../utils/getNft1155";
import axios from "axios";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import { getImageHash } from "../utils/imageHash";

export default function MintForm1155() {
  // all the states
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [duplicateNftImageMessage, setDuplicateNftImageMessage] = useState("");
  const [duplicateNftImageMessageClass, setDuplicateNftImageMessageClass] =
    useState("");
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [pageLoading, setpageLoading] = useState(false);

  const handleImageUpload = (e) => {
    setImageFile(e.target.files[0]);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setPreviewImage(null);
    document.getElementById("file-upload").value = null;
  };

  const formValid = async (currentImageHash) => {
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

    if (quantity <= 0) {
      setMessage("Quantity cannot be 0");
      setMessageClass("font-bold text-lg text-red-600");
      return false;
    }
    if (quantity == 1) {
      setMessage("Please mint a erc721 Token if you want a unique token");
      setMessageClass("font-bold text-lg text-red-600");
      return false;
    }
    setMessage("");

    // checking if the image already exists in the data base

    const nft721Hashes = await axios.post(
      "http://localhost:4988/api/nfts/checkIfHashExists",
      {
        hash: currentImageHash,
      }
    );
    const nft1155Hashes = await axios.post(
      "http://localhost:4988/api/nfts1155/checkIfHashExists",
      {
        hash: currentImageHash,
      }
    );
    const nft1155MarketPlaceHases = await axios.post(
      "http://localhost:4988/api/nfts1155market/checkIfHashExists",
      {
        hash: currentImageHash,
      }
    );

    if (
      nft721Hashes.data != null ||
      nft1155Hashes.data != null ||
      nft1155MarketPlaceHases.data != null
    ) {
      setDuplicateNftImageMessage(
        "Image is already in the chain, use another one"
      );
      setDuplicateNftImageMessageClass("font-bold text-lg text-red-600");
      return false;
    }
    setDuplicateNftImageMessage("");

    return true;
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

  const addNft = async (
    imageuri,
    walletaddr,
    imagehash,
    tokenid,
    nftAddress
  ) => {
    const nftData = {
      token_id: tokenid,
      nft_address: nftAddress,
      name,
      description,
      total_quantity: quantity,
      image_uri: imageuri,
      image_hash: imagehash,
      price: 0,
      owners: { [walletaddr]: Number(quantity) },
    };

    try {
      await axios.post(
        "http://localhost:4988/api/nfts1155/addNfts1155",
        nftData
      );
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

  const mintNFT = async (e) => {
    e.preventDefault();
    setbuttonLoading(true);
    if (imageFile === null) {
      setMessage("Please upload an image.");
      setMessageClass("font-bold text-lg text-red-600");
      setbuttonLoading(false);
      return;
    }
    const currentImageHash = await getImageHash(imageFile);
    if (await formValid(currentImageHash)) {
      try {
        setpageLoading(true);
        const contract = await getContract();
        if (contract !== null) {
          if (window.localStorage.getItem("currentAddr") !== null) {
            // get the image and json hashes
            const imageuri = await pinata_Image(imageFile, name);
            const jsonhash = await pinata_Json(name, description, imageuri);

            const token_id = await contract.methods.getTokenId().call();
            const address = window.localStorage.getItem("currentAddr");

            await contract.methods
              .mint(address, quantity, jsonhash, [])
              .send({ from: address });

            addNft(
              imageuri,
              address,
              currentImageHash,
              token_id.toString(),
              contract.options.address
            );
            handleDeleteImage();
            setbuttonLoading(false);
            setpageLoading(false);
          } else {
            console.error("wallet is not connected");
          }
        }
      } catch (error) {
        setpageLoading(false);
        console.error(error);
      }
    }
    setTimeout(() => {
      setbuttonLoading(false);
    }, 500);
  };

  return (
    <div>
      <section
        className="bg-[#1e1e1e] min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {pageLoading ? (
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
        <div className="bg-slate-400 bg-opacity-60 flex rounded-2xl shadow-lg max-w-[1100px] p-5 items-center">
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
                  nameError ? "border-red-500" : ""
                } focus:outline-[#35fefe]`}
                type="name"
                name="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="relative">
                <input
                  className={`p-2 rounded-xl border w-full${
                    descriptionError ? "border-red-500" : ""
                  } focus:outline-[#35fefe]`}
                  type="description"
                  name="description"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="relative">
                <input
                  className={`p-2 rounded-xl border w-full${
                    descriptionError ? "border-red-500" : ""
                  } focus:outline-[#35fefe]`}
                  type="quantity"
                  name="quantity"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
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
                    {previewImage ? (
                      <>
                        <div className="flex justify-center py-3">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="rounded-xl max-w-[300px] max-h-[100px]"
                          />
                        </div>
                        <button
                          onClick={handleDeleteImage}
                          className="text-red-500 font-bold hover:text-red-700"
                        >
                          X Delete Image
                        </button>
                      </>
                    ) : (
                      <PhotoIcon
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                    )}
                    <div className="mt-4 flex text-sm leading-6 text-white font-bold">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-yellow-600 px-1 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-[#66f587]"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleImageUpload}
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
              <p className={duplicateNftImageMessageClass}>
                {duplicateNftImageMessage}
              </p>
              <button
                type="submit"
                className="bg-slate-800 flex justify-center items-center w-full rounded-xl text-3xl font-bold text-white px-4 py-2 hover:scale-105 duration-300"
                onClick={mintNFT}
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
                  "Mint !"
                )}
              </button>
            </form>
          </div>
          <div className="md:block hidden w-1/2">
            <img alt="" className="rounded-2xl opacity-80" src={nft_mint} />
          </div>
        </div>
      </section>
    </div>
  );
}
