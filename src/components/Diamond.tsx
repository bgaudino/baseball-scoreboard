import React from 'react';
import {Base, moveRunner, recordOut, recordRun, removeRunner} from '../store';
import {useStore} from '../store';

export default function Diamond() {
  const [selectedRunner, setSelectedRunner] = React.useState<Base | null>(null);
  const baseRunners = useStore((state) => state.baseRunners);
  const baseStatus = React.useCallback(
    (base: Base) => ((baseRunners as any)[base] ? 'taken' : 'empty'),
    [baseRunners]
  );

  React.useEffect(() => {
    document.addEventListener('click', (e) => {
      if (
        e.target instanceof HTMLDivElement &&
        e.target.classList.contains('base')
      ) {
        return;
      }
      setSelectedRunner(null);
    });
  }, []);

  const selectRunner = React.useCallback(
    (runner: Base) => {
      if (baseRunners[runner]) {
        setSelectedRunner(runner);
      }
    },
    [baseRunners]
  );

  const canAdvance = React.useMemo(() => {
    if (!selectedRunner) {
      return {};
    }
    const result: {[base: number]: boolean} = {};
    for (let i = selectedRunner; i < 4; i++) {
      const next = i + 1;
      if (next === 4 || !baseRunners[next as Base]) {
        result[next] = true;
      } else {
        break;
      }
    }
    return result;
  }, [selectedRunner, baseRunners]);

  return (
    <>
      <div className="diamond-container">
        <div className="diamond">
          <div className="base home empty" />
          <div
            className={`base first ${baseStatus(1)}`}
            onClick={() => selectRunner(1)}
          />
          <div
            className={`base second ${baseStatus(2)}`}
            onClick={() => selectRunner(2)}
          />
          <div
            className={`base third ${baseStatus(3)}`}
            onClick={() => selectRunner(3)}
          />
        </div>
      </div>
      <dialog open={!!selectedRunner}>
        <p>Runner on {selectedRunner}B</p>
        {canAdvance[2] && (
          <div>
            <button onClick={() => moveRunner(selectedRunner!, 2)}>
              Advance to 2B
            </button>
          </div>
        )}
        {canAdvance[3] && (
          <div>
            <button onClick={() => moveRunner(selectedRunner!, 3)}>
              Advance to 3B
            </button>
          </div>
        )}
        {canAdvance[4] && (
          <div>
            <button
              onClick={() => {
                removeRunner(selectedRunner!);
                recordRun();
              }}
            >
              Score
            </button>
          </div>
        )}
        {selectedRunner && (
          <div>
            <button
              onClick={() => {
                removeRunner(selectedRunner);
                recordOut();
              }}
            >
              Make Out on Basepaths
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
