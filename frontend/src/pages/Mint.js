import React, { useState, useEffect } from "react";
import button_721_bg from "../assets/mint_button_721.png";
import button_1155_bg from "../assets/mint_button_1155.png";
import mint_721_bg from "../assets/mint_721_bg.jpg";
import mint_1155_bg from "../assets/mint_1155_bg.jpg";
import mint_default_bg from "../assets/mint_default_bg.jpg";
import { Link } from "react-router-dom";
import { Spinner } from "@material-tailwind/react";

export const Mint = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hovered721Card, setHovered721Card] = useState(false);
  const [hovered1155Card, setHovered1155Card] = useState(false);

  let bg = mint_default_bg;
  if (hovered721Card) {
    bg = mint_721_bg;
  } else if (hovered1155Card) {
    bg = mint_1155_bg;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`h-screen flex flex-col justify-center items-center transition-all duration-200 ease-in-out`}
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className={`fixed top-0 left-0 bg-black w-screen h-screen flex items-center justify-center z-50 transition-all duration-1000 ${
          isLoading ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {isLoading && <Spinner className="h-40 w-40" />}
      </div>
      <div className="justify-center mb-64 text-6xl font-sans font-extrabold text-yellow-300">
        <h1>CHOOSE YOUR TOKEN TYPE</h1>
      </div>
      <div className="flex justify-around w-full px-10">
        <Link
          to="/mint/721"
          className={`w-[30rem] h-[30rem] flex hover:scale-110 transition-all duration-200 items-center justify-center bg-white rounded-xl shadow-lg cursor-pointer`}
          style={{
            backgroundImage: `url(${button_721_bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: hovered721Card ? 0.85 : 1,
          }}
          onMouseEnter={() => setHovered721Card(true)}
          onMouseLeave={() => setHovered721Card(false)}
        ></Link>
        <Link
          to="/mint/1155"
          className={`w-[30rem] h-[30rem] flex hover:scale-110 transition-all duration-200 items-center justify-center bg-white rounded-xl shadow-lg cursor-pointer `}
          style={{
            backgroundImage: `url(${button_1155_bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: hovered1155Card ? 0.85 : 1,
          }}
          onMouseEnter={() => setHovered1155Card(true)}
          onMouseLeave={() => setHovered1155Card(false)}
        >
          <div
            className={`${
              hovered1155Card ? "bg-opacity-50" : ""
            } w-full h-full`}
          ></div>
        </Link>
      </div>
    </div>
  );
};
