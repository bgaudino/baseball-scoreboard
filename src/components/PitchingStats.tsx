import usePitchingStats from '../hooks/usePitchingStats';

export default function Pitcher() {
  const {IP, H, R, BB, K, ERA, WHIP, pitches, name} = usePitchingStats();
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>IP</th>
          <th>H</th>
          <th>R</th>
          <th>BB</th>
          <th>K</th>
          <th>ERA</th>
          <th>WHIP</th>
          <th>PC</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="name">{name}</td>
          <td>{IP}</td>
          <td>{H}</td>
          <td>{R}</td>
          <td>{BB}</td>
          <td>{K}</td>
          <td>{ERA.toFixed(2)}</td>
          <td>{WHIP.toFixed(2)}</td>
          <td>{pitches}</td>
        </tr>
      </tbody>
    </table>
  );
}
