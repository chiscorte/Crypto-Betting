import React, {useState} from 'react'
import { Grid } from "@mui/material";
import "./index.scss";
import visacard from "../../assets/img/visacard.png";
import paypal from "../../assets/img/paypal.png";
import bitcoin from "../../assets/img/bitcoin.png";
import bitcoincash from "../../assets/img/bitcoincash.png";
import ethereum from "../../assets/img/ethereum.png";
import {getUser} from '../../provider/user'

const Withdraw = () => {
  const [selectedCrypto, setCrypto] = useState('')
  const walletAddress = global.user.wallet.address;
  const cryptoTypes = ['BTC', 'ETH']
  
  const hSelCoin = (cryptoType) => {
    setCrypto(cryptoType)
  }

  const hWithdraw = () => {
    // crypto type, house wallet, my wallet, private key, amount
    alert('adf')
  }

  return (
    <Grid container direction="column" rowSpacing={2} className="withdraw-page">
      <Grid item container className="title">
        Withdrawal
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
            <img src={bitcoin} alt="bitcoin" onClick={() => hSelCoin('BTC')} />
          </Grid>
          <Grid item>
            <img src={bitcoincash} alt="bitcoincash" />
          </Grid>
          <Grid item>
            <img src={ethereum} alt="ethereum" onClick={() => hSelCoin('ETH')} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <hr />
      </Grid>

      <Grid item container direction="column" rowSpacing={1} className="second-part">
        <Grid item className="title">
          2. Withdrawal information
        </Grid>
        <Grid item container direction='column' className="input-part">
          <Grid item classNames='title'>Your Current Chips: 123$</Grid>
          <Grid item className='title'>Amount *</Grid>
          <Grid item><input placeholder="Enter amount" className="input-field" /></Grid>
          <Grid item className='footer-text'>(€1 - €123)</Grid>
        </Grid>
        <Grid item container spacing={2} className='check-part'>
          <Grid item><input type='checkbox' className='checkbox' /></Grid>
          <Grid item>I have read and agree with the payment </Grid>
        </Grid>
        <Grid item><button className='deposit-btn' onClick={hWithdraw}>Withdraw</button></Grid>
      </Grid>
    </Grid>
  );
};

export default Withdraw;
