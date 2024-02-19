import React from "react";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
import bg from "../assets/analytics_bg.jpg";

export const Analytics = () => {
  return (
    <div>
      <div
        className="py-[5%]"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex justify-center p-4 max-w-7xl bg-slate-500 m-auto bg-opacity-70 rounded-3xl">
          <div className="w-full text-center">
            <h2 className="inline-block text-transparent bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text font-bold text-8xl pb-5">
              Analytics
            </h2>
          </div>
        </div>

        <div className="flex justify-center p-4 mt-5 max-w-7xl bg-slate-500 m-auto bg-opacity-70 rounded-3xl">
          <div className="my-6 sm:my-10 w-[90%]">
            <div className="mb-5">
              <LineChart className="w-full" />
            </div>
            <div className="">
              <BarChart className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
