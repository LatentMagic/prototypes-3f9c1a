# Architecture

## Conventions

- **Comments carry intent and mapping, and flag the special; nothing else.**
  - Intent: a rule or decision the code keeps, with its reason.
  - Mapping: a short label that helps a reader find their way around a file, or says where a part sits in the product.
  - The special: behaviour a rebuild from screenshots of the usual states would get wrong (adaptive styling, overlap or overflow handling, a value chosen against the default). Mark it `// KEEP:` and state the outcome the product must keep, in plain words with any numbers that matter, then one clause of why. Never the algorithm. These marks are written for another agent: the one that integrates this prototype into the product reads `KEEP:` as "preserve this", so it never needs speccing in a ticket. Change that behaviour and you update or remove its `KEEP:` in the same edit.
  - No narration. A comment that restates what the code plainly does is deleted.
