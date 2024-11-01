const dotenv = require("dotenv");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { init, updateUser } = require("./db");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const routes = require("./routes");
const { ROOM_STATE_WAITING, ROOM_STATE_ROUND_DEAL } = require("./constants");
const Game = require("./game/game");
const { isEmptyObj, getContract } = require("./global");
const sd = require("send-crypto");

var corsOptions = {
  origin: "*",
};
init();
getContract();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(routes);

const server = require("http").createServer(app);
let io = require("socket.io")(server, { cors: { origin: "*" } });

app.use((req, res, next) => {
  req.io = io;
  return next();
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});

/////////////// scheduling ////////////////
const cron = require("node-cron");

cron.schedule("* * * * *", () => {
  console.log("fjdsalkfjlasdkjflksdjflksdjflksjdlfjd");
});
/////////////// ///////// ////////////////

let rooms = {}; // {[roomNumber]: room object}
let games = {}; // {[roomNumber]: game object}
let timers = new Array(1000);

const room = {
  number: -1,
  chips: -1,
  players: [],
  members: {}, // [name]: { name: name }
  socketIds: {}, // [name]: socketId
  gameStarted: false,
  chatHistory: [],

  timer: null,
  progress: 0,
  nowCounting: false,

  reset: function () {
    (this.number = -1), (this.members = {}), (this.socketIds = {});
    (this.chips = -1), (gameStarted = false);
    this.chatHistory = [];
    this.resetTimer();
  },
  startWaitTimer: function (callback) {
    this.timer = setInterval(() => {
      const step = 3.3333;

      console.log("--- timer: progress ---", this.progress);

      if (this.progress < 100 && this.progress + step >= 100) {
        this.progress = 100;
      } else if (this.progress == 100) {
        this.resetTimer();
        callback();
      } else {
        this.progress += step;
      }
    }, 1000);

    this.nowCounting = true;
  },
  resetTimer: function () {
    if (this.timer) clearInterval(this.timer);

    this.progress = 0;
    this.timer = null;
    this.nowCounting = false;
  },
};

///////////////////// global functions ///////////////////////
const resetRoom = (roomNumber) => {
  let rmNumStr = roomNumber.toString();

  for (const rmNumStr in rooms) {
    rooms[roomNumber].reset();
  }
  rooms = {};
  games = {};
  room.reset();
  io.to(rmNumStr).emit("reseted room");
  io = require("socket.io")(server, { cors: { origin: "*" } });
  initSocketServer();

  console.log("--- after reset ---", rooms, games, room);
};
const getPlayersInRoom = (rmNumStr) => {
  let players = [];
  let game = games[rmNumStr];

  for (let k = 0; k < game.players.length; k++) {
    players.push({
      firstCard: game.players[k].firstCard,
      secondCard: game.players[k].secondCard,
      name: game.players[k].name,
      chips: game.players[k].chips,
      bet: game.players[k].bet,
      lastAction: game.players[k].lastAction,
      hasActed: game.players[k].hasActed,
      hasDone: game.players[k].hasDone,
    });
  }

  return players;
};

