import React from 'react';
import {
  Base,
  moveRunner,
  removeRunner,
  recordRun,
  recordOut,
  useStore,
} from '../store';

interface RunnerProps {
  base: number;
}
export default function RunnerDialog({base}: RunnerProps) {
  const baseRunners = useStore((state) => state.baseRunners);
  const canAdvance = React.useMemo(() => {
    if (!base) {
      return {};
    }
    const result: {[base: number]: boolean} = {};
    for (let i = base; i < 4; i++) {
      const next = i + 1;
      if (next === 4 || !baseRunners[next as Base]) {
        result[next] = true;
      } else {
        break;
      }
    }
    return result;
  }, [base, baseRunners]);

  return (
    <dialog open={base > 0 && base < 4}>
      <p>Runner on {base}B</p>
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
