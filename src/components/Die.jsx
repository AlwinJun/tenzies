import './Die.css';

export default function Die({ value, isHeld, holdDice }) {
  return (
    <div className={`die ${isHeld ? 'isHeld' : ''}`} onClick={holdDice}>
      <span className='die-num'>{value}</span>
    </div>
  );
}
