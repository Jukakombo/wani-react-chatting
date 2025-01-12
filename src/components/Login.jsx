import React from "react";
import { GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import firebase from "firebase/app";
import { auth } from "../firebase";
const Login = () => {
  return (
    <div id="login-page">
      <div className="" id="login-card">
        <h2>Welcome to Wani's Chat-app</h2>
        <div
          className="login-button google"
          onClick={() =>
            auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
          }
        >
          <GoogleOutlined /> Sign In with Google
        </div>
        <br />
        <br />
        
      </div>
    </div>
  );
};

export default Login;
