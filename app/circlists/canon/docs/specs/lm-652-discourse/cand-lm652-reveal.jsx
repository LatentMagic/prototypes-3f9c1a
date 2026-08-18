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
    <div>
      <SwellReview all={all} interactive={false} firstHere={firstHere} />
      <div style={{ marginTop: 18 }}>
        <Button variant="primary" full onClick={go}>
          {talked ? 'Go to the conversation' : 'Start the conversation'}
        </Button>
      </div>
    </div>
  );
};

Object.assign(window, { CircSwellReveal: CandSwellReveal });
