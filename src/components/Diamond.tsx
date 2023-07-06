import React from 'react';
import {Base, caughtStealing, steal} from '../store';
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
        <div>
          <button onClick={() => selectedRunner && steal(selectedRunner)}>
            Steal
          </button>
          <button
            onClick={() => selectedRunner && caughtStealing(selectedRunner)}
          >
            Caught Stealing
          </button>
        </div>
      </dialog>
    </>
  );
}
