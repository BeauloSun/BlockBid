import nft_mint from "../assets/minting_nft.png";
import { PhotoIcon } from "@heroicons/react/24/solid";

export default function MintForm() {
  return (
    <section class="bg-[#0f103e] min-h-screen flex items-center justify-center">
      <div class="bg-[#724fff] flex rounded-2xl shadow-lg max-w-[1100px] p-5 items-center">
        <div class="md:w-1/2 px-6 md:px-10">
          <h2 class="font-bold text-8xl text-[#ffffff] font-shadows">
            Minting
          </h2>
          <p class="text-3xl mt-4 pt-4 text-[#ffffff]">
            Take your first step to mint your own NFT !
          </p>

          <form action="" class="flex flex-col gap-4">
            <input
              class="p-2 mt-8 rounded-xl border"
              type="name"
              name="name"
              placeholder="Name"
            />
            <div class="relative">
              <input
                class="p-2 rounded-xl border w-full"
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

            <button class="bg-[#440074] rounded-xl text-3xl font-bold text-white py-2 hover:scale-105 duration-300">
              Mint !
            </button>
          </form>
        </div>
        <div class="md:block hidden w-1/2">
          <img alt="" class="rounded-2xl" src={nft_mint} />
        </div>
      </div>
    </section>
  );
}
