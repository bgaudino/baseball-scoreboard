import React from 'react';
import {Hitter, Pitcher, useStore} from '../store';
import HittingStats from './HittingStats';
import PitchingStats from './PitchingStats';

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
        {lineup.map((players, i) => (
          <React.Fragment key={i}>
            {players.map((player, j) => (
              <HittingStats
                name={player.name}
                atBat={i === atBat && j === players.length - 1}
                index={i}
                sub={j > 0}
                slotIndex={j}
                key={j}
                active={j === players.length - 1}
              />
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

interface PitcherProps {
  pitchers: Pitcher[];
}
function Pitchers({pitchers}: PitcherProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>IP</th>
          <th>H</th>
          <th>R</th>
          <th>BB</th>
          <th>K</th>
          <th>ERA</th>
          <th>WHIP</th>
          <th>PC</th>
        </tr>
      </thead>
      <tbody>
        {pitchers.map((pitcher, i) => (
          <PitchingStats
            key={i}
            pitcher={pitcher}
            current={i === pitchers.length - 1}
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
  const awayPitchers = useStore((state) => state.awayPitchers);
  const awayBench = useStore((state) => state.awayBench);
  const awayBullpen = useStore((state) => state.awayBullpen);
  const homeLineup = useStore((state) => state.homeLineup);
  const homePitchers = useStore((state) => state.homePitchers);
  const homeBench = useStore((state) => state.homeBench);
  const homeBullpen = useStore((state) => state.homeBullpen);
  const awayHitter = useStore((state) => state.awayHitter);
  const homeHitter = useStore((state) => state.homeHitter);
  const top = useStore((state) => state.top);

  const hittingTeam = top ? awayTeam : homeTeam;
  const pitchingTeam = top ? homeTeam : awayTeam;
  const pitchers = top ? homePitchers : awayPitchers;
  const lineup = top ? awayLineup : homeLineup;
  const bench = top ? awayBench : homeBench;
  const bullpen = top ? homeBullpen : awayBullpen;
  const atBat = top ? awayHitter : homeHitter;

  return (
    <>
      <h2>{pitchingTeam} Pitchers</h2>
      <Pitchers pitchers={pitchers} />
      <h2>{hittingTeam} Lineup</h2>
      <Lineup lineup={lineup} atBat={atBat} />
      <h2>{hittingTeam} Bench</h2>
      {bench.map((player, i) => (
        <div key={i} className="name">
          {player.name}
        </div>
      ))}
      <h2>{pitchingTeam} Bullpen</h2>
      {bullpen.map((player, i) => (
        <div key={i} className="name">
          {player.name}
        </div>
      ))}
    </>
  );
}
