import React from 'react';
import usePitchingStats from '../hooks/usePitchingStats';
import {Pitcher, subPitcher, useStore} from '../store';

interface PitcherProps {
  pitcher: Pitcher;
  current: boolean;
}
export default function PitchingStats({pitcher, current}: PitcherProps) {
  const [subbing, setSubbing] = React.useState(false);
  const [bullpenIndex, setBullpenIndex] = React.useState(-1);
  const top = useStore((state) => state.top);
  const awayBullpen = useStore((state) => state.awayBullpen);
  const homeBullpen = useStore((state) => state.homeBullpen);
  const bullpen = top ? homeBullpen : awayBullpen;
  const {IP, H, R, BB, K, ERA, WHIP, pitches, name} = usePitchingStats(pitcher);

  return (
    <tr>
      <div className="d-flex justify-content-between">
        {subbing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (bullpenIndex >= 0) {
                subPitcher(bullpenIndex, top ? 'home' : 'away');
              }
              setSubbing(false);
            }}
            className="d-flex"
          >
            <select
              value={bullpenIndex}
              style={{padding: 8, flexGrow: 3, width: '100%'}}
              onChange={(e) => setBullpenIndex(Number(e.target.value))}
            >
              <option value={-1}>{name}</option>
              {bullpen.map((player, i) => (
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
            {current && bullpen.length > 0 && !subbing && (
              <i
                className="fa-solid fa-baseball
                "
                onClick={() => setSubbing((prev) => !prev)}
              ></i>
            )}
          </>
        )}
      </div>
      <td>{IP}</td>
      <td>{H}</td>
      <td>{R}</td>
      <td>{BB}</td>
      <td>{K}</td>
      <td>{ERA.toFixed(2)}</td>
      <td>{WHIP.toFixed(2)}</td>
      <td>{pitches}</td>
    </tr>
  );
}
