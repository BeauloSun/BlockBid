import React from "react";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
import bg from "../assets/analytics_bg.jpg";
import PieChart from "../components/PieChart";

export const Analytics = () => {
  const rowData = ["Dec-2023", "Jan-2024", "Feb-2024", "Mar-2024"];
  const colName = "Price";
  const colData = [12, 14, 16, 18];
  const sections = [44, 55, 13, 43, 22];
  const colours = ["#020617", "#ff8f00", "#00897b", "#1e88e5", "#d81b60"];

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
              <LineChart
                className="w-full"
                rowData={rowData}
                colName={colName}
                colData={colData}
              />
            </div>
            <div className="mb-5">
              <BarChart
                className="w-full"
                rowData={rowData}
                colName={colName}
                colData={colData}
              />
            </div>
            <div className="">
              <PieChart
                className="w-full"
                sections={sections}
                colours={colours}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
