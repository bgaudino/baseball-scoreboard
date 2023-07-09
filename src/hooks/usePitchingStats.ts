import {currentPitcher, useStore} from '../store';

export default function usePitchingStats() {
  const state = useStore((state) => state);
  const pitcher = currentPitcher(state);
  const {outs, balls, strikes} = pitcher;
  const innings = Math.floor(outs / 3);
  const extraOuts = outs % 3;
  const IP = `${innings}.${extraOuts}`;
  const pitches = balls + strikes;
  return {
    ...pitcher,
    IP,
    pitches,
  };
}
