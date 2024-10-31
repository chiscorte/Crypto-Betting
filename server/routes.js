const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const { generateEthWallet } = require("./helpers");
const { createUser, signinUser, enterRoom, getUser, updateUser } = require("./db");
const CryptoAccount = require("send-crypto");
const CryptoConvert = require("crypto-convert").default;
const { gasstationInfo } = require("eth-gasprice-estimator");
const { HOUSE_WALLET, HOUSE_WALLET_PRIVATEKEY, COIN_NETWORK } = require("./global");

const userSchema = Joi.object().keys({
  firstname: Joi.string().max(20),
  lastname: Joi.string().max(20),
  birth: Joi.string().max(20),
  phonenumber: Joi.string().max(15),
  email: Joi.string(),
  zipcode: Joi.string().max(5),
  password: Joi.string().max(30),
  chips: Joi.number().min(0),
  wallet: Joi.object(),
  privateKey: Joi.string(),
  address: Joi.string(),
});

const userSigninSchema = Joi.object().keys({
  email: Joi.string(),
  password: Joi.string().max(30),
});

const roomEnterSchema = Joi.object().keys({
  email: Joi.string(),
  roomNumber: Joi.number().max(20),
  smallBlind: Joi.number().min(0),
  chips: Joi.number().min(0),
});

router.post("/api/users/signup", async (req, res) => {
  const { firstname, lastname, birth, phonenumber, email, zipcode, password } = req.body;
  const { privateKey, address } = generateEthWallet();
  const data = {
    firstname,
    lastname,
    birth,
    phonenumber,
    email,
    zipcode,
    password,
    chips: 0,
    wallet: {
      privateKey,
      address,
    },
  };
  const check = userSchema.validate(data);

  if (check.error) {
    console.log(check.error);
    res.json({ result: check.error });
    return;
  }

  createUser(data);

  res.json({ result: "user saved" });
});

router.post("/api/users/signin", async (req, res) => {
  const { email, password } = req.body;
  const data = { email, password };
  const check = userSigninSchema.validate(data);
  if (check.error) {
    res.json({ result: check.error });
  }
  const user = await signinUser(data);
  if (user) {
    res.json({ result: "success", user });
  } else {
    res.json({ result: "email or passwd incorrect" });
  }
});

router.get("/api/users/:email", async (req, res) => {
  const { email } = req.params;
  console.log('--- email ---', email)
  const data = { email };
  const user = await getUser(data);
  if (user) {
    res.json({ result: "getting user success", user });
  } else {
    res.json({ result: "email or passwd incorrect" });
  }
});

router.post("/api/rooms/enter", async (req, res) => {
  console.log("enter");
  const { email, roomNumber, smallBlind, chips } = req.body;
  const data = {
    email,
    roomNumber,
    smallBlind,
    chips,
  };

  const check = roomEnterSchema.validate(data);

  if (check.error) {
    res.json({ result: check.error });
    return;
  }

  enterRoom(data);
  res.json({ result: "success" });
});

router.post("/api/play/call", async (req, res) => {
  const { email, roomNumber } = req.body;
  const data = {
    email,
    roomNumber,
  };
});

router.post("/api/play/check", async (req, res) => {
  const { email, roomNumber } = req.body;
  const data = {
    email,
    roomNumber,
  };
});

router.post("/api/play/fold", async (req, res) => {
  const { email, roomNumber } = req.body;
  const data = {
    email,
    roomNumber,
  };
});

router.post("/api/play/raise", async (req, res) => {
  const { email, roomNumber, amount } = req.body;
  const data = {
    email,
    roomNumber,
    amount,
  };
});

///////////////////////////////////////////////////////
////////////////////// payment API ////////////////////
///////////////////////////////////////////////////////

const bigNum = 1000000000000000000;
const btcFee = 0.0001;

router.post("/api/payment/deposit", async (req, res) => {
  const { cryptoType, privateKey } = req.body;

  if (!cryptoType || !privateKey) {
    res.json({ error: "invalid request" });
  }

  const playerWallet = new CryptoAccount(privateKey, {
    network: COIN_NETWORK[cryptoType],
  });
  const balance = await playerWallet.getBalance(cryptoType, { subtractFee: true });
  const sendAmount = cryptoType === "ETH" ? balance - (await gasstationInfo("fastest")) / bigNum : balance - btcFee;

  if (sendAmount <= 0) {
    res.json({ error: "insufficient fund" });
    return;
  }

  console.log("--- balance ---", sendAmount);

  playerWallet
    .send(HOUSE_WALLET[cryptoType], sendAmount, cryptoType)
    .then(async (res) => {
      console.log("--- wait poe ---");
      console.log(res);

      const convert = new CryptoConvert(/*options?*/);

      await convert.ready(); //Wait for the initial cache to load

      const usd = convert[cryptoType].USD(sendAmount);

      await updateUser({ chips: usd });

      res.json({ chips: usd });
    })
    .catch((err) => {
      console.log("--- error in wallet ---");
      console.log(err);

      res.json({ error: err });
    });
});

router.post("/api/payment/withdraw", async (req, res) => {
  const { email, cryptoType, playerWallet, amountUSD } = req.body;

  if (!cryptoType || !playerWallet || !chips) {
    res.json({ error: "invalid request" });
    return;
  }

  const user = await getUser({ email });

  if (!user) {
    res.json({ error: "not such user" });
    return;
  }

  const chips = user.chips;

  if (amountUSD > chips) {
    res.json({ error: "invalid withdraw amount" });
    return;
  }

  const convert = new CryptoConvert(/*options?*/);
  await convert.ready(); //Wait for the initial cache to load
  const crypto = convert.USD[cryptoType](amountUSD);
  const houseWallet = new CryptoAccount(HOUSE_WALLET_PRIVATEKEY[cryptoType], {
    network: COIN_NETWORK[cryptoType],
  });

  console.log("--- ether ---", crypto);

  const sendAmount = cryptoType === "ETH" ? crypto - (await gasstationInfo("fastest")) / bigNum : crypto - btcFee;

  houseWallet
    .send(playerWallet, sendAmount, cryptoType)
    .then(async (res) => {
      console.log("--- wait poe ---");
      console.log(res);

      await updateUser({ chips: chips - amountUSD });

      res.json({ chips: chips - amountUSD });
    })
    .catch((err) => {
      console.log("--- error in wallet ---");
      console.log(err);

      res.json({ error: err });
    });
});

module.exports = router;
