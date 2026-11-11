import React from 'react';
// The foe's d20 in a Delve held roll: a diamond, so it never reads as a second hero roll.
// KEEP: when the foe rolled two d20s (advantage), the other roll is an empty diamond tucked up and left behind the first, with no number, so the pair never reads as two rolls.
// KEEP: the number is 15px so it does not clip the diamond's points.
export function DelveFoeDie({ value, other, hit = false, surface = 'card', size = 34, className = '' }) {
  const cls = ['mcp-dl-foe', other != null && 'has-other', hit && 'is-hit', surface === 'popup' && 'is-popup', className].filter(Boolean).join(' ');
  return (
    <svg className={cls} viewBox="-2 -2 40 44" width={size} height={Math.round(size * 44 / 40)} aria-hidden="true">
      {other != null && <polygon className="gf" points="18,0 36,20 18,40 0,20" transform="translate(-3.5 -4.5)" />}
      <polygon className="fx" points="18,0 36,20 18,40 0,20" />
      <text className="nm" x="18" y="20.5">{value}</text>
    </svg>
  );
}
