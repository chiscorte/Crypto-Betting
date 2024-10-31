import "./index.scss";
import { Button, Grid, TextField, AccountCircle, Input } from "@mui/material";
import { HomeIcon, InputAdornment } from "@mui/icons-material";
import Header from "../Header";
import React from 'react'
import {useNavigate} from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()
  
  return (
    <>
      <Grid container direction="column" spacing={6} className="landing-page">
        <Grid container item className="">
          <Header />
          <Grid item xs={3} container direction="column" justifyContent="flex-start" className="sidebar-container">
            <Grid
              item
              xs={12}
              container
              direction="column"
              justifyContent="flex-start"
              spacing={0}
              className="side-bar"
            >
              <Grid item container direction="column" spacing={2} className="menu">
                <Grid item className="item">
                  Home
                </Grid>
                <Grid item className="item">
                  Favourites
                </Grid>
                <Grid item className="item">
                  Recent
                </Grid>
                <Grid item className="item">
                  Challenges
                </Grid>

                <Grid item className="ho-line">
                  <hr className="w-80"></hr>
                </Grid>

                <Grid item className="item" onClick={() => navigate('/cash')}>
                  Poker Live Cash Games
                </Grid>
                <Grid item className="item">
                  Stake Exclusives
                </Grid>
                <Grid item className="item">
                  Slots
                </Grid>
                <Grid item className="item">
                  Live Casino
                </Grid>
                <Grid item className="item">
                  Game Shows
                </Grid>
                <Grid item className="item">
                  New Releases
                </Grid>
                <Grid item className="item">
                  Table Games
                </Grid>
                <Grid item className="item">
                  Blackjack
                </Grid>
                <Grid item className="item">
                  Baccarat
                </Grid>

                <Grid item className="ho-line">
                  <hr></hr>
                </Grid>

                <Grid item className="item">
                  Sports
                </Grid>
                <Grid item className="item">
                  Live Support
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container item xs={9} direction="column" spacing={2} className="main-board">
            <Grid item>
              <img alt="img" src="/img/bg.png" className="flex-img" />
            </Grid>
            <Grid item>
              <img alt="img" src="/img/2-main-img.png" className="flex-img" />
            </Grid>

            <Grid container item>
              <Grid item xs={6}>
                <img alt="img" src="/img/3-main.png" className="flex-img" />
              </Grid>
              <Grid item xs={6}>
                <img alt="img" src="/img/4-main.png" className="flex-img" />
              </Grid>
            </Grid>

            <Grid container item justifyContent="space-between" spacing={2}>
              <Grid item xs={4}>
                <img alt="img" src="/img/group-1-img.png" className="flex-img" />
              </Grid>
              <Grid item xs={4}>
                <img alt="img" src="/img/group-2-img.png" className="flex-img" />
              </Grid>
              <Grid item xs={4}>
                <img alt="img" src="/img/group-3-img.png" className="flex-img" />
              </Grid>
            </Grid>

            <Grid container item justifyContent="space-between" spacing={2}>
              <Grid item xs={4}>
                <img alt="img" src="/img/group-4-img.png" className="flex-img" />
              </Grid>
              <Grid item xs={4}>
                <img alt="img" src="/img/group-5-img.png" className="flex-img" />
              </Grid>
              <Grid item xs={4}>
                <img alt="img" src="/img/group-6-img.png" className="flex-img" />
              </Grid>
            </Grid>

            <Grid container item justifyContent="space-between" spacing={1}>
              <Grid item xs={2}>
                <img alt="img" src="/img/group-2-1-img.png" className="flex-img" />
              </Grid>
              <Grid item xs={2}>
                <img alt="img" src="/img/group-2-2-img.png" className="flex-img" />
              </Grid>
              <Grid item xs={2}>
                <img alt="img" src="/img/group-2-3-img.png" className="flex-img" />
              </Grid>
              <Grid item xs={2}>
                <img alt="img" src="/img/group-2-4-img.png" className="flex-img" />
              </Grid>
              <Grid item xs={2}>
                <img alt="img" src="/img/group-2-5-img.png" className="flex-img" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item>
          <Grid item xs={12}>
            <img alt="img" src="/img/foot-bar.png" className="foot-bar-img" />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default LandingPage;
