import React, { useRef, useContext, useState } from "react";
import { assets } from "../assets/assets/assets.js";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate(); 
  const { backendurl, isLoggedin, userData, getUserData } =
    useContext(AppContext);
  const inputrefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputrefs.current.length - 1) {
      inputrefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (e.target.value === "") {
        if (index > 0) {
          inputrefs.current[index - 1].focus();
        }
      } else {
        e.target.value = ""; // clear current box
      }
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text");
    const pastedDataArray = pastedData.split("");
    pastedDataArray.forEach((char, index) => {
      if (inputrefs.current[index]) {
        inputrefs.current[index].value = char;
        if (index < inputrefs.current.length - 1) {
          inputrefs.current[index + 1].focus();
        }
      }
    });
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      const OTP = inputrefs.current.map((e) => e.value).join("");
      console.log(OTP);
      const { data } = await axios.post(
        "http://localhost:8000/api/auth/verify-account",
        { OTP }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
        toast.error(error.response.data.message || "Server error");
      } else if (error.request) {
        // Request was made but no response
        console.error("No response from server:", error.request);
        toast.error("No response from server");
      } else {
        // Something else
        console.error("Axios error:", error.message);
        toast.error("Unexpected error: " + error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <form
        onSubmit={onSubmit}
        className="bg-slate-900 p-8 rounded-lg w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6 digit OTP
        </p>
        <div className="flex gap-1 justify-center mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-xl text-center rounded-md"
                ref={(e) => (inputrefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
