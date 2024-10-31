import { Grid } from "@mui/material";
import "./index.scss";
import visacard from "../../assets/img/visacard.png";
import paypal from "../../assets/img/paypal.png";
import bitcoin from "../../assets/img/bitcoin.png";
import bitcoincash from "../../assets/img/bitcoincash.png";
import ethereum from "../../assets/img/ethereum.png";
import { getUser } from "../../provider/user";
import useGameStore from "../../GameStore";
import React from "react";

const Deposit = () => {
  const { myEmail, user, setUser, setRoomNumber } = useGameStore();
  const walletAddress = user.wallet.address;

  const hClick = () => {
    console.log(user);
    alert(user.wallet.address);
  };

  return (
    <Grid container direction="column" rowSpacing={2} className="deposit-page">
      <Grid item container className="title">
        Deposit
      </Grid>

      <Grid item>
        <hr />
      </Grid>

      <Grid item container direction="column" rowSpacing={1} className="first-part">
        <Grid item className="title">
          1. choose payment option
        </Grid>
        <Grid item container spacing={2} className="payment-method-list">
          <Grid item>
            <img src={visacard} alt="visacard" />
          </Grid>
          <Grid item>
            <img src={paypal} alt="paypal" />
          </Grid>
          <Grid item>
            <img src={bitcoin} alt="bitcoin" />
          </Grid>
          <Grid item>
            <img src={bitcoincash} alt="bitcoincash" />
          </Grid>
          <Grid item>
            <img src={ethereum} alt="ethereum" onClick={hClick} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <hr />
      </Grid>

      <Grid item container direction="column" rowSpacing={1} className="second-part">
        <Grid item className="title">
          2. Payment information
        </Grid>
        <Grid item container className="wallet-address">
          {walletAddress}
        </Grid>
        {/* <Grid item container direction='column' className="input-part">
          <Grid item className='title'>Amount *</Grid>
          <Grid item><input placeholder="Enter amount" className="input-field" /></Grid>
          <Grid item className='footer-text'>(€1 - €100)</Grid>
        </Grid>
        <Grid item container spacing={2} className='check-part'>
          <Grid item><input type='checkbox' className='checkbox' /></Grid>
          <Grid item>I have read and agree with the payment </Grid>
        </Grid>
        <Grid item><button className='deposit-btn'>Deposit</button></Grid> */}
      </Grid>
    </Grid>
  );
};

export default Deposit;
