import { BsDice1, BsDice2, BsDice3, BsDice4, BsDice5, BsDice6 } from 'react-icons/bs';
import './Die.css';

export default function Die({ value, isHeld, holdDice }) {
  const dice = {
    1: BsDice1,
    2: BsDice2,
    3: BsDice3,
    4: BsDice4,
    5: BsDice5,
    6: BsDice6,
  };

  const Icon = dice[value];

  return (
    <div className='die' onClick={holdDice}>
      <Icon className={`die-num ${isHeld ? 'isHeld' : ''}`} />
    </div>
  );
}
