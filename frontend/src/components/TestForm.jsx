import test_ph from "../assets/test_ph.jpg";
import { PhotoIcon } from "@heroicons/react/24/solid";

import axios from "axios";
import { useState } from "react";

export default function TestForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");

  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const addNft = async (event) => {
    event.preventDefault();

    // ------------------------validation------------------------

    setNameError(!name.trim() || name.trim().length > 50);
    setDescriptionError(!description.trim() || description.trim().length > 100);

    if (!name.trim() || !description.trim()) {
      setMessage("Name and Description cannot be empty");
      setMessageClass("font-bold text-lg text-red-600");
      return;
    }

    if (name.trim().length > 50 || description.trim().length > 100) {
      setMessage(
        "Name cannot be longer than 50 characters\nDescription cannot be longer than 100 characters"
      );
      setMessageClass("font-bold text-lg text-red-600");
      return;
    }
    // ------------------------validation------------------------

    const nftData = {
      nft_address: "0x1234asudhieo292903903jr23iorf",
      token_id: 1,
      name,
      description,
      image_uri: "ipfs://example.com/image.jpg",
      price: 3.2,
      owner: "0x567845a46312354aw1e",
      on_auction: true,
      on_sale: false,
      bids: {
        JS: 2.5,
        SG: 3.6,
        BM: 2.8,
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/addNfts",
        nftData
      );
      console.log(response.data);
      setName("");
      setDescription("");
      setMessage("Submission successful!");
      setMessageClass("font-bold text-lg text-[#48f9ff]");
    } catch (error) {
      console.error(error);
      setMessage("Submission failed!");
      setMessageClass("font-bold text-lg text-red-600");
    }
  };
  return (
    <section className="bg-[#0f103e] min-h-screen flex items-center justify-center">
      <div className="bg-[#724fff] flex rounded-2xl shadow-lg max-w-[1100px] p-5 items-center">
        <div className="md:w-1/2 px-6 md:px-10">
          <h2 className="font-bold text-8xl text-[#ffffff] font-shadows">
            The ultimate test
          </h2>
          <p className="text-3xl mt-4 pt-4 text-[#ffffff]">
            Comeon make it work !
          </p>

          <form action="" onSubmit={addNft} className="flex flex-col gap-4">
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
              className="bg-[#440074] rounded-xl text-3xl font-bold text-white py-2 hover:scale-105 duration-300"
            >
              Add to DB
            </button>
          </form>
        </div>
        <div className="md:block hidden w-1/2">
          <img alt="" className="rounded-2xl" src={test_ph} />
        </div>
      </div>
    </section>
  );
}