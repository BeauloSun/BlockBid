import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";

export default function PieChart({
  sections = [],
  colours = [],
  labels = ["aaa", "bbb", "ccc", "ddd", "eee"],
}) {
  const chartConfig = {
    type: "pie",
    width: 280,
    height: 280,
    series: sections,
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
      colors: colours,
      legend: {
        show: false,
      },
      plotOptions: {
        pie: {
          customScale: 0.95, // Adjust the scaling factor as needed
          donut: {
            labels: {
              show: true,
              name: {
                fontSize: "14px", // Customize font size for series names
              },
            },
          },
        },
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val) => val + "%", // Display percentage values in tooltips
        },
      },
    },
    labels: labels, // Provide custom labels for each series
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
        <div>
          <Typography variant="h6" color="white" className="text-2xl">
            Pie Chart
          </Typography>
          <Typography
            variant="small"
            color="gray"
            className="max-w-sm font-normal text-slate-300 text-xl min-w-[420px]"
          >
            Description...
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="mt-4 grid place-items-center px-2">
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
}
