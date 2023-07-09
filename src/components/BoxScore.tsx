import {Hitter, useStore} from '../store';
import HittingStats from './HittingStats';

interface LineupProps {
  lineup: Hitter[][];
  atBat: number;
}
function Lineup({lineup, atBat}: LineupProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>AB</th>
          <th>H</th>
          <th>R</th>
          <th>RBI</th>
          <th>BB</th>
          <th>K</th>
          <th>AVG</th>
          <th>OPS</th>
        </tr>
      </thead>
      <tbody>
        {lineup.map((players, index) => (
          <HittingStats
            name={players[players.length - 1].name}
            index={index}
            atBat={atBat}
            key={index}
          />
        ))}
      </tbody>
    </table>
  );
}

export default function BoxScore() {
  const awayTeam = useStore((state) => state.awayTeam);
  const homeTeam = useStore((state) => state.homeTeam);
  const awayLineup = useStore((state) => state.awayLineup);
  const homeLineup = useStore((state) => state.homeLineup);
  const awayHitter = useStore((state) => state.awayHitter);
  const homeHitter = useStore((state) => state.homeHitter);
  const top = useStore((state) => state.top);

  const team = top ? awayTeam : homeTeam;
  const lineup = top ? awayLineup : homeLineup;
  const atBat = top ? awayHitter : homeHitter;

  return (
    <>
      <h2>{team} Lineup</h2>
      <Lineup lineup={lineup} atBat={atBat} />
    </>
  );
}
