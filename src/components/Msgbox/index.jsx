import React, { useState, useEffect, useRef } from "react";
import { Grid } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import "./index.scss";

const Msgbox = ({ myName, socket, roomNumber, broadcastMsg }) => {
  //////////////////////// states /////////////////////////
  const [visualData, setVisualData] = useState({
    chatHistory: [
    ],
    curMsg: "",
  });

  // const dummy = useRef();

  //////////////////////// component did mount /////////////////////////
  useEffect(() => {
    console.log("--- useEffect ---", socket);

    if (socket) {
      socket.on("msg share", ({ who, msg }) => {
        console.log("--- msg share ---", who, msg);

        setVisualData((prevData) => ({
          ...prevData,
          chatHistory: [...prevData.chatHistory, { who, msg }],
        }));
        setVisualData((prevData) => ({ ...prevData, curMsg: "" }));

        let chatHistoryPan = document.getElementById("history-pan");

    chatHistoryPan.scrollTop = chatHistoryPan.scrollHeight;
      });
    }
  }, [socket]);

  useEffect(() => {
    console.log('hello')
    let chatHistoryPan = document.getElementById("history-pan");

    chatHistoryPan.scrollTop = chatHistoryPan.scrollHeight;
  }, [visualData.chatHistory]);

  //////////////////////// local methods /////////////////////////
  const hChangeInput = (e) => {
    setVisualData({ ...visualData, curMsg: e.target.value });
  };
  const hSend = () => {
    console.log("--- before send ---", { roomNumber, who: myName, msg: visualData.curMsg });
    socket.emit("msg send", { roomNumber, who: myName, msg: visualData.curMsg });
  };

  return (
    <div className="msg-box">
      <h1 style={{ color: "white" }} className="title">
        <ChatBubbleOutlineIcon />
        Chat
      </h1>
      <Grid container className="history-pan" id="history-pan">
        {visualData.chatHistory.map((record, index) => (
          <>
            <Grid
              item
              xs={12}
              container
              className="row"
              // ref={index === visualData.chatHistory.length - 1 ? dummy : undefined}
            >
              <Grid item xs={3} className="who">
                {record.who}:
              </Grid>
              <Grid item xs={9} className="msg">
                {record.msg}
              </Grid>
            </Grid>
          </>
        ))}
      </Grid>
      <div className="input-container">
        <input value={visualData.curMsg} onChange={hChangeInput} className="input-field" />
        <button onClick={hSend} className="send-btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default Msgbox;
