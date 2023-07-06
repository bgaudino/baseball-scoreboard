import { useStore } from '../store'

export function sum(nums: number[]) {
  return nums.reduce((prev, curr) => prev + curr, 0);
}
export default function useScore() {
  const {awayRuns, homeRuns} = useStore(({awayRuns, homeRuns}) => ({awayRuns, homeRuns}));
  return {
    awayTotalRuns: sum(awayRuns),
    homeTotalRuns: sum(homeRuns),
  }
}
