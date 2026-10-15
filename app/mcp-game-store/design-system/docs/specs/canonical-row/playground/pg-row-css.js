// The canonical row's CSS for each idea, built from three geometries: stack (S), gutter (G), ledger (L).
// One markup for every idea (pg-row-app.jsx): .cr > .cr-lead? .cr-t(.cr-g .cr-n .cr-m) .cr-f(.cr-r .cr-w .cr-x) .cr-go
(() => {
  const GUT = '80px';
  const S = (p) => `
${p} .cr{grid-template-columns:minmax(0,1fr) 20px;grid-template-areas:"t g" "f g"}
${p} .cr.has-lead{grid-template-columns:40px minmax(0,1fr) 20px;grid-template-areas:"l t g" "l f g"}
${p} .cr-lead{grid-area:l}${p} .cr-t{grid-area:t}${p} .cr-go{grid-area:g}
${p} .cr-f{grid-area:f;display:flex;flex-wrap:wrap;align-items:center;min-width:0;margin-left:-20px;clip-path:inset(-4px -4px -4px 20px)}
${p} .cr-f>*::before{content:"·";display:inline-block;width:20px;text-align:center;color:var(--muted);font-weight:400}
${p} .cr-f>.cr-r::before{margin-right:-6px}`;
  const G = (p, gut = GUT) => `
${p} .cr{grid-template-columns:minmax(0,1fr) ${gut} 20px;grid-template-areas:"t w g" "r x g"}
${p} .cr.has-lead{grid-template-columns:40px minmax(0,1fr) ${gut} 20px;grid-template-areas:"l t w g" "l r x g"}
${p} .cr-f{display:contents}${p} .cr-f>*::before{content:none}
${p} .cr-lead{grid-area:l}${p} .cr-t{grid-area:t;align-self:baseline}${p} .cr-go{grid-area:g}
${p} .cr-w{grid-area:w;justify-self:end;align-self:baseline}${p} .cr-r{grid-area:r}${p} .cr-x{grid-area:x;justify-self:end}
${p} .cr:not(:has(.cr-x)) .cr-r{grid-column:r-start / x-end}`;
  const GW = (p, gut = GUT, w = GUT) => `
${p} .cr{grid-template-columns:minmax(0,1fr) minmax(0,15rem) ${w} ${gut} 20px;grid-template-areas:"t r w x g"}
${p} .cr.has-lead{grid-template-columns:40px minmax(0,1fr) minmax(0,15rem) ${w} ${gut} 20px;grid-template-areas:"l t r w x g"}
${p} .cr-t,${p} .cr-w{align-self:center}
${p} .cr:not(:has(.cr-x)) .cr-r{grid-column:r}`;
  const L = (p) => `
${p} .crl{grid-template-columns:[l] auto [t] minmax(0,1fr) [r] fit-content(16rem) [w] max-content [x] max-content [g] 40px}
${p} .crl>li{grid-column:1/-1;display:grid;grid-template-columns:subgrid}
${p} .crl>li.crl-h{display:block}
${p} .cr,${p} .cr.has-lead{grid-column:1/-1;grid-template-columns:subgrid;grid-template-areas:none;column-gap:0}
${p} .cr-f{display:contents}${p} .cr-f>*::before{content:none}
${p} .cr-lead,${p} .cr-t,${p} .cr-r,${p} .cr-w,${p} .cr-x,${p} .cr-go{grid-row:1;align-self:center}
${p} .cr-lead{grid-column:l;margin-right:12px}${p} .cr-t{grid-column:t}${p} .cr-t .cr-m{display:inline}
${p} .cr-r{grid-column:r;padding-left:24px}${p} .cr-w{grid-column:w;padding-left:24px;justify-self:end}
${p} .cr-x{grid-column:x;padding-left:16px;justify-self:start}${p} .cr-go{grid-column:g;justify-self:end}
${p} .cr:not(:has(.cr-x)) .cr-r{grid-column:r}`;
  // Pinned stack (10b): title alone on line one; line two is result left, time right; Replay under the time. Same slots on every row.
  const P = (p) => `
${p} .cr{grid-template-columns:minmax(0,1fr) max-content 20px;grid-template-areas:"t t g" "r w g" ". x g"}
${p} .cr.has-lead{grid-template-columns:40px minmax(0,1fr) max-content 20px;grid-template-areas:"l t t g" "l r w g" "l . x g"}
${p} .cr-f{display:contents}${p} .cr-f>*::before{content:none}
${p} .cr-lead{grid-area:l}${p} .cr-t{grid-area:t}${p} .cr-go{grid-area:g}
${p} .cr-r{grid-area:r;align-self:start}${p} .cr-r>span{text-wrap:balance}
${p} .cr-w{grid-area:w;justify-self:end;align-self:start}${p} .cr-x{grid-area:x;justify-self:end}`;
  // Ledger with the result beside the title (10c): spare width sits between result and time.
  const LN = (p) => L(p) + `
${p} .crl{grid-template-columns:[l] auto [t] auto [r] minmax(8rem,1fr) [w] max-content [x] max-content [g] 40px}`;
  const Q = (min, css) => `@container crl (min-width:${min}px){${css}}`;
  const css = [
    S('.i1'),
    G('.i2'), Q(640, GW('.i2')),
    S('.i3'), Q(560, L('.i3')),
    S('.i4 .crl.is-stack'),
    `.i4 .crl.is-cols .cr{grid-template-columns:minmax(0,1fr) auto 20px;grid-template-areas:"t f g"}
.i4 .crl.is-cols .cr.has-lead{grid-template-columns:40px minmax(0,1fr) auto 20px;grid-template-areas:"l t f g"}
.i4 .crl.is-cols .cr-lead{grid-area:l}.i4 .crl.is-cols .cr-t{grid-area:t}.i4 .crl.is-cols .cr-go{grid-area:g}
.i4 .crl.is-cols .cr-f{grid-area:f;display:flex;gap:16px;align-items:center;justify-content:end;white-space:nowrap}
.i4 .crl.is-cols .cr-x{order:1}.i4 .crl.is-cols .cr-w{order:2;min-width:4.5em;text-align:right}
.i4 .crl:not(.is-cols):not(.is-stack){visibility:hidden}`,
    // Eyebrow: game or number above, the edition's own name or number as the headline.
    G('.i5'),
    `.i5 .cr-t{display:flex;flex-direction:column;gap:2px;align-self:start}
.i5 .cr-sep{display:none}.i5 .cr-t>*{margin-left:0!important}
.i5 .cr-g,.i5 .cr-n:has(+.cr-m){font:600 12px/1.35 var(--font-text);letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.i5 .cr-m,.i5 .cr-n:not(:has(+.cr-m)){font:700 17px/1.25 var(--font-heading);letter-spacing:-.005em;text-wrap:pretty}
.i5 .cr-w{align-self:start;font-size:13px;line-height:1.35}`,
    Q(640, `.i5 .cr{grid-template-columns:minmax(0,1fr) minmax(0,15rem) 80px 88px 20px;grid-template-areas:"t r x w g"}
.i5 .cr.has-lead{grid-template-columns:40px minmax(0,1fr) minmax(0,15rem) 80px 88px 20px;grid-template-areas:"l t r x w g"}
.i5 .cr-w{align-self:center;font-size:14px}
.i5 .cr-t{align-self:center}`),
    // Timeline: when leads.
    `.i6 .cr{grid-template-columns:4.5em minmax(0,1fr) max-content 20px;grid-template-areas:"w t t g" "w r x g"}
.i6 .cr.has-lead{grid-template-columns:4.5em 40px minmax(0,1fr) max-content 20px;grid-template-areas:"w l t t g" "w l r x g"}
.i6 .cr-lead{grid-area:l}.i6 .cr-t{grid-area:t}.i6 .cr-go{grid-area:g}
.i6 .cr-f{display:contents}
.i6 .cr-w{grid-area:w;align-self:start;color:var(--text);font-weight:600;padding-top:1px}
.i6 .cr-r{grid-area:r}.i6 .cr-x{grid-area:x;justify-self:end}.i6 .cr:not(:has(.cr-x)) .cr-r{grid-column:r-start / x-end}`,
    Q(640, `.i6 .cr{grid-template-columns:6em minmax(0,1fr) minmax(0,15rem) 80px 20px;grid-template-areas:"w t r x g"}
.i6 .cr.has-lead{grid-template-columns:6em 40px minmax(0,1fr) minmax(0,15rem) 80px 20px;grid-template-areas:"w l t r x g"}
.i6 .cr-r{grid-area:r}.i6 .cr-x{grid-area:x;justify-self:start}.i6 .cr-w{align-self:center;padding-top:0}.i6 .cr:not(:has(.cr-x)) .cr-r{grid-column:r}`),
    // Uniform: gutter geometry, one fixed row height, title clamped to two lines.
    G('.i7'), Q(640, GW('.i7')),
    `.i7 .cr,.i7 .cr.has-lead{height:88px;align-content:center}
.i7 .cr-m{display:inline}.i7 .cr-t{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}`,
    Q(640, `.i7 .cr,.i7 .cr.has-lead{height:64px}`),
    // Nested: gutter geometry; replays as sub-rows on a rail.
    G('.i8'), Q(640, GW('.i8', GUT, '112px')),
    `.i8 .cr.is-sub,.i8 .cr.is-sub.has-lead{min-height:44px;padding-top:6px;padding-bottom:6px;padding-left:var(--ind,32px);position:relative;grid-template-columns:auto minmax(0,1fr) auto 20px;grid-template-areas:"x r w g"}
.i8 .has-leads .cr.is-sub{--ind:68px}
.i8 .cr.is-sub::before{content:"";position:absolute;left:calc(var(--ind,32px) - 12px);top:0;bottom:0;width:2px;background:var(--line)}
.i8 .cr.is-sub .cr-x{justify-self:start;color:var(--muted)}.i8 .cr.is-sub .cr-w{align-self:center}
.i8 .crl>li.is-sub-li{border-top:0}`,
    Q(640, `.i8 .cr.is-sub,.i8 .cr.is-sub.has-lead{padding-left:16px;grid-template-columns:minmax(0,1fr) minmax(0,15rem) 112px 80px 20px;grid-template-areas:"x r w x2 g"}
.i8 .has-leads .cr.is-sub{grid-template-columns:40px minmax(0,1fr) minmax(0,15rem) 112px 80px 20px;grid-template-areas:"l x r w x2 g"}
.i8 .crl:not(.has-leads) .cr.is-sub .cr-x{padding-left:16px}
.i8 .crl:not(.has-leads) .cr.is-sub::before{left:20px}
.i8 .has-leads .cr.is-sub::before{left:56px}`),
    // Outcome first.
    `.i9 .crl:not(.no-outcome) .cr{grid-template-columns:minmax(0,1fr) 80px 20px;grid-template-areas:"r x g" "t w g"}
.i9 .crl:not(.no-outcome) .cr.has-lead{grid-template-columns:40px minmax(0,1fr) 80px 20px;grid-template-areas:"l r x g" "l t w g"}
.i9 .crl:not(.no-outcome) .cr-f{display:contents}
.i9 .crl:not(.no-outcome) .cr-lead{grid-area:l}.i9 .crl:not(.no-outcome) .cr-go{grid-area:g}
.i9 .crl:not(.no-outcome) .cr-r{grid-area:r;font:600 16px/1.35 var(--font-text);color:var(--text);align-self:baseline}
.i9 .crl:not(.no-outcome) .cr-t{grid-area:t;font:400 14px/1.45 var(--font-text);color:var(--muted)}
.i9 .crl:not(.no-outcome) .cr-w{grid-area:w;justify-self:end;align-self:baseline}
.i9 .crl:not(.no-outcome) .cr-x{grid-area:x;justify-self:end;align-self:baseline}
.i9 .crl:not(.no-outcome) .cr:not(:has(.cr-x)) .cr-r{grid-column:r-start / x-end}
.i9 .crl:not(.no-outcome) .cr-t,.i9 .crl:not(.no-outcome) .cr-w{align-self:baseline}`,
    G('.i9 .crl.no-outcome'),
    Q(640, `.i9 .crl:not(.no-outcome) .cr{grid-template-columns:minmax(0,16rem) minmax(0,1fr) 80px 88px 20px;grid-template-areas:"r t x w g"}
.i9 .crl:not(.no-outcome) .cr.has-lead{grid-template-columns:40px minmax(0,16rem) minmax(0,1fr) 80px 88px 20px;grid-template-areas:"l r t x w g"}
.i9 .crl:not(.no-outcome) .cr-r,.i9 .crl:not(.no-outcome) .cr-w,.i9 .crl:not(.no-outcome) .cr-t,.i9 .crl:not(.no-outcome) .cr-x{align-self:center}.i9 .crl:not(.no-outcome) .cr:not(:has(.cr-x)) .cr-r{grid-column:r}
${GW('.i9 .crl.no-outcome')}`),
    S('.i10'), Q(420, G('.i10')), Q(720, L('.i10')),
    P('.i10b'), Q(420, G('.i10b')), Q(720, L('.i10b')),
    P('.i10c'), Q(420, G('.i10c')), Q(720, LN('.i10c')),
  ].join('\n');
  const el = document.createElement('style'); el.id = 'cr-ideas'; el.textContent = css; document.head.appendChild(el);
})();
