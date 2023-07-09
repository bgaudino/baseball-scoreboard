import {useStore} from '../store';

export default function useHittingStats(lineupPosition: number, top: boolean) {
  const lineup = useStore((state) =>
    top ? state.awayLineup : state.homeLineup
  );
  const slot = lineup[lineupPosition];
  const hitter = slot[slot.length - 1];
  const {AB, singles, doubles, triples, homeRuns, BB}  = hitter;
  const H = singles + doubles + triples + homeRuns;
  const AVG = AB > 0 ? H / AB : 0;
  const PA = AB + BB;
  const TB = singles + doubles * 2 + triples * 3 + homeRuns * 4;
  const SLG = AB > 0 ? TB / AB : 0;
  const OBP = PA > 0 ? (H + BB) / PA : 0;
  const OPS = SLG + OBP;
  return {
    ...hitter,
    H,
    AVG,
    SLG,
    OBP,
    OPS,
  };
}
