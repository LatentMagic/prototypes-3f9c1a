// ============================================================================
// LM-626 whiteboard — Di, resolved.
// Di is chosen: on desktop, Leave left / Fund right. This module carries the
// three corrections and the one piece of pushback.
//   1. Leave is a real Button (house tertiary variant, destructive colour), so
//      it has a button's hover and a button's 44px target — not a text node.
//   2. Leave opens the SHIPPED leave confirmation (window.ConfirmDialog,
//      kind="leave"), the same one the roster uses. Live here.
//   3. Copy: the screen never says WHY the circle is asleep. Three sets that do.
//   4. Mobile stacking order, because Fund-on-top "feels weird".
// ============================================================================

// ---- the live screen -------------------------------------------------------
// One component, two postures. `row` is the only posture switch: desktop puts
// the pair side by side, mobile stacks. Everything else is shared.
const WbDi = ({ row = false, copy, leaveKind = 'tertiary', tint = true, gap = 20, flip = false, onLeave }) => {
  const fund = <Button variant="primary" size="lg" full={!row}>Fund this circle</Button>;
  const leaveBtn = leaveKind === 'outline'
    ? <window.Wb2Leave weight="outline" onClick={onLeave} />
    : leaveKind === 'text'
      ? <window.Wb2Leave weight="text" onClick={onLeave} />
      : (<span className={tint ? 'wb2-tint' : undefined}>
          <Button variant="tertiary" size="lg" onClick={onLeave}
            style={{ color: 'var(--color-destructive)', padding: tint ? '14px 18px' : '14px 10px' }}>Leave</Button>
        </span>);
  return (
    <main style={window.wb2.main}>
      <div style={window.wb2.mid}><div style={{ ...window.wb2.col, maxWidth: row ? 460 : 360 }}>
        <window.Wb2Head body={copy.body} title={copy.title} />
        {row ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', justifyContent: 'center', marginTop: 'var(--space-8)' }}>
            {leaveBtn}{fund}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: flip ? 'column-reverse' : 'column', alignItems: 'center', width: '100%', gap, marginTop: 'var(--space-8)' }}>
            {fund}{leaveBtn}
          </div>
        )}
        <p style={{ ...window.wb2.cap, marginTop: 20 }}>{copy.cap}</p>
      </div></div>
      <window.Wb2Addr />
    </main>
  );
};

// ---- copy ------------------------------------------------------------------
// The pushback: the screen states a state and offers a remedy but never names
// the CAUSE, so "Fund this circle" reads as an upsell rather than a repair, and
// the calm reads as evasion. Naming the lapse is not a payment nag — it is the
// one fact that makes the button make sense. "Data" stays out; the product's own
// nouns are links and members.
const WB2DI_COPY = [
  {
    id: 'A', name: 'State, then cause',
    title: 'This circle is asleep.',
    body: 'Its funding has run out, so nobody champions it right now.',
    cap: 'Everything in it is still here. Any member can fund it, and whoever funds it next champions it.',
    n: 'Keeps the shipped headline and gives the subheading a job it did not have: the reason. Preservation drops to the caption, where it belongs \u2014 it is reassurance, not news.',
  },
  {
    id: 'B', name: 'Cause first',
    title: 'This circle\u2019s funding has run out.',
    body: 'It is asleep rather than gone \u2014 its links and members are still here.',
    cap: 'Any member can fund it. Whoever funds it next champions it.',
    n: 'The headline carries the fact and the subheading carries the comfort, which is the honest order. It also settles the asleep/dormant argument by demoting "asleep" to a description instead of a euphemistic headline.',
  },
  {
    id: 'C', name: 'What is closed, and what is not',
    title: 'This circle is asleep.',
    body: 'Its funding has run out, so nobody can add or read. Nothing has gone anywhere.',
    cap: 'Any member can fund it. Whoever funds it next champions it.',
    n: 'The only set that says what you have actually lost \u2014 the circle is closed, not merely quiet. Heaviest of the three, and the closest to naming a cost; it is here because "something is missing" is probably this.',
  },
];

