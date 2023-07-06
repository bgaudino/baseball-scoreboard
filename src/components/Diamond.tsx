import React from 'react';
import {Base} from '../store';
import {useStore} from '../store';

export default function Diamond() {
  const baseRunners = useStore((state) => state.baseRunners);
  const baseStatus = React.useCallback(
    (base: Base) => ((baseRunners as any)[base] ? 'taken' : 'empty'),
    [baseRunners]
  );

  return (
    <div className="diamond-container">
      <div className="diamond">
        <div className="base home empty" />
        <div className={`base first ${baseStatus(1)}`} />
        <div className={`base second ${baseStatus(2)}`} />
        <div className={`base third ${baseStatus(3)}`} />
      </div>
    </div>
  );
}
