import React from 'react';
// A Delve turn as a die: a hexagon holding the roll's number, filled by its grade, or a quiet sparkle for a turn that used something and rolled nothing.
const HEX = '18,0 36,10 36,30 18,40 0,30 0,10';
const RIM = '18,-3.5 39,8 39,32 18,43.5 -3,32 -3,8';
// Four-point sparkle, 14 die units tall in the die's 46-unit box.
const SPARKLE = 'M18 13 Q19 19 25 20 Q19 21 18 27 Q17 21 11 20 Q17 19 18 13Z';
// Biggest hit is a hit with a dark ring drawn just inside the die's edge, as wide as the dark gap between a natural 20's rim and the die, so the two dark gaps match at every size; the ring is computed from the die's drawn width.
const HP = HEX.split(' ').map((p) => p.split(',').map(Number));
const CEN = [18, 20];
// The stroke widths of `.rim` and `.hx` in components.css, which the ring's geometry is measured from; change them together.
const RIM_W = 1.75;
const RING_W = 1.5;
const sideNormals = (d) => HP.map((a, i) => { const b = HP[(i + 1) % 6]; const dx = b[0] - a[0]; const dy = b[1] - a[1]; const n = Math.hypot(dx, dy); let nx = dy / n; let ny = -dx / n;
  if (nx * (a[0] - CEN[0]) + ny * (a[1] - CEN[1]) < 0) { nx = -nx; ny = -ny; } return [nx, ny, nx * a[0] + ny * a[1] + d]; });
// The hexagon with every side moved d units along its normal (out is positive); its sides stay parallel to the die's.
const offHex = (d) => { const L = sideNormals(d); return HP.map((_, i) => { const p = L[(i + 5) % 6]; const q = L[i]; const det = p[0] * q[1] - p[1] * q[0]; return [(p[2] * q[1] - p[1] * q[2]) / det, (p[0] * q[2] - p[2] * q[0]) / det]; }); };
// Mean distance, in die units, from each side of the die to the same side of polygon P.
const sideDist = (P) => { const L = sideNormals(0); const m = HP.map((_, i) => [P[i], P[(i + 1) % 6]].map((q) => q[0] * L[i][0] + q[1] * L[i][1]).reduce((x, y) => x + y) / 2 - L[i][2]); return (Math.min(...m) + Math.max(...m)) / 2; };
const RIM_PTS = RIM.split(' ').map((p) => p.split(',').map(Number));
const biggestRing = (size) => { const k = size / 46; const gap = sideDist(RIM_PTS) * k - RIM_W / 2; const band = -sideDist(HP.map(([x, y]) => [CEN[0] + (x - CEN[0]) * 0.8, CEN[1] + (y - CEN[1]) * 0.8])) * k - RING_W / 2;
  return { points: offHex(-(band + gap / 2) / k).map((p) => p[0].toFixed(3) + ',' + p[1].toFixed(3)).join(' '), width: gap }; };
// a biggest hit that is not a natural 20 is grown about the die's centre until its edge sits where a natural 20's rim sits, so the two biggest-hit dice take the same space (the user, 2026-11-25: "both should be of equal size"); its number is not grown.
const GROW = 1.167;
// the held roll's grey advantage hex is the die's own outline moved a fixed 2.5px up and left, whatever the die's size or shape (a natural 20's rim, a grown biggest hit, a plain hexagon), so it sits evenly behind the die; nothing else is drawn behind a die.
const BEHIND_PX = 2.5;
const grownHex = () => HP.map(([x, y]) => (CEN[0] + (x - CEN[0]) * GROW).toFixed(3) + ',' + (CEN[1] + (y - CEN[1]) * GROW).toFixed(3)).join(' ');
export function DelveDie({ kind = 'miss', value, other, crit = false, fumble = false, biggest = false, won = false, behind = false, selected = false, surface = 'card', size = 36, className = '' }) {
  const big = size >= 64;
  const ringed = biggest && kind === 'strong';
  const ring = ringed ? biggestRing(crit ? size : size * GROW) : null;
  // selected, a two-dice die stands alone with nothing behind it, so nothing crosses the selection ring; from 64px the second die sits at the die's corner instead.
  const adv = other != null && behind && !big && !selected;
  const away = -BEHIND_PX * 46 / size;
  const cls = ['mcp-dl-die', 'is-' + kind, crit && 'is-crit', ringed && 'is-biggest', fumble && 'is-fumble', won && kind === 'use' && 'is-won', selected && 'is-sel', surface === 'popup' && 'is-popup', className].filter(Boolean).join(' ');
  return (
    <svg className={cls} viewBox="-5 -5 46 50" width={size} height={Math.round(size * 50 / 46)} aria-hidden="true">
      {adv && <polygon className="gh" points={crit ? RIM : ringed ? grownHex() : HEX} transform={'translate(' + away.toFixed(3) + ' ' + away.toFixed(3) + ')'} />}
      {ringed && !crit
        ? <g transform={'translate(18 20) scale(' + GROW + ') translate(-18 -20)'}><polygon className="hx" points={HEX} /><polygon className="cut" points={ring.points} style={{ strokeWidth: ring.width + 'px' }} /></g>
        : <polygon className="hx" points={HEX} />}
      {crit && <polygon className="rim" points={RIM} />}
      {ringed && crit && <polygon className="cut" points={ring.points} style={{ strokeWidth: ring.width + 'px' }} />}
      {kind === 'use' ? <path className="gl" d={SPARKLE} /> : <text className="nm" x="18" y="20.5">{value}</text>}
      {other != null && big && <g className="tw" transform="translate(25 28) scale(.42)"><polygon points={HEX} /><text x="18" y="21">{other}</text></g>}
      <polygon className="sl" points={RIM} />
    </svg>
  );
}
// A turn where the hero used an ability, the ultimate or gear and made no roll: one sparkle for every kind of use. `won` fills it green, for the use that ends a won run.
export function DelveUseDie({ won = false, behind = false, selected = false, surface = 'card', size = 36, className = '' }) {
  return <DelveDie kind="use" won={won} selected={selected} surface={surface} size={size} className={className} />;
}
