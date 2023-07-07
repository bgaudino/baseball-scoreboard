import {Hitter, useStore} from '../store';

function avg(H: number, AB: number) {
  if (!AB) {
    return '-'
  }
  const result = (H / AB).toFixed(3).toString();
  if (result.startsWith('0')) {
    return result.slice(1)
  }
  return result;
}
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
          <th>AVG</th>
        </tr>
      </thead>
      <tbody>
        {lineup.map((players, index) => (
          <tr
            key={index}
            className={index === atBat ? 'at-bat' : ''}
          >
            <td>{players[players.length - 1].name}</td>
            <td>{players[players.length - 1].AB}</td>
            <td>{players[players.length - 1].H}</td>
            <td>
              {avg(players[players.length - 1].H, players[players.length - 1].AB)}
            </td>
          </tr>
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
