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
    function listener(e: MouseEvent) {
      const target = e.target;
      const cell = ref.current;
      if (
        target instanceof HTMLInputElement ||
        (target instanceof HTMLElement &&
          (target === cell || Array.from(cell.children).includes(target)))
      ) {
        return;
      }
      setEditing(false);
    }
    document.addEventListener('click', listener);
    return () => document.removeEventListener('click', listener);
  }, []);

  return (
    <td
      ref={ref}
      className="name"
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
      }}
    >
      {editing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEditing(false);
          }}
        >
          <input
            autoFocus
            value={value as string}
            onChange={(e) => setState(e.target.value)}
          />
        </form>
      ) : (
        <span>{value}</span>
      )}
      <i
        aria-label={editing ? 'Edit' : 'Done'}
        className={editing ? 'fa-solid fa-check' : 'fa-solid fa-pen-to-square'}
        onClick={() => setEditing((prev) => !prev)}
      />
    </td>
  );
}
