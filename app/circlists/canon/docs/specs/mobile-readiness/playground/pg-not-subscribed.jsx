// ============================================================================
// Option board — the app's not-subscribed surfaces, and the Reported row.
// Four surfaces, each with its own options, drawn at a phone width (app posture
// only: every one of them keys on pppAppNoPay or lives in the app's card menu).
// 00 always mounts the shipped component. The ratified lines are word for word
// in every option; only form changes.
// ============================================================================
window.__pppApi = { isApp: true, mobilePayments: false, spaces: [], user: { email: 'sam.rivera@gmail.com' }, goHome() {}, setRoute() {}, setTab() {}, enterSpace() {} };
const NS_KEY = 'pg_not_subscribed_v1';
const NS_WIDTHS = [[320, 568], [375, 667], [393, 852]];
const NS_SUB = { status: 'trial', plan: 'monthly', pending: null, usedFreeMonth: true };
const NS_NONE = { status: 'none', plan: 'monthly', pending: null, usedFreeMonth: false };

// The ratified line as one paragraph: no per-sentence boxes, no balance.
const NsLine = () => <>Joining circles is free. Starting your own needs a Circlists{'\u00a0'}subscription. You can{'\u2019'}t subscribe in this{'\u00a0'}app.</>;
// The status line broken only at its phrase edge: whole on one line where it fits, else before "in this app."
const NsManage = () => <><span style={{ display: 'inline-block' }}>You can{'\u2019'}t manage your subscription</span> in this{'\u00a0'}app.</>;

const nsBack = () => {};
const NsHeader = () => (
  <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', flex: 'none' }}>
    <WizardIconBtn name="arrow-left" label="Back to your circles" onClick={nsBack} /><span style={{ width: 40 }} />
  </header>
);
const nsP = (size) => ({ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: size, lineHeight: 1.55, color: 'var(--color-fg-1)', margin: 0, textWrap: 'pretty' });

// The page title sized to the column (container units), so it holds one line at 320-393.
const nsH1 = { fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'min(32px, 8.4cqi)', lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--color-fg-1)', margin: 0, whiteSpace: 'nowrap' };
const nsBody = { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 'var(--text-md)', lineHeight: 1.5, color: 'var(--color-fg-1)', margin: 'var(--space-3) 0 0', textWrap: 'pretty' };
const nsNote = { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: 'var(--space-5) 0 0', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-2)' };
const NsBackBtn = () => <div style={{ marginTop: 'var(--space-8)' }}><Button variant="secondary" full size="lg" onClick={nsBack}>Back to your circles</Button></div>;
const NsFrame = ({ children }) => (
  <div style={{ minHeight: 'var(--circ-vh)', background: 'var(--color-canvas)', display: 'flex', flexDirection: 'column' }}>
    <NsHeader />
    <main className="circ-wizard-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="circ-auth-col" style={{ containerType: 'inline-size' }}>{children}</div>
    </main>
  </div>
);

