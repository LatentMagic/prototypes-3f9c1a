// ============================================================================
// Notifications (GSA-028). A droppable module: main.jsx, Home and Account read
// every export off `window`, and a missing file renders nothing.
//
//   GsaPushAsk             the turn-on ask, top of Home
//   GsaNotificationsCard   the Notifications card on Account
//   GsaPushHost            the pictured device permission prompt, the arriving
//                          notification, and the turn-on wait
//   gsaPushMoveOn / gsaPushSend / gsaPushLoseRegistration   Config and stager verbs
//
// Two fields, never one: `push.on` is what the person chose for this device,
// `push.perm` is what the device allows. Notifications are on only when both are.
// Everything is read from and written to GsaStore.
// ============================================================================
const GSA_PUSH_DAY = 86400000;
const GSA_PUSH_SNOOZE = [3, 7, 30];
const GSA_PUSH_HOST = 'gsa.example';
const GSA_PUSH_LABELS = { 'event-one': 'Slot: event one', 'event-two': 'Slot: event two' };

const gsaPushWait = (n) => (n ? GSA_PUSH_SNOOZE[Math.min(n, GSA_PUSH_SNOOZE.length) - 1] : 0);
const gsaPushStore = () => window.GsaStore;
const gsaPushSet = (patch) => gsaPushStore().set({ push: patch });

// The ask: signed in, on the web, a device that can get them, undecided, never
// raised, and not waiting out a snooze.
function gsaPushAskDue(g, now = Date.now()) {
  const p = g.push;
  return g.session === 'signed-in' && !g.isApp && !!p && p.channel === 'ok' && p.perm === 'default' && !p.asked
    && (!p.snoozes || now >= (p.snoozeAt || 0) + gsaPushWait(p.snoozes) * GSA_PUSH_DAY);
}

// A press that would turn notifications on. The device asks only here, and only
// when it has not decided (BF-02: an earlier snooze does not stop it). Config's
// Prompt answer decides what the device does: 'none' leaves the answer to the
// pictured prompt; Grant and Refuse answer at once; Close ends the request with no answer.
function gsaPushTurnOn() {
  const g = gsaPushStore().get();
  const p = g.push;
  if (p.perm === 'default') {
    const answer = g.review.promptAnswer;
    if (answer === 'grant') gsaPushSet({ asked: true, perm: 'granted', turning: true, failed: false });
    else if (answer === 'refuse') gsaPushSet({ asked: true, perm: 'denied', on: false, failed: false });
    else if (answer === 'close') gsaPushSet({ asked: true, failed: false });
    else if (answer === 'none') gsaPushSet({ asked: true, on: false, failed: false });
    else gsaPushSet({ asked: true, prompt: true, failed: false });
    return;
  }
  gsaPushSet({ turning: true, failed: false });
}

// ---- The arriving notification: a one-way channel from gsaPushSend to the host
const gsaPushArrivals = new Set();
function gsaPushSend() {
  const g = gsaPushStore().get();
  const p = g.push;
  if (g.review.deletedElsewhere || g.session !== 'signed-in' || g.isApp) return;
  if (!(p.on && p.perm === 'granted' && p.channel === 'ok')) return;
  if (!p.registered) return;
  const event = window.GSA_EVENTS.find((k) => p.events[k]);
  if (!event) return;
  gsaPushArrivals.forEach((fn) => fn({ id: Date.now(), event }));
}

function gsaPushLoseRegistration() {
  gsaPushSet({ registered: false });
}

// Move on to the next snooze: pull the snooze back by the wait it is serving.
function gsaPushMoveOn() {
  const p = gsaPushStore().get().push;
  if (!p.snoozes || p.asked || p.perm !== 'default') return;
  gsaPushSet({ snoozeAt: (p.snoozeAt || Date.now()) - gsaPushWait(p.snoozes) * GSA_PUSH_DAY });
}

const gsaPushFocusPage = () => setTimeout(() => {
  const h = document.querySelector('main h1, h1');
  if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
}, 0);

// ---- The on/off control --------------------------------------------------------
function GsaPushSwitch({ on, busy, onChange, labelledBy }) {
  return (
    <span className="gsa-push-switch-slot">
      {busy ? <span className="gsa-spin" aria-hidden="true" /> : null}
      <button
        type="button"
        role="switch"
        className="gsa-push-switch"
        aria-checked={!!on}
        aria-labelledby={labelledBy}
        aria-busy={busy || undefined}
        onClick={() => { if (!busy) onChange(!on); }}
      >
        <span className="gsa-push-switch-track" aria-hidden="true"><span className="gsa-push-switch-thumb" /></span>
      </button>
    </span>
  );
}

// ---- The ask --------------------------------------------------------------------
function GsaPushAsk() {
  const g = window.useGsa();
  if (!gsaPushAskDue(g)) return null;
  const snooze = () => {
    gsaPushSet({ snoozes: Math.min((g.push.snoozes || 0) + 1, 3), snoozeAt: Date.now() });
    gsaPushFocusPage();
  };
  return (
    <div className="gsa-push-ask-wrap"><section className="gsa-push-ask" aria-label="Notifications">
      <p className="gsa-push-ask-text">Get a notification on this device when something happens. You choose what in Account.</p>
      <div className="gsa-push-ask-actions">
        <window.GsaButton onClick={gsaPushTurnOn}>Turn on notifications</window.GsaButton>
        <window.GsaButton kind="secondary" onClick={snooze}>Not now</window.GsaButton>
      </div>
    </section></div>
  );
}

