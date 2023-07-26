import Die from './components/Die';
import './App.css';
import { useState } from 'react';

function App() {
  const [allNewDice, setAllNewDice] = useState(dieNumbers());

  function dieNumbers() {
    const arrNum = [];
    for (let i = 0; i < 10; i++) {
      arrNum.push(Math.ceil(Math.random() * 6));
    }
    return arrNum;
  }

  function rollDice() {
    setAllNewDice(dieNumbers);
  }

  const dice = allNewDice.map((die, index) => <Die key={index} value={die} />);
  console.log(dice);

  return (
    <main>
      <div className='dice-container'>{dice}</div>
      <button type='button' onClick={rollDice}>
        Roll
      </button>
    </main>
  );
}

export default App;

