// ============================================================================
// C1 playground — the store, the levers, the option table, and the seed.
//
// THE MECHANIC IS NOT THE QUESTION. The page mounts the real candidate, and the
// thought opens exactly as the candidate opens it: the link card slips behind to
// a sliver, the thought card comes forward. That is settled and nothing here
// changes it.
//
// What varies is what the reader finds when it has come forward:
//   the FACE  — what the alternate card carries over from the link card, and how
//               the thought is set so it reads as somebody's words.
//   the MARK  — what says, at rest, that there is more of the thought held back,
//               and what brings the link card back.
// ============================================================================
const PGC1F_KEY = 'pg_c1f_v1';
const pgc1fSaved = (() => { try { return JSON.parse(localStorage.getItem(PGC1F_KEY) || 'null') || {}; } catch (e) { return {}; } })();

const PGC1F = {
  face: pgc1fSaved.face || 'f1',
  mark: pgc1fSaved.mark || 'lines',
  type: pgc1fSaved.type || 's1',
  len: pgc1fSaved.len || 'mixed',
  subs: new Set(),
  set(patch) {
    Object.assign(this, patch);
    try { localStorage.setItem(PGC1F_KEY, JSON.stringify({ face: this.face, mark: this.mark, len: this.len, type: this.type })); } catch (e) {}
    this.subs.forEach(f => f());
  },
  sub(f) { this.subs.add(f); return () => this.subs.delete(f); },
};
const usePGC1F = () => {
  const [, bump] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => PGC1F.sub(bump), []);
  return PGC1F;
};

// ---- The five faces --------------------------------------------------------
// Each is a complete answer to both halves: what comes over from the link card,
// and how the thought is set. Number, name, direction, cost.
const PGC1F_FACES = [
  { id: 'f1', n: '1', name: 'Bare',
    dir: 'Nothing comes over but the title. The thought is the body of the card, set as running prose, signed at the foot with avatar, name and time.',
    cost: 'The face is a stripped card. Nothing but the title says which card you are on, and a long title is the only anchor you get.' },
  { id: 'f2', n: '2', name: 'Source line',
    dir: 'The link\u2019s identity comes over in words: favicon and source sit under the title, in the card\u2019s own vocabulary, then the thought.',
    cost: 'Two attributions on one face \u2014 who added the link and who wrote the thought \u2014 and they are usually the same person.' },
  { id: 'f3', n: '3', name: 'Thumbnail kept',
    dir: 'The card\u2019s preview image stays exactly where it is, beside the title at the same size, so the object is unmistakably the same card. The thought runs full width beneath it.',
    cost: 'The picture pulls the eye on the one face whose whole subject is the words.' },
  { id: 'f4', n: '4', name: 'Said',
    dir: 'The thought is set as speech: the contributor stands in a left gutter with the words in a column beside them \u2014 the setting a turn gets on the conversation surface.',
    cost: 'It makes the thought look like the first turn of the talk, which is the one thing it is not. Below 420px the gutter has to collapse.' },
  { id: 'f5', n: '5', name: 'Inset',
    dir: 'The face stays the WHITE card \u2014 title, source, thumbnail, actions, all in place \u2014 and it is the thought that takes the paper, set apart inside it as a passage to be read.',
    cost: 'A block inside a card inside a shelf. This is the treatment judged bad on the surface, brought back properly scoped \u2014 it may still be too many boxes.' },
];
const pgc1fFace = () => PGC1F_FACES.find(o => o.id === PGC1F.face) || PGC1F_FACES[0];

// ---- The mark --------------------------------------------------------------
// At rest the band shows one line. Something has to say there is more, without a
// count and without borrowing a glyph that means something else on this screen.
const PGC1F_MARKS = [
  { id: 'chevron', label: 'Chevron', note: 'What the build carried before Lines. It is also the return banner\u2019s glyph, where it opens a list downward \u2014 two mechanics, one mark, on one screen.' },
  { id: 'lines', label: 'Lines', note: 'What the build now carries. Lines of text, one to three, standing for roughly how much is held back. A tell, not a direction \u2014 which is why the close can be an X without breaking a promise.' },
  { id: 'edge', label: 'Second edge', note: 'No glyph at all: a second sliver of paper behind the band. The shelf says there is more paper here, in the depth language the mechanic already uses.' },
  { id: 'word', label: 'Word', note: 'A small mono MORE at the right end. Unambiguous, and it cannot be confused with any other control.' },
  { id: 'none', label: 'None', note: 'The band is the control and nothing marks it. Tests whether the mark is needed at all \u2014 and whether a band you cannot open reads differently from one you can.' },
];
const pgc1fMark = () => PGC1F_MARKS.find(o => o.id === PGC1F.mark) || PGC1F_MARKS[0];

// ---- The length lever ------------------------------------------------------
const PGC1F_PARA = 'Worth twenty minutes before Thursday. It is the first write-up I have found that treats rotation sizing as a staffing problem rather than a tooling one, and the section on handovers is close to what we already do badly.';
const PGC1F_TEXT = {
  one: 'Skip to the trunk-based section.',
  para: PGC1F_PARA,
  bullets: PGC1F_PARA + '\nThe three things I want us to settle:\n- how deep the rotation goes\n- who owns the handover checklist\n- whether we keep the secondary at all',
};
const PGC1F_LENGTHS = [
  { id: 'mixed', label: 'Mixed' }, { id: 'one', label: 'One line' },
  { id: 'para', label: 'Paragraph' }, { id: 'bullets', label: 'Paragraph + bullets' },
];

const pgc1fBy = (t) => (/^you$/i.test(t.by) ? 'You' : t.by);
const pgc1fHost = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
const pgc1fSource = (item) => item.source || pgc1fHost(item.url);

// ---- Seed ------------------------------------------------------------------
// Wraps the candidate's own seed. Guarantees the shelf the question needs: Active
// cards at four lengths of thought, with cards carrying none among them, and one
// thought a single word longer than the band can hold.
(() => {
  const base = window.CircSeed.seedSpaces;
  window.CircSeed.seedSpaces = (email) => {
    const spaces = base(email);
    const NOW = Date.now();
    const byUrl = {};
    spaces.forEach(sp => sp.items.forEach(it => { byUrl[it.url] = it; }));
    const set = (url, fields) => { const it = byUrl[url]; if (it) Object.assign(it, fields); };
    set('https://arxiv.org/abs/2503.04918', {
      thought: { by: 'Ada L.', text: 'The result is narrower than the abstract makes it sound, but the method section is genuinely useful and I think it settles the argument we had in March.', at: NOW - 5 * 3600e3 },
    });
    set('https://www.youtube.com/watch?v=Kx7Bvksk_qg', {
      thought: { by: 'Marcus T.', text: 'Old talk, still the clearest hour anyone has spent on this, and the questions at the end are worth staying for.', at: NOW - 26 * 3600e3 },
    });
    return spaces;
  };
})();

Object.assign(window, { PGC1F, usePGC1F, PGC1F_FACES, pgc1fFace, PGC1F_MARKS, pgc1fMark,
  PGC1F_LENGTHS, PGC1F_TEXT, pgc1fBy, pgc1fHost, pgc1fSource });