// ---- The card -------------------------------------------------------------------
function GsaNotificationsCard() {
  const g = window.useGsa();
  const p = g.push;
  // EF-01: the line stays until the person tries again or leaves the page.
  React.useEffect(() => () => {
    const live = window.GsaStore.get().push;
    if (live && live.failed) window.GsaStore.set({ push: { failed: false } });
  }, []);
  if (g.isApp || !p || p.channel === 'none') return null;
  const Card = window.GsaCard;
  const statement = p.channel === 'ios-tab'
    ? 'To get notifications, add this app to the home screen of your device first.'
    : p.perm === 'denied' ? 'Notifications are blocked for this app. Allow them in your device settings.' : null;
  if (statement) {
    return <Card title="Notifications"><p className="gsa-push-line">{statement}</p></Card>;
  }
  const allOn = p.perm === 'granted' && p.on;
  const waiting = !!(p.prompt || p.turning);
  const flip = (v) => {
    if (!v) { gsaPushSet({ on: false, failed: false }); return; }
    gsaPushTurnOn();
  };
  return (
    <Card title="Notifications">
      <div className="gsa-push-row">
        <span id="gsa-push-device" className="gsa-push-label">Notifications on this device</span>
        <GsaPushSwitch on={allOn} busy={waiting} onChange={flip} labelledBy="gsa-push-device" />
      </div>
      <p className="gsa-push-hint">This switch covers this device only.{waiting ? ' Waiting for your device to answer.' : ''}</p>
      {p.failed ? <div className="gsa-push-failed"><window.GsaStatusLine tone="danger">Notifications did not turn on. Try again.</window.GsaStatusLine></div> : null}
    </Card>
  );
}

// ---- The device's own prompt, the wait, and the arriving notification ------------
function GsaPushHost() {
  const g = window.useGsa();
  const p = g.push || {};
  const [arrived, setArrived] = React.useState(null);
  const allow = React.useRef(null);
  const opener = React.useRef(null);
  const answerRef = React.useRef(null);

  React.useEffect(() => {
    const on = (n) => setArrived(n);
    gsaPushArrivals.add(on);
    return () => { gsaPushArrivals.delete(on); };
  }, []);

  // The turn-on wait ends in the held outcome: it works, or it does not.
  React.useEffect(() => {
    if (!p.turning) return undefined;
    const t = setTimeout(() => {
      const live = window.GsaStore.get();
      gsaPushSet(live.review.pushFail ? { turning: false, on: false, failed: true } : { turning: false, on: true, registered: true });
    }, 900);
    return () => clearTimeout(t);
  }, [p.turning]);

  // A device that lost its registration registers again on the next screen
  // change, while it grants permission and the switch is on (EF-02).
  React.useEffect(() => {
    if (p.on && p.perm === 'granted' && p.channel === 'ok' && !p.registered && g.session === 'signed-in') gsaPushSet({ registered: true });
  }, [g.route]);

  answerRef.current = (v) => {
    if (v === true) gsaPushSet({ prompt: false, perm: 'granted', turning: true });
    else if (v === false) gsaPushSet({ prompt: false, perm: 'denied', on: false });
    else gsaPushSet({ prompt: false });
    const back = opener.current;
    setTimeout(() => {
      if (back && back !== document.body && document.contains(back)) back.focus({ preventScroll: true });
      else gsaPushFocusPage();
    }, 60);
  };

  React.useEffect(() => {
    if (!p.prompt) return undefined;
    opener.current = document.activeElement;
    const t = setTimeout(() => allow.current && allow.current.focus({ preventScroll: true }), 40);
    const onKey = (e) => { if (e.key === 'Escape') answerRef.current(null); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); };
  }, [p.prompt]);

  if (g.isApp) return null;
  return (
    <React.Fragment>
      {p.prompt ? (
        <div className="gsa-push-os" role="dialog" aria-modal="false" aria-label={GSA_PUSH_HOST + ' wants to show notifications'}>
          <div className="gsa-push-os-head">
            <span>{GSA_PUSH_HOST} wants to</span>
            <button type="button" className="gsa-push-os-x" aria-label="Close" onClick={() => answerRef.current(null)}>{'×'}</button>
          </div>
          <p className="gsa-push-os-what">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2Z" /></svg>
            Show notifications
          </p>
          <div className="gsa-push-os-acts">
            <button type="button" onClick={() => answerRef.current(false)}>Block</button>
            <button type="button" ref={allow} className="is-main" onClick={() => answerRef.current(true)}>Allow</button>
          </div>
        </div>
      ) : null}
      {arrived ? (
        <div className="gsa-push-note" role="status" key={arrived.id}>
          <div className="gsa-push-note-head">
            <span>{window.GSA_APP_NAME}</span>
            <button type="button" className="gsa-push-os-x" aria-label="Dismiss notification" onClick={() => setArrived(null)}>{'×'}</button>
          </div>
          <p className="gsa-push-note-body">{GSA_PUSH_LABELS[arrived.event]}</p>
        </div>
      ) : null}
    </React.Fragment>
  );
}

Object.assign(window, { GsaPushAsk, GsaNotificationsCard, GsaPushHost, gsaPushMoveOn, gsaPushSend, gsaPushLoseRegistration });
