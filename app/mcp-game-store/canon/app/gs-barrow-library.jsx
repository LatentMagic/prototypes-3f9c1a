// ============================================================================
// [Platform] — The Barrow of Hollowmere's library page (added 2026-10-13). Chapters are its editions; chapter 1 is out
// and free with an account, chapter 2 is coming soon. Nobody has played it yet, so nothing is earned and Your chapters is empty.
// Chapter titles and achievements are sample content.
// ============================================================================
const BW_CH1 = { title: 'Under the Hill', line: 'Five levels under the hill. Your loot carries on.' };
// The chapters out so far, newest first, in edList's shape (gs-history.jsx). Chapter 1 came out 12 October; nobody has played it.
const bwEds = (gs) => [{ key: 'bw1', gid: 'barrow', n: 1, title: BW_CH1.title, date: '12 October', month: 'October', free: true, now: true, status: gs.view !== 'out' ? { kind: 'none', label: 'Not played' } : null, open: null }];
const BW_ACH = [
  { k: 'seal', n: 'Through the broken seal', how: 'Go into the barrow.', first: true },
  { k: 'ring', n: 'The bronze ring', how: 'Find the ring under the dust in the root hall.', first: true },
  { k: 'deep', n: 'Five levels down', how: 'Reach the barrow’s deepest room.', first: true },
  { k: 'sheep', n: 'Every sheep home', how: 'Bring the village’s sheep back out.', first: true },
  { k: 'unhurt', n: 'Out without a scratch', how: 'Finish chapter 1 with full HP.', first: true },
  { k: 'heavy', n: 'A heavy pack', how: 'Carry ten pieces of loot out of chapter 1.', of: 10, have: 0, first: true },
];
const BW_BADGES = lbAutoBadges(BW_ACH);
const BwChapter = () => {
  const gs = useGs(); const pass = gs.view === 'pass';
  return (
    <section className="lb-card" style={{ gridColumn: '1 / -1' }}>
      <div className="lb-top"><div className="gs-stack-xs"><span className="gs-label">{pass ? 'CHAPTER 1' : 'CHAPTER 1 · FREE'}</span><h2 className="mcp-t-sec">{BW_CH1.title}</h2></div></div>
      <p>{BW_CH1.line}</p>
      <div className="lb-foot">
        <div className="lb-acts"><DS.Button onClick={() => gs.playReq({ kind: 'edition', e: bwEds(gs)[0] })}>Play</DS.Button></div>
        <span className="gs-muted">Chapter 2: coming soon</span>
      </div>
    </section>
  );
};
const BwLibrary = () => {
  const gs = useGs(); const access = lbAccess(gs, 'barrow');
  return (
    <main key={gs.view} className="gs-wrap gs-main">
      <LbHead id="barrow" />
      <div className="lb-lay">
        <BwChapter />
        <LbAch items={BW_ACH} badges={BW_BADGES} access={access} ed={GS_GAMES.barrow.ed} />
        <LbRecent title="Your chapters" allLabel="See in History" empty="Your chapters appear here once you have played one." />
      </div>
    </main>
  );
};
window.GS_LIBRARY.barrow = BwLibrary;
Object.assign(window, { bwEds });
