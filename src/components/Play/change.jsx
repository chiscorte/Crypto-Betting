import "./Play.scss";
import React, { useEffect, useState } from "react";
import { LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

import msg_btn from "../../assets/img/msg_btn.png";
import Slider from "../Slider/Slider";
import io from "socket.io-client";
import Msgbox from "../Msgbox";
import useGameStore from "../../GameStore";

import winnerBadge from "../../assets/img/winner-badge.png";
import bg_table from "../../assets/img/bg_table.png";
import lobby_button_bg from "../../assets/img/lobby_button_bg.png";
import round_under_card from "../../assets/img/round_under_card.png";
import bgcard_2 from "../../assets/img/cards/BG-2.png";
import c2 from "../../assets/img/new-cards/CLUBS/2.png";
import c3 from "../../assets/img/new-cards/CLUBS/3.png";
import c4 from "../../assets/img/new-cards/CLUBS/4.png";
import c5 from "../../assets/img/new-cards/CLUBS/5.png";
import c6 from "../../assets/img/new-cards/CLUBS/6.png";
import c7 from "../../assets/img/new-cards/CLUBS/7.png";
import c8 from "../../assets/img/new-cards/CLUBS/8.png";
import c9 from "../../assets/img/new-cards/CLUBS/9.png";
import cT from "../../assets/img/new-cards/CLUBS/10.png";
import cJ from "../../assets/img/new-cards/CLUBS/J.png";
import cQ from "../../assets/img/new-cards/CLUBS/Q.png";
import cK from "../../assets/img/new-cards/CLUBS/K.png";
import cA from "../../assets/img/new-cards/CLUBS/A.png";

import s2 from "../../assets/img/new-cards/SPADES/2.png";
import s3 from "../../assets/img/new-cards/SPADES/3.png";
import s4 from "../../assets/img/new-cards/SPADES/4.png";
import s5 from "../../assets/img/new-cards/SPADES/5.png";
import s6 from "../../assets/img/new-cards/SPADES/6.png";
import s7 from "../../assets/img/new-cards/SPADES/7.png";
import s8 from "../../assets/img/new-cards/SPADES/8.png";
import s9 from "../../assets/img/new-cards/SPADES/9.png";
import sT from "../../assets/img/new-cards/SPADES/10.png";
import sJ from "../../assets/img/new-cards/SPADES/J.png";
import sQ from "../../assets/img/new-cards/SPADES/Q.png";
import sK from "../../assets/img/new-cards/SPADES/K.png";
import sA from "../../assets/img/new-cards/SPADES/A.png";

import h2 from "../../assets/img/new-cards/HEARTS/2.png";
import h3 from "../../assets/img/new-cards/HEARTS/3.png";
import h4 from "../../assets/img/new-cards/HEARTS/4.png";
import h5 from "../../assets/img/new-cards/HEARTS/5.png";
import h6 from "../../assets/img/new-cards/HEARTS/6.png";
import h7 from "../../assets/img/new-cards/HEARTS/7.png";
import h8 from "../../assets/img/new-cards/HEARTS/8.png";
import h9 from "../../assets/img/new-cards/HEARTS/9.png";
import hT from "../../assets/img/new-cards/HEARTS/10.png";
import hJ from "../../assets/img/new-cards/HEARTS/J.png";
import hQ from "../../assets/img/new-cards/HEARTS/Q.png";
import hK from "../../assets/img/new-cards/HEARTS/K.png";
import hA from "../../assets/img/new-cards/HEARTS/A.png";

import d2 from "../../assets/img/new-cards/DIAMONDS/2.png";
import d3 from "../../assets/img/new-cards/DIAMONDS/3.png";
import d4 from "../../assets/img/new-cards/DIAMONDS/4.png";
import d5 from "../../assets/img/new-cards/DIAMONDS/5.png";
import d6 from "../../assets/img/new-cards/DIAMONDS/6.png";
import d7 from "../../assets/img/new-cards/DIAMONDS/7.png";
import d8 from "../../assets/img/new-cards/DIAMONDS/8.png";
import d9 from "../../assets/img/new-cards/DIAMONDS/9.png";
import dT from "../../assets/img/new-cards/DIAMONDS/10.png";
import dJ from "../../assets/img/new-cards/DIAMONDS/J.png";
import dQ from "../../assets/img/new-cards/DIAMONDS/Q.png";
import dK from "../../assets/img/new-cards/DIAMONDS/K.png";
import dA from "../../assets/img/new-cards/DIAMONDS/A.png";

let raiseVal = 0;

const Play = () => {
  ////////////////// navigate /////////////////////
  const navigate = useNavigate();
  const { myEmail, user, setUser, roomNumber, setRoomNumber, socket, setSocket, chips } = useGameStore();

  ////////////////// states /////////////////////
  const [gameData, setGameData] = useState({
    seats: 6,
    gameStarted: false,
    players: "[]", // '{ name: "Me", chips: 100 }, ...' json string
    dealer: "", // user name
    curPlayer: "",
    curPlayerBet: 0,
    lastPlayer: {},
    communityCards: "[]", // json array
    topHands: {
      "Full House": 5,
      Straight: 5,
      Flush: 5,
      "Four of a Kind": 4,
      Pair: 2,
      "Two Pair": 4,
      "Three of a Kind": 3,
      High: 1,
    },
    totalPot: 0,
    myChips: 0,
    winner: "",
    matchingCards: [],
    firstcard: "",
    secondcard: "",
    gets: 0,
    highestBet: 0,

    dealerPos: function (name) {
      const seats = this.posPlayers(name);

      if (!seats || !seats.length) return -1;

      let pos = -1;

      console.log("--- seats ---", seats);

      for (const player of seats) {
        pos++;

        if (player && player.name && player.name === this.dealer) {
          break;
        }
      }

      return pos;
    },
    martchingCardsStrToArr: function (str) {
      const splitter = ", ";
      return str.split(splitter).map((card) => (card.includes("10") ? card.replace("10", "T") : card));
    },
    leaveValidCards: function (nameOfHand, matchingCardArr) {
      for (const nameHand in this.topHands) {
        if (nameOfHand.includes(nameHand)) {
          matchingCardArr.splice(this.topHands[nameHand]);
          break;
        }
      }
      return matchingCardArr;
    },
    getPlayers: function () {
      return JSON.parse(this.players);
    },
    updatePlayers: function (json) {
      this.players = JSON.parse(json);
    },
    posPlayers: function (whoFirst) {
      let players = this.getPlayers();
      let playersAtSeats = new Array(this.seats);
      let i;
      let offset;

      for (i = 0; i < players.length; i++) {
        if (players[i].name == whoFirst) break;
      }

      offset = i;

      for (i = 0; i < playersAtSeats.length; i++) {
        const temp = i + offset;
        const pos = temp >= playersAtSeats.length ? temp % playersAtSeats.length : temp;

        playersAtSeats[i] = players[pos];
      }

      return playersAtSeats;
    },
    getCommunityCards: function () {
      return JSON.parse(this.communityCards);
    },
    me: function () {
      let players = this.getPlayers();

      for (let i = 0; i < players.length; i++) {
        if (name == players[i].name) {
          return players[i];
        }
      }

      return null;
    },
    curPlayerObj: function () {
      let obj = {};
      let players = this.getPlayers();

      for (let i = 0; i < players.length; i++) {
        if (this.curPlayer == players[i].name) {
          obj = players[i];
          return obj;
        }
      }

      return null;
    },
    getPlayerObj: function (json, name) {
      let obj = {};
      let players = JSON.parse(json);

      for (let i = 0; i < players.length; i++) {
        if (name == players[i].name) {
          obj = players[i];
          return obj;
        }
      }

      return null;
    },
  });
  const [visualData, setVisualData] = useState({
    progress: 0,
    firstCard: null,
    secondCard: null,
    showOtherWaitTimer: false,
    showTotalPot: false,
    showMainTimer: false,
    showButtons: false,
    showCardsOnBards: false,
    showAnimCircle: false,
    showActionBadge: false,
    shouldCheckLocal: false,
    showDealerButton: false,
    showMsgbox: false,
  });

  ////////////////// local vars /////////////////////
  const name = user.firstname + " " + user.lastname;
  const communityCardOrder = ["first", "second", "third", "fourth", "fifth"];
  const positionClass = ["firstpos", "secondpos", "thirdpos", "fourthpos", "fifthpos", "sixthpos"];
  const timerController = {
    second: 0,
    waitTimer: null,
    step: 3.3333,
    resetSec: function () {
      this.reverseSec =
        100 / this.step - Math.floor(100 / this.step) !== 0 ? Math.ceil(100 / this.step) : 100 / this.step;
    },
    startWaitTimer: function () {
      console.log("timer started!");

      this.resetSec();

      this.waitTimer = setInterval(() => {
        setVisualData((prevData) => {
          let progress = -1;

          if (prevData.progress < 100 && prevData.progress + this.step >= 100) {
            progress = 100;
          } else if (prevData.progress == 100) {
            this.stopWaitTimer(this.waitTimer);
            this.waitTimer = null;
            progress = 100;
          } else {
            progress = prevData.progress + this.step;
          }

          this.reverseSec--;

          return { ...prevData, progress };
        });
      }, 1000);
    },
    stopWaitTimer: function () {
      console.log("timer stopped");

      clearInterval(this.waitTimer);
    },
    restartTimer: function () {
      console.log("restart timer");
      if (this.waitTimer) {
        this.stopWaitTimer();
        this.waitTimer = null;
      }

      setVisualData((prevData) => ({ ...prevData, progress: 0 }));
      this.resetSec();

      console.log("--- visualdata.progress ---", visualData.progress);

      this.startWaitTimer();
    },
  };
  const room = {
    timerController,
    gameData,
  };
  const playerClassNames = [
    "first-player",
    "second-player",
    "third-player",
    "fourth-player",
    "fifth-player",
    "sixth-player",
  ];
  const cards = {
    "2c": c2,
    "3c": c3,
    "4c": c4,
    "5c": c5,
    "6c": c6,
    "7c": c7,
    "8c": c8,
    "9c": c9,
    Tc: cT,
    Jc: cJ,
    Qc: cQ,
    Kc: cK,
    Ac: cA,
    "2s": s2,
    "3s": s3,
    "4s": s4,
    "5s": s5,
    "6s": s6,
    "7s": s7,
    "8s": s8,
    "9s": s9,
    Ts: sT,
    Js: sJ,
    Qs: sQ,
    Ks: sK,
    As: sA,
    "2d": d2,
    "3d": d3,
    "4d": d4,
    "5d": d5,
    "6d": d6,
    "7d": d7,
    "8d": d8,
    "9d": d9,
    Td: dT,
    Jd: dJ,
    Qd: dQ,
    Kd: dK,
    Ad: dA,
    "2h": h2,
    "3h": h3,
    "4h": h4,
    "5h": h5,
    "6h": h6,
    "7h": h7,
    "8h": h8,
    "9h": h9,
    Th: hT,
    Jh: hJ,
    Qh: hQ,
    Kh: hK,
    Ah: hA,
  };

  ////////////////// local methods /////////////////////
  const acted = () => {
    timerController.stopWaitTimer();
  };
  const call = () => {
    console.log("calling", socket);
    socket.emit("call", { roomNumber, email: myEmail });
    acted();
  };
  const fold = () => {
    console.log("folding", socket);
    socket.emit("fold", { roomNumber, email: myEmail });
    acted();
  };
  const check = () => {
    console.log("checking", socket);
    socket.emit("call", { roomNumber, email: myEmail });
    acted();
  };
  const raise = (raiseVal) => {
    console.log("raising", raiseVal);
    socket.emit("raise", { roomNumber, email: myEmail, raiseVal });
    acted();
  };
  const onChangeSlider = (raiseVal2) => {
    raiseVal = raiseVal2;
    console.log("--- raiseVal ---", raiseVal);
  };
  const hReset = () => {
    console.log("--- reset ---");

    socket.emit("reset room", { roomNumber });
  };

  ////////////////// after did mount /////////////////////
  useEffect(() => {
    console.log("--- use effect started ---", room);

    setGameData((prevData) => ({ ...prevData, myChips: chips }));

    const socket = io("http://localhost:5000");

    setSocket(socket)

    socket.on("connect", () => {
      console.log("--- connected ---");

      socket.emit("join room", { roomNumber, name: name, chips: user.chips });
    });
    socket.on("disconnect", (data) => {
      console.log("--- disconnected ---");
    });
    socket.on("same player", () => {
      console.log("--- same player ---");

      navigate("/cash");
    });
    socket.on("reseted room", () => {
      console.log("--- reseted room ---");

      navigate("/cash");
    });
    socket.on("new user joined", ({ members, timer }) => {
      console.log("-- new user joined ---", { members });

      setGameData((prevData) => ({ ...prevData, players: members }));

      if (timer) {
        setVisualData((prevData) => ({ ...prevData, showMainTimer: true }));
        room.timerController.restartTimer();
      }
    });
    socket.on("a player disconnected", ({ players }) => {
      console.log("--- a player disconnected ---", players);

      setGameData((prevData) => ({ ...prevData, players }));
    });
    socket.on("game started", ({ firstcard, secondcard, curPlayer, players, pot, chips, dealer }) => {
      console.log("--- game started ---");

      let changeData = {
        showMainTimer: false,
        showOtherWaitTimer: true,
        firstCard: cards[firstcard],
        secondCard: cards[secondcard],
        showCardsOnBards: true,
        showTotalPot: true,
        showAnimCircle: true,
        showActionBadge: true,
        showDealerButton: true,
      };

      if (curPlayer == name) {
        console.log("--- my name ---", curPlayer, name);
        changeData = { ...changeData, showButtons: true };
      }

      room.timerController.restartTimer();
      setGameData((prevData) => ({
        ...prevData,
        gameStarted: true,
        dealer,
        curPlayer,
        players,
        totalPot: pot,
        myChips: chips,
      }));
      setVisualData((prevData) => ({ ...prevData, ...changeData }));
      // console.log("--------", visualData.showOtherWaitTimer, gameData.curPlayer, gameData.posPlayers(name));
    });
    socket.on(
      "small started",
      ({
        firstcard,
        secondcard,
        curPlayer,
        curPlayerBet,
        dealer,
        players,
        pot,
        communityCards,
        chips,
        winner,
        matchingCards,
        description,
        highestBet,
        shouldCheck,
      }) => {
        console.log("--- small started ---", {
          firstcard,
          secondcard,
          curPlayer,
          curPlayerBet,
          dealer,
          players,
          pot,
          communityCards,
          chips,
          winner,
          matchingCards: gameData.leaveValidCards(description, gameData.martchingCardsStrToArr(matchingCards)),
          description,
          highestBet,
          shouldCheck,
        });

        room.timerController.restartTimer();
        setGameData((prevData) => ({
          ...prevData,
          firstcard,
          secondcard,
          lastPlayer: gameData.getPlayerObj(players, prevData.curPlayer),
          dealer,
          curPlayer,
          curPlayerBet,
          players,
          communityCards,
          totalPot: pot,
          myChips: chips,
          winner,
          matchingCards: gameData.leaveValidCards(description, gameData.martchingCardsStrToArr(matchingCards)),
          description,
          highestBet,
        }));

        let changeData = {
          showOtherWaitTimer: true,
          showMainTimer: false,
          firstCard: cards[firstcard],
          secondCard: cards[secondcard],
          shouldCheckLocal: shouldCheck,
        };

        if (curPlayer == name) {
          changeData = { ...changeData, showButtons: true };
        } else {
          changeData = { ...changeData, showButtons: false };
        }
          changeData = { ...changeData, showOtherWaitTimer: true, showMainTimer: false, showButtons: true };

        setVisualData((prevData) => ({ ...prevData, ...changeData }));
      }
    );
    socket.on(
      "after player acted",
      ({
        firstcard,
        secondcard,
        curPlayer,
        curPlayerBet,
        dealer,
        players,
        pot,
        communityCards,
        chips,
        winner,
        matchingCards,
        description,
        highestBet,
        shouldCheck,
      }) => {
        console.log("--- after player acted ---", {
          firstcard,
          secondcard,
          curPlayer,
          curPlayerBet,
          dealer,
          players,
          pot,
          communityCards,
          chips,
          winner,
          matchingCards: gameData.leaveValidCards(description, gameData.martchingCardsStrToArr(matchingCards)),
          description,
          highestBet,
          shouldCheck,
        });

        room.timerController.restartTimer();
        setGameData((prevData) => ({
          ...prevData,
          firstcard,
          secondcard,
          lastPlayer: gameData.getPlayerObj(players, prevData.curPlayer),
          dealer,
          curPlayer,
          curPlayerBet,
          players,
          communityCards,
          totalPot: pot,
          myChips: chips,
          winner,
          matchingCards: gameData.leaveValidCards(description, gameData.martchingCardsStrToArr(matchingCards)),
          description,
          highestBet,
        }));

        let changeData = {
          showOtherWaitTimer: true,
          showMainTimer: false,
          firstCard: cards[firstcard],
          secondCard: cards[secondcard],
          shouldCheckLocal: shouldCheck,
        };

        if (curPlayer == name) {
          changeData = { ...changeData, showButtons: true };
        } else {
          changeData = { ...changeData, showButtons: false };
        }

        if (winner) {
          changeData = { ...changeData, showOtherWaitTimer: false, showMainTimer: true, showButtons: false };
        } else {
          changeData = { ...changeData, showOtherWaitTimer: true, showMainTimer: false };
        }

        setVisualData((prevData) => ({ ...prevData, ...changeData }));
      }
    );

    return () => {
      console.log("--- disconnect ---");
      socket.disconnect();
    };
  }, []);

  console.log("--- when render ---", gameData);

  ////////////////// render part /////////////////////
  return (
    <div className="play" style={{ backgroundColor: "black" }}>
      <button className="reset-btn" onClick={hReset}>
        Reset
      </button>
      <img className="img-board" src={bg_table} alt="asdf"></img>
      <img className="lobby-img" src={lobby_button_bg} alt="asdf"></img>

      {/* --- show users and their states --- */}

      {[...Array(gameData.seats)].map((_, index) => (
        <div className={playerClassNames[index]}>
          {gameData.posPlayers(name)[index] && (
            <>
              <p className="bet-amount">{`$${gameData.posPlayers(name)[index].bet.toLocaleString("en-IN")}`}</p>

              <img className="img-round" src={round_under_card} alt="img round"></img>
              {gameData.gameStarted && (
                <>
                  {gameData.posPlayers(name)[index].name == name && (
                    <>
                      <img
                        className={`first-card ${
                          gameData.winner && gameData.matchingCards.includes(gameData.firstcard)
                            ? "selected"
                            : !gameData.winner
                            ? ""
                            : "notallowed"
                        }`}
                        src={visualData.firstCard}
                        alt="first card"
                      ></img>
                      <img
                        className={`second-card ${
                          gameData.winner && gameData.matchingCards.includes(gameData.secondcard)
                            ? "selected"
                            : !gameData.winner
                            ? ""
                            : "notallowed"
                        }`}
                        src={visualData.secondCard}
                        alt="second card"
                      ></img>
                    </>
                  )}
                  {gameData.posPlayers(name)[index].name != name && !gameData.winner && (
                    <>
                      <img className="first-card" src={bgcard_2} alt="first card"></img>
                      <img className="second-card" src={bgcard_2} alt="second card"></img>
                    </>
                  )}
                  {gameData.posPlayers(name)[index].name != name && gameData.winner && (
                    <>
                      <img
                        className="first-card"
                        src={cards[gameData.posPlayers(name)[index].firstCard]}
                        alt="first card"
                      ></img>
                      <img
                        className="second-card"
                        src={cards[gameData.posPlayers(name)[index].secondCard]}
                        alt="second card"
                      ></img>
                    </>
                  )}
                </>
              )}
              <div className="coin-amount-box">
                <p className="two-pair">{gameData.posPlayers(name)[index].name}</p>
                <p className="coin-amount">{`$${gameData.posPlayers(name)[index].chips.toLocaleString("en-IN")}`}</p>
              </div>

              {gameData.winner != "" && gameData.winner == gameData.posPlayers(name)[index].name && (
                <img src={winnerBadge} alt="winner badge" className="winner-badge" />
              )}

              {visualData.showAnimCircle && gameData.curPlayer == gameData.posPlayers(name)[index].name && (
                <>
                  <div className="anim-circle-1"></div>
                  <div className="anim-circle-2"></div>
                  <div className="anim-circle-3"></div>
                </>
              )}

              {gameData.lastPlayer && gameData.lastPlayer.name == gameData.posPlayers(name)[index].name && (
                <div
                  className={`action-badge ${
                    visualData.showActionBadge ? gameData.posPlayers(name)[index].lastAction : "empty"
                  }`}
                >
                  <p className="action-text">{gameData.lastPlayer.lastAction}</p>
                </div>
              )}

              {visualData.showOtherWaitTimer && gameData.curPlayer == gameData.posPlayers(name)[index].name && (
                <div className="action-board">
                  <span className="progress-badge">
                    {Math.ceil((100 - visualData.progress) / timerController.step)}
                  </span>
                  <LinearProgress
                    variant="determinate"
                    value={100 - visualData.progress}
                    className="progress-circle"
                    sx={{
                      backgroundColor: "rgb(167, 202, 237)",
                      // backgroundColor: "#4B4B4B",
                      "& .css-5xe99f-MuiLinearProgress-bar1": {
                        background: "linear-gradient(to right, #7f4, #06A)",
                        // backgroundColor: "#29FF00",
                      },
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      ))}

      {/* {visualData.showButtons && (
        <>
          <button className="call-btn-real" onClick={() => call()}>
            CALL
          </button>
          <button className="raise-btn-real" onClick={() => raise(raiseVal)}>
            RAISE
          </button>
          <button className="fold-btn-real" onClick={() => fold()}>
            FOLD
          </button>
          <button className="check-btn-real" onClick={() => check()}>
            CHECK
          </button>
        </>
      )} */}
      {visualData.showMainTimer && (
        <LinearProgress
          variant="determinate"
          value={100 - visualData.progress}
          className="progress-circle main"
          sx={{
            background: "transparent",
            "& .css-5xe99f-MuiLinearProgress-bar1": {
              background: "linear-gradient(to right, #7f4, #005)",
            },
          }}
        />
      )}
      <div className="board">
        {visualData.showTotalPot && (
          <p className="text-total-pot">Total pot : ${gameData.totalPot.toLocaleString("en-IN")}</p>
        )}
        {visualData.showCardsOnBards && (
          <>
            {gameData.getCommunityCards().map((card, index) => (
              <>
                <img
                  className={`card front ${communityCardOrder[index]} ${
                    gameData.winner && gameData.matchingCards.includes(card)
                      ? "selected"
                      : !gameData.winner
                      ? ""
                      : "notallowed"
                  }`}
                  src={cards[card]}
                  alt="board card"
                ></img>
                <img className={`card back ${communityCardOrder[index]}`} src={bgcard_2} alt="board card"></img>
              </>
            ))}
          </>
        )}
      </div>
      {/* <img
        className="btn-msg"
        src={msg_btn}
        alt="message button"
        onClick={() => {
          setVisualData(prev => ({ ...prev, showMsgbox: !prev.showMsgbox }));
        }}
      ></img> */}
      <Msgbox myName={name} socket={socket} roomNumber={roomNumber} />

      {visualData.showButtons && (
        <Slider
          chips={gameData.myChips}
          onChangeSlider={onChangeSlider}
          prevCall={gameData.highestBet}
          myBet={gameData.curPlayerBet}
          call={call}
          raise={raise}
          check={check}
          fold={fold}
          shouldCheck={visualData.shouldCheckLocal}
        />
      )}

      {visualData.showDealerButton && gameData.getPlayers(name).length && gameData.dealerPos(name) !== -1 && (
        <button className={`dealer-btn ${positionClass[gameData.dealerPos(name)]}`}>D</button>
      )}
    </div>
  );
};

export default Play;
