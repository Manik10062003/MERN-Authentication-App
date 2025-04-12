import React, { useContext } from "react";
import { assets } from "../assets/assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendurl, setUserData,isLoggedin, setIsLoggedIn } =
    useContext(AppContext);
  console.log("Navbar userData:", userData); 

  const sendverificationotp = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(
        "http://localhost:8000/api/auth/send-verify-otp",
        
      );
      if(data.success) {
        navigate('/email-verify')
        toast.success(data.message);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      
    }
  
  }
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post('http://localhost:8000/api/auth/logout');  
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="" className="w-28 sm:w-32" />

      {userData ? (
        <div className="bg-black text-white relative group w-10 h-10 rounded-full flex items-center justify-center">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 rounded pt-10 text-black">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li onClick={sendverificationotp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                  Verify email
                </li>
              )}
              <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-100 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
