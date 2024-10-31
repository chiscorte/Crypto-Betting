import React from 'react';
import  { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import search_icon from "../../assets/icons/search-icon.png";

const Header = () => {
  const navigate = useNavigate();
  const hSignin = () => {
    navigate("/signin");
  };
  const hSignup = () => {
    navigate("/signup");
  };

  return (
    <>
      <Grid container direction="row" justifyContent="space-around" className="header">
        <Grid item xs={2} className="title">
          BLUFFFSCASINO
        </Grid>
        <Grid item xs={6} container direction="row" justifyContent="space-evenly" className="search-box-container">
          <Grid item xs={6} container direction="row" justifyContent="space-between" className="search-box">
            <Grid item xs={1}>
              <img src={search_icon} alt="search icon" />
            </Grid>
            <Grid item xs={10}>
              <input placeholder="Search your game" className="input-field" />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} container direction="row" justifyContent="center" spacing={2} className="button-group">
          <Grid item>
            <button className="signin-btn" onClick={hSignin}>
              Sign in
            </button>
          </Grid>
          <Grid item>
            <button className="signup-btn" onClick={hSignup}>
              Register
            </button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Header;
