import useScore from '../hooks/useScore';
import {useStore} from '../store';

function Text() {
  const {awayTotalRuns, homeTotalRuns} = useScore();
  const awayTeam = useStore((state) => state.awayTeam);
  const homeTeam = useStore((state) => state.homeTeam);
  if (awayTotalRuns > homeTotalRuns) {
    return `${awayTeam} wins!`;
  } else if (homeTotalRuns > awayTotalRuns) {
    return `${homeTeam} wins!`;
  }
  return `It's a tie!`;
}

export default function Result() {
  return (
    <div>
      <p className="result">
        <Text />
      </p>
      <button
        onClick={() => {
          // TODO: reset state
          window.location.reload();
        }}
      >
        New Game
      </button>
    </div>
  );
}
