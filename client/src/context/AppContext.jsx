import { createContext, useEffect } from 'react';
import axios from 'axios';
export const AppContext = createContext();
import { useState } from 'react'
import { toast } from 'react-toastify';
export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const backendurl = import.meta.env.VITE_BACKENED_URL;
  const [isLoggedin, setIsLoggedIn ] = useState(false);
  const [userData, setUserData] = useState(null);
  
  const getAuthstate = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/auth/is-auth",
        {
          withCredentials: true,
        }
      );
      if (data.success) {

        setIsLoggedIn(true);
        getUserData();
      }
    } catch (error) {
      toast.error(error.message);
      setIsLoggedIn(false);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/user/data", {
        withCredentials: true,
      });
      console.log("User Data", data);

      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

    useEffect(() => {
        getAuthstate();
          console.log("Final userData value:", userData);

    }, []);

  const value = {
    backendurl,
    isLoggedin,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData
  };
  console.log("Backend URL:", backendurl);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}