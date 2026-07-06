// ============================================================================
// LatentPulse — Tweaks. Accent token-swap (locked fallbacks) + layout posture.
// ============================================================================
const LP_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#047857",
  "layout": "auto",
  "swellCenterDot": true,
  "swellBreath": true,
  "swellSnap": true
}/*EDITMODE-END*/;

const LPTweaks = ({ tw, setTweak }) => (
  <TweaksPanel>
    <TweakSection label="Brand accent" />
    <TweakColor label="Accent" value={tw.accent}
      options={["#047857", "#0D9488", "#166534"]}
      onChange={(v) => setTweak('accent', v)} />
    <TweakSection label="Layout posture" />
    <TweakRadio label="Viewport" value={tw.layout}
      options={["auto", "desktop", "mobile"]}
      onChange={(v) => setTweak('layout', v)} />
    <TweakSection label="The Swell — refinements" />
    <TweakToggle label="Centre dot" value={tw.swellCenterDot}
      onChange={(v) => setTweak('swellCenterDot', v)} />
    <TweakToggle label="Breathing halo" value={tw.swellBreath}
      onChange={(v) => setTweak('swellBreath', v)} />
    <TweakToggle label="Magnetic snap (angle only)" value={tw.swellSnap}
      onChange={(v) => setTweak('swellSnap', v)} />
  </TweaksPanel>
);

Object.assign(window, { LP_TWEAK_DEFAULTS, LPTweaks });
