import React, { useState, useEffect, useCallback, useRef } from "react";
import CardC from "./CardC";

export const Holdings = () => {
  const [images, setImages] = useState([]);
  const [name, setName] = useState([]);
  const [tokenIds, setTokenIds] = useState([]);
  const [description, setDescription] = useState([]);
  const [price, setPrice] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
      <div
        className="grid grid-flow-row-dense gap-1 mt-20 mx-[17%]"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        }}
      >
        <CardC
          img_src={img_src}
          name={name[index]}
          description={description[index]}
          price={price[index]}
          market={false}
        />
      </div>
    </div>
  );
};