// ---- A · Create a circle, not subscribed -----------------------------------
const NS_CREATE = [
  { n: '00', name: 'Today', stance: 'The shipped page: the calm page with the wordmark pinned at the top, each sentence boxed so it wraps on its own, centred in the screen, primary button.', cost: 'Four ragged centred lines float mid-screen under a pinned wordmark; the empty half above and below reads as a broken page. A green primary for a way back.',
    Page: () => <PppWebHandoff /> },
  { n: '08', name: 'The calm-page family', stance: 'Every other full-page state (Page not found, This invite isn\u2019t valid anymore, This circle is full) is the shipped CalmPage: a title stating the situation, a secondary-grey body explaining it, one action. This page was the only one with no title. Here the essential fact, "You can\u2019t subscribe in this app.", is the title; the other two sentences are the body. Mounted from app/spaces.jsx; the title scales and balances the way the sleeping-circle title does (clamp 24 to 32px), so it is two even lines at every phone width.', cost: 'Reorders the ratified line (no word changed) and gives it a title, which the brief barred.',
    Page: () => <CalmPage title={<span style={{ display: 'block', fontSize: 'clamp(24px, 8cqi, 32px)', textWrap: 'balance' }}>You can{'\u2019'}t subscribe in this{'\u00a0'}app.</span>} body="Joining circles is free. Starting your own needs a Circlists subscription." actionLabel="Back to your circles" onAction={nsBack} /> },
  { n: '07', name: 'Set as a paragraph', stance: 'Today\u2019s page and button, untouched. The line is set as one short paragraph: 17px, generous leading, a measure narrow enough that its lines come out even, so it reads as one tidy block.', cost: 'Sentences wrap where the measure says, not at their ends.',
    Page: () => (
      <div style={{ position: 'relative', minHeight: 'var(--circ-vh)', background: 'var(--color-canvas)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'safe center', padding: '76px 24px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)' }}><Wordmark size={21} /></div>
        <div style={{ width: '100%', maxWidth: 340 }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 17, lineHeight: 1.6, color: 'var(--color-fg-1)', margin: '0 auto', maxWidth: '19.5em', textWrap: 'balance' }}>Joining circles is free. Starting your own needs a Circlists subscription. You can{'\u2019'}t subscribe in this{'\u00a0'}app.</p>
          <div style={{ marginTop: 'var(--space-8)' }}><Button variant="primary" size="lg" onClick={nsBack}>Back to your circles</Button></div>
        </div>
      </div>
    ) },
  { n: '04', name: 'Lead sentence', stance: 'The words get roles. "Joining circles is free." is the page\u2019s title, sized to sit on one line at every phone width; the other two sentences are its body in secondary grey. Left-aligned in the Create a circle frame, the way back below.', cost: 'Uses the line\u2019s first sentence as a heading. No new words, but the brief\u2019s "one line" is now set as title and body.',
    Page: () => <NsFrame><h1 style={nsH1}>Joining circles is free.</h1><p style={{ ...nsBody, color: 'var(--color-fg-2)' }}>Starting your own needs a Circlists subscription. You can{'\u2019'}t subscribe in this app.</p><NsBackBtn /></NsFrame> },
  { n: '05', name: 'Lead, body, note', stance: 'Three sentences, three roles. The title; the condition as body in ink; "You can\u2019t subscribe in this app." as a note under a hairline, the way the Account card sets its status line.', cost: 'The most structure: three levels for three sentences. The note is quieter than the rule it states.',
    Page: () => <NsFrame><h1 style={nsH1}>Joining circles is free.</h1><p style={nsBody}>Starting your own needs a Circlists subscription.</p><p style={nsNote}>You can{'\u2019'}t subscribe in this{'\u00a0'}app.</p><NsBackBtn /></NsFrame> },
  { n: '06', name: 'The Account card', stance: 'The page holds the same card the Account page shows a non-subscriber, so the statement looks the same wherever it is met. Card title "Subscription", the line as its body, the way back under the card.', cost: 'Adds the card\u2019s existing title "Subscription"; the brief bars a heading here. A card alone on a page can read as a fragment.',
    Page: () => <NsFrame><div className="ppp-card"><div className="ppp-card-head"><div className="ppp-card-title">Subscription</div></div><p className="ppp-card-body" style={{ fontSize: 16 }}>Joining circles is free. Starting your own needs a Circlists{'\u00a0'}subscription. You can{'\u2019'}t subscribe in this{'\u00a0'}app.</p></div><NsBackBtn /></NsFrame> },
];

