// After Pixels — playground "Achievement status line" (PROTOTYPE AID, drop before merge: delete this file and its CSS, its
// import and init call in main.jsx). Compares three looks for .lb-ach-st on a Library game page; the value lands as
// data-pg-ach on <html>, which playground-ach-status.css reads.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { pgRegister, pgActive, usePgSetting } from './playground.jsx';

const PgAchApply = () => {
  const v = usePgSetting('ach');
  React.useEffect(() => { document.documentElement.dataset.pgAch = v; }, [v]);
  return null;
};

export function initPlaygroundAchStatus() {
  pgRegister('ach-status', { title: 'Achievement status line', settings: [
    { key: 'ach', kind: 'concept', label: 'Status line', options: [
      { value: 'a', label: 'a Earned in green', state: 'library-common' },
      { value: 'b', label: 'b Quieter grey', state: 'library-common' },
      { value: 'c', label: 'c Small caps label', state: 'library-common' },
    ] },
  ] });
  if (!pgActive()) return;
  const host = document.createElement('div'); document.body.appendChild(host);
  createRoot(host).render(<PgAchApply />);
}
