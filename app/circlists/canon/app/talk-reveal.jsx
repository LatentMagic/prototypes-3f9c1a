// ============================================================================
// LM-652 candidate — the reveal (item 5). Publishes window.CircSwellReveal,
// which SwellReactionFlow (additive hook) renders IN PLACE of its passive
// auto-fading reveal: static, held until dismissed, the flow's own x top right.
// Shows the circle's reactions (the shipped SwellReview, untouched) and hands
// over to the surface. It never renders the conversation itself.
// ============================================================================

const CandSwellReveal = ({ item, all, firstHere, onClose }) => {
  const go = () => { onClose(); const C = window.CircCandidate; if (C && C.goToCard) C.goToCard(item); };
  const talked = candTurns(item).filter(t => !t.deleted).length > 0 || !!item.thought;
  return (
    <div className="cand652-reveal">
      <SwellReview all={all} interactive={false} firstHere={firstHere} />
      <div style={{ marginTop: 18 }}>
        <Button variant="primary" full onClick={go}>
          {talked ? 'Go to the conversation' : 'Start the conversation'}
        </Button>
      </div>
    </div>
  );
};

// KEEP: about 32px between the disc and the roster under it in the reveal, and
// the disc in the same place as in the input step, so nothing jumps between
// steps. The shipped review's reserve plus the body gap read loose once the
// primary button sat under the roster. Candidate-scoped: app/swell-reactions.jsx stays.
if (typeof document !== 'undefined' && !document.getElementById('cand652-reveal-css')) {
  const s = document.createElement('style');
  s.id = 'cand652-reveal-css';
  s.textContent = '.cand652-reveal > h2 + div > div:nth-child(2){margin-top:-26px}';
  document.head.appendChild(s);
}

Object.assign(window, { CircSwellReveal: CandSwellReveal });
