import React from "react";
import CardC from "../components/CardC";

import nft2 from "../assets/nft2.jpg";
import nft3 from "../assets/nft3.jpg";
import nft6 from "../assets/nft6.jpg";

export const Profile = () => {
  const images = [nft2, nft3, nft6];

  return (
    <div className="mt-5 px-5 shadow">
      <div className="relative h-96 rounded-b flex justify-center">
        <img
          src="https://picsum.photos/id/468/2980"
          className="object-cover w-full h-full rounded-b"
          alt="cover"
        />
        <div className="absolute -bottom-6">
          <img
            src="https://picsum.photos/seed/picsum/300/302"
            className="object-cover border-4 border-white w-40 h-40 rounded-full"
            alt="cover"
          />
        </div>
      </div>
      <div className="text-center mt-10 text-3xl font-bold text-white">
        Jiaming Sun
      </div>
      <div
        className="grid grid-flow-row-dense gap-1 mt-20 mx-[17%]"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))" }}
      >
        {images.map((img_src, index) => (
          <div
            key={index}
            className="flex flex-col items-center py-4 hover:scale-105 duration-300"
          >
            <CardC img_src={img_src} />
          </div>
        ))}
      </div>
    </div>
  );
};
