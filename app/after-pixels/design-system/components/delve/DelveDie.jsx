import React from 'react';
// A Delve turn as a die: a hexagon holding the roll's number, filled by its grade, or a quiet sparkle for a turn that used something and rolled nothing.
const HEX = '18,0 36,10 36,30 18,40 0,30 0,10';
const RIM = '18,-3.5 39,8 39,32 18,43.5 -3,32 -3,8';
// Four-point sparkle, 14 die units tall in the die's 46-unit box.
const SPARKLE = 'M18 13 Q19 19 25 20 Q19 21 18 27 Q17 21 11 20 Q17 19 18 13Z';
// Biggest hit is a hit with a dark ring drawn just inside the die's edge, as wide as the dark gap between a natural 20's rim and the die, so the two dark gaps match at every size; the ring is computed from the die's drawn width.
const HP = HEX.split(' ').map((p) => p.split(',').map(Number));
const CEN = [18, 20];
// The stroke widths of `.rim` and `.hx` at a 44px die, which the ring's geometry is measured from; a rimmed or ringed die scales them with its size (never under 1px for the rim) so a natural 20 keeps the 44px die's proportions, a thin outer edge and a thicker band within, at every size.
const REF = 44;
const RIM_W = 1.75;
const RING_W = 1.5;
const rimPx = (size) => Math.max(1, RIM_W * size / REF);
const sideNormals = (d) => HP.map((a, i) => { const b = HP[(i + 1) % 6]; const dx = b[0] - a[0]; const dy = b[1] - a[1]; const n = Math.hypot(dx, dy); let nx = dy / n; let ny = -dx / n;
  if (nx * (a[0] - CEN[0]) + ny * (a[1] - CEN[1]) < 0) { nx = -nx; ny = -ny; } return [nx, ny, nx * a[0] + ny * a[1] + d]; });
// The hexagon with every side moved d units along its normal (out is positive); its sides stay parallel to the die's.
const offHex = (d) => { const L = sideNormals(d); return HP.map((_, i) => { const p = L[(i + 5) % 6]; const q = L[i]; const det = p[0] * q[1] - p[1] * q[0]; return [(p[2] * q[1] - p[1] * q[2]) / det, (p[0] * q[2] - p[2] * q[0]) / det]; }); };
// Mean distance, in die units, from each side of the die to the same side of polygon P.
const sideDist = (P) => { const L = sideNormals(0); const m = HP.map((_, i) => [P[i], P[(i + 1) % 6]].map((q) => q[0] * L[i][0] + q[1] * L[i][1]).reduce((x, y) => x + y) / 2 - L[i][2]); return (Math.min(...m) + Math.max(...m)) / 2; };
const RIM_PTS = RIM.split(' ').map((p) => p.split(',').map(Number));
const biggestRing = (size) => { const k = size / 46; const gap = sideDist(RIM_PTS) * k - rimPx(size) / 2; const band = -sideDist(HP.map(([x, y]) => [CEN[0] + (x - CEN[0]) * 0.8, CEN[1] + (y - CEN[1]) * 0.8])) * k - RING_W * size / REF / 2;
  return { points: offHex(-(band + gap / 2) / k).map((p) => p[0].toFixed(3) + ',' + p[1].toFixed(3)).join(' '), width: gap }; };
// a biggest hit that is not a natural 20 is grown about the die's centre until its edge sits where a natural 20's rim sits, so the two biggest-hit dice take the same space (the user, 2026-11-25: "both should be of equal size"); its number is not grown.
const GROW = 1.167;
// the held roll's grey advantage hex is the die's own outline moved a fixed 2.5px up and left, whatever the die's size or shape (a natural 20's rim, a grown biggest hit, a plain hexagon), so it sits evenly behind the die; nothing else is drawn behind a die.
const BEHIND_PX = 2.5;
const grownHex = () => HP.map(([x, y]) => (CEN[0] + (x - CEN[0]) * GROW).toFixed(3) + ',' + (CEN[1] + (y - CEN[1]) * GROW).toFixed(3)).join(' ');
// `even`: a key moment is one drawn size whether or not it is special, so a plain key die's hexagon is grown (as a biggest hit's is) to the footprint a natural 20's rim takes, in the same picture box, so a selection ring or a neighbour sits as close to it as to a natural 20; its number is not grown. `num`: the number's size in px, whatever the die's size or shape, so a surface holds every die's number at one size (default: it scales with the die). `mini`: a pip, with no number, for the map; `size` is then the hexagon's own width.
export function DelveDie({ kind = 'miss', value, other, crit = false, fumble = false, biggest = false, won = false, behind = false, selected = false, surface = 'card', size: asked = 36, even = false, mini = false, num, className = '' }) {
  const size = mini ? asked * 46 / 36 : asked;
  const big = size >= 64;
  const ringed = biggest && kind === 'strong';
  const grown = even && !crit && !mini;
  const ring = ringed ? biggestRing(crit ? size : size * GROW) : null;
  // selected, a two-dice die stands alone with nothing behind it, so nothing crosses the selection ring; from 64px the second die sits at the die's corner instead.
  const adv = other != null && behind && !big && !selected;
  const away = -BEHIND_PX * 46 / size;
  const cls = ['mcp-dl-die', 'is-' + kind, crit && 'is-crit', ringed && 'is-biggest', fumble && 'is-fumble', won && kind === 'use' && 'is-won', selected && 'is-sel', mini && 'is-mini', surface === 'popup' && 'is-popup', className].filter(Boolean).join(' ');
  return (
    <svg className={cls} viewBox="-5 -5 46 50" width={size} height={Math.round(size * 50 / 46)} aria-hidden="true">
      {adv && <polygon className="gh" points={crit ? RIM : grown ? grownHex() : HEX} transform={'translate(' + away.toFixed(3) + ' ' + away.toFixed(3) + ')'} />}
      {grown
        ? <g transform={'translate(18 20) scale(' + GROW + ') translate(-18 -20)'}><polygon className="hx" points={HEX} />{ringed && <polygon className="cut" points={ring.points} style={{ strokeWidth: ring.width + 'px' }} />}</g>
        : ringed && !crit
        ? <g transform={'translate(18 20) scale(' + GROW + ') translate(-18 -20)'}><polygon className="hx" points={HEX} /><polygon className="cut" points={ring.points} style={{ strokeWidth: ring.width + 'px' }} /></g>
        : <polygon className="hx" points={HEX} />}
      {crit && <polygon className="rim" points={RIM} style={{ strokeWidth: rimPx(size) + 'px' }} />}
      {ringed && crit && <polygon className="cut" points={ring.points} style={{ strokeWidth: ring.width + 'px' }} />}
      {mini ? null : kind === 'use' ? <path className="gl" d={SPARKLE} /> : <text className="nm" x="18" y="20.5" style={num ? { fontSize: (num * 46 / size).toFixed(3) + 'px' } : undefined}>{value}</text>}
      {other != null && big && <g className="tw" transform="translate(25 28) scale(.42)"><polygon points={HEX} /><text x="18" y="21">{other}</text></g>}
      <polygon className="sl" points={RIM} />
    </svg>
  );
}
// A turn where the hero used an ability, the ultimate or gear and made no roll: one sparkle for every kind of use. `won` fills it green, for the use that ends a won run.
export function DelveUseDie({ won = false, behind = false, selected = false, surface = 'card', size = 36, className = '' }) {
  return <DelveDie kind="use" won={won} selected={selected} surface={surface} size={size} className={className} />;
}