const gameDataForPlayers = (rmNumStr) => {
  const game = games[rmNumStr];
  const players = getPlayersInRoom(rmNumStr);
  let gameDataArr = [];

  for (let j = 0; j < game.players.length; j++) {
    const gameData = {
      firstcard: game.players[j].firstCard,
      secondcard: game.players[j].secondCard,
      curPlayer: game.getCurrentPlayer().name,
      curPlayerBet: game.getCurrentPlayer().bet,
      dealer: game.players[game.dealerPos].name,
      players: JSON.stringify(players),
      BET: game.BET,
      chips: game.getCurrentPlayer().chips,
      round: game.round,
      dealerPos: game.dealerPos,
      turnPos: game.turnPos,
      pot: game.pot,
      communityCards: JSON.stringify(game.communityCards),
      isEndRound: game.isEndRound(),
      isEndGame: game.gameoverInfo.gameover,
      winner: game.gameoverInfo.winner,
      matchingCards: game.gameoverInfo.matchingCards,
      description: game.gameoverInfo.description,
      wonAmount: game.gameoverInfo.amount,
      gets: game.gameoverInfo.gets,
      highestBet: game.getHighestBet(),
      shouldCheck: game.getCurrentPlayer().shouldCheck(),
    };

    gameDataArr[j] = gameData;
  }

  return gameDataArr;
};
const getPlayerSocketIdInRoom = (roomNumber, n) => {
  return rooms[roomNumber].socketIds[games[roomNumber].players[n].name];
};
const foldAfter =
  ({ roomNumber, email }) =>
  () => {
    console.log("--- fold after ---");

    if (games.length == 0 || rooms.length == 0) return;

    const game = games[roomNumber];
    const room = rooms[roomNumber];

    game.getCurrentPlayer().fold();

    doSthAfterAction({ roomNumber, game, email });
  };
const startGameAfter =
  ({ roomNumber }) =>
  () => {
    console.log("--- start game ---");

    games[roomNumber].start();

    const gameDataArr = gameDataForPlayers(roomNumber);

    console.log("--- game data ---", gameDataArr);

    for (let i = 0; i < gameDataArr.length; i++) {
      const gameData = gameDataArr[i];

      io.to(getPlayerSocketIdInRoom(roomNumber, i)).emit(
        "game started",
        gameData
      );
    }

    rooms[roomNumber].startWaitTimer(
      foldAfter({ roomNumber, doNotUpdate: true })
    );
  };
const startSmallAfter =
  ({ roomNumber }) =>
  () => {
    console.log("--- start small ---");

    games[roomNumber].start();

    const gameDataArr = gameDataForPlayers(roomNumber);

    console.log("--- game data ---", gameDataArr);

    for (let i = 0; i < gameDataArr.length; i++) {
      const gameData = gameDataArr[i];

      io.to(getPlayerSocketIdInRoom(roomNumber, i)).emit(
        "small started",
        gameData
      );
    }

    rooms[roomNumber].resetTimer();
    rooms[roomNumber].startWaitTimer(
      foldAfter({ roomNumber, doNotUpdate: true })
    );
  };

const doSthAfterAction = ({ roomNumber, game, email, doNotUpdate }) => {
  const changedChips = game.getCurrentPlayer().chips;
  const rmNumStr = roomNumber.toString();
  const rm = rooms[rmNumStr];

  if (!doNotUpdate) updateUser({ email, chips: changedChips });

  const gameDataArr = gameDataForPlayers(rmNumStr);

  for (let i = 0; i < gameDataArr.length; i++) {
    const gameData = gameDataArr[i];

    console.log("--- after player action ---", gameData);

    if (gameData.winner) {
      io.to(getPlayerSocketIdInRoom(rmNumStr, i)).emit("msg share", {
        who: gameData.dealer,
        msg: `player ${game.lastPlayer.name} won with ${gameData.description} amount $${gameData.wonAmount}`,
      });
    }

    io.to(getPlayerSocketIdInRoom(rmNumStr, i)).emit("after player acted", {
      ...gameData,
      // timerStop: game.isEndGame(),
    });
  }

  console.log("--- isEndGame ---", game.isEndGame());

  // console.log("--- currentBalance ---", currentBalance);

  if (!game.isEndSmall()) {
    io.to(rmNumStr).emit("msg share", {
      who: game.players[game.dealerPos].name,
      msg: `player ${game.lastPlayer.name} did ${game.lastPlayer.lastAction}`,
    });

    rm.resetTimer();
    rm.startWaitTimer(foldAfter({ rmNumStr, email }));
  } else {
    rm.resetTimer();
    rm.startWaitTimer(startSmallAfter({ roomNumber: rmNumStr, email }));
  }
};

