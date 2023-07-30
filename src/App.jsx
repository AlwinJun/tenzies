import React, { useEffect, useState } from 'react';
import Die from './components/Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';
import './App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [diceList, setDiceList] = useState(generateDiceList());
  const [isTenzies, setIsTenzies] = useState(false);

  const lowestTime = JSON.parse(localStorage.getItem('lowestTime')) || 0;

  // Timer/Stopwatch
  useEffect(() => {
    let interval;
    if (gameStarted) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 10);
    }

    return () => clearInterval(interval);
  }, [gameStarted]);

  // Check if the game is over
  useEffect(() => {
    const isEveryHeld = diceList.every((dice) => dice.isHeld);
    const refValue = diceList[0].value;
    const allSameValue = diceList.every((dice) => dice.value === refValue);

    if (isEveryHeld && allSameValue) {
      if (!lowestTime) {
        localStorage.setItem('lowestTime', JSON.stringify(time));
      } else {
        console.log(typeof time, typeof lowestTime);
        const minTime = Math.min(time, parseInt(lowestTime));
        localStorage.setItem('lowestTime', JSON.stringify(minTime));
      }
      setIsTenzies(true);
      setGameStarted(false);
    }
  }, [diceList]);

  function getTimeParts(timeInMilliseconds) {
    const minutes = String(Math.floor(timeInMilliseconds / 6000)).padStart(2, '0');
    const seconds = String(Math.floor((timeInMilliseconds / 100) % 60)).padStart(2, '0');
    const milliseconds = String(timeInMilliseconds % 100).padStart(2, '0');
    return { minutes, seconds, milliseconds };
  }

  const { minutes, seconds, milliseconds } = getTimeParts(time);
  const { minutes: toMinutes, seconds: toSeconds, milliseconds: toMs } = getTimeParts(lowestTime);

  function generateDice() {
    return {
      id: nanoid(),
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
    };
  }

  function generateDiceList() {
    const diceList = [];
    for (let i = 0; i < 10; i++) {
      diceList.push(generateDice());
    }
    return diceList;
  }

  function rollDice() {
    if (!isTenzies) {
      setDiceList((prevDiceList) =>
        prevDiceList.map((dice) =>
          // Persist the value of hold dice
          dice.isHeld ? dice : generateDice()
        )
      );
    } else {
      // New Game
      setDiceList(generateDiceList());
      setIsTenzies(false);
      setTime(0);
    }
  }

  // Update the style condition of click dice
  function holdDice(id) {
    if (!gameStarted) {
      // Start timer
      setGameStarted(true);
    }
    setDiceList((prevDice) =>
      prevDice.map((dice) => (dice.id === id ? { ...dice, isHeld: !dice.isHeld } : dice))
    );
  }

  const diceElements = diceList.map(({ id, value, isHeld }) => (
    <Die key={id} value={value} isHeld={isHeld} holdDice={() => holdDice(id)} />
  ));

  let lowestTimeElement = '00:00';
  if (lowestTime) {
    lowestTimeElement = `${toMinutes}:${toSeconds}:${toMs}`;
  }

  return (
    <main>
      {isTenzies && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <h1 id='title'>Tenzies</h1>
      <p id='info'>
        Roll until all dice are the same. Click each die to hold it at its current value between rolls.
      </p>
      <div className='dice-container'>{diceElements}</div>
      <div className='flex-row'>
        <div className='current-score'>{`${minutes}:${seconds}:${milliseconds}`}</div>
        <button className='dice-roll' type='button' onClick={rollDice}>
          {!isTenzies ? 'Roll' : 'New Game'}
        </button>
        <span className='high-score'>{lowestTimeElement}</span>
      </div>
    </main>
  );
}

export default App;