// ---- the section -----------------------------------------------------------
const Wb2DiSection = ({ Shell, Phone }) => {
  const [confirm, setConfirm] = React.useState(false);
  const copyB = WB2DI_COPY[2]; // set C — chosen, and what shipped
  return (
    <React.Fragment>
      <section className="wb-sec">
        <div className="wb-sec-h"><span className="wb-badge">Di</span>Resolved &mdash; shipped into the app on 2026-08-03</div>
        <p className="wb-note">Leave is the house <strong>tertiary</strong> button in destructive red, and it opens <code>ConfirmDialog kind=&ldquo;leave&rdquo;</code> &mdash; the same dialog the roster opens, unchanged. Press it.</p>
        <div className="wb-desk wb2-fixhost" style={{ '--circ-vh': '560px' }}>
          <Shell isMobile={false} Body={WbDi} bodyProps={{ row: true, copy: copyB, onLeave: () => setConfirm(true) }} />
          {confirm && <window.ConfirmDialog kind="leave" onConfirm={() => setConfirm(false)} onCancel={() => setConfirm(false)} />}
        </div>
      </section>

      <section className="wb-sec">
        <div className="wb-sec-h">Which button is Leave</div>
        <p className="wb-note"><strong>Recommendation: tertiary, red, tinted hover.</strong> A bordered button is a container, and a container says &ldquo;these two are the same kind of choice&rdquo; &mdash; on a screen whose job is recovery, the exit should not claim parity. Tertiary keeps the 52px target and a real hover while ranking below the primary by weight alone, which is the rule the product already uses everywhere else. The only thing to settle is the hover: the house tertiary underlines, but underline reads as a link, and a link is exactly what we banned.</p>
        <div className="wb2-weights wb2-pairstrip">
          {[
            { k: 'tertiary', tint: true, t: 'Tertiary, tinted hover', n: 'Recommended. Unmistakably a button on hover, no border at rest, destructive by colour only.' },
            { k: 'tertiary', tint: false, t: 'Tertiary, house hover', n: 'The shipped tertiary hover is an underline \u2014 correct to the system, but it makes a button look like a link.' },
            { k: 'outline', tint: false, t: 'Secondary, red outline', n: 'A true peer. Reads as an equal choice, which overstates how often anyone should leave.' },
            { k: 'text', tint: false, t: 'Text (round two, wrong)', n: 'What was on the board: red text with no button behaviour. The mistake this corrects.' },
          ].map((o, i) => (
            <div className="wb2-weight" key={i}>
              <div className="wb2-wt">{o.t}</div>
              <div className="wb2-wstage" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 'var(--space-3)', justifyContent: 'center', padding: '28px 12px' }}>
                {o.k === 'tertiary'
                  ? <span className={o.tint ? 'wb2-tint' : undefined}><Button variant="tertiary" size="lg" style={{ color: 'var(--color-destructive)', padding: o.tint ? '14px 18px' : '14px 10px' }}>Leave</Button></span>
                  : <window.Wb2Leave weight={o.k} />}
                <Button variant="primary" size="lg">Fund this circle</Button>
              </div>
              <p className="wb2-wn">{o.n}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wb-sec">
        <div className="wb-sec-h">Mobile: the stack</div>
        <p className="wb-note"><strong>Fund on top is right, and the weirdness is the spacing.</strong> Horizontal rows rank by reading order, so the affirmative goes last &mdash; which is why Di puts Fund on the right, and why the product&rsquo;s own confirmation dialog puts its affirmative rightmost too. Vertical stacks rank the opposite way: the first item is the recommended one (iOS action sheets, Material stacked dialog buttons), so flipping Leave to the top would read as the recommendation. What makes it feel wrong at 4px is that the two buttons look like one segmented control. Give the exit air and the ranking reads immediately.</p>
        <div className="wb2-trio">
          {[
            { p: { gap: 4 }, l: '4px \u2014 as boarded', n: 'Reads as one two-part control.' },
            { p: { gap: 20 }, l: '20px \u2014 recommended', n: 'Two things, ranked. The gap does the work the border was doing.' },
            { p: { gap: 20, flip: true }, l: 'Flipped', n: 'Leave first reads as the recommended action. This is the one to reject.' },
          ].map((v, i) => (
            <div key={i}>
              <div className="wb2-plabel">{v.l}</div>
              <Phone Body={WbDi} bodyProps={{ copy: copyB, ...v.p }} height={600} />
              <p className="wb2-wn">{v.n}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wb-sec">
        <div className="wb-sec-h">Saying why &mdash; three copy sets</div>
        <p className="wb-note">The pushback, agreed with: the screen states a state and offers a remedy but never names the cause, so Fund reads as an upsell rather than a repair. Naming the lapse is not a payment nag &mdash; it is the fact that makes the button make sense. &ldquo;Data&rdquo; stays out; the nouns are links and members. All three use &ldquo;run out&rdquo; over &ldquo;lapsed&rdquo; (plainer, less contractual) &mdash; a word we can swap either way afterwards.</p>
        {WB2DI_COPY.map((c) => (
          <div key={c.id} className="wb-deskwrap">
            <div className="wb-desklabel"><span className="wb-badge">{c.id}</span>{c.name}</div>
            <p className="wb2-wn" style={{ margin: '0 0 8px', maxWidth: '68ch' }}>{c.n}</p>
            <div className="wb-desk" style={{ '--circ-vh': '520px' }}>
              <Shell isMobile={false} Body={WbDi} bodyProps={{ row: true, copy: c }} />
            </div>
          </div>
        ))}
      </section>
    </React.Fragment>
  );
};

Object.assign(window, { WbDi, Wb2DiSection, WB2DI_COPY });
