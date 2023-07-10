import React from 'react';
import {useStore} from '../store';

interface TeamNameProps {
  field: 'awayTeam' | 'homeTeam';
}
export default function TeamName({field}: TeamNameProps) {
  const setState = React.useCallback(
    (value: string) => {
      useStore.setState((state) => ({...state, [field]: value}));
    },
    [field]
  );
  const [editing, setEditing] = React.useState(false);
  const value = useStore((state) => state[field]);
  const ref = React.useRef<any>();
  React.useEffect(() => {
    document.addEventListener('click', (e) => {
      if (![ref.current, ref.current?.firstChild].includes(e.target)) {
        setEditing(false);
      }
    });
  }, []);
  React.useEffect(() => {
    if (editing) {
      ref.current.firstChild.focus();
    }
  }, [editing]);
  return (
    <td
      onClick={() => setEditing(true)}
      ref={ref}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          setEditing(false);
        }
      }}
      className="name"
    >
      {editing ? (
        <input
          value={value as string}
          onChange={(e) => setState(e.target.value)}
        />
      ) : (
        value
      )}
    </td>
  );
}
