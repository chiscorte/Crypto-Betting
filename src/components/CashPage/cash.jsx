import { Grid } from "@mui/material";
import React from "react";
import "./cash.scss";
import { useNavigate } from "react-router-dom";
import { enterRoom } from "../../provider/cash";
import { getUser } from "../../provider/user";
import useGameStore from "../../GameStore";

const CashPage = ({ socket }) => {
  const success = "success";
  const { myEmail, user, setUser, setRoomNumber } = useGameStore();
  const navigate = useNavigate();

  const listTitles = ["GAME", "SEATS", "STAKES", "LIMIT"];
  const cashgames = [
    {
      [listTitles[0]]: "Cash Game",
      [listTitles[1]]: "6 Seats",
      [listTitles[2]]: "Stakes $0.25/$0.50",
      [listTitles[3]]: "No Limit Table",
    },
    {
      [listTitles[0]]: "Cash Game",
      [listTitles[1]]: "6 Seats",
      [listTitles[2]]: "Stakes $0.5/$0.1",
      [listTitles[3]]: "No Limit Table",
    },
    {
      [listTitles[0]]: "Cash Game",
      [listTitles[1]]: "6 Seats",
      [listTitles[2]]: "Stakes $1/$2",
      [listTitles[3]]: "No Limit Table",
    },
    {
      [listTitles[0]]: "Cash Game",
      [listTitles[1]]: "6 Seats",
      [listTitles[2]]: "Stakes $2/$5",
      [listTitles[3]]: "No Limit Table",
    },
    {
      [listTitles[0]]: "Cash Game",
      [listTitles[1]]: "6 Seats",
      [listTitles[2]]: "Stakes $5/$10",
      [listTitles[3]]: "No Limit Table",
    },
    {
      [listTitles[0]]: "Cash Game",
      [listTitles[1]]: "6 Seats",
      [listTitles[2]]: "Stakes $50/$100",
      [listTitles[3]]: "No Limit Table",
    },
  ];

  const callback = (response) => {
    console.log(response);
    // if (response && response.data && response.data.result == success) {
    console.log("----------myemail:", myEmail);
    // recheck chips in db
    getUser({
      email: myEmail,
      callback: (res) => {
        console.log("--- after enter room user data ---", res);
        if (!res.data || !res.data.user || res.data.user.chips === 0) {
          alert("You dont have enough chips now.");
          return;
        }

        setUser(res.data.user)
        navigate("/play");
      },
    });
    // } else {
    //   alert("failed");
    // }
  };

  const hClick = (e, roomNumber) => {
    const smallBlind = 10;
    const chips = user.chips;

    roomNumber = Number(roomNumber);
    setRoomNumber(roomNumber)
    localStorage.setItem("roomNumber", roomNumber, chips);
    // send room enter request
    enterRoom({ email: myEmail, roomNumber, smallBlind, chips }, callback);
    const data = {
      roomNumber: roomNumber,
      email: myEmail,
      chips,
    };
    console.log("data", data);
    socket.emit("join room", data);
  };
  const hSend = () => {
    alert("asdfasfsadf");
  };

  return (
    <Grid container justifyContent="center" className="cash-page">
      <Grid item xs={9} container direction="column" justifyContent="flex-start" rowSpacing={2}>
        <Grid item xs={1} container className="top-title">
          <Grid item xs={6} container justifyContent="flex-start" alignItems="flex-end" className="title">
            BLUFFS CASINO
          </Grid>
        </Grid>
        <Grid item xs={1} container justifyContent="center" columnSpacing={2} className="title-bar">
          <Grid item xs={3} container justifyContent="flex-end" alignItems="center" className="badge-container">
            <button className="badge">CASH</button>
          </Grid>
          <Grid item xs={6} container justifyContent="flex-start" alignItems="center" className="title">
            LIVE POKER TABLES
          </Grid>
        </Grid>
        <Grid item container direction="column" rowSpacing={2} justifyContent="flex-start" className="list-container">
          <Grid item container justifyContent="space-between" className="title-bar">
            {listTitles.map((title) => (
              <Grid item xs={2.5} container justifyContent="center" alignItems="center" className="title">
                {title}
              </Grid>
            ))}
          </Grid>
          <Grid item container direction="column" rowSpacing={1} className="list">
            {cashgames.map((item, index) => (
              <Grid
                item
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                className="row"
                onClick={(event) => hClick(event, index + 1)}
              >
                {listTitles.map((title) => (
                  <Grid item xs={2.5} container justifyContent="center" alignItems="center" className="list-item">
                    {item[title]}
                  </Grid>
                ))}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CashPage;
