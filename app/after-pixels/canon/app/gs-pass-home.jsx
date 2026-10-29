// After Pixels — Home, and the Pass mark on the game cards.
// Declares GsHome, GsCard / GsGameCard and GsPick (the Home and the cards every card row draws).
// GsHome is canon's with the Pass section gone: the Pass is a card first in Available games, and the row's line says what's free;
// the hero, Coming soon and What's new are canon's. GsTile (gs-parts.jsx) is the one tile, for the wall and tile rows.

// The Pass mark is the design system's: GameCard, GamePick and GameTile draw it on the picture when `pass`
// is set. Set for Pass-only games, for a player without the Pass. The mark is its own control: it opens Pricing (`pass`).
// The Free and "First … free" chips come off the cards; the Pass is never a tag.
import React from 'react';
import { GS_GAMES, useGs, DS, GS_ART, GS, GS_NAME, GS_SOON } from './gs-data.jsx';
import { GsArt, useGsArtHost, gsKeepLast, GsTagList, GsSoonCard } from './gs-parts.jsx';
import { GS_HERO_CHAT, GS_CHAT_MARK, GS_CHAT_BY } from './gs-chats.jsx';
import { GS_HOME_GAMES, GsFeature, GsWhatsNew } from './gs-home.jsx';
import { GS_PLAN } from './gs-billing.jsx';
import { cprLocked, cprPassLine, CPR_SHOWN, CPR_STAGE } from './gs-pass-store.jsx';

const cprTags = (k) => GS_GAMES[k].tags.filter((t) => t !== 'FREE' && t !== 'FIRST' && t !== 'PASS');
const CprArt = ({ host, id, shape }) => <div ref={host}><GsArt art={GS_GAMES[id].art} shape={shape} /></div>;
export const GsCard = ({ id, mark }) => {
  const gs = useGs(); const host = useGsArtHost(); const g = GS_GAMES[id];
  return (
    <DS.GameCard className="mcp-art-host gs-host"
      art={<CprArt host={host} id={id} shape="wide" />} pass={cprLocked(gs, id)} onPass={() => gs.go('pass')}
      title={<button type="button" className="gs-titlebtn mcp-art-link" onClick={() => gs.go(g.route)}>{g.name}</button>}
      mark={mark && <DS.Tag kind="daily" icon="check">{mark}</DS.Tag>}
      blurb={gsKeepLast(g.blurb)}
      tags={<GsTagList tags={cprTags(id)} ed={g.ed} />} />
  );
};
export const GsGameCard = GsCard;
export const GsPick = ({ id, label }) => {
  const gs = useGs(); const host = useGsArtHost(); const g = GS_GAMES[id];
  return (
    <DS.GamePick className="mcp-art-host gs-host"
      art={<CprArt host={host} id={id} shape="wide" />} pass={cprLocked(gs, id)} onPass={() => gs.go('pass')}
      label={label}
      title={<button type="button" className="gs-titlebtn mcp-art-link" onClick={() => gs.go(g.route)}>{g.name}</button>}
      blurb={gsKeepLast(g.blurb)}
      tags={<GsTagList tags={cprTags(id)} ed={g.ed} />} />
  );
};

// The line under Available games: what's free, from the staging (a third free daily reads "Three" with no copy edit), then "the Pass" as its only link.
const CprHomeLine = () => {
  const gs = useGs(); const c = cprPassLine();
  return <>{c.p1.replace(/ with your account\. $/, ' free. ')}{c.p1 ? 'Everything else' : 'Everything'} with <button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>the Pass</button>.</>;
};
// KEEP: the Pass card is first in the row, so a phone shows it without scrolling. The whole card opens Pricing; the price is plain text in the chip line.
// Salvage's board is too fine to read at mosaic size, so Daily Word takes its place (owner, 2026-10-21).
// KEEP: no square shares its ground colour with the one beside or above it (four to a row).
const cprMix = (ids) => {
  const ground = (k) => (GS_ART[GS_GAMES[k].art] || {}).ground; const out = []; const used = ids.map(() => false);
  const ok = (k, i) => !((i % 4 && ground(out[i - 1]) === ground(k)) || (i >= 4 && ground(out[i - 4]) === ground(k)));
  const fill = (i) => {
    if (i === ids.length) return true;
    for (let j = 0; j < ids.length; j++) if (!used[j] && ok(ids[j], i)) { used[j] = true; out[i] = ids[j]; if (fill(i + 1)) return true; used[j] = false; }
    return false;
  };
  return fill(0) ? out.slice() : ids;
};
let CPR_MOSAIC;
const CprPassCard = () => {
  const gs = useGs(); const host = useGsArtHost(); const go = () => gs.go('pass');
  return (
    <DS.GameCard className="mcp-art-host gs-host cpr-pcard"
      art={<div ref={host} className="cpr-mosaic" aria-hidden="true" onClick={go}>{CPR_MOSAIC.map((k) => <GsArt key={k} art={GS_GAMES[k].art} shape="square" />)}</div>}
      title={<button type="button" className="gs-titlebtn mcp-art-link" onClick={go}><DS.Icon name="lock" size={18} className="cpr-lock" />The Pass<span className="cpr-chev" aria-hidden="true"><DS.Icon name="down" size={18} style={{ transform: 'rotate(-90deg)' }} /></span></button>}
      blurb="Every game, every edition."
      tags={<span className="cpr-price"><span>{GS_PLAN.monthly.price}</span> or <span>{GS_PLAN.yearly.price}</span></span>} />
  );
};

