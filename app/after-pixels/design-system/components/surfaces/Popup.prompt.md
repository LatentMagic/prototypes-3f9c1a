Popup is the focus-taking overlay with a dim. Pick its `kind` by its job: a `dialog` (default) stays a centred window at every width; only a `panel` becomes a bottom sheet under 640px. Short command lists use `Menu` instead.

```jsx
<Popup open={open} onClose={close} busy={deleting} title="Delete this save?"
  actions={<><Button variant="secondary" onClick={close}>Keep it</Button><Button variant="danger" loading={deleting} loadingLabel="Deleting" onClick={del}>Delete save</Button></>}>
  <p>Your progress in Daily Puzzles is removed.</p>
</Popup>

<Popup kind="panel" open={open} onClose={close} title="Earlier editions">{rows}</Popup>
```

- Ask in this order; the first that fits is the kind. Dialog: one question or one short edit, nothing behind it usable until answered (confirm, sign-in proof, rename). Menu: short list of commands from a control. Panel: anything else the user stays in and works with.
- A dialog's content never scrolls. If it would outgrow the space above the on-screen keyboard, make it a page or a panel, never a taller dialog.
- Same content, same order at every width.
- Confirm only serious, hard-to-undo actions, and name the consequence, never "Are you sure?".
- While the main action works, pass `busy` so the dim and Escape can't close it mid-way.
- Navigation destinations are pages, not pop-ups.
