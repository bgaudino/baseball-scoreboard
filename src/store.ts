import {create} from 'zustand';
import {sum} from './hooks/useScore';
import {faker} from '@faker-js/faker';
import {persist} from 'zustand/middleware';

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
export interface Pitcher {
  name: string;
  balls: number;
  strikes: number;
  BB: number;
  K: number;
  H: number;
  R: number;
  outs: number;
}
export interface GameState {
  awayTeam: string;
  homeTeam: string;
  awayLineup: Hitter[][];
  homeLineup: Hitter[][];
  awayPitchers: Pitcher[];
  homePitchers: Pitcher[];
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

function getInitialData() {
  return {
    homeTeam: 'HOME',
    awayTeam: 'AWAY',
    awayLineup: fakeHitters(9),
    homeLineup: fakeHitters(9),
    awayPitchers: fakePitchers(1),
    homePitchers: fakePitchers(1),
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
  };
}

export const useStore = create(
  persist<GameState>(() => getInitialData(), {name: 'game'})
);

export const reset = () => useStore.setState(getInitialData());;

function fakeHitters(num: number) {
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

function fakePitchers(num: number) {
  const players: Pitcher[] = [];
  for (let i = 0; i < num; i++) {
    const player: Pitcher = {
      name: faker.person.lastName(),
      balls: 0,
      strikes: 0,
      outs: 0,
      BB: 0,
      K: 0,
      H: 0,
      R: 0,
    };
    players.push(player);
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
    let runs = 0;
    const batter = state.top ? state.awayHitter : state.homeHitter;
    for (const [base, lineupPosition] of [
      [bases, batter],
      ...currentBaseRunners,
    ]) {
      if (base > 3) {
        runs++;
        const runner = hitterAtLineupPosition(newState, lineupPosition);
        runner.R++;
      } else {
        baseRunners[base as Base] = lineupPosition;
      }
    }
    if (runs > 0) {
      currentHitter(newState).RBI += runs;
      currentPitcher(newState).R += runs;
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

export const currentHitter = (state: GameState) => {
  const slot = state.top
    ? state.awayLineup[state.awayHitter]
    : state.homeLineup[state.homeHitter];
  return slot[slot.length - 1];
};

export const currentPitcher = (state: GameState) => {
  const pitchers = state.top ? state.homePitchers : state.awayPitchers;
  return pitchers[pitchers.length - 1];
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

export function hitterAtLineupPosition(state: GameState, position: number) {
  const lineup = state.top ? state.awayLineup : state.homeLineup;
  const slot = lineup[position];
  return slot[slot.length - 1];
}

export const logHitState = (bases: number) =>
  useStore.setState((state) => {
    const newState = {...state};
    const hitter = currentHitter(newState);
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
        hitter.homeRuns++;
    }
    currentPitcher(newState).H++;
    currentPitcher(newState).strikes++;
    return newState;
  });

export const logOutState = () =>
  useStore.setState((state) => {
    const newState = {...state};
    currentHitter(newState).AB++;
    currentPitcher(newState).strikes++;
    return newState;
  });

export const logRunState = (lineupPosition: number) =>
  useStore.setState((state) => {
    const newState = {...state};
    hitterAtLineupPosition(newState, lineupPosition).R++;
    currentPitcher(newState).R++;
    return newState;
  });

export const logStrikeOutState = () =>
  useStore.setState((state) => {
    const newState = {...state};
    currentHitter(newState).K++;
    currentPitcher(newState).K++;
    return newState;
  });

export const logWalkState = () =>
  useStore.setState((state) => {
    const newState = {...state};
    currentHitter(newState).BB++;
    currentPitcher(newState).BB++;
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
  useStore.setState((state) => {
    const newState = {...state};
    currentPitcher(newState).balls++;
    newState.balls++;
    return newState;
  });

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
  useStore.setState((state) => {
    const newState = {...state};
    currentPitcher(newState).outs++;
    newState.outs++;
    return newState;
  });

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
  useStore.setState((state) => {
    const newState = {...state};
    currentPitcher(newState).strikes++;
    newState.strikes++;
    return newState;
  });

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