export const GsHome = () => {
  const gs = useGs(); const field = React.useRef(null);
  React.useEffect(() => {
    const f = field.current; if (!f) return undefined;
    const on = (e) => { if (e.pointerType !== 'mouse' && e.target.closest('.gs-hero-name, .gs-hero-shapes4')) f.classList.add('is-on'); };
    const off = () => f.classList.remove('is-on'); const ends = ['pointerup', 'pointercancel', 'pointerleave'];
    f.addEventListener('pointerdown', on); ends.forEach((t) => f.addEventListener(t, off));
    return () => { f.removeEventListener('pointerdown', on); ends.forEach((t) => f.removeEventListener(t, off)); };
  }, []);
  return (
    <main className="gs-wrap gs-main gs-home">
      <section className="gs-hero3">
        <div className="gs-hero-copy">
          <h1 className="gs-h1 gs-h1-home"><span>Your AI does the talking.</span> <span>The game keeps the score.</span></h1>
          <p className="gs-hero-sub">Play small games by talking to Claude or ChatGPT. The game holds the rules, the dice and your record.</p>
          <div className="gs-hero-act">
            <DS.Button onClick={gs.startFree}>Start free</DS.Button>
            <DS.Button variant="secondary" onClick={gs.goHow}>See how it works</DS.Button>
          </div>
          <div className="gs-works"><span className="gs-label">WORKS WITH</span><p className="gs-muted">{GS.works}</p></div>
        </div>
        {/* Casebook here isn't a decided game. The pattern stands whichever game it shows:
            one game's art, its schedule caption, a sample chat. */}
        <div className="gs-hero-field" ref={field}>
          <div className="gs-hero-shapes4" aria-hidden="true" onClick={() => gs.go(GS_GAMES.casebook.route)}>
            <i style={{ background: '#D66847', '--h': '62%', '--rise': '12px' }}></i>
            <i style={{ background: '#A390B2', '--h': '86%', '--rise': '6px' }}></i>
            <i style={{ background: '#F2EBE0', '--h': '66%', '--rise': '18px' }}></i>
            <b></b>
          </div>
          <button type="button" className="gs-hero-name" onClick={() => gs.go(GS_GAMES.casebook.route)}>
            <span className="gs-label">A NEW CASE EVERY WEEK</span>
            <span className="gs-hero-name-t">{GS_NAME.casebook} <DS.Icon name="down" size={20} style={{ transform: 'rotate(-90deg)' }} /></span>
          </button>
          <DS.ChatPlayback turns={GS_HERO_CHAT} loop mark={GS_CHAT_MARK} toolBy={GS_CHAT_BY} height={340} width={480} label="A Casebook case being played in a chat" />
        </div>
      </section>

      <section className="gs-band">
        <DS.CardRow title="Available games" sub={<CprHomeLine />} className="gs-row4">
          {[<CprPassCard key="pass" />, ...GS_HOME_GAMES.map((k) => <GsFeature key={k} id={k} />)]}
        </DS.CardRow>
        <div className="gs-grid2">{GS_SOON.map((g) => <GsSoonCard key={g.name} g={g} />)}</div>
        <div className="gs-stack-sm">
          <div><DS.TextLink onClick={() => gs.go('games')}>All games</DS.TextLink></div>
          <p className="gs-small gs-pu-wrap">{GS.purchase}</p>
        </div>
      </section>

      <GsWhatsNew />
    </main>
  );
};

// Load-time code, run by main.jsx in index.html's old tag order.
export function initGsPassHome() {
CPR_MOSAIC = cprMix(CPR_SHOWN.filter((k) => CPR_STAGE[k] === 'pass').map((k) => (k === 'salvage' ? 'word' : k)).slice(0, 8));
}
