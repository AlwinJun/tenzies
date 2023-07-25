import './Die.css';

export default function Die({ value }) {
  return (
    <div className='die'>
      <span className='die-num'>{value}</span>
    </div>
  );
}
