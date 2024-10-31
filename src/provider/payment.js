// const CryptoAccount = require("send-crypto");
import { axios, baseURL } from "./index";

/**
 * 
 * @param {String} cryptoType, ETH, BTC
 */
export const sendCryptoToHouseWallet = async ({ cryptoType, privateKey }) => {
  const data = {
    cryptoType,
    privateKey
  }

  axios.post(`${baseURL}/payment/deposit`, data)
  .then(res => console.log(res))
  .catch(err => console.log(err))
}