const initSocketServer = () => {
  io.on("connection", (socket) => {
    console.log("--- connected ---");

    socket.on("disconnect", () => {
      console.log("--- disconnected ---");

      for (const rmNumStr in rooms) {
        let rm = rooms[rmNumStr];

        for (const name in rm.socketIds) {
          let socketIds = rm.socketIds;

          if (socketIds[name] == socket.id) {
            delete socketIds[name];
            delete rm.members[name];

            console.log("--- after disconnected: room ---", rm);

            if (rm.gameStarted) {
              resetRoom(rmNumStr);
            } else {
              games[rmNumStr].removePlayer(name);

              const playersInRoom = getPlayersInRoom(rmNumStr);
              const json = JSON.stringify(playersInRoom);

              io.to(rmNumStr).emit("a player disconnected", { players: json });
            }

            return;
          }
        }
      }
    });

    socket.on("reset room", ({ roomNumber }) => {
      console.log("--- reset room ---");

      resetRoom(roomNumber);
    });

    socket.on("join room", ({ roomNumber, name, chips }) => {
      console.log("--- join room ---", { roomNumber, name, chips });

      let rmNumStr = roomNumber.toString();

      socket.join(rmNumStr);

      if (rooms[rmNumStr] == null) {
        room.number = rmNumStr;
        room.chips = chips;
        room.members[name] = name;
        room.socketIds[name] = socket.id;
        rooms[rmNumStr] = JSON.parse(JSON.stringify(room));
        rooms[rmNumStr] = {
          ...rooms[rmNumStr],
          reset: room.reset,
          startWaitTimer: room.startWaitTimer,
          resetTimer: room.resetTimer,
        };
        room.reset();

        games[rmNumStr] = new Game();
        games[rmNumStr].addPlayer({ name: name, chips });
      } else {
        let rm = rooms[rmNumStr];
        let gm = games[rmNumStr];

        if (rm.members[name] != null) {
          io.to(socket.id).emit("same player");

          return;
        }

        rm.members[name] = name;
        rm.socketIds[name] = socket.id;
        gm.addPlayer({ name: name, chips });
      }

      console.log("--- after add player: rooms ---", rooms);

      const rm = rooms[rmNumStr];
      const players = getPlayersInRoom(rmNumStr);
      const json = JSON.stringify(players);
      let timer = false;

      if (Object.keys(rm.members).length >= 2) {
        timer = true;
        rm.resetTimer();
        rm.startWaitTimer(startGameAfter({ roomNumber: rmNumStr }));
        // startGameAfter({ roomNumber: rmNumStr })()
      }

      io.to(rmNumStr).emit("new user joined", { members: json, timer });
    });
    socket.on("call", ({ roomNumber, email }) => {
      console.log("--- call ---", roomNumber);

      const game = games[roomNumber];
      const rm = rooms[roomNumber];

      game.getCurrentPlayer().callOrCheck();

      // in; game.round, game.players,

      doSthAfterAction({ roomNumber, game, email });
    });
    socket.on("raise", ({ roomNumber, email, raiseVal }) => {
      console.log("--- raise ---", roomNumber, raiseVal);

      const game = games[roomNumber];
      const rm = rooms[roomNumber];

      game.getCurrentPlayer().raise(raiseVal);

      doSthAfterAction({ roomNumber, game, email });
    });
    socket.on("fold", ({ roomNumber, email }) => {
      console.log("--- fold ---", roomNumber);

      foldAfter({ roomNumber, email })();
    });
    socket.on("msg send", ({ roomNumber, who, msg }) => {
      console.log("--- msg send ---", roomNumber, who, msg);

      const rmNumStr = roomNumber.toString();
      const rm = rooms[rmNumStr];

      rm.chatHistory.push({ who, msg });

      console.log("--- chatHistory ---", rm.chatHistory);

      io.to(rmNumStr).emit("msg share", { who, msg });
    });
  });
};

initSocketServer();
