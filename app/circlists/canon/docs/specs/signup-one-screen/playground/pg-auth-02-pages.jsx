// ============================================================================
// Playground pages — 02 explored (signup-one-screen). 02 is the frame taken
// forward: no card at any width, the Create circle page's spacing. This rig
// varies where the brand lives, the buttons' size and where the small print
// sits. Reuses pg-auth-frame-pages.jsx (AfProviders, AfForm, AfConsent,
// AfSwitch, AF_COPY, AfBarePage) and its rig, pg-auth-frame.jsx, through
// window.AF_RIG. Nothing in app/ is changed.
// ============================================================================

const Af02Page = ({ cfg, kind, step, wide, onEmail, onBack, onSwitch, firstRef, uid }) => {
  const c = AF_COPY[kind];
  const two = step === 2;
  const size = cfg.btn === '44' ? 'md' : 'lg';
  const atFoot = cfg.print === 'foot';
  const back = cfg.back || 'header';
  const col = { width: '100%', maxWidth: wide ? 360 : 400 };
  const print = (
    <>
      <div className={cfg.brand === 'title' ? 'af-consent-bal' : undefined}><AfConsent kind={kind} /></div>
      {!two && <div style={{ ...afFoot, textAlign: 'center', marginTop: 'var(--space-4)' }}><AfSwitch kind={kind} onSwitch={onSwitch} /></div>}
    </>
  );
  const heading = cfg.brand === 'title'
    ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}><LogoMark size={28} /><h1 style={afH1}>{c.title}</h1></div>
    : <h1 style={afH1}>{c.title}</h1>;
  return (
    <div className={cfg.btn === '44' ? 'af-b44' : undefined} style={{ minHeight: 'var(--circ-vh)', background: 'var(--color-canvas)', display: 'flex', flexDirection: 'column' }}>
      {back === 'aligned' ? (
        <header style={{ display: 'flex', justifyContent: 'center', padding: (wide ? 'clamp(10px, 1.2vw, 16px) 24px' : 'clamp(10px, 1.2vw, 16px) 22px'), flex: 'none' }}>
          <div style={{ ...col, display: 'flex', alignItems: 'center' }}>
            {two ? <span style={{ marginLeft: -8, display: 'inline-flex' }}><WizardIconBtn name="arrow-left" label="Back" onClick={onBack} /></span> : <span style={{ width: 40, height: 40 }} />}
          </div>
        </header>
      ) : (
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'clamp(10px, 1.2vw, 16px) clamp(12px, 1.4vw, 20px)', flex: 'none' }}>
        {two && back !== 'line' ? <WizardIconBtn name="arrow-left" label="Back" onClick={onBack} /> : <span style={{ width: 40, height: 40 }} />}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>{cfg.brand === 'header' ? <LogoMark size={28} /> : cfg.brand === 'header-word' ? <Wordmark size={18} /> : null}</div>
        <span style={{ width: 40 }} />
      </header>
      )}
      <div className={'circ-wizard-body af-body' + (two ? ' af-body-tight' : '')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: atFoot ? '1 0 auto' : undefined, paddingBottom: atFoot || cfg.brand === 'foot' ? 16 : undefined }}>
        <div style={col}>
          {cfg.brand === 'above' && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}><LogoMark size={36} /></div>}
          <div style={{ textAlign: 'center' }}>
            {heading}
            {!two && <p style={afSub}>{c.sub}</p>}
          </div>
          <div style={{ marginTop: 'var(--space-6)' }}>{two ? <AfForm kind={kind} hintInLabel size={size} firstRef={firstRef} uid={uid} /> : <AfProviders size={size} onEmail={onEmail} />}</div>
          {two && back === 'line' && <div style={{ ...afFoot, textAlign: 'center', marginTop: 'var(--space-5)' }}><TextLink onClick={onBack}>Use Google or Apple instead</TextLink></div>}
          {!atFoot && print}
        </div>
      </div>
      {(atFoot || cfg.brand === 'foot') && (
        <footer style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 22px 24px', marginTop: atFoot ? 0 : 'auto' }}>
          <div style={col}>
            {atFoot && print}
            {cfg.brand === 'foot' && <div style={{ display: 'flex', justifyContent: 'center', marginTop: atFoot ? 'var(--space-5)' : 0 }}><Wordmark size={18} /></div>}
          </div>
        </footer>
      )}
    </div>
  );
};

