import nft_mint from "../assets/minting_nft.png";
import { PhotoIcon } from "@heroicons/react/24/solid";
import nftcontract from "../backend-constants/nft721.json";
import { useState } from "react";
import Web3 from "web3";
import { pinFileToIPFS, pinJsonToIPFS } from "../utils/pinata";

export default function Example() {
  const [contract, setContract] = useState(null);
  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageUrl] = useState(null);
  const [jsonUrl, setJsonUrl] = useState(null);

  const getContract = async () => {
    return new Promise(async (resolve, reject) => {
      const contractAddress = nftcontract.address;
      const contractAbi = nftcontract.abi;
      if (window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);
        const mintcontract = new web3.eth.Contract(
          contractAbi,
          contractAddress
        );
        console.log("I am here");
        const token_id = await mintcontract.methods.getTokenId().call();
        console.log("minttokenid ", token_id);
        if (token_id !== null || token_id !== "undefined") {
          console.log("Connected to smart contract");
          setContract(mintcontract);
          resolve(mintcontract);
        } else {
          console.error("Not connected to smart contract");
          reject("not connected to smart contract");
        }
      } else {
        reject("Ethereum provider not found");
      }
    });
  };

  const storeFile = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  const hashImage = async (file, name) => {
    try {
      const response = await pinFileToIPFS(file);
      const pinataURL =
        "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash;
      setImageUrl(pinataURL);
      return pinataURL;
    } catch (error) {
      console.error(error);
    }
  };

  const hasJson = async (name, description, imagehash) => {
    const jsonBody = {
      imageHash: imagehash,
      name: name,
      description: description,
    };
    const response = await pinJsonToIPFS(jsonBody);
    const pinataURL =
      "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash;
    setJsonUrl(pinataURL);
    return pinataURL;
  };

  const mintNFT = async (e) => {
    e.preventDefault();
    const { name, description } = formParams;
    console.log("in mint function");
    const imagehash = await hashImage(imageFile, name);
    console.log("image url", imagehash);
    const jsonhash = await hasJson(name, description, imagehash);
    console.log("json url", jsonhash);
    try {
      const contract = await getContract();
      console.log(contract);
      if (contract !== null) {
        console.log("trying to mint");
        console.log("json url inside trying to mint", jsonhash);
        const id = await contract.methods
          .mintNft("0x4F8Bed052fADE364592d88c53c154AD3fE8Cb9Ef", jsonhash)
          .send({ from: "0x4F8Bed052fADE364592d88c53c154AD3fE8Cb9Ef" });
        console.log(id);
        const token_id = await contract.methods.getTokenId().call();
        console.log("token id after minting ", token_id);
      }
    } catch (error) {
      console.error(error);
    }
    // window.location.href = "/marketplace";
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
              onChange={(e) =>
                updateFormParams({ ...formParams, name: e.target.value })
              }
              value={formParams.name}
            />
            <div className="relative">
              <input
                className="p-2 rounded-xl border w-full"
                type="description"
                name="description"
                placeholder="Description"
                value={formParams.description}
                onChange={(e) =>
                  updateFormParams({
                    ...formParams,
                    description: e.target.value,
                  })
                }
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
            <button
              className="bg-[#440074] rounded-xl text-3xl font-bold text-white py-2 hover:scale-105 duration-300"
              onClick={mintNFT}
            >
              Mint !
            </button>
          </form>
        </div>
        <div className="md:block hidden w-1/2">
          <img alt="" className="rounded-2xl" src={nft_mint} />
        </div>
      </div>
    </section>
  );
}
