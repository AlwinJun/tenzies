import Die from './components/Die';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';
import './App.css';

function App() {
  const [start, setStart] = useState(false);
  const [time, setTime] = useState(0);
  const [allNewDice, setAllNewDice] = useState(dieNumbers());
  const [tenzies, setTenzies] = useState(false);

  const lowestTime = JSON.parse(localStorage.getItem('lowestTime')) || 0;

  // Convert the time interval into mm:ss:ms
  const minutes = String(Math.floor(time / 6000)).padStart(2, '0');
  const seconds = String(Math.floor((time / 100) % 60)).padStart(2, '0');
  const milliseconds = String(time % 100).padStart(2, '0');

  // Convert miliseconds into mm:ss:ms
  const mm = 60 * 1000; //There are 60000 milliseconds in a minute
  const millisec = parseInt(lowestTime);
  const toMinutes = String(Math.floor(millisec / mm)).padStart(2, '0');
  const toSeconds = String(((millisec % mm) / 1000).toFixed(0)).padStart(2, '0');
  const toMs = String(millisec % 1000).padStart(2, '0');

  const convertToMilliseconds = parseInt(minutes) * 60000 + parseInt(seconds) * 1000 + parseInt(milliseconds);

  // Check if the game is over
  useEffect(() => {
    const isEveryHeld = allNewDice.every((dice) => dice.isHeld);
    const refValue = allNewDice[0].value;
    const allSameValue = allNewDice.every((dice) => dice.value === refValue);
    if (isEveryHeld && allSameValue) {
      if (!lowestTime) {
        localStorage.setItem('lowestTime', JSON.stringify(convertToMilliseconds));
      } else {
        const minTime = Math.min(convertToMilliseconds, parseInt(lowestTime));
        localStorage.setItem('lowestTime', JSON.stringify(minTime));
      }
      console.log({ time, convertToMilliseconds });
      setTenzies(true);
      setStart(false);
    }
  }, [allNewDice]);

  // Timer/Stopwatch
  useEffect(() => {
    let interval;
    if (start) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 10);
    }

    return () => clearInterval(interval);
  }, [start]);

  function generateDie() {
    return {
      id: nanoid(),
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
    };
  }

  function dieNumbers() {
    const arrNum = [];
    for (let i = 0; i < 10; i++) {
      arrNum.push(generateDie());
    }
    return arrNum;
  }

  function rollDice() {
    if (!tenzies) {
      setAllNewDice((prevDice) =>
        prevDice.map((dice) =>
          // Persist the value of hold dice
          dice.isHeld ? dice : generateDie()
        )
      );
    } else {
      setAllNewDice(dieNumbers());
      setTenzies(false);
      setTime(0);
    }
  }

  // Update the style condition of click dice
  function holdDice(id) {
    if (!start) {
      setStart(true);
    }

    setAllNewDice((prevDice) => {
      const newDiceArr = prevDice.map((dice) => {
        if (dice.id === id) {
          return {
            ...dice,
            isHeld: !dice.isHeld,
          };
        } else {
          return dice;
        }
      });

      return newDiceArr;
    });
  }

  const dice = allNewDice.map(({ id, value, isHeld }) => (
    <Die key={id} value={value} isHeld={isHeld} holdDice={() => holdDice(id)} />
  ));

  let lowestTimeElement;
  if (!lowestTime) {
    lowestTimeElement = '00:00';
  } else {
    lowestTimeElement = `${toMinutes}:${toSeconds}:${toMs}`;
  }
  return (
    <main>
      {tenzies && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <h1 id='title'>Tenzies</h1>
      <p id='info'>
        Roll until all dice are the same. Click each die to hold it at its current value between rolls.
      </p>
      <div className='dice-container'>{dice}</div>
      <div className='flex-row'>
        <div className='current-score'>
          {minutes === '00' ? 'mm' : minutes}:{seconds === '00' ? 'ss' : seconds}:
          {milliseconds === '00' ? 'ms' : milliseconds}
        </div>
        <button className='dice-roll' type='button' onClick={rollDice}>
          {!tenzies ? 'Roll' : 'New Game'}
        </button>
        <span className='high-score'>{lowestTimeElement}</span>
      </div>
    </main>
  );
}

export default App;

