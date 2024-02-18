import React from "react";
import bg from "../assets/seller_list_bg.jpg";

export default function TokenSellerList() {
  return (
    <div>
      <div
        className="bg-yellow-300 py-10"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "150vh",
        }}
      >
        <div className="flex flex-col items-center w-full">
          <div className="flex justify-center w-2/3 bg-slate-600 bg-opacity-80 mx-auto rounded-3xl mb-5 py-3">
            <h1 className="text-white text-4xl font-bold">
              Seller list for Token ID_PLACEHOLDER
            </h1>
          </div>
          <div className="flex justify-center w-2/3 bg-slate-600 bg-opacity-80 mx-auto rounded-3xl">
            <ul class="divide-y divide-gray-100 w-full mx-[5%]">
              <li class="flex justify-between  py-5">
                <div class="flex min-w-0 gap-x-4">
                  <img
                    class="h-12 w-12 flex-none rounded-full bg-gray-50"
                    src="https://picsum.photos/50"
                    alt=""
                  />
                  <div class="min-w-0 mr-[30%]">
                    <p class="text-xl font-bold leading-6 text-white">
                      WALLET ADDRESS PLACEHOLDER (LINK THIS P)
                    </p>
                    {/* <Link
                  to={`/marketplace/ERC1155/Sale/${tokenIDs[index]}/${listingIds[index]}`}
                  key={tokenIDs[index]}
                ></Link> */}
                  </div>
                </div>
                <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <p class="text-xl font-bold leading-6 text-white">
                    QUANTITY PLACEHOLDER
                  </p>
                  <p class="text-lg font-semibold leading-6 text-blue-300">
                    PRICE PLACEHOLDER / TOKEN
                  </p>
                </div>
              </li>
              <li class="flex justify-between  py-5">
                <div class="flex min-w-0 gap-x-4">
                  <img
                    class="h-12 w-12 flex-none rounded-full bg-gray-50"
                    src="https://picsum.photos/55"
                    alt=""
                  />
                  <div class="min-w-0 mr-[30%]">
                    <p class="text-xl font-bold leading-6 text-white">
                      WALLET ADDRESS PLACEHOLDER 2 (LINK THIS P)
                    </p>
                  </div>
                </div>
                <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <p class="text-xl font-bold leading-6 text-white">
                    QUANTITY PLACEHOLDER 2
                  </p>
                  <p class="text-lg font-semibold leading-6 text-blue-300">
                    PRICE PLACEHOLDER 2 / TOKEN
                  </p>
                </div>
              </li>
              <li class="flex justify-between  py-5">
                <div class="flex min-w-0 gap-x-4">
                  <img
                    class="h-12 w-12 flex-none rounded-full bg-gray-50"
                    src="https://picsum.photos/55"
                    alt=""
                  />
                  <div class="min-w-0 mr-[30%]">
                    <p class="text-xl font-bold leading-6 text-white">
                      WALLET ADDRESS PLACEHOLDER 2 (LINK THIS P)
                    </p>
                  </div>
                </div>
                <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <p class="text-xl font-bold leading-6 text-white">
                    QUANTITY PLACEHOLDER 2
                  </p>
                  <p class="text-lg font-semibold leading-6 text-blue-300">
                    PRICE PLACEHOLDER 2 / TOKEN
                  </p>
                </div>
              </li>
              <li class="flex justify-between  py-5">
                <div class="flex min-w-0 gap-x-4">
                  <img
                    class="h-12 w-12 flex-none rounded-full bg-gray-50"
                    src="https://picsum.photos/55"
                    alt=""
                  />
                  <div class="min-w-0 mr-[30%]">
                    <p class="text-xl font-bold leading-6 text-white">
                      WALLET ADDRESS PLACEHOLDER 2 (LINK THIS P)
                    </p>
                  </div>
                </div>
                <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <p class="text-xl font-bold leading-6 text-white">
                    QUANTITY PLACEHOLDER 2
                  </p>
                  <p class="text-lg font-semibold leading-6 text-blue-300">
                    PRICE PLACEHOLDER 2 / TOKEN
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
