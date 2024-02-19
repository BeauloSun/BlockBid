import React, { useEffect, useState } from "react";
import "https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css";
import "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.css";
import { Chart } from "chart.js";

export const ComparisonChart = () => {
  const [chartData, setChartData] = useState({
    date: "today",
    options: [
      {
        label: "Today",
        value: "today",
      },
      {
        label: "Last 7 Days",
        value: "7days",
      },
      {
        label: "Last 30 Days",
        value: "30days",
      },
      {
        label: "Last 6 Months",
        value: "6months",
      },
      {
        label: "This Year",
        value: "year",
      },
    ],
    showDropdown: false,
    selectedOption: 0,
    data: null,
  });

  const selectOption = (index) => {
    setChartData((prevState) => ({
      ...prevState,
      selectedOption: index,
      date: prevState.options[index].value,
    }));
  };

  useEffect(() => {
    fetch(
      "https://cdn.jsdelivr.net/gh/swindon/fake-api@master/tailwindAlpineJsChartJsEx1.json"
    )
      .then((res) => res.json())
      .then((res) => {
        setChartData((prevState) => ({
          ...prevState,
          data: res.dates,
        }));
      });
  }, []);

  useEffect(() => {
    if (chartData.data) {
      let c = false;

      Chart.helpers.each(Chart.instances, function (instance) {
        if (instance.chart.canvas.id == "chart") {
          c = instance;
        }
      });

      if (c) {
        c.destroy();
      }

      let ctx = document.getElementById("chart").getContext("2d");

      let chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: chartData.data[chartData.date].data.labels,
          datasets: [
            {
              label: "Income",
              backgroundColor: "rgba(102, 126, 234, 0.25)",
              borderColor: "rgba(102, 126, 234, 1)",
              pointBackgroundColor: "rgba(102, 126, 234, 1)",
              data: chartData.data[chartData.date].data.income,
            },
            {
              label: "Expenses",
              backgroundColor: "rgba(237, 100, 166, 0.25)",
              borderColor: "rgba(237, 100, 166, 1)",
              pointBackgroundColor: "rgba(237, 100, 166, 1)",
              data: chartData.data[chartData.date].data.expenses,
            },
          ],
        },
        layout: {
          padding: {
            right: 10,
          },
        },
        options: {
          scales: {
            yAxes: [
              {
                gridLines: {
                  display: false,
                },
                ticks: {
                  callback: function (value, index, array) {
                    return value > 1000
                      ? value < 1000000
                        ? value / 1000 + "K"
                        : value / 1000000 + "M"
                      : value;
                  },
                },
              },
            ],
          },
        },
      });
    }
  }, [chartData]);

  return (
    <div className="min-w-screen min-h-screen bg-gray-900 flex items-center justify-center px-5 py-5">
      <div className="bg-gray-800 text-gray-500 rounded shadow-xl py-5 px-5 w-full lg:w-1/2">
        <div className="flex flex-wrap items-end">
          <div className="flex-1">
            <h3 className="text-lg font-semibold leading-tight">Income</h3>
          </div>
          <div className="relative">
            <button className="text-xs hover:text-gray-300 h-6 focus:outline-none">
              {/* Replace this with the selected option label */}
              <span>Option Label</span>
              <i className="ml-1 mdi mdi-chevron-down"></i>
            </button>
            <div className="bg-gray-700 shadow-lg rounded text-sm absolute top-auto right-0 min-w-full w-32 z-30 mt-1 -mr-3">
              <span className="absolute top-0 right-0 w-3 h-3 bg-gray-700 transform rotate-45 -mt-1 mr-3"></span>
              <div className="bg-gray-700 rounded w-full relative z-10 py-1">
                <ul className="list-reset text-xs">
                  {/* Map over your options here */}
                  <li className="px-4 py-2 hover:bg-gray-600 hover:text-white transition-colors duration-100 cursor-pointer">
                    <span>Option Label</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-end mb-5">
          <h4 className="text-2xl lg:text-3xl text-white font-semibold leading-tight inline-block mr-2">
            $0
          </h4>
          <span className="inline-block">
            <span>0</span> <span>0</span>%
          </span>
        </div>
        <div>
          <canvas id="chart" className="w-full"></canvas>
        </div>
      </div>
    </div>
  );
};
