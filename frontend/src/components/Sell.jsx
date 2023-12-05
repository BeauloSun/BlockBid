import { useLocation } from "react-router-dom";
import bg from "../assets/sell_bg.jpg";

export default function Sell() {
  const location = useLocation();
  const { img_src, name, description } = location.state;
  return (
    <section
      class="bg-[#1e1e1e] min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div class="bg-slate-400 bg-opacity-50 flex flex-col rounded-2xl shadow-lg max-w-[1100px] p-5 items-center">
        <div class="w-full text-center">
          <h2 class="text-white font-bold text-8xl pb-10">Sell your NFT</h2>
        </div>
        <div class="flex w-full">
          <div class="md:w-1/2 px-6 md:px-10">
            <img alt="" class="rounded-2xl" src={img_src} />
          </div>
          <div class="md:w-1/2 px-6 md:px-10">
            <h2 class="font-bold text-8xl text-[#ffffff] font-shadows">
              {name}
            </h2>
            <p class="text-3xl mt-4 pt-4 text-[#ffffff]">{description}</p>
            <p class="text-3xl mt-4 pt-4 text-[#ffffff]">
              Time Left: Unlimited
            </p>

            <form action="" class="flex flex-col gap-4">
              <input
                class="p-2 mt-8 rounded-xl border"
                type="number"
                name="Price"
                placeholder="Enter price you want to sell for"
              />

              <button class="bg-slate-800 rounded-xl text-3xl font-bold text-white py-2 hover:scale-105 duration-300">
                Sell !
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