// ---- B / C · Account, never subscribed / free month ------------------------
const NsAccountTop = ({ children }) => (
  <div style={{ minHeight: 'var(--circ-vh)', background: 'var(--color-canvas)', padding: '24px 24px 48px' }}>
    <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.25, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 6px' }}>Account</h1>
    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-fg-2)', margin: '0 0 var(--space-6)' }}>sam.rivera@gmail.com</p>
    {children}
  </div>
);
const NsHead = ({ marker }) => (
  <div className="ppp-card-head"><div className="ppp-card-title">Subscription</div>
    {marker && <div className="ppp-card-marker"><Icon name="check" size={15} color="var(--color-fg-3)" />{marker}</div>}</div>
);
const NS_ACCOUNT = [
  { n: '00', name: 'Today', stance: 'The shipped cards. Each sentence of the line is boxed and balanced; the status line is balanced.', cost: 'Balance splits lines that would read better long: "Starting your own needs / a Circlists subscription." and "You can\u2019t manage your / subscription in this app."',
    None: () => <PppNotSubscribed st={NS_NONE} />, Sub: () => <PppSubscribed st={NS_SUB} user={window.__pppApi.user} /> },
  { n: '01', name: 'Let it flow', stance: 'The line is one paragraph that fills the card\u2019s width and wraps where it must. The status line breaks only at its phrase edge, before "in this app.", or not at all where it fits.', cost: 'Lines run the card\u2019s full width, so the paragraph is less even; "Circlists\u00a0subscription" and "this\u00a0app" are glued so no word is left alone.',
    None: () => <div className="ppp-card ppp-ns"><NsHead /><p className="ppp-card-body"><NsLine /></p></div>,
    Sub: () => (
      <div className="ppp-card ppp-card-cq"><NsHead marker="Active" />
        <div className="ppp-rows"><PppRow k="Plan" v={'Monthly \u00b7 \u00a33\u00a0a\u00a0month'} /><PppRow k="First payment" v={pppNb(pppDay(PPP_TRIAL_DAYS))} /></div>
        <p className="ppp-card-line"><NsManage /></p>
      </div>
    ) },
];

