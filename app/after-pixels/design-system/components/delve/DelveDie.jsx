import React from 'react';
// A Delve turn as a die: a hexagon holding the roll's number, filled by its grade, or a quiet sparkle for a turn that used something and rolled nothing.
const HEX = '18,0 36,10 36,30 18,40 0,30 0,10';
const RIM = '18,-3.5 39,8 39,32 18,43.5 -3,32 -3,8';
// Four-point sparkle, 14 die units tall in the die's 46-unit box.
const SPARKLE = 'M18 13 Q19 19 25 20 Q19 21 18 27 Q17 21 11 20 Q17 19 18 13Z';
// KEEP: the foe's red hex sits one step out from whatever is behind the die (nothing, the advantage hex, or a natural 20's rim), so no two lines run together.
const foeAt = (crit, adv) => (crit ? (adv ? [-10, -9.5] : [-5, -4.5]) : adv ? [-7, -6] : [-3.5, -3]);
export function DelveDie({ kind = 'miss', value, other, crit = false, fumble = false, foe = false, selected = false, surface = 'card', size = 36, className = '' }) {
  const big = size >= 64;
  // KEEP: selected, a two-dice die stands alone and the foe's hex is cleared, so nothing crosses the selection ring; from 64px the foe's hex is cleared too and the second die sits at the die's corner.
  const adv = other != null && !big && !selected;
  const layer = foe && !big && !selected ? foeAt(crit, adv) : null;
  const cls = ['mcp-dl-die', 'is-' + kind, crit && 'is-crit', fumble && 'is-fumble', selected && 'is-sel', surface === 'popup' && 'is-popup', className].filter(Boolean).join(' ');
  return (
    <svg className={cls} viewBox="-5 -5 46 50" width={size} height={Math.round(size * 50 / 46)} aria-hidden="true">
      {layer && <polygon className="fo" points={HEX} transform={'translate(' + layer[0] + ' ' + layer[1] + ')'} />}
      {adv && <polygon className="gh" points={HEX} transform={crit ? 'translate(-7 -6.5)' : 'translate(-3.5 -3)'} />}
      <polygon className="hx" points={HEX} />
      {crit && <polygon className="rim" points={RIM} />}
      {kind === 'use' ? <path className="gl" d={SPARKLE} /> : <text className="nm" x="18" y="20.5">{value}</text>}
      {other != null && big && <g className="tw" transform="translate(25 28) scale(.42)"><polygon points={HEX} /><text x="18" y="21">{other}</text></g>}
      <polygon className="sl" points={RIM} />
    </svg>
  );
}
// A turn where the hero used an ability, the ultimate or gear and made no roll: one sparkle for every kind of use.
export function DelveUseDie({ foe = false, selected = false, surface = 'card', size = 36, className = '' }) {
  return <DelveDie kind="use" foe={foe} selected={selected} surface={surface} size={size} className={className} />;
}
