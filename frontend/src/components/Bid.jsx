import { useLocation } from "react-router-dom";

export default function Bid() {
  const location = useLocation();
  const { img_src, name, description, price } = location.state;

  return (
    <section class="bg-[#0f103e] min-h-screen flex items-center justify-center">
      <div class="bg-[#724fff] flex flex-col rounded-2xl shadow-lg max-w-[1100px] p-5 items-center">
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

              <button class="bg-[#440074] rounded-xl text-3xl font-bold text-white py-2 hover:scale-105 duration-300">
                Place Bid
              </button>

              <button class="bg-[#440074] rounded-xl text-3xl font-bold text-white py-2 hover:scale-105 duration-300">
                Buy Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}