import React from 'react';
import useHittingStats from '../hooks/useHittingStats';
import {subHitter, useStore} from '../store';

function formatRatioStat(num: number) {
  const result = num.toFixed(3).toString();
  if (result.startsWith('0')) {
    return result.slice(1);
  }
  return result;
}

interface HittingStatsProps {
  name: string;
  index: number;
  slotIndex: number;
  atBat: boolean;
  sub: boolean;
  active: boolean;
}
export default function Hitter({
  name,
  index,
  atBat,
  slotIndex,
  sub,
  active,
}: HittingStatsProps) {
  const {AB, H, R, RBI, BB, K, AVG, OPS} = useHittingStats(index, slotIndex);
  const top = useStore((state) => state.top);
  const awayBench = useStore((state) => state.awayBench);
  const homeBench = useStore((state) => state.homeBench);
  const bench = top ? awayBench : homeBench;
  const [subbing, setSubbing] = React.useState(false);
  const [benchIndex, setBenchIndex] = React.useState(-1);
  return (
    <tr key={index} className={atBat ? 'at-bat' : ''}>
      <td className="name" style={{textIndent: sub ? '1rem' : 0}}>
        <div className="d-flex justify-content-between">
          {subbing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (benchIndex >= 0) {
                  subHitter(benchIndex, index, top ? 'away' : 'home');
                }
                setSubbing(false);
              }}
              className="d-flex"
            >
              <select
                value={benchIndex}
                style={{padding: 8, flexGrow: 3, width: '100%'}}
                onChange={(e) => setBenchIndex(Number(e.target.value))}
              >
                <option value={-1}>{name}</option>
                {bench.map((player, i) => (
                  <option key={i} value={i}>
                    {player.name}
                  </option>
                ))}
              </select>
              <button type="submit">
                <i className="fa-solid fa-check" style={{color: 'green'}} />
              </button>
              <button type="button" onClick={() => setSubbing(false)}>
                <i className="fa-solid fa-x" style={{color: 'red'}} />
              </button>
            </form>
          ) : (
            <>
              <span>{name}</span>
              {active && bench.length > 0 && !subbing && (
                <i
                  className="fa-solid fa-baseball-bat-ball"
                  onClick={() => setSubbing((prev) => !prev)}
                ></i>
              )}
            </>
          )}
        </div>
      </td>
      <td>{AB}</td>
      <td>{H}</td>
      <td>{R}</td>
      <td>{RBI}</td>
      <td>{BB}</td>
      <td>{K}</td>
      <td>{formatRatioStat(AVG)}</td>
      <td>{formatRatioStat(OPS)}</td>
    </tr>
  );
}
