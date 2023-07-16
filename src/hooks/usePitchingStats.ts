import {Pitcher} from '../store';

export default function usePitchingStats(pitcher: Pitcher) {
  const {outs, balls, strikes, BB, H, R} = pitcher;
  const innings = Math.floor(outs / 3);
  const extraOuts = outs % 3;
  const IP = `${innings}.${extraOuts}`;
  const pitches = balls + strikes;
  const ERA = outs > 0 ? (R / (outs / 3)) * 9 : 0;
  const WHIP = outs > 0 ? (BB + H) / (outs / 3) : 0;
  return {
    ...pitcher,
    IP,
    ERA,
    WHIP,
    pitches,
  };
}
