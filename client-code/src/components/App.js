import "../styles/App.css";
import React, { useContext } from "react";
import NavBar from "./NavBar";
import { Routes, Route } from "react-router-dom";
import ComplaintGrid from "./ComplaintGrid";
import HomeScreen from "./HomeScreen";
import Footer from "./Footer";
import PostDetails from "./ComplaintModal";
import loginContext from "./../context/login/loginContext";
import Loader from "./Loader";
import { useEffect } from "react";
import axios from "axios";
import { HOST } from "../backend";
import AddNewPost from "./NewComplaint";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const contextLogin = useContext(loginContext);
  const { isLoggedIn, setIsLoggedIn } = contextLogin;

  useEffect(() => {
    async function getLoginStatus() {
      try {
        const LOGIN_CHECK_ENDPOINT = `${HOST}/api/v1/users/is-logged-in`;
        const response = await axios.get(LOGIN_CHECK_ENDPOINT, {
          withCredentials: true,
          credentials: "include",
        });
        if (response.data.status === "success") {
          localStorage.setItem("loggedInUserId", response.data.user);
          localStorage.setItem("role", response.data.role);
          setIsLoggedIn("loggedin");
        }else {
          console.log("request recv");
          setIsLoggedIn("loggedout");
          console.log(response.data.statuscode);
        }
      } catch (err) {
        setIsLoggedIn("loggedout");
      }
    }
    getLoginStatus();
    //eslint-disable-next-line
  }, []);

  return (
    <div>
      <NavBar />
      <ToastContainer />
      <div style={{ minHeight: "80vh" }}>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn === "loggedin" ? (
                <ComplaintGrid />
              ) : isLoggedIn === "loggedout" ? (
                <HomeScreen />
              ) : (
                <Loader />
              )
            }
          />

          <Route path="/postdetails/:id" element={<PostDetails />} />
          <Route path="/addnew" element={<AddNewPost />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
