import useHittingStats from '../hooks/useHittingStats';

function formatRatioStat(num: number) {
  const result = num.toFixed(3).toString();
  if (result.startsWith('0')) {
    return result.slice(1);
  }
  return result;
}

interface HittingStatsProps {
  name: string;
  index: number;
  atBat: number;
}
export default function HittingStats({name, index, atBat}: HittingStatsProps) {
  const {AB, H, R, RBI, BB, K, AVG, OPS} = useHittingStats(index);
  return (
    <tr key={index} className={index === atBat ? 'at-bat' : ''}>
      <td>{name}</td>
      <td>{AB}</td>
      <td>{H}</td>
      <td>{R}</td>
      <td>{RBI}</td>
      <td>{BB}</td>
      <td>{K}</td>
      <td>{formatRatioStat(AVG)}</td>
      <td>{formatRatioStat(OPS)}</td>
    </tr>
  );
}
