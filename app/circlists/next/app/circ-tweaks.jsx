// ============================================================================
// Circlists — Tweaks. Accent token-swap (locked fallbacks) + layout posture.
// ============================================================================
const CIRC_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#047857",
  "layout": "auto",
  "pulseDepth": 7.5,
  "spinSpeed": 1.4
}/*EDITMODE-END*/;

const CircTweaks = ({ tw, setTweak }) => (
  <TweaksPanel>
    <TweakSection label="Brand accent" />
    <TweakColor label="Accent" value={tw.accent}
      options={["#047857", "#0D9488", "#166534"]}
      onChange={(v) => setTweak('accent', v)} />
    <TweakSection label="Brand motion" />
    <TweakSlider label="Pulse depth" value={tw.pulseDepth} min={4} max={14} step={0.5} unit="%"
      onChange={(v) => setTweak('pulseDepth', v)} />
    <TweakSlider label="Spin speed" value={tw.spinSpeed} min={0.8} max={2.5} step={0.1} unit="×"
      onChange={(v) => setTweak('spinSpeed', v)} />
    <TweakSection label="Layout posture" />
    <TweakRadio label="Viewport" value={tw.layout}
      options={["auto", "desktop", "mobile"]}
      onChange={(v) => setTweak('layout', v)} />
  </TweaksPanel>
);

Object.assign(window, { CIRC_TWEAK_DEFAULTS, CircTweaks });
