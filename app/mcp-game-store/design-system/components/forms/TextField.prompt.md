TextField is the labelled 48px input with an inline error; SearchField is the same input with a leading search glyph.

```jsx
<TextField label="Email" type="email" placeholder="you@example.com"/>
<TextField label="Email" value={v} error="Enter an email with an @ in it."/>
<SearchField placeholder="Find a game"/>
```

- Errors appear in place, never in a banner. Show them only after the first submit.
- Text is 16px. Don't shrink it.
