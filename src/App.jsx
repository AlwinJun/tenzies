import Die from './components/Die';
import './App.css';
import { useState } from 'react';
import { nanoid } from 'nanoid';

function App() {
  const [allNewDice, setAllNewDice] = useState(dieNumbers());

  function dieNumbers() {
    const arrNum = [];
    for (let i = 0; i < 10; i++) {
      const dieObj = {
        id: nanoid(),
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
      };
      arrNum.push(dieObj);
    }
    return arrNum;
  }

  function rollDice() {
    setAllNewDice((prevAllNewDice) =>
      prevAllNewDice.map((dice) =>
        // Persist the value of hold dice
        dice.isHeld ? dice : { id: nanoid(), value: Math.ceil(Math.random() * 6), isHeld: false }
      )
    );
  }

  // Update the style condition of click dice
  function holdDice(id) {
    setAllNewDice((prevAllNewDice) => {
      const newDiceArr = prevAllNewDice.map((dice) => {
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
      <h1 id='title'>Tenzies</h1>
      <p id='info'>
        Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
      </p>
      <div className='dice-container'>{dice}</div>
      <button type='button' onClick={rollDice}>
        Roll
      </button>
    </main>
  );
}

export default App;

