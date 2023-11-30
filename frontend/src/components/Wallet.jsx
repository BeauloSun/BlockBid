import { PhotoIcon } from "@heroicons/react/24/solid";

import metamask from "../assets/metamask_icon.png";

export default function Wallet() {
  const bg =
    "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/card-visa.jpg";
  return (
    <div>
      <div class="flex justify-center max-w-[1250px] mx-auto">
        <div class="flex mx-auto px-4 mb-6 break-words bg-transparent border-0 border-transparent border-solid shadow-xl rounded-2xl bg-clip-border">
          <div
            class="relative overflow-hidden rounded-2xl"
            style={{ backgroundImage: `url(${bg})` }}
          >
            <span class="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-gradient-to-tl from-zinc-800 to-zinc-700 opacity-70"></span>
            <div class="relative z-10 p-4">
              <div class="flex justify-between items-center">
                <p class="pb-2 mt-3 mb-3 text-white text-4xl font-bold ">
                  Wallet Address:
                </p>
                <button class="flex items-center rounded-full py-2 px-4 bg-blue-500 hover:bg-gradient-to-r hover:scale-105 duration-300 from-blue-500 to-green-500 text-white font-bold">
                  <span>Switch Wallet</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 ml-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                    />
                  </svg>
                </button>
              </div>

              <p class="pb-2 mb-5 text-green-300 text-3xl font-bold ">
                0xe5e7fabA4c9375D5A1322D88A19243A00367B236
              </p>
              <div class="flex items-center">
                <div>
                  <p class="pb-2 mt-3 mb-3 text-white text-4xl font-bold ">
                    Wallet Provider:
                  </p>
                  <p class="pb-2 mb-5 text-green-300 text-3xl font-bold ">
                    Metamask
                  </p>
                </div>
                <div class="flex items-end justify-end w-1/5 ml-auto">
                  <img class="w-3/5 mt-2" src={metamask} alt="logo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center">
        <div class="flex max-w-[1200px] w-full mx-auto px-4 mb-6 break-words bg-transparent border-0 border-transparent border-solid shadow-xl rounded-2xl bg-clip-border">
          <div class="flex justify-center w-full">
            <div class="w-2/3 h-[500px] mr-5 relative flex flex-col min-w-0 break-words bg-slate-400 border-0 shadow-xl rounded-2xl bg-clip-border flex-none">
              <h3 class="mb-0 text-white pl-5 pt-5 font-bold text-3xl">
                Manage Your Wallet
              </h3>
            </div>
            <div class="w-1/3 h-[500px] ml-5 relative flex flex-col min-w-0 break-words bg-slate-400 border-0 shadow-xl rounded-2xl bg-clip-border flex-none">
              <h3 class="mb-0 text-white pl-5 pt-5 font-bold text-3xl">
                Your Transactions
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
