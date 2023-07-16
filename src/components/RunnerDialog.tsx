import React from 'react';
import {
  Base,
  moveRunner,
  removeRunner,
  recordRun,
  recordOut,
  useStore,
  logRunState,
} from '../store';

interface RunnerProps {
  base: number;
}
export default function RunnerDialog({base}: RunnerProps) {
  const baseRunners = useStore((state) => state.baseRunners);
  const top = useStore((state) => state.top);
  const awayLineup = useStore((state) => state.awayLineup);
  const homeLineup = useStore((state) => state.homeLineup);
  const lineup = top ? awayLineup : homeLineup;
  const canAdvance = React.useMemo(() => {
    if (!base) {
      return {};
    }
    const result: {[base: number]: boolean} = {};
    for (let i = base; i < 4; i++) {
      const next = i + 1;
      if (next === 4 || baseRunners[next as Base] === undefined) {
        result[next] = true;
      } else {
        break;
      }
    }
    return result;
  }, [base, baseRunners]);
  const runner = React.useMemo(() => {
    const baseRunner = baseRunners[base as Base];
    if (baseRunner !== undefined) {
      const slot = lineup[baseRunner.runner];
      return slot[slot.length - 1].name;
    }
    return ''
  }, [baseRunners, base, lineup]);

  return (
    <dialog open={base > 0 && base < 4}>
      <p>Runner on {base}B ({runner})</p>
      {canAdvance[2] && (
        <div>
          <button onClick={() => moveRunner(base as Base, 2)}>
            Advance to 2B
          </button>
        </div>
      )}
      {canAdvance[3] && (
        <div>
          <button onClick={() => moveRunner(base as Base, 3)}>
            Advance to 3B
          </button>
        </div>
      )}
      {canAdvance[4] && (
        <div>
          <button
            onClick={() => {
              const slot = baseRunners[base as Base];
              if (slot === undefined) return;
              logRunState(slot);
              removeRunner(base as Base);
              recordRun();
            }}
          >
            Score
          </button>
        </div>
      )}
      {base && (
        <div>
          <button
            onClick={() => {
              removeRunner(base as Base);
              recordOut();
            }}
          >
            Make Out on Basepaths
          </button>
        </div>
      )}
    </dialog>
  );
}
