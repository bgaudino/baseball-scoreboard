import React from 'react'
import { resetCount, recordOut, useStore, endInning, advanceRunnersIfForced } from '../store'

export default function Count() {
  const {balls, strikes, outs} = useStore(({balls, strikes, outs}) => ({balls, strikes, outs}));
  React.useEffect(() => {
    if (strikes >= 3) {
      recordOut();
      resetCount();
    }
  }, [strikes]);

  React.useEffect(() => {
    if (balls >= 4) {
      resetCount();
      advanceRunnersIfForced(1);
    }
  }, [balls]);

  React.useEffect(() => {
    if (outs === 3) {
      endInning();
    }
  }, [outs])

  return (
    <table>
      <thead>
        <tr>
          <th>Balls</th>
          <th>Strikes</th>
          <th>Outs</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{balls}</td>
          <td>{strikes}</td>
          <td>{outs}</td>
        </tr>
      </tbody>
    </table>
  )
}
