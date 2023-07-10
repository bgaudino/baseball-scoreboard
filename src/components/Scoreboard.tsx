import useScore from '../hooks/useScore';
import {useStore} from '../store';
import TeamName from './TeamName';

export default function Scoreboard() {
  const {awayRuns, awayHits, homeRuns, homeHits} = useStore(
    ({awayTeam, homeTeam, awayRuns, homeRuns, awayHits, homeHits}) => ({
      awayTeam,
      homeTeam,
      awayRuns,
      homeRuns,
      awayHits,
      homeHits,
    })
  );
  const numInnings = Math.max(9, awayRuns.length);
  const {awayTotalRuns, homeTotalRuns} = useScore();
  return (
    <table>
      <thead>
        <tr>
          <th>Team</th>
          {[...Array(numInnings).keys()].map((key) => (
            <th key={key}>{key + 1}</th>
          ))}
          <th>R</th>
          <th>H</th>
          <th>E</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <TeamName field="awayTeam" />
          {[...Array(numInnings).keys()].map((key) => (
            <td key={key}>{awayRuns[key] ?? '-'}</td>
          ))}
          <td>{awayTotalRuns}</td>
          <td>{awayHits}</td>
          <td>0</td>
        </tr>
        <tr>
          <TeamName field="homeTeam" />
          {[...Array(numInnings).keys()].map((key) => (
            <td key={key}>{homeRuns[key] ?? '-'}</td>
          ))}
          <td>{homeTotalRuns}</td>
          <td>{homeHits}</td>
          <td>0</td>
        </tr>
      </tbody>
    </table>
  );
}
