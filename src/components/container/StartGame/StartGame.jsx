import { React, useState } from "react";
import "./StartGame.css";
import { Link } from "react-router-dom";

const StartGame = () => {
  const [playerInput, setPlayerInput] = useState({
    playerInput1: "",
    playerInput2: "",
    playerInput3: "",
    playerInput4: "",
  });
  const handlePlayerInput = (e) => {
    e.preventDefault();
    const regX = /^[0-9]+$/; // /^[0-9]*$
    const value = e.target.value;
    if (e.target.value === "" || regX.test(e.target.value)) {
      setPlayerInput({ [e.target.name]: value });
    }
  };
  console.log("1", playerInput.playerInput1);
  console.log("2", playerInput.playerInput2);
  console.log("3", playerInput.playerInput3);
  console.log("4", playerInput.playerInput4);
  // console.log(playerInput);
  const displayResult = () => {};
  return (
    <section>
      <form className="entries" action="#" onSubmit={displayResult}>
        <label htmlFor="player-inputs">
          {" "}
          Enter four unique numbers from 0 - 9{" "}
        </label>
        <div className="input">
          <input
            type="text"
            maxLength={1}
            minLength={1}
            name="playerInput1"
            id="player-inputs"
            className="first-player-input player-input"
            value={playerInput.playerInput1}
            onChange={handlePlayerInput}
          ></input>
          <input
            type="text"
            maxLength={1}
            minLength={1}
            name="playerInput2"
            id="player-inputs"
            className="second-player-input player-input"
            value={playerInput.playerInput2}
            onChange={handlePlayerInput}
          ></input>
          <input
            type="text"
            maxLength={1}
            minLength={1}
            name="playerInput3"
            id="player-inputs"
            className="third-player-input player-input"
            value={playerInput.playerInput3}
            onChange={handlePlayerInput}
          ></input>
          <input
            type="text"
            maxLength={1}
            minLength={1}
            name="playerInput4"
            id="player-inputs"
            className="fourth-player-input player-input"
            value={playerInput.playerInput4}
            onChange={handlePlayerInput}
          ></input>
        </div>
        <div className="number-btns">
          <button className="input-btn">0</button>
          <button className="input-btn">1</button>
          <button className="input-btn">2</button>
          <button className="input-btn">3</button>
          <button className="input-btn">4</button>
          <button className="input-btn">5</button>
          <button className="input-btn">6</button>
          <button className="input-btn">7</button>
          <button className="input-btn">8</button>
          <button className="input-btn">9</button>
        </div>
        <button className="game-btn clear">Clear</button>
        <button className="game-btn play" type="submit">
          Play
        </button>
      </form>

      <div className="attempts-and-trials">
        <div className="attempts">
          <p>Attempts:</p>
          <span>{}</span>
        </div>
        <div className="trials">
          <p>Trials Left:</p>
          <span>{}</span>
        </div>
      </div>
      <Link to="/">
        <button>Back</button>
      </Link>
    </section>
  );
};

export default StartGame;
