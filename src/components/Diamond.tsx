import React from 'react';
import {Base} from '../store';
import {useStore} from '../store';
import RunnerDialog from './RunnerDialog';

export default function Diamond() {
  const [selectedRunner, setSelectedRunner] = React.useState(0);
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
      setSelectedRunner(0);
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
      <RunnerDialog base={selectedRunner} />
    </>
  );
}
