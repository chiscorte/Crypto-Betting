import React,  { useState, useEffect } from "react";
import ReactSlider from "react-slider";
import plus_btn from "../../assets/img/plus-button.png";
import minus_btn from "../../assets/img/minus-button.png";
import "./index.scss";

const Slider = ({ onChangeSlider, chips, currentIndex }) => {
  const [raiseValue, setRaiseValue] = useState(chips);
  const onChange = (reverseValue) => {
    const value = Math.round((100 - reverseValue) / 100 * chips);
    setRaiseValue(value);
    onChangeSlider(value);
  };

  console.log()

  return (
    <div className="slider-container">
      <ReactSlider
        className="vertical-slider"
        markClassName="example-mark"
        thumbClassName="example-thumb"
        onChange={onChange}
        trackClassName="example-track"
        defaultValue={100}
        value={currentIndex}
        renderTrack={(props, state) => <div {...props} />}
        orientation="vertical"
      />
      <img src={plus_btn} alt="plus button" className="plus-btn" />
      <img src={minus_btn} alt="minus button" className="minus-btn" />
      <p className="raise-amount">${chips + raiseValue - chips}</p>
    </div>
  );
};

export default Slider;
