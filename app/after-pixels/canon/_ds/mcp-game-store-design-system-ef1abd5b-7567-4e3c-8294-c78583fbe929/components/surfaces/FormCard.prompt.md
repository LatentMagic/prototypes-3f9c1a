FormCard is the card that holds a form on screens that have no cover (sign in, settings, connect); the corner shape block brings in cover colour.

```jsx
<FormCard title="Sign in">
  <TextField label="Email" type="email" placeholder="you@example.com"/>
  <ButtonPair><Button variant="secondary">Sign in</Button><Button>Sign up</Button></ButtonPair>
  <TextLink>Why sign in?</TextLink>
</FormCard>
```

- Max width in the hand-off is 420px.
