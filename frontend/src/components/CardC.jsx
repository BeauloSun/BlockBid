import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import tmpImage from "../assets/music/cover.png";

const CardC = ({
  img_src,
  album_src = "",
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
  const [mediaType, setMediaType] = useState("");

  let cardColour = "bg-purple-300";
  if (!is1155 && onSale && !onAuction) {
    cardColour = "bg-blue-300";
  } else if (!is1155 && onSale && onAuction) {
    cardColour = "bg-yellow-300";
  } else if (is1155 && !onSale) {
    cardColour = "bg-slate-300";
  } else if (is1155 && onSale && !onAuction) {
    cardColour = "bg-green-300";
  } else if (is1155 && onSale && onAuction) {
    cardColour = "bg-red-300";
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

  useEffect(() => {
    const fetchContentType = async () => {
      let response = await fetch(img_src);
      let contentType = response.headers.get("Content-Type");
      setMediaType(contentType.split("/")[0]);
    };

    fetchContentType();
  }, [img_src]);

  return (
    <div
      className="w-[300px] h-[500px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={`${cardColour} w-[300px] h-[500px]`}>
        <CardHeader shadow={true} floated={false} className="h-70">
          {mediaType === "image" && (
            <img
              src={img_src}
              alt=""
              className="h-full w-full object-cover rounded-xl z-10"
            />
          )}

          {mediaType === "video" && (
            <video className="w-full h-full" controls>
              <source src={img_src} type="video/mp4" />
            </video>
          )}

          {mediaType === "audio" && (
            <div
              className="pt-[80%] w-full h-full"
              style={{
                backgroundImage: `url(${album_src})`,
                backgroundSize: "cover",
                width: "100%",
                height: "100%",
              }}
            >
              <audio className="w-[99%] pl-[1%] pb-[5%]" controls>
                <source src={img_src} type="audio/mpeg" />
              </audio>
            </div>
          )}

          {is1155 ? (
            <>
              <div
                className={`absolute w-full bg-gray-600 bg-opacity-90 border-b-2 border-blue-400 transition-all ease-in-out duration-1000 top-0 z-20`}
                style={{ height: percentage }}
              ></div>
              <div
                className={`absolute top-1/2 left-1/2 transition-opacity duration-300 transform -translate-x-1/2 -translate-y-1/2 z-30 text-white text-4xl font-semibold ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                {owned}%
              </div>
            </>
          ) : (
            <></>
          )}
        </CardHeader>
        <CardBody className="mt-auto">
          <div className="mb-2 px-5 mt-auto flex items-center justify-between">
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
