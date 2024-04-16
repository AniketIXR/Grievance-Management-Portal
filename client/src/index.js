import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./components/App";
import LoginState from "./context/login/LoginState";
import PostState from "./context/post/PostState";
import PostDetailsState from "./context/postDetails/PostDetailsState";
import CommentState from "./context/comment/CommentState";
import AlertState from "./context/alert/AlertState";
import LoadingBarState from "./context/loadingBar/LoadingBarState";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
ReactDOM.render(
  <GoogleOAuthProvider clientId="408367771379-bfe5jq7vsaqthh48adn9j74oji6l78g2.apps.googleusercontent.com">
    <React.StrictMode>
      <Router>
        <LoadingBarState>
          <AlertState>
            <CommentState>
              <PostState>
                <PostDetailsState>
                  <LoginState>
                    <App />
                  </LoginState>
                </PostDetailsState>
              </PostState>
            </CommentState>
          </AlertState>
        </LoadingBarState>
      </Router>
    </React.StrictMode>
  </GoogleOAuthProvider>,
  document.getElementById("root")
);
