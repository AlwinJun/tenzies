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

  const minutes = String(Math.floor(time / 6000)).padStart(2, '0');
  const seconds = String(Math.floor((time / 100) % 60)).padStart(2, '0');
  const milliseconds = String(time % 100).padStart(2, '0');

  // Check if the game is over
  useEffect(() => {
    const isEveryHeld = allNewDice.every((dice) => dice.isHeld);
    const refValue = allNewDice[0].value;
    const allSameValue = allNewDice.every((dice) => dice.value === refValue);
    if (isEveryHeld && allSameValue) {
      setTenzies(true);
    }
  }, [allNewDice]);

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

  return (
    <main>
      {tenzies && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <h1 id='title'>Tenzies</h1>
      <p id='info'>
        Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
      </p>
      <div className='dice-container'>{dice}</div>
      <div className='flex-row'>
        <div className='current-score'>
          {seconds}:{milliseconds}
        </div>
        <button className='dice-roll' type='button' onClick={rollDice}>
          {!tenzies ? 'Roll' : 'New Game'}
        </button>
        <div className='high-score'>00:00</div>
      </div>
    </main>
  );
}

export default App;