const AF02_OPTIONS = [
  { n: '02', name: 'As built', Page: AfBarePage, oneStep: false, ref: true,
    stance: 'The frame taken forward, unchanged: the wordmark in the header row, 52px buttons in a 400 column, the small print under the buttons.',
    cost: 'The reference. The wordmark reads as a bar with no bar; the buttons are heavy on desktop; the small print stacks under the buttons.' },
  { n: '02.1', name: 'Mark above the title', Page: Af02Page, def: { brand: 'above', btn: '44', print: 'foot' },
    stance: 'The mark alone, 36px, centred above the heading: the page\u2019s emblem, the way a sign-in page usually opens. Buttons at the 44 floor in a 360 column on desktop; the small print at the foot of the screen.',
    cost: 'The word Circlists is not on the page, only the mark. The mark\u2019s row costs about 50px: in a small phone\u2019s browser (iPhone SE, Safari) step 2 of sign-up runs about 40px past.' },
  { n: '02.2', name: 'Mark on the title', Page: Af02Page, def: { brand: 'title', btn: '44', print: 'foot' },
    stance: 'The mark, 28px, sits in the heading\u2019s line, before its first word. No row of its own. Same buttons, column and foot as 02.1.',
    cost: 'The mark becomes part of the heading, so the heading reads as a lockup. The shortest of the four; step 2 of sign-up fits a small phone\u2019s browser by a hair.' },
  { n: '02.2.1', name: 'Arrow on the column', Page: Af02Page, def: { brand: 'title', btn: '44', print: 'foot', back: 'aligned' },
    stance: '02.2 with the back arrow’s glyph on the column’s left edge, in line with the fields’ labels. Its 40px hit area overhangs into the gutter. See it on step 2.',
    cost: 'On desktop the arrow moves in from the page corner to the column. The Create circle page keeps its corner arrow unless it moves too.' },
  { n: '02.2.2', name: 'A way back in words', Page: Af02Page, def: { brand: 'title', btn: '44', print: 'foot', back: 'line' },
    stance: 'No arrow. Under the form, a line names where back goes: “Use Google or Apple instead”. The header row stays, empty. See it on step 2.',
    cost: 'The way back sits below the fold of attention, after the form. The empty header row still costs its height. The browser’s Back still works.' },
  { n: '02.3', name: 'Mark in the header', Page: Af02Page, def: { brand: 'header', btn: '44', print: 'foot' },
    stance: '02\u2019s position, with the mark alone at 28px instead of the wordmark, so it is lighter than a bar. Same buttons, column and foot.',
    cost: 'Still locked to the top, the position you called weird; the difference is weight only. Fits as 02.2 does.' },
  { n: '02.3.1', name: 'Wordmark in the header', Page: Af02Page, def: { brand: 'header-word', btn: '44', print: 'foot' },
    stance: '02.3 with the Circlists wordmark, 18px, in place of the mark, centred in the header row. Same buttons, column and foot.',
    cost: 'The name is on the page, at the top, the position you called weird in 02. The difference from 02 is the 44 buttons, the 360 column and the foot.' },
  { n: '02.4', name: 'Wordmark at the foot', Page: Af02Page, def: { brand: 'foot', btn: '44', print: 'foot' },
    stance: 'Nothing above the heading but the back arrow. The wordmark signs the page at its foot, under the small print.',
    cost: 'The brand is the last thing read, and the first screen opens on a bare heading. In a small phone\u2019s browser step 2 of sign-up runs about 30px past.' },
];

window.AF_RIG = {
  key: 'pg_auth_02_v1',
  options: AF02_OPTIONS,
  levers: [
    { id: 'btn', label: 'Buttons', values: [['52', '52'], ['44', '44']] },
    { id: 'print', label: 'Small print', values: [['stack', 'Under buttons'], ['foot', 'At foot']] },
  ],
};
