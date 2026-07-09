// ============================================================================
// Circlists — Tweaks. Accent token-swap (locked fallbacks) + layout posture.
// ============================================================================
const CIRC_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#047857",
  "layout": "auto"
}/*EDITMODE-END*/;

const CircTweaks = ({ tw, setTweak }) => (
  <TweaksPanel>
    <TweakSection label="Brand accent" />
    <TweakColor label="Accent" value={tw.accent}
      options={["#047857", "#0D9488", "#166534"]}
      onChange={(v) => setTweak('accent', v)} />
    <TweakSection label="Layout posture" />
    <TweakRadio label="Viewport" value={tw.layout}
      options={["auto", "desktop", "mobile"]}
      onChange={(v) => setTweak('layout', v)} />
  </TweaksPanel>
);

Object.assign(window, { CIRC_TWEAK_DEFAULTS, CircTweaks });
