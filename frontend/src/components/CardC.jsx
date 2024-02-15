import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

const CardC = ({
  img_src,
  name,
  description,
  price,
  onSale = false,
  onAuction = false,
}) => {
  let cardColour = "bg-purple-300";
  if (onSale && !onAuction) {
    cardColour = "bg-blue-300";
  } else if (onSale && onAuction) {
    cardColour = "bg-yellow-300";
  }

  return (
    <div className="w-[350px]">
      <Card className={cardColour}>
        <CardHeader shadow={true} floated={false} className="h-96">
          <img
            src={img_src}
            alt=""
            className="h-full w-full object-cover rounded-xl"
          />
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
