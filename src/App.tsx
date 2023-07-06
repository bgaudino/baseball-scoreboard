import React from 'react';
import './App.css';
import Scoreboard from './components/Scoreboard';
import Diamond from './components/Diamond';
import Count from './components/Count';
import Actions from './components/Actions';
import {endGame, useStore} from './store';
import useScore from './hooks/useScore';
import Result from './components/Result';

function App() {
  const gameOver = useStore((state) => state.gameOver);
  const top = useStore((state) => state.top);
  const inning = useStore((state) => state.inning);
  const {awayTotalRuns, homeTotalRuns} = useScore();

  React.useEffect(() => {
    if (!top && inning >= 9 && homeTotalRuns > awayTotalRuns) {
      endGame();
    }
  }, [inning, top, awayTotalRuns, homeTotalRuns]);

  return (
    <>
      <h1>Baseball Scorekeeper</h1>
      <Diamond />
      <Scoreboard />
      <Count />
      {gameOver ? <Result /> : <Actions />}
    </>
  );
}

export default App;
