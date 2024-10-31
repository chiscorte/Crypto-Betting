const { MongoClient, ObjectId } = require("mongodb");
const { ROOM_STATE_WAITING } = require("./constants");
const connectionUrl = process.env.DB_URL;
const axios = require('axios');
const dbName = "bluffcasino";
let db;

const init = () => {                                                                                                                                                                                                                                                                                                                                                                                                                
  MongoClient.connect(connectionUrl, { useNewUrlParser: true }).then(
    (client) => {
      db = client.db(dbName);
    }
  ).catch(error => true);
}                                           

const createUser = (data) => {
  const collection = db.collection("users");
  const query = { email: data.email  };
  const update = { $set: data };
  const options = { upsert: true };
  return collection.updateOne(query, update, options);
};

const updateUser = (data) => {
  const collection = db.collection('users')
  const query  = {email: data.email}
  const update = {$set: data}
  const options = {upsert: true}
  return collection.updateOne(query, update, options)
}

const updateChips = async ({email, change}) => {
  const chipsCollect = db.collection('chips')
  const query = {email}
}

const signinUser = async (data) => {
  const collection = db.collection("users");
  const query = { email: data.email };
  const user = await collection.findOne(query);
  if (user == null) return null;
  if (user.password === data.password) return user;
  else return null;
};

const getUser = async (data) => {
  const collection = db.collection("users");
  const query = { email: data.email };
  const user = await collection.findOne(query);
  if (user == null) return null;
  else return user
};

const enterRoom = async (data) => {
  const collection = db.collection("rooms");
  const query = { roomNumber: data.roomNumber };
  const room = await collection.findOne(query);
  if (room == null) {
    // if room is not created, create new room
    const newroom = {
      users: [],
      stakes: data.smallBlind,
      state: ROOM_STATE_WAITING,
      roomNumber: data.roomNumber,
    };
    const newuser = {
      email: data.email,
      chips: data.chips,
      opserver: false,
    };
    newroom.users.push(newuser);
    await collection.insertOne(newroom);
    return "created";
  } else {
    // if room is already created, add user
    // if game is playing now, add user as opserver
    const newuser = {
      email: data.email,
      chips: data.chips,
      opserver: room.state == ROOM_STATE_WAITING ? false : true,
    };
    room.users.push(newuser);
    const update = { $set: room };
    const options = { upsert: true };
    await collection.updateOne(query, update, options);
    return "added";
  }
};

module.exports = {
  init,
  createUser,
  updateUser,
  signinUser,
  getUser,
  enterRoom,
};
