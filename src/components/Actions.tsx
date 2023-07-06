import {
  advanceRunners,
  recordBall,
  recordHit,
  recordOut,
  recordStrike,
} from '../store';

function hit(bases: number) {
  advanceRunners(bases);
  recordHit();
}

export default function Actions() {
  return (
    <div>
      <div className="actions">
        <button onClick={recordStrike}>Strike</button>
        <button onClick={recordBall}>Ball</button>
      </div>
      <div className="actions">
        <button onClick={recordOut}>Out in Play</button>
      </div>
      <div className="actions">
        <button onClick={() => hit(1)}>Single</button>
        <button onClick={() => hit(2)}>Double</button>
        <button onClick={() => hit(3)}>Triple</button>
        <button onClick={() => hit(4)}>Home Run</button>
      </div>
    </div>
  );
}
