// ============================================================================
// Kit — Tweaks. Accent token-swap + layout posture.
//
// "accent" starts empty: the product's tokens.css decides the accent until a
// tweak picks one. The panel needs app/tweaks-panel.jsx; without it this file
// still supplies the defaults and publishes no panel.
// ============================================================================
const KIT_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "",
  "layout": "auto",
  "configBtn": true
}/*EDITMODE-END*/;

const KitTweaks = ({ tw, setTweak }) => (
  <TweaksPanel>
    <TweakSection label="Accent" />
    <TweakColor label="Accent" value={tw.accent}
      options={["#2563EB", "#475569", "#7C3AED"]}
      onChange={(v) => setTweak('accent', v)} />
    <TweakSection label="Prototype aids" />
    <TweakToggle label="Config button" value={tw.configBtn !== false}
      onChange={(v) => setTweak('configBtn', v)} />
    <TweakSection label="Layout posture" />
    <TweakRadio label="Viewport" value={tw.layout}
      options={["auto", "desktop", "mobile"]}
      onChange={(v) => setTweak('layout', v)} />
  </TweaksPanel>
);

Object.assign(window, { KIT_TWEAK_DEFAULTS, KitTweaks: window.TweaksPanel ? KitTweaks : null });
