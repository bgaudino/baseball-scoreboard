import {create} from 'zustand';
import {sum} from './hooks/useScore';
import {faker} from '@faker-js/faker';

export type Base = 1 | 2 | 3;
export type BaseRunners = {1?: number; 2?: number; 3?: number};
export interface Hitter {
  name: string;
  AB: number;
  singles: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  R: number;
  RBI: number;
  BB: number;
  K: number;
}
export interface GameState {
  awayTeam: string;
  homeTeam: string;
  awayLineup: Hitter[][];
  homeLineup: Hitter[][];
  awayHitter: number;
  homeHitter: number;
  awayRuns: number[];
  homeRuns: number[];
  awayHits: number;
  homeHits: number;
  inning: number;
  top: boolean;
  outs: number;
  balls: number;
  strikes: number;
  baseRunners: BaseRunners;
  gameOver: boolean;
}
export const useStore = create<GameState>(() => ({
  homeTeam: 'HOME',
  awayTeam: 'AWAY',
  awayLineup: getFakePlayers(9),
  homeLineup: getFakePlayers(9),
  awayHitter: 0,
  homeHitter: 0,
  awayRuns: [0],
  homeRuns: [],
  awayHits: 0,
  homeHits: 0,
  inning: 1,
  top: true,
  outs: 0,
  balls: 0,
  strikes: 0,
  baseRunners: {},
  gameOver: false,
}));

function getFakePlayers(num: number) {
  const players: Hitter[][] = [];
  for (let i = 0; i < num; i++) {
    const player: Hitter = {
      name: faker.person.lastName(),
      AB: 0,
      singles: 0,
      doubles: 0,
      triples: 0,
      homeRuns: 0,
      R: 0,
      RBI: 0,
      BB: 0,
      K: 0,
    };
    players.push([player]);
  }
  return players;
}

function advance(base: Base, runner: number, bases: BaseRunners) {
  if (base > 0) {
    delete bases[runner as Base];
  }
  const next = (base + 1) as Base;
  if (next >= 4) {
    recordRun();
  } else {
    if (bases[next]) {
      bases = advance(next, bases[next] as number, bases);
    }
    bases[next] = runner;
  }
  return bases;
}

export const advanceRunners = (bases: number) =>
  useStore.setState((state) => {
    const currentBaseRunners = Object.entries(state.baseRunners).map(
      ([base, runner]) => [Number(base) + bases, runner]
    );
    const baseRunners: BaseRunners = {};
    const newState = {...state, baseRunners};
    const lineup = newState.top ? newState.awayLineup : newState.homeLineup;

    let runs = 0;
    const batter = state.top ? state.awayHitter : state.homeHitter;
    for (const [base, lineupIndex] of [[bases, batter], ...currentBaseRunners]) {
      if (base > 3) {
        runs++;
        const slot = lineup[lineupIndex];
        const runner = slot[slot.length - 1];
        runner.R++;
      } else {
        baseRunners[base as Base] = lineupIndex;
      }
    }
    if (runs > 0) {
      const lineupIndex = newState.top ? newState.awayHitter : newState.homeHitter;
      const slot = lineup[lineupIndex];
      const hitter = slot[slot.length -1 ];
      hitter.RBI += runs;
      const teamRuns = state.top ? newState.awayRuns : newState.homeRuns;
      teamRuns[state.inning - 1] += runs;
    }
    return newState;
  });

export const advanceRunnersIfForced = (bases: number) =>
  useStore.setState((state) => {
    const newState = {...state};
    const runner = state.top ? state.awayHitter : state.homeHitter;
    for (let i = 0; i < bases; i++) {
      newState.baseRunners = advance(i as Base, runner, newState.baseRunners);
    }
    return newState;
  });

export const batterOut = () => {
  logOutState();
  nextHitter();
  resetCount();
  recordOut();
};

export const endGame = () =>
  useStore.setState((state) => ({...state, gameOver: true}));

