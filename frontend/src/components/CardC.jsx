import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

const CardC = ({ img_src, name, description, price, market }) => {
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
            <Typography color="blue-gray" className="font-medium">
              {price}
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
        <CardFooter className="pt-0">
          <Button
            ripple={false}
            fullWidth={true}
            className="bg-blue-gray-900/10 text-blue-gray-900 text-xl bg-pink-400 rounded-xl shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          >
            {market ? "Place a bid" : "Sell"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CardC;
