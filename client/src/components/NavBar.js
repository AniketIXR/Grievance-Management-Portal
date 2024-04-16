import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import postContext from "../context/post/postContext";
import loginContext from "./../context/login/loginContext";
import alertContext from "./../context/alert/alertContext";
import loadingBarContext from "./../context/loadingBar/loadingBarContext"
import { useGoogleLogin } from '@react-oauth/google';
import { HOST } from "../constants";
import axios from "axios";
import Cookies from 'js-cookie';
import "../styles/NavBar.css";

const NavBar = () => {
  const contextLogin = useContext(loginContext);
  const { isLoggedIn, logOut } = contextLogin;
  const contextPost = useContext(postContext);
  const { filter, setFilter, resetToDefaultState } = contextPost;

  const location = useLocation();
  const navigate = useNavigate();

  const { setIsLoggedIn } = contextLogin;
  const contextAlert = useContext(alertContext);
  const { showAlert } = contextAlert;
  const contextLoadingBar = useContext(loadingBarContext);
  const {setProgress} = contextLoadingBar;

  const responseSuccessGoogle = (response) => {
    setProgress(30);
    console.log(response);
    try {
      axios({
        method: "POST",
        url: `${HOST}/api/v1/users/googlelogin`,
        withCredentials: true,
        credentials: "include",
        data: {
          code: response.code,
        },
      }).then((res) => {
        if (res.status === 200) {
          setIsLoggedIn("loggedin");
          Cookies.set('jwt', res.data.token, { expires: 7 })
          localStorage.setItem("loggedInUserId", res.data.data.user._id);
          localStorage.setItem("role", res.data.data.user.role);
          showAlert("success", "Logged-In Successfully");
        } else {
          showAlert("danger", "Something went wrong");
          console.log(response.data.statuscode);
        }
        setProgress(100);
      });
    } catch (error) {
      console.log(error);
      showAlert("danger", "Something went wrong");
      setProgress(100);
    }
  };

  const responseErrorGoogle = (response) => {
    console.log(response);
    showAlert("danger", "Something went wrong");
  };

  const login = useGoogleLogin({
    onSuccess: codeResponse => responseSuccessGoogle(codeResponse),
    //render={renderProps => (
    //  <button className="log" onClick={renderProps.onClick} disabled={renderProps.disabled}>Login with Google</button>
    //)}
    // buttonText="Login with Google"
    // onSuccess={responseSuccessGoogle}
    onError: codeResponse => responseErrorGoogle(codeResponse),
    //cookiePolicy={"single_host_origin"}
    flow: 'auth-code',
  });

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{backgroundColor: '#7957f3'}}
    >
      <div className="container-fluid">
      <Link className={`navbar-brand nav-link font-weight-bold ${location.pathname==="/"&&filter===""?"active":""}`} aria-current="page" onClick={()=>{setFilter(""); resetToDefaultState();navigate("/");}} to="/">
          Grievance Management Portal
      </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isLoggedIn === "loggedin"  && <li className="nav-item dropdown">
              <div className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Filter
              </div>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown" style={{backgroundColor: '#ab8ef4'}}>
                <li><div className="dropdown-item" style={{color: "black", cursor: "pointer"}} onClick={()=>{setFilter("&status=0"); resetToDefaultState(); navigate("/");}}>Just Dropped</div></li>
                <li><div className="dropdown-item" style={{color: "black", cursor: "pointer"}} onClick={()=>{setFilter("&status=1"); resetToDefaultState(); navigate("/");}}>Mission Accomplished</div></li>
                <li><div className="dropdown-item" style={{color: "black", cursor: "pointer"}} onClick={()=>{setFilter("&status=2"); resetToDefaultState(); navigate("/");}}>Approved</div></li>
              </ul>
            </li>}
          </ul>
          {isLoggedIn === "loggedin" && (
            <Link
              to="/addnew"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <button className="btn btn-outline-success my-2 my-lg-0 mx-2 d-block log">
                Add New
              </button>
            </Link>
          )}
          {isLoggedIn === "loggedin" && (
            <button
              className="btn btn-outline-danger my-2 my-lg-0 mx-2 d-block log"
              onClick={logOut}
            >
              Log out
            </button>
          )}
          {isLoggedIn === "loggedout" && (
            <button className="btn btn-outline-success my-2 my-lg-0 mx-2 d-block log" onClick={() => login()}>Sign in with Google</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
