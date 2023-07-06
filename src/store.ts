import {create} from 'zustand';
import {sum} from './hooks/useScore';

export type Base = 1 | 2 | 3;
export type BaseRunners = {1?: boolean; 2?: boolean; 3?: boolean};
export interface GameState {
  awayTeam: string;
  homeTeam: string;
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
  awayRuns: [0],
  homeRuns: [],
  awayHits: 0,
  homeHits: 0,
  inning: 1,
  top: true,
  outs: 0,
  balls: 0,
  strikes: 0,
  baseRunners: {
    1: false,
    2: false,
    3: false,
  },
  gameOver: false,
}));

function advance(base: Base, bases: BaseRunners) {
  if (base > 0) {
    bases[base] = false;
  }
  const next = (base + 1) as Base;
  if (next >= 4) {
    recordRun();
  } else {
    if (bases[next]) {
      bases = advance(next, bases);
    }
    bases[next] = true;
  }
  return bases;
}
export const advanceRunners = (bases: number) =>
  useStore.setState((state) => {
    const currentBaseRunners = Object.entries(state.baseRunners)
      .filter(([, taken]) => taken)
      .map(([base]) => Number(base) + bases);
    const baseRunners: BaseRunners = {};
    let runs = 0;
    for (const base of [bases, ...currentBaseRunners]) {
      if (base > 3) {
        runs++;
      } else {
        baseRunners[base as Base] = true;
      }
    }
    const newState = {...state, baseRunners};
    if (runs > 0) {
      if (state.top) {
        newState.awayRuns[state.inning - 1] += runs;
      } else {
        newState.homeRuns[state.inning - 1] += runs;
      }
    }
    return newState;
  });
export const advanceRunnersIfForced = (bases: number) =>
  useStore.setState((state) => {
    const newState = {...state};
    for (let i = 0; i < bases; i++) {
      newState.baseRunners = advance(i as Base, newState.baseRunners);
    }
    return newState;
  });
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
export const resetCount = () =>
  useStore.setState((state) => ({...state, balls: 0, strikes: 0}));
