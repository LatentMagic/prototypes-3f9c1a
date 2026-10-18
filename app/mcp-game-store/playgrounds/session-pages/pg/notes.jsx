// ============================================================================
// Session-pages playground: the Notes entry (o=5), one per game. Renders notes/<game>.md from this playground's own folder, so it ships with the page.
// A whiteboard like the share-text view: a full-window sheet over the app, no shell. The renderer knows only what the notes use:
// # / ## / ### headings, "- " lists, blank-line paragraphs, **bold**, `code`, [label](url). Names are Pg-prefixed: Babel scripts share one global scope.
// ============================================================================
const pgNotesInline = (s, key) => {
  const parts = []; const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g; let last = 0, m, i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) parts.push(s.slice(last, m.index));
    const t = m[0];
    if (t[0] === '*') parts.push(<strong key={key + '-' + i++}>{t.slice(2, -2)}</strong>);
    else if (t[0] === '`') parts.push(<code key={key + '-' + i++}>{t.slice(1, -1)}</code>);
    else { const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(t); parts.push(/^https?:/.test(mm[2]) ? <a key={key + '-' + i++} href={mm[2]} target="_blank" rel="noreferrer">{mm[1]}</a> : mm[1]); }
    last = m.index + t.length;
  }
  if (last < s.length) parts.push(s.slice(last));
  return parts;
};
const pgNotesBlocks = (md) => {
  const out = []; let para = [], list = [];
  const flush = () => {
    if (para.length) { out.push(<p key={out.length}>{pgNotesInline(para.join(' '), 'p' + out.length)}</p>); para = []; }
    if (list.length) { out.push(<ul key={out.length}>{list.map((l, i) => <li key={i}>{pgNotesInline(l, 'l' + out.length + i)}</li>)}</ul>); list = []; }
  };
  md.split('\n').forEach((raw) => {
    const ln = raw.trimEnd(); let m;
    if (!ln.trim()) flush();
    else if ((m = /^(#{1,3})\s+(.*)$/.exec(ln))) { flush(); const H = 'h' + (m[1].length + 1); out.push(<H key={out.length}>{pgNotesInline(m[2], 'h' + out.length)}</H>); }
    else if ((m = /^[-*]\s+(.*)$/.exec(ln))) { if (para.length) flush(); list.push(m[1]); }
    else { if (list.length) flush(); para.push(ln.trim()); }
  });
  flush(); return out;
};

const PgNotes = ({ game }) => {
  const [md, setMd] = React.useState(null);
  React.useEffect(() => {
    let live = true; setMd(null);
    fetch(window.PG_BASE + 'notes/' + game.id + '.md').then((r) => (r.ok ? r.text() : Promise.reject(new Error(r.status)))).then((t) => { if (live) setMd(t); }).catch(() => { if (live) setMd(''); });
    return () => { live = false; };
  }, [game.id]);
  return (
    <div className="pgs pgn" role="region" aria-label={game.name + ' notes'}>
      <div className="pgs-in pgn-in">
        <div className="pgs-head"><div className="pg-eyebrow">Notes · {game.name}</div></div>
        {md === null ? <p>Loading.</p> : md === '' ? <p>No notes for this game yet.</p> : <article className="pgn-md">{pgNotesBlocks(md)}</article>}
      </div>
    </div>
  );
};
window.PgNotes = PgNotes;
