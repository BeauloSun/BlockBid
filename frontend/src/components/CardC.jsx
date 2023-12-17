import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const CardC = ({
  img_src,
  name,
  description,
  price,
  token_id,
  nft_address,
  market,
}) => {
  return (
    <div className="w-[350px]">
      <Card className="bg-purple-300">
        <CardHeader shadow={true} floated={false} className="h-96">
          <img
            src={img_src}
            alt=""
            className="h-full w-full object-cover rounded-xl"
          />
        </CardHeader>
        <CardBody>
          <div className="mb-2 px-5 mt-2 flex items-center justify-between">
            <Typography color="blue-gray" className="font-medium">
              {name}
            </Typography>
          </div>
          <div className="mb-2 px-5 mt-2 flex items-center justify-between">
            <Typography color="blue-gray" className="font-medium">
              {market ? "" : "Price Bought: "}
              {price} ETH
            </Typography>
          </div>
          <Typography
            variant="small"
            color="gray"
            className="font-normal opacity-75 px-5"
          >
            {description}
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
};

export default CardC;
