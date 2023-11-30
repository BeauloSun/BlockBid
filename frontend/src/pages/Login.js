import React from "react";
import bg from "../assets/login_bg.jpg";
import { Link } from "react-router-dom";

export const Login = () => {
  return (
    <div
      className="text-white bg-center bg-cover bg-no-repeat h-[60vh] w-screen relative flex items-center"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div class="relative max-w-[500px] w-[30%] font-bold border-[#48ff91] text-[#48f6ff] text-center flex flex-col gap-4 mx-auto border-4 rounded-lg px-4 py-10 shadow-3xl shadow-[#48ff91]">
        <h1 class="text-4xl uppercase font-semibold">Login</h1>
        <div class="flex flex-col gap-2 pt-5 w-[70%] mx-auto text-[#48f6ff]">
          <label class="text-xl font-semibold text-left" for="">
            Username
          </label>
          <input
            class="outline-none px-4 py-2 rounded-full bg-transparent border-2 outline-[#48f6ff] placeholder-yellow-100 "
            type="text"
            placeholder="Username"
          />
        </div>
        <div class="flex flex-col gap-2 py-4 w-[70%] mx-auto text-[#48f6ff]">
          <label class="text-xl font-semibold text-left" for="">
            Password
          </label>
          <input
            class="outline-none px-4 py-2 rounded-full bg-transparent border-2 outline-[#48f6ff] placeholder-yellow-100"
            type="text"
            placeholder="Password"
          />
        </div>
        <div class="text-md flex gap-4 pb-4 mx-auto items-center">
          <input
            class="text-xl font-semibold text-left checked:bg-[#48ff91]"
            type="checkbox"
            name="Remember me"
            id=""
          />
          <label for="">Remember me</label>
          <Link
            class="text-xs text-yellow-400 cursor-pointer select-none hover:underline"
            to="/forgot"
          >
            Forgot Password?
          </Link>
        </div>
        <button class="bg-purple-700 px-4 py-3 rounded-md text-xl w-[200px] mx-auto hover:bg-transparent hover:border-purple-600 border-2 border-purple-500">
          Login
        </button>
      </div>
    </div>
  );
};
