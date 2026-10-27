// ============================================================================
// Session pages 2, Daily Word: the colour config. One set of colours, applied live as CSS variables on <html>, to the cover
// (GS_ART.word reads them, model.jsx) and to every option's tiles (word.css). Kept in localStorage, so it survives switching
// option and state. Rendered in the rail under the options (harness/rail.jsx reads the game's `config`).
// The owner's rules (2026-10-27): no white or cream ground; white never means success; success is a forest green, not the logo's.
// ============================================================================
(function () {
  const KEY = 'pg_session-pages-2_word-colours_v1';
  const PAGE = '#1B1917';

  // Named swatches: the store palette, the Daily Word cover, then mid-light grounds lighter than the indigo and clearly not cream.
  const SWATCHES = [
    ['Store', [['Page', '#1B1917'], ['Card', '#262320'], ['Popup', '#322E2A'], ['Line', '#37332E'], ['Control edge', '#918B80'], ['Muted', '#ABA79E'], ['Text', '#F0EEE8'], ['Off-white', '#EDE8DF'], ['Success (logo green)', '#4CC38A'], ['Warning', '#FFD23A'], ['Error', '#FF6B5E']]],
    ['Covers', [['Indigo', '#1D1B3A'], ['Wine', '#421A28'], ['Forest', '#163328'], ['Amber', '#E5A63B'], ['Orange', '#D66847'], ['Teal', '#328A88'], ['Lilac', '#A390B2'], ['Cream', '#F2EBE0']]],
    ['Greens', [['Pine (forest lifted)', '#2B6448'], ['Fern', '#3E7656'], ['Moss', '#6E8B6A'], ['Eucalyptus', '#7FA396'], ['Sage', '#8FA89A'], ['Olive', '#8A8A5C']]],
    ['Mids', [['Stone', '#9C978C'], ['Warm stone', '#A8998A'], ['Clay', '#B08A74'], ['Slate', '#6F7C8A'], ['Dusk blue', '#7F8FA6'], ['Heather', '#8E849E']]],
  ];
  const NAME = {}; SWATCHES.forEach(([, l]) => l.forEach(([n, h]) => { NAME[h] = n; }));

  // Starting palettes. miss: 'fill' | 'outline' | 'cover' (an outline that fills on hover, as the cover's block does).
  const PALETTES = [
    { id: 'sage', name: 'Sage, pine', ground: '#8FA89A', hit: '#2B6448', hitOn: '#F2EBE0', near: '#E5A63B', nearOn: '#1B1917', miss: '#37332E', missOn: '#ABA79E', missStyle: 'fill' },
    { id: 'stone', name: 'Stone, forest', ground: '#9C978C', hit: '#163328', hitOn: '#F2EBE0', near: '#E5A63B', nearOn: '#1B1917', miss: '#37332E', missOn: '#ABA79E', missStyle: 'fill' },
    { id: 'dusk', name: 'Dusk, pine', ground: '#7F8FA6', hit: '#2B6448', hitOn: '#F2EBE0', near: '#E5A63B', nearOn: '#1B1917', miss: '#37332E', missOn: '#ABA79E', missStyle: 'fill' },
    { id: 'moss', name: 'Moss, forest', ground: '#6E8B6A', hit: '#163328', hitOn: '#F2EBE0', near: '#E5A63B', nearOn: '#1B1917', miss: '#918B80', missOn: '#ABA79E', missStyle: 'outline' },
    { id: 'clay', name: 'Clay, forest', ground: '#B08A74', hit: '#163328', hitOn: '#F2EBE0', near: '#E5A63B', nearOn: '#1B1917', miss: '#37332E', missOn: '#ABA79E', missStyle: 'cover' },
  ];
  const DEFAULT = PALETTES[0];
  const FIELDS = ['ground', 'hit', 'hitOn', 'near', 'nearOn', 'miss', 'missOn'];
  const STYLES = ['fill', 'outline', 'cover'];

  const isHex = (v) => /^#[0-9a-fA-F]{6}$/.test(v);
  const lum = (h) => {
    const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

  const clean = (raw) => {
    const s = Object.assign({}, DEFAULT, { id: null });
    if (!raw) return Object.assign(s, { id: DEFAULT.id });
    FIELDS.forEach((f) => { if (isHex(raw[f])) s[f] = raw[f].toUpperCase(); });
    if (STYLES.includes(raw.missStyle)) s.missStyle = raw.missStyle;
    s.id = raw.id || null;
    return s;
  };
  let cur = (() => { try { return clean(JSON.parse(localStorage.getItem(KEY))); } catch (e) { return clean(null); } })();
  let subs = [];

  // Text on the ground (option 3's hint and labels): whichever of the page's dark or its text reads better.
  const apply = () => {
    const r = document.documentElement.style;
    r.setProperty('--wd-ground', cur.ground); r.setProperty('--wd-hit', cur.hit); r.setProperty('--wd-hit-on', cur.hitOn);
    r.setProperty('--wd-near', cur.near); r.setProperty('--wd-near-on', cur.nearOn); r.setProperty('--wd-miss', cur.miss); r.setProperty('--wd-miss-on', cur.missOn);
    r.setProperty('--wd-ground-on', ratio(cur.ground, PAGE) >= ratio(cur.ground, '#F0EEE8') ? PAGE : '#F0EEE8');
    document.documentElement.setAttribute('data-wd-miss', cur.missStyle);
  };
  const set = (patch) => {
    cur = Object.assign({}, cur, patch);
    try { localStorage.setItem(KEY, JSON.stringify(cur)); } catch (e) {}
    apply(); subs.forEach((f) => f());
  };
  apply();
  const useColours = () => React.useSyncExternalStore((f) => { subs.push(f); return () => { subs = subs.filter((x) => x !== f); }; }, () => cur);

  // ---- The config ----
  const Ratio = ({ fg, bg, label }) => <span className="wdc-ratio" title={'Contrast against ' + label}>{label} {ratio(fg, bg).toFixed(1)}</span>;

  const ColourField = ({ field, label, against }) => {
    const c = useColours();
    const v = c[field];
    const [draft, setDraft] = React.useState(v);
    React.useEffect(() => setDraft(v), [v]);
    const id = 'wdc-' + field;
    return (
      <div className="wdc-field">
        <label className="wdc-label" htmlFor={id}>{label}</label>
        <div className="wdc-line">
          <span className="wdc-chip" style={{ background: v }} aria-hidden="true" />
          <select id={id} className="wdc-select" value={NAME[v] ? v : ''} onChange={(e) => e.target.value && set({ [field]: e.target.value, id: null })}>
            {!NAME[v] && <option value="">Custom</option>}
            {SWATCHES.map(([g, list]) => <optgroup key={g} label={g}>{list.map(([n, h]) => <option key={h} value={h}>{n} {h}</option>)}</optgroup>)}
          </select>
          <input className="wdc-hex" aria-label={label + ' hex'} value={draft} spellCheck="false" maxLength={7}
            onChange={(e) => { const x = e.target.value.trim(); setDraft(x); if (isHex(x)) set({ [field]: x.toUpperCase(), id: null }); }} />
        </div>
        {against && <div className="wdc-ratios">{against.map(([bg, l]) => <Ratio key={l} fg={v} bg={bg} label={l} />)}</div>}
      </div>
    );
  };

  const WdColourConfig = () => {
    const c = useColours();
    const tileGrounds = [[PAGE, 'page'], [c.ground, 'cover ground']];
    return (
      <section className="wdc" aria-label="Daily Word colours">
        <h2 className="sp2-game-name">Colours</h2>
        <div className="wdc-pals">
          {PALETTES.map((p) => <button key={p.id} type="button" className="wdc-pal" aria-pressed={c.id === p.id} onClick={() => set(Object.assign({}, p))}>
            <span className="wdc-pal-sw" aria-hidden="true">{[p.ground, p.hit, p.near, p.miss].map((h, i) => <i key={i} style={{ background: h }} />)}</span>{p.name}</button>)}
        </div>
        <ColourField field="ground" label="Cover ground" against={[[PAGE, 'page']]} />
        <ColourField field="hit" label="In place" against={tileGrounds} />
        <ColourField field="hitOn" label="In place, letter" against={[[c.hit, 'tile']]} />
        <ColourField field="near" label="In the word" against={tileGrounds} />
        <ColourField field="nearOn" label="In the word, letter" against={[[c.near, 'tile']]} />
        <ColourField field="miss" label="Not in the word" against={tileGrounds} />
        <div className="sp2-seg">
          <div className="sp2-label">Not in the word, drawn</div>
          <window.ConfigSeg value={c.missStyle} options={[{ value: 'fill', label: 'Filled' }, { value: 'outline', label: 'Outline' }, { value: 'cover', label: 'Cover block' }]}
            onChange={(v) => set({ missStyle: v, id: null })} />
        </div>
        <ColourField field="missOn" label="Not in the word, letter" against={c.missStyle === 'fill' ? [[c.miss, 'tile']] : tileGrounds} />
        <button type="button" className="wdc-reset" onClick={() => set(Object.assign({}, DEFAULT))}>Reset to {DEFAULT.name}</button>
      </section>
    );
  };

  window.WdColours = { get: () => cur, PALETTES, DEFAULT };
  window.WdColourConfig = WdColourConfig;
})();
