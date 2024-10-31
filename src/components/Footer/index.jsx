import "./index.scss";
import React from 'react';
import { Grid } from "@mui/material";
import twitter_btn from "../../assets/icons/twitter-icon.png";
import fly_btn from "../../assets/icons/fly-icon.png";
import freelancer_btn from "../../assets/icons/freelancer-icon.png";
import discord_btn from "../../assets/icons/discord-icon.png";
import youtoube_btn from "../../assets/icons/youtube-icon.png";

const Footer = () => {
  return (
    <>
      <Grid container direction="row" justifyContent="space-around" className="footer">
        <Grid item xs={4} container direction="row" justifyContent="space-evenly" className="horizon-link-group">
          <Grid item className="link selected" onClick={() => alert("Home")}>
            Home
          </Grid>
          <Grid item className="link">
            Casino
          </Grid>
          <Grid item className="link">
            Live Games
          </Grid>
          <Grid item className="link">
            About us
          </Grid>
        </Grid>
        <Grid item xs={4} container direction="column" justifyContent="flex-end" alignItems="center" className="main-part">
          <Grid item xs={9} className="title">
            BLUFFSCASINO
          </Grid>
          <Grid item xs={3} className="info">
            © 2022 BluffsCasino. All Rights Reserved.
          </Grid>
        </Grid>
        <Grid item xs={4} container direction="row" justifyContent="center" alignItems="center" spacing={1} className="btn-group">
          <Grid item>
            <img src={twitter_btn} alt="twitter" />
          </Grid>
          <Grid item>
            <img src={fly_btn} alt="fly" onClick={() => alert("Clicked")} />
          </Grid>
          <Grid item>
            <img src={freelancer_btn} alt="freelancer" />
          </Grid>
          <Grid item>
            <img src={discord_btn} alt="discord" />
          </Grid>
          <Grid item>
            <img src={youtoube_btn} alt="youtube" />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Footer;
