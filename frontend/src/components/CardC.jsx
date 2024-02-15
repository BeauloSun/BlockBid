import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";

const CardC = ({
  img_src,
  name,
  description,
  price,
  onSale = false,
  onAuction = false,
  is1155 = false,
  owned = null,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [percentage, setPercentage] = useState("100%");

  let cardColour = "bg-purple-300";
  if (!is1155 && onSale && !onAuction) {
    cardColour = "bg-blue-300";
  } else if (!is1155 && onSale && onAuction) {
    cardColour = "bg-yellow-300";
  } else if (is1155 && !onSale) {
    cardColour = "bg-slate-300";
  } else if (is1155 && onSale) {
    cardColour = "bg-green-300";
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setPercentage((100 - owned).toString() + "%");
    }, 100);

    setIsHovered(true);

    const hoverTimer = setTimeout(() => {
      setIsHovered(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(hoverTimer);
    };
  }, [owned]);

  return (
    <div
      className="w-[350px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={cardColour}>
        <CardHeader shadow={true} floated={false} className="h-96">
          <img
            src={img_src}
            alt=""
            className="h-full w-full object-cover rounded-xl z-10"
          />
          {is1155 ? (
            <>
              <div
                className={`absolute w-full bg-gray-600 bg-opacity-90 border-b-2 border-blue-400 transition-all ease-in-out duration-1000 top-0 z-20`}
                style={{ height: percentage }}
              ></div>
              <div
                className={`absolute top-1/2 left-1/2 transition-opacity duration-300 transform -translate-x-1/2 -translate-y-1/2 z-30 text-yellow-300 text-5xl font-semibold ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                {owned} %
              </div>
            </>
          ) : (
            <></>
          )}
        </CardHeader>
        <CardBody>
          <div className="mb-2 px-5 mt-2 flex items-center justify-between">
            <Typography color="blue-gray" className="text-2xl font-bold">
              {name}
            </Typography>
          </div>
          <div className="mb-2 px-5 mt-2 flex items-center justify-between">
            <Typography color="blue-gray" className="text-xl">
              Current Market Price: {price}ETH
            </Typography>
          </div>
          <Typography
            variant="small"
            color="gray"
            className="text-xl opacity-75 px-5"
          >
            {description}
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
};

export default CardC;
