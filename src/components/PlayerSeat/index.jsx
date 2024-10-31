
import React from 'react'
import round_under_card from "../../assets/img/round_under_card.png";
import './index.scss'

const PlayerSeat = ({
  seatNumber,
  isPlayerSeat,
  showCards,
  isMySeat,
  playerName,
  chips,
  firstcard,
  secondcard,
  bgcard,
}) => {
  const playerClassNames = [
    "first-player",
    "second-player",
    "third-player",
    "fourth-player",
    "fifth-player",
    "sixth-player",
  ];

  return (
    <>
      <div className={playerClassNames[seatNumber]}>
        {isPlayerSeat && (
          <>
            <img className="img-round" src={round_under_card} alt="img round"></img>
            {showCards && (
              <>
                {isMySeat && (
                  <>
                    <img className="first-card" src={firstcard} alt="first card"></img>
                    <img className="second-card" src={secondcard} alt="second card"></img>
                  </>
                )}
                {!isMySeat && (
                  <>
                    <img className="first-card" src={bgcard} alt="first card"></img>
                    <img className="second-card" src={bgcard} alt="second card"></img>
                  </>
                )}
              </>
            )}
            <div className="coin-amount-box">
              <p className="two-pair">{playerName}</p>
              <p className="coin-amount">{`$${chips}`}</p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PlayerSeat;
