Popup is the focus-taking overlay with a dim. Pick its `kind` by its job: a `dialog` (default) stays a centred window at every width; only a `panel` becomes a bottom sheet under 640px. Short command lists use `Menu` instead.

```jsx
<Popup open={open} onClose={close} busy={deleting} title="Delete this save?"
  actions={<><Button variant="secondary" onClick={close}>Keep it</Button><Button variant="danger" loading={deleting} loadingLabel="Deleting" onClick={del}>Delete save</Button></>}>
  <p>Your progress in Daily Puzzles is removed.</p>
</Popup>

<Popup kind="panel" open={open} onClose={close} title="Earlier editions">{rows}</Popup>
```

- While the main action works, pass `busy` so the dim and Escape can't close it mid-way.
- Navigation destinations are pages, not pop-ups.
