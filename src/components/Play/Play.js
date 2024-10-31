import "./Play.scss";
import { useEffect, useState } from "react";
import { LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
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
import msg_btn from "../../assets/img/msg_btn.png";
import Slider from "../Slider";
import useGameStore from "../../GameStore";
import io from "socket.io-client";

const Play = () => {
  const { myEmail, user, setUser, roomNumber, setRoomNumber, socket, setSocket, chips, setChips } = useGameStore();
  const navigate = useNavigate();

  // state variables
  const [gameData, setGameData] = useState({
    seats: 6,
    gameStarted: false,
    players: "[]", // '{ name: "Me", chips: 100, lastAction: '' }, ...' json string
    dealer: "", // user email
    curPlayer: "",
    lastPlayer: {},
    communityCards: "[]", // json array
    totalPot: 0,
    myChips: 0,
    winner: "",
    gets: 0,

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
        if (myEmail == players[i].name) {
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
  });
  const [progress, setProgress] = useState(0); // unit: second from 0s
  const [firstcard, setfirstcard] = useState(null);
  const [secondcard, setsecondcard] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const [showMainTimer, setShowMainTimer] = useState(false);
  const [showOtherWaitTimer, setShowOtherWaitTimer] = useState(false);
  const [showTotalPot, setShowTotalPot] = useState(false);
  const [showAnimCircle, setShowAnimCircle] = useState(false);
  const [showActionBadge, setShowActionBadge] = useState(false);

  // local variables
  const roomStates = {
    empty: "empty",
    countdown: "countdown",
    pending: "pending",
  };
  let showCardsOnBards = true;
  let showOthersCards = false;
  let showMyCards = false;
  let showDealerButton = false;
  const playerClassNames = [
    "first-player",
    "second-player",
    "third-player",
    "fourth-player",
    "fifth-player",
    "sixth-player",
  ];
  let timerController = {
    waitTimer: null,
    step: 20,
    startWaitTimer: function () {
      console.log("timer started!");

      this.waitTimer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress < 100 && prevProgress + this.step >= 100) {
            return 100;
          } else if (prevProgress == 100) {
            this.stopWaitTimer(this.waitTimer);
            this.waitTimer = null;
            return 100;
          } else {
            return prevProgress + this.step;
          }
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
        this.stopWaitTimer(this.waitTimer);
        this.waitTimer = null;
        setProgress(0);
      }

      this.startWaitTimer();
    },
  };
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
  // for dealer button position
  const dealerBtnPosClasses = ["pos-1", "pos-2", "pos-3", "pos-4", "pos-5", "pos-6"];
  const positionClass = "";
  const communityCardOrder = ["first", "second", "third", "fourth", "fifth"];
  // for raise slider
  let raisevalue = 0;

  // local functions
  const acted = () => {
    timerController.stopWaitTimer();
    if (showMainTimer) setShowMainTimer(false);
  };
  const call = () => {
    console.log("calling", socket);
    socket.emit("call", { roomNumber });
    acted();
  };
  const fold = () => {
    console.log("folding", socket);
    socket.emit("fold", { roomNumber });
    acted();
  };
  const check = () => {
    console.log("checking", socket);
    socket.emit("check", { roomNumber });
    acted();
  };
  const raise = () => {
    console.log("raising", socket);
    socket.emit("raise", { roomNumber, raisevalue });
    acted();
  };
  const onChangeSlider = (raiseVal) => {
    raisevalue = raiseVal;
  };
  const hReset = () => {
    console.log("/* --------------- RESET ROOM STATE --------------- */");
    ///////////// send reset order to server //////////////
    socket.emit("reset room", { roomNumber });
  };

  useEffect(() => {
    console.log("use effect started");
    // set my chips
    setGameData((prevData) => ({ ...prevData, myChips: chips }));

    // socket relative
    const socket = io(process.env.REACT_APP_BACKEND_URL);

    setSocket(socket)

    socket.on("connect", () => {
      console.log("connected!!!", gameData);

      // should be changed
      socket.emit("join room", { roomNumber: roomNumber, email: myEmail, chips: chips });
    });
    socket.on("disconnect", (data) => {
      console.log("disconnected!!!", gameData);
    });
    socket.on("new user joined", (data) => {
      console.log("new user joined");
      let changeData = data.room.members.map((member) => ({
        name: member,
        chips: data.room.chips,
      }));
      changeData = JSON.stringify(changeData);
      setGameData((prevData) => {
        return { ...prevData, players: changeData, dealer: data.room.dealer };
      });
    });
    socket.on("wait new user", () => {
      // console.log("wait new user");
      // show main timer
      setShowMainTimer(true);
      // start timer
      timerController.restartTimer();
    });
    socket.on("stop wait new user", () => {
      // console.log("stop wait new user");
      // stop timer
      timerController.stopWaitTimer();
      // hide main timer
      setShowMainTimer(false);
    });
    socket.on("start timer", () => {
      // console.log("start timer");
      timerController.restartTimer();
    });
    socket.on("stop waiting", () => {
      // console.log("stop waiting", gameData);

      // start client waiting timer
      timerController.stopWaitTimer();
    });
    socket.on("start game", ({ curPlayer, firstcard, secondcard, pot }) => {
      console.log("start game");

      setGameData((prevData) => ({ ...prevData, gameStarted: true, curPlayer: curPlayer, totalPot: pot }));
      setfirstcard((_) => cards[firstcard]);
      setsecondcard((_) => cards[secondcard]);

      // hidden main timer
      setShowMainTimer(false);

      // show totalpot
      setShowTotalPot(true);

      // show my or other's waiting timer
      setShowOtherWaitTimer(true);

      // check if it's my turn
      if (myEmail == curPlayer) {
        setShowButtons(true);
      }
    });
    socket.on("wait player action", () => {
      console.log("wait player action start");
      // start timer
      timerController.restartTimer();
      // hidden player action badge
      // setShowActionBadge(false);
    });
    socket.on(
      "after player action",
      ({ curPlayer, firstcard, secondcard, players, communityCards, pot, chips, isEndGame, winner, gets }) => {
        if (isEndGame) console.log("winner: ", winner, " with: ", gets);

        const changedData = {
          curPlayer,
          firstcard,
          secondcard,
          players,
          communityCards,
          pot,
          chips,
          isEndGame,
          winner,
          gets,
        };

        console.log("after player action", changedData);

        setGameData((prevData) => {
          console.log('--- prev Data last Action ---', prevData.curPlayerObj(), prevData.getPlayers())

          return { ...prevData, lastPlayer: prevData.curPlayerObj(), ...changedData }
        });

        // check if game is over
        if (winner) {
          console.log("winner");
          // hide order buttons
          setShowButtons(false);

          // show main timer
          setShowMainTimer(true);

          // start timer
          timerController.restartTimer();
        } else {
          console.log("not winner", curPlayer, myEmail);
          // if my turn
          if (curPlayer == myEmail) {
            // update my current cards
            setfirstcard((_) => cards[firstcard]);
            setsecondcard((_) => cards[secondcard]);

            // show order buttons
            setShowButtons(true);

            console.log("draw my cards", gameData.posPlayers(myEmail)[0].name == myEmail);
          } else {
            console.log("hidden buttons");
            // hide order buttons
            setShowButtons(false);
          }
        }

        timerController.stopWaitTimer();
        // show player action badge
        // setShowActionBadge(true);
      }
    );
    socket.on("reseted room", () => {
      // console.log("reseted room");
      ///////////// Reset global vars //////////////
      socket.disconnect();
      setSocket(null)
      setRoomNumber(null)
      ///////////// reset client state //////////////
      setGameData({
        ...gameData,
        gameStarted: false,
        players: "[]",
        dealer: "",
        curPlayer: "",
        communityCards: "[]",
        totalPot: 0,
        myChips: 0,
      });
      setProgress(0);
      setfirstcard(null);
      setsecondcard(null);
      setShowButtons(false);
      setShowMainTimer(false);
      setShowOtherWaitTimer(false);
      setShowTotalPot(false);
      ///////////// reset local vars //////////////
      showCardsOnBards = true;
      showOthersCards = false;
      showMyCards = false;
      showDealerButton = false;
      timerController.stopWaitTimer();
      timerController.waitTimer = null;
      ///////////// Redirect out //////////////
      navigate("/cash");
    });

    setShowAnimCircle(true);
  }, []);

  // console.log("out of the render", gameData);

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
          {gameData.posPlayers(myEmail)[index] && (
            <>
              {gameData.posPlayers(myEmail)[index].bet && (
                <p className="bet-amount">{`$${gameData.posPlayers(myEmail)[index].bet}`}</p>
              )}
              <img className="img-round" src={round_under_card} alt="img round"></img>
              {gameData.gameStarted && (
                <>
                  {gameData.posPlayers(myEmail)[index].name == myEmail && (
                    <>
                      <img className="first-card" src={firstcard} alt="first card"></img>
                      <img className="second-card" src={secondcard} alt="second card"></img>
                    </>
                  )}
                  {gameData.posPlayers(myEmail)[index].name != myEmail && (
                    <>
                      <img className="first-card" src={bgcard_2} alt="first card"></img>
                      <img className="second-card" src={bgcard_2} alt="second card"></img>
                    </>
                  )}
                </>
              )}
              <div className="coin-amount-box">
                <p className="two-pair">{gameData.posPlayers(myEmail)[index].name}</p>
                <p className="coin-amount">{`$${gameData.posPlayers(myEmail)[index].chips}`}</p>
              </div>

              {gameData.winner != "" && gameData.winner == gameData.posPlayers(myEmail)[index].name && (
                <div className="winner-badge">WINNER</div>
              )}

              {showAnimCircle && gameData.curPlayer == gameData.posPlayers(myEmail)[index].name && (
                <>
                  <div className="anim-circle-1"></div>
                  <div className="anim-circle-2"></div>
                  <div className="anim-circle-3"></div>
                </>
              )}

              {gameData.lastPlayer.name == gameData.posPlayers(myEmail)[index].name && (
                <div
                  className={`action-badge ${showActionBadge ? gameData.posPlayers(myEmail)[index].lastAction : "empty"}`}
                >
                  <p className='action-text'>{gameData.lastPlayer.lastAction}</p>
                </div>
              )}

              {showOtherWaitTimer && gameData.curPlayer == gameData.posPlayers(myEmail)[index].name && (
                <>
                  <div className={`action-board`}>
                    <p className="progress-percent">{progress}</p>
                    <LinearProgress
                      variant="determinate"
                      value={100 - progress}
                      className="progress-circle"
                      sx={{
                        backgroundColor: "rgb(167, 202, 237)",
                        "& .css-5xe99f-MuiLinearProgress-bar1": {
                          background: "linear-gradient(to right, #7f4, #06A)",
                        },
                      }}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      ))}

      {showButtons && (
        <>
          <button className="call-btn-real" onClick={() => call()}>
            CALL
          </button>
          <button className="raise-btn-real" onClick={() => raise()}>
            RAISE
          </button>
          <button className="fold-btn-real" onClick={() => fold()}>
            FOLD
          </button>
          <button className="check-btn-real" onClick={() => check()}>
            CHECK
          </button>
        </>
      )}
      {showMainTimer && (
        <LinearProgress
          variant="determinate"
          value={100 - progress}
          className="progress-circle main"
          sx={{
            background: "transparent",
            "& .css-5xe99f-MuiLinearProgress-bar1": {
              background: "linear-gradient(to right, #7f4, #005)",
            },
            "& .MuiLinearProgress-bar": {
              transition: "200ms",
            },
          }}
        />
      )}
      <div className="board">
        {showTotalPot && <p className="text-total-pot">Total pot : ${gameData.totalPot}</p>}
        {showCardsOnBards && (
          <>
            {/* <img className="card first selected" src={cards[gameData.getCommunityCards()[0]]} alt="board card"></img>
            <img className="card second selected" src={cards[gameData.getCommunityCards()[1]]} alt="board card"></img>
            <img className="card third notallowed" src={cards[gameData.getCommunityCards()[2]]} alt="board card"></img>
            <img className="card fourth notallowed" src={cards[gameData.getCommunityCards()[3]]} alt="board card"></img>
            <img className="card fifth" src={cards[gameData.getCommunityCards()[4]]} alt="board card"></img> */}

            {gameData.getCommunityCards().map((card, index) => (
              <img
                className={`card ${communityCardOrder[index]}`}
                src={cards[gameData.getCommunityCards()[index]]}
                alt="board card"
              ></img>
            ))}
          </>
        )}
      </div>
      <img className="btn-msg" src={msg_btn} alt="message button"></img>
      <div className="slider-img">
        <Slider chips={gameData.myChips} onChangeSlider={onChangeSlider} />
      </div>
      {showDealerButton && <button className={`dealer-btn ${positionClass}`}>D</button>}
    </div>
  );
};

export default Play;
