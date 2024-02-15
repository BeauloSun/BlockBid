import React, { useState, useEffect, useCallback, useRef } from "react";
import CardC from "../components/CardC";
import nft_test from "../assets/nft4.jpg";

export const Splitting = () => {
  return (
    <div>
      <h1 className="text-white text-3xl flex mt-7 justify-center">
        Split test
      </h1>
      <div
        className="grid grid-flow-row-dense gap-1 mt-20 mx-[17%]"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        }}
      >
        <CardC
          img_src={nft_test}
          name={"Hello"}
          description={"哈哈哈哈哈"}
          price={2.3}
          is1155={true}
          owned={30}
        />
        <CardC
          img_src={nft_test}
          name={"yo"}
          description={"我真的服了"}
          price={2.3}
          is1155={true}
          owned={50}
        />
        <CardC
          img_src={nft_test}
          name={"给我个一等吧"}
          description={"哈哈哈哈哈"}
          price={2.3}
          is1155={true}
          owned={70}
        />
        <CardC
          img_src={nft_test}
          name={"还测，别测了"}
          description={"哈哈哈哈哈"}
          price={2.3}
          is1155={true}
          owned={44}
        />
      </div>
    </div>
  );
};
