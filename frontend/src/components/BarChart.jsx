import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";

export default function BarChart({ rowData = [], colName = "", colData = [] }) {
  const chartConfig = {
    type: "bar",
    height: 240,
    series: [
      {
        name: colName,
        data: colData,
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#FF00DC"], // line colour
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 2,
        },
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          // x-axis labels
          style: {
            colors: "#00FFBE",
            fontSize: "15px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: rowData,
      },
      yaxis: {
        // y-axis labels
        labels: {
          style: {
            colors: "#00FFBE",
            fontSize: "15px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#00CEFF",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };
  return (
    <Card className="bg-slate-700">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
      >
        <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
          <Square3Stack3DIcon className="h-6 w-6" />
        </div>
        <div className="">
          <Typography variant="h6" color="white" className="text-2xl">
            Trade Frequency
          </Typography>
          <Typography
            variant="small"
            color="gray"
            className="max-w-sm font-normal text-slate-300 text-xl min-w-[420px]"
          >
            The number of contract transaction at BlockBid
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="px-2 pb-0">
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
}