// ---- D · Reported, in the card menu ----------------------------------------
// rbRow and the menu box: copied from app/report-block.jsx and app/feed.jsx.
const nsRow = { display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', background: 'transparent', border: 0, padding: '11px 10px', minHeight: 44, borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, color: 'var(--color-fg-1)', whiteSpace: 'nowrap' };
const NsMenu = ({ children }) => (
  <div style={{ padding: 24, background: 'var(--color-canvas)', minHeight: 'var(--circ-vh)', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
    <div role="menu" style={{ minWidth: 168, background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-overlay)', padding: 6 }}>
      <div className="circ-menuitem" style={{ ...nsRow, cursor: 'pointer' }}><Icon name="share" size={16} /> Share</div>
      <div aria-hidden="true" style={{ height: 1, background: 'var(--color-border-2)', margin: '5px 4px' }} />
      {children}
      <div className="circ-menuitem" style={{ ...nsRow, cursor: 'pointer', color: 'var(--color-destructive)' }}><Icon name="trash" size={16} /> Delete</div>
    </div>
  </div>
);
const NsReported = ({ icon, color, iconColor }) => (
  <div role="menuitem" aria-disabled="true" style={{ ...nsRow, cursor: 'default', color }}>
    {icon && <Icon name={icon} size={16} color={iconColor || 'currentColor'} />} Reported
  </div>
);
const NS_REPORTED = [
  { n: '00', name: 'Today', stance: 'A tick and "Reported" in --color-fg-2.', cost: 'A tick reads as "done" or "selected" (Save uses it for checked); it says nothing about reporting. fg-2 is #525252, a neutral grey, where every other grey in the set is warm.',
    Row: () => <RbReportedRow /> },
  { n: '01', name: 'Flag, fg-2', stance: 'The row keeps the flag that Report link carried; only its words change. The menu reads the same shape before and after.', cost: 'Keeps the neutral #525252.',
    Row: () => <NsReported icon="flag" color="var(--color-fg-2)" /> },
  { n: '02', name: 'Flag, fg-3', stance: 'The flag, in the warm tertiary grey the captions and meta use: a statement, quieter than the acts around it.', cost: 'Lighter (5.1:1 on white, still AA). Reads clearly as not pressable; a little further from the ink rows.',
    Row: () => <NsReported icon="flag" color="var(--color-fg-3)" /> },
  { n: '03', name: 'Flag in ink, words grey', stance: 'The icon in ink like every row\u2019s icon; only the label is grey.', cost: 'Splits the row\u2019s colour; the grey alone carries "not pressable".',
    Row: () => <NsReported icon="flag" color="var(--color-fg-3)" iconColor="var(--color-fg-1)" /> },
];
const NS_GREYS = [['--color-fg-1', '#0A0A0A', '19.8:1', 'ink: titles, body, menu rows'], ['--color-fg-2', '#525252', '7.8:1', 'secondary text; neutral (R=G=B)'], ['--color-fg-3', '#6E6E6B', '5.1:1', 'tertiary, captions, meta; warm'], ['--color-border-1', '#DCDCD8', '', 'warm'], ['--color-page', '#FAFAF7', '', 'warm']];

const NS_ROWS = [
  { id: 'A', title: 'Create a circle, not subscribed', sub: 'App posture, Mobile payments Off · tap New circle on Home', opts: NS_CREATE, draw: (o) => <o.Page />, full: true },
  { id: 'B', title: 'Account, never subscribed', sub: 'The Subscription card leads the Account page', opts: NS_ACCOUNT, draw: (o) => <NsAccountTop><o.None /></NsAccountTop> },
  { id: 'C', title: 'Account, free month', sub: 'Status only; the same for Active', opts: NS_ACCOUNT, draw: (o) => <NsAccountTop><o.Sub /></NsAccountTop> },
  { id: 'D', title: 'Reported, in a card\u2019s menu', sub: 'After Report link; the same row on a comment', opts: NS_REPORTED, draw: (o) => <NsMenu><o.Row /></NsMenu>, short: 260 },
];

const NsScreen = ({ w, h, children }) => (
  <div className="ns-screen" data-circ-posture="mobile" style={{ width: w, height: h, '--circ-vh': h + 'px' }}>{children}</div>
);
const NsBoard = () => {
  const saved = (() => { try { return JSON.parse(localStorage.getItem(NS_KEY) || '{}'); } catch (e) { return {}; } })();
  const [wi, setWi] = React.useState(saved.wi != null ? saved.wi : 1);
  const [open, setOpen] = React.useState(null);
  React.useEffect(() => { try { localStorage.setItem(NS_KEY, JSON.stringify({ wi })); } catch (e) {} }, [wi]);
  const [w, h] = NS_WIDTHS[wi];
  return (
    <div className="ns-board">
      <header className="ns-top">
        <div><h1>Not subscribed, in the app</h1><p>The ratified lines are word for word in every option; only form changes. 00 is the shipped component.</p></div>
        <div className="ns-seg" role="radiogroup" aria-label="Width">
          {NS_WIDTHS.map(([ww], i) => <button key={ww} type="button" role="radio" aria-checked={wi === i} data-on={wi === i ? '1' : undefined} onClick={() => setWi(i)}>{ww}</button>)}
        </div>
      </header>
      {NS_ROWS.map((r) => (
        <section key={r.id} className="ns-row" data-screen-label={r.id + ' ' + r.title}>
          <h2><b>{r.id}</b>{r.title}<span>{r.sub}</span></h2>
          <div className="ns-grid">
            {r.opts.map((o) => {
              const k = r.id + o.n; const sh = r.full ? h : (r.short || Math.min(h, 420));
              return (
                <article key={o.n} className="ns-cell">
                  <div className="ns-cell-head"><b>{r.id}.{o.n}</b><span>{o.name}</span>
                    <button type="button" aria-expanded={open === k} onClick={() => setOpen(open === k ? null : k)}>{open === k ? 'Hide' : 'Why'}</button></div>
                  {open === k && <div className="ns-why"><p>{o.stance}</p><p><span>Cost</span>{o.cost}</p></div>}
                  <NsScreen w={w} h={sh}>{r.draw(o)}</NsScreen>
                </article>
              );
            })}
          </div>
          {r.id === 'D' && (
            <table className="ns-greys"><tbody>
              {NS_GREYS.map(([t, hex, cr, note]) => <tr key={t}><td><i style={{ background: hex }} /></td><td>{t}</td><td>{hex}</td><td>{cr && cr + ' on white'}</td><td>{note}</td></tr>)}
            </tbody></table>
          )}
        </section>
      ))}
    </div>
  );
};
ReactDOM.createRoot(document.getElementById('root')).render(<NsBoard />);
