import { useState, useContext } from "react";
import LoginContext from "./loginContext";
import { HOST } from "./../../backend";
import axios from "axios";
import postContext from "../post/postContext";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const LoginState = (props) => {
  const contextPost = useContext(postContext);
  const { setFilter,  resetToDefaultState } = contextPost;

  const [isLoggedIn, setIsLoggedIn] = useState("unknown");
  //The value of isLogged In: 'unknown, loggedin, loggedout'

  const navigate = useNavigate();

  //Log the user out:
  const logOut = async() => {
    const ENDPOINT = `/api/v1/users/logout`;
    const GET_LOGOUT_ENDPOINT = `${HOST}${ENDPOINT}`;
    try {
      const response = await axios.get(GET_LOGOUT_ENDPOINT, {
        withCredentials: true,
        credentials: "include",
      });
      if(response.status===200){
        setIsLoggedIn("loggedout");
        toast.success("Logout successfull");
        setFilter("");
        resetToDefaultState();
        navigate("/");
      }else{
        toast.error("Logout Failure");
      }
    } catch (error) {
      toast.error("Logout Failure");
      console.error(error);
    }
  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn, logOut }}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginState;