export const endInning = () =>
  useStore.setState((state) => {
    if (state.inning >= 9) {
      const awayTotalRuns = sum(state.awayRuns);
      const homeTotalRuns = sum(state.homeRuns);
      if (state.top) {
        if (homeTotalRuns > awayTotalRuns) {
          return {...state, gameOver: true};
        }
      } else {
        if (homeTotalRuns !== awayTotalRuns) {
          return {...state, gameOver: true};
        }
      }
    }
    const newState = {
      ...state,
      balls: 0,
      strikes: 0,
      outs: 0,
      baseRunners: {},
    };
    if (state.top) {
      return {...newState, top: false, homeRuns: [...state.homeRuns, 0]};
    }
    return {
      ...newState,
      top: true,
      inning: state.inning + 1,
      awayRuns: [...state.awayRuns, 0],
    };
  });

export function hit(bases: number) {
  advanceRunners(bases);
  recordHit();
  logHitState(bases);
  nextHitter();
}

export const logHitState = (bases: number) =>
  useStore.setState((state) => {
    const lineup = state.top ? 'awayLineup' : 'homeLineup';
    const lineupIndex = state.top ? state.awayHitter : state.homeHitter;
    const newState = {...state};
    const slot = newState[lineup][lineupIndex];
    const hitter = slot[slot.length - 1];
    hitter.AB++;
    switch (bases) {
      case 1:
        hitter.singles++;
        break;
      case 2:
        hitter.doubles++;
        break;
      case 3:
        hitter.triples++;
        break;
      case 4:
        hitter.homeRuns++
    }
    return newState;
  });

export const logOutState = () =>
  useStore.setState((state) => {
    const lineup = state.top ? 'awayLineup' : 'homeLineup';
    const hitter = state.top ? state.awayHitter : state.homeHitter;
    const newState = {...state};
    newState[lineup][hitter][newState[lineup][hitter].length - 1].AB++;
    return newState;
  });

export const logRunState = (runner: number) =>
  useStore.setState((state) => {
    const lineup = state.top ? 'awayLineup' : 'homeLineup';
    const newState = {...state};
    newState[lineup][runner][newState[lineup][runner].length - 1].R++;
    return newState;
  });

export const logStrikeOutState = () =>
  useStore.setState((state) => {
    const lineup = state.top ? 'awayLineup' : 'homeLineup';
    const hitter = state.top ? state.awayHitter : state.homeHitter;
    const newState = {...state};
    newState[lineup][hitter][newState[lineup][hitter].length - 1].K++;
    return newState;
  });

export const logWalkState = () =>
  useStore.setState((state) => {
    const lineup = state.top ? 'awayLineup' : 'homeLineup';
    const hitter = state.top ? state.awayHitter : state.homeHitter;
    const newState = {...state};
    newState[lineup][hitter][newState[lineup][hitter].length - 1].BB++;
    return newState;
  });

export const moveRunner = (from: Base, to: Base) =>
  useStore.setState((state) => {
    const newState = {...state};
    newState.baseRunners[to] = newState.baseRunners[from];
    delete newState.baseRunners[from];
    return newState;
  });

export const nextHitter = () =>
  useStore.setState((state) => {
    const key = state.top ? 'awayHitter' : 'homeHitter';
    return {...state, [key]: (state[key] + 1) % 9};
  });

export const recordBall = () =>
  useStore.setState((state) => ({...state, balls: state.balls + 1}));

export const recordHit = () =>
  useStore.setState((state) => {
    const newState = {...state};
    if (state.top) {
      newState.awayHits++;
    } else {
      newState.homeHits++;
    }
    return newState;
  });

export const recordOut = () =>
  useStore.setState((state) => ({...state, outs: state.outs + 1}));

export const recordRun = () =>
  useStore.setState((state) => {
    const newState = {...state};
    if (state.top) {
      newState.awayRuns[state.inning - 1]++;
    } else {
      newState.homeRuns[state.inning - 1]++;
    }
    return newState;
  });

export const recordStrike = () =>
  useStore.setState((state) => ({...state, strikes: state.strikes + 1}));

export const removeRunner = (base: Base) =>
  useStore.setState((state) => {
    const newState = {...state};
    delete newState.baseRunners[base];
    return newState;
  });

export const resetCount = () =>
  useStore.setState((state) => ({...state, balls: 0, strikes: 0}));

export const walk = () => {
  logWalkState();
  resetCount();
  advanceRunnersIfForced(1);
  nextHitter();
};
