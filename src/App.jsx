import Die from './components/Die';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
// import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import './App.css';

function App() {
  const [allNewDice, setAllNewDice] = useState(dieNumbers());
  const [tenzies, setTenzies] = useState(false);

  // Check if the game is over
  useEffect(() => {
    const isEveryHeld = allNewDice.every((dice) => dice.isHeld);
    const refValue = allNewDice[0].value;
    const allSameValue = allNewDice.every((dice) => dice.value === refValue);
    if (isEveryHeld && allSameValue) {
      setTenzies(true);
    }
  }, [allNewDice]);

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
      <button className='dice-roll' type='button' onClick={rollDice}>
        {!tenzies ? 'Roll' : 'New Game'}
      </button>
    </main>
  );
}

export default App;

