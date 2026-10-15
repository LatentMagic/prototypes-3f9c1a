Menu is a short list of commands opened from a control. It opens at that control at every width and closes when a command runs.

```jsx
<Menu label="Save options" align="end" trigger={<Button variant="secondary" icon="settings">Options</Button>}
  items={[{label:'Start again',onSelect:restart},{label:'Delete save',danger:true,onSelect:()=>setConfirm(true)}]}/>
```

- Commands only. A list that can grow or scroll, or anything the user works inside, is a panel (`Popup kind="panel"`).
- A command that needs a question answered opens a dialog (`Popup`), as "Delete save" does above.
- Labels name the action, sentence case.
