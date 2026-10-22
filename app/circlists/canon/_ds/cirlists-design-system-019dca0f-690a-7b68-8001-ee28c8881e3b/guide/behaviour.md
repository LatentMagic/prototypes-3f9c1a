# Behaviour

## Status

Status is shown with an icon and a label on neutral ground, never a coloured fill. No toasts.

## Loading

Two indicators, each with its own job (ui.md Decision-13, Decision-53).

- The **brand spinner**, at three sizes, is the standalone one: centred in the element that is waiting, no copy.
- The **in-button ring** is a small plain ring before a button's label, from the press until the action comes back.
- The brand spinner never sits inside a button; the ring is what a button shows.
- No skeleton placeholders. An item that is still arriving may shimmer in place.

## The working state

Every action that changes state shows it is working. From the press until the result, the pressed control holds its working state: the ring before its label, focus kept, further presses ignored. Set Button's `loading`.

## Touch

44px for primary controls, 24px for dense secondary displays. Inline links are exempt: they are sized by their sentence.
