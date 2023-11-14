// export const NotFound = () => {
//   return (
//     <h1 className="text-white">
//       Don't fuck around with my website, use the buttons!
//     </h1>
//   );
// };

import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#000300] text-white flex flex-col items-center justify-center space-y-3">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-4xl">
        Hey! Don't fuck around with my website! Stick to the button offered!
      </h2>
      <p className="text-lg">
        You are never going to find some "Secret pages" !!!
      </p>
      <Link to="/" className="text-blue-500 hover:underline">
        Go back home
      </Link>
    </div>
  );
};
