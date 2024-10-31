import React, { useState, useEffect } from "react";
import ReactSlider from "react-slider";
import plus_btn from "../../assets/img/plus-button.png";
import minus_btn from "../../assets/img/minus-button.png";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import { Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./Slider.scss";

const Slider = ({
  onChangeSlider,
  chips,
  currentIndex,
  prevCall,
  myBet,
  call,
  check,
  raise,
  fold,
  totalPot,
  shouldCheck,
}) => {
  const [raiseValue, setRaiseValue] = useState(0);
  const onChange = (reverseValue) => {
    setRaiseValue(reverseValue);
    onChangeSlider(reverseValue);
  };
  const callVal = prevCall;
  let maxRaise = chips - prevCall + myBet;

  if (maxRaise < 0) maxRaise = 0;

  return (
    <div className="slider-container">
      <ReactSlider
        className="horizontal-slider"
        defaultValue={0}
        min={0}
        max={maxRaise}
        onChange={onChange}
        value={raiseValue}
        // marks
        renderMark={(props) => {
          if (props.key < currentIndex) {
            props.className = "example-mark example-mark-completed";
          } else if (props.key === currentIndex) {
            props.className = "example-mark example-mark-active";
          }

          return <span {...props}>{`>>`}</span>;
        }}
        renderThumb={(props, state) => (
          <Tooltip
            {...props}
            title={`$${state.value}`}
            placement="top"
            arrow
            className="value"
            componentsProps={{
              arrow: {
                sx: {
                  // backgroundColor: 'red',
                  // borderWidth: '2px',
                  // borderColor: 'blue'
                },
              },
              tooltip: {
                sx: {
                  // background: "linear-gradient(to bottom, #945D00, #8F4C00)",
                  fontSize: "2vw",
                  fontWeight: "bolder",
                },
              },
            }}
          >
            <button className="example-thumb"></button>
          </Tooltip>
        )}
        trackClassName="example-track"
      />
      <button onClick={() => raise(raiseValue)} className="raise">
        Raise
      </button>
      <button onClick={() => fold()} className="fold">
        <span className="prefix-cross"></span>FOLD
      </button>
      <button onClick={() => raise(maxRaise)} className="allin">
        <span className="triangle-top"></span>ALL IN
      </button>
      {!shouldCheck && (
        <>
          <button onClick={call} className="call">
            CALL ${callVal.toLocaleString("en-IN")}
          </button>
        </>
      )}
      {shouldCheck && (
        <button onClick={() => check()} className="check">
          <span className="prefix-cross"></span>CHECK
        </button>
      )}
      <dev className="call-amount">
        <span className="prefix">$</span>
        <input
          value={Number(raiseValue).toLocaleString("en-IN")}
          onChange={(e) => onChange(Number(e.target.value))}
          className="input-field"
        />
      </dev>
      <button className="plus-btn">
        <span>+</span>
      </button>
      <button className="minus-btn"></button>
      {chips >= totalPot / 2 && (
        <button onClick={() => raise(totalPot / 2)} className="pot-21">
          1/2 pot
        </button>
      )}
      {chips >= (totalPot * 3) / 4 && (
        <button onClick={() => raise((totalPot * 3) / 4)} className="pot-43">
          4/3 pot
        </button>
      )}
      {chips >= totalPot && (
        <button onClick={() => raise(totalPot)} className="pot">
          pot
        </button>
      )}
    </div>
  );
};

export default Slider;
