import React from "react";
import { Link } from "react-router-dom";
import bg from "../assets/notfound_bg.jpg";
import "@fontsource/shadows-into-light";

export const NotFound = () => {
  return (
    <div
      className="text-white font-shadows"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="min-h-screen text-white flex flex-col font-bold items-center justify-start pt-[50px] space-y-3">
        <h1 className="text-9xl">404</h1>
        <h2 className="text-5xl">Hey! Don't fuck around with my website! </h2>
        <h2 className="text-5xl">
          You are never going to find some "Secret pages" !!!
        </h2>

        <p className="text-3xl">Stick to the button offered!</p>
        <Link to="/" className="text-blue-500 hover:underline pt-[225px] pr-5">
          <button className="bg-gradient-to-r from-[#61e2ff] to-[#fbfbfb] hover:from-[#b4d3ff] hover:to-[#abfffb] hover:scale-125 focus:ring focus:ring-violet-500 h-[300px] w-[300px] rounded-full text-5xl my-6 mx-auto py-3 text-[#9f46ff]">
            Go back home
          </button>
        </Link>
      </div>
    </div>
  );
};
