// ============================================================================
// LM-652 candidate — seed extension. Wraps window.CircSeed.seedSpaces (loaded
// before this file, before main.jsx) to lay discourse over the shipped seeds:
// thoughts, conversations, watching state, and two new own-cards so item 7's
// champion and non-champion lines are both reachable. The shipped seeds are
// extended, never replaced.
// ============================================================================
(() => {
  const base = window.CircSeed.seedSpaces;
  const { IT } = window.CircSeed;
  const H = 3600e3;

  window.CircSeed.seedSpaces = (email) => {
    const NOW = Date.now();
    const T = (id, by, hoursAgo, text, extra) => ({ id, by, text, at: NOW - hoursAgo * H, ...(extra || {}) });
    const spaces = base(email);
    const byUrl = {};
    spaces.forEach(sp => sp.items.forEach(it => { byUrl[it.url] = it; }));
    const set = (url, fields) => { const it = byUrl[url]; if (it) Object.assign(it, fields); };

    // ---- Backend Pod: thoughts on Active cards (the tucked-under band) ----
    // @fixture item-7-near-miss — YOUR card, first on Active, three replies from
    // other people and none of your own: the item-7 line is ABSENT here, and
    // appears the moment you reply. The pair to `@fixture item-7-sales-line`
    // below (go.dev/blog/pipelines), which meets both counts.
    set('https://newsletter.pragmaticengineer.com/p/scaling-on-call', {
      thought: { by: 'You', text: 'Their on-call comp table matches what we pay. The rotation sizing is where we differ.', at: NOW - 1 * H },
      watching: true, talkSeenAt: NOW - 4 * H,
      talk: [
        T('pe1', 'Marcus T.', 5, 'Their rotation is six deep and ours is four. That is the whole difference in how tired everyone is.'),
        T('pe2', 'Ada L.', 4, 'The handover checklist at the end is worth stealing wholesale.'),
        T('pe3', 'Priya N.', 1, 'Can we take the sizing question to Thursday? I would rather argue it with the numbers up.'),
      ],
    });
    set('https://blog.rust-lang.org/2026/01/async-internals', {
      thought: { by: 'Priya N.', text: 'Before Thursday\u2019s review, the three things I want us to agree on:\n- when a future is allowed to block\n- who owns the waker in our executor wrapper\n- whether we keep the custom runtime at all', at: NOW - 6 * H },
      talk: [
        T('ru1', 'Ada L.', 8, 'Answering the second bullet before Thursday: the wrapper owns it. I wrote the fix up in the doc.'),
      ],
    });
    set('https://martinfowler.com/articles/cd-pipeline.html', {
      thought: { by: 'Sam R.', text: 'Skip to the trunk-based section.', at: NOW - 11 * H },
    });
    // An Active card with a conversation already running behind the read —
    // mark it read to see the reveal carry the opening three.
    set('https://danluu.com/percentile-latency/', {
      talk: [
        T('dl1', 'Priya N.', 20, 'We alert on p99 and our dashboards draw means. This is the cleanest argument for burning that down I have read.'),
        T('dl2', 'Marcus T.', 18, 'The coordinated-omission section is the one to sit with. Our load tool lies to us exactly this way.'),
        T('dl3', 'Dev K.', 12, 'Bookmarking the histogram-merge trick.'),
      ],
    });

    // ---- Backend Pod: conversations on Read cards, watched, some fresh ----
    // YOUR card, first on Read, well talked about — the same item-7 line, met
    // from the tab you actually visit conversations from.
    // @fixture item-7-sales-line — the card that DEMONSTRATES the item-7 line.
    // Yours, with three replies from other people AND one of your own, which is
    // what the line now needs (CAND_OWN_MIN + CAND_OWN_MINE, ratified
    // 2026-08-18). Open it and the line sits at the foot of the surface.
    // Near-miss twin, deliberately kept: the Pragmatic Engineer card below —
    // three replies from others, none of yours, so the line is ABSENT until you
    // add one. Search this file for `@fixture` to find both.
    set('https://go.dev/blog/pipelines', {
      attribution: 'Added by you',
      watching: true, talkSeenAt: NOW - 20 * H,
      thought: { by: 'You', text: 'The fan-in section is the one to slow down for. It finally made our worker pool shutdown bug make sense.', at: NOW - 40 * H },
      talk: [
        T('gp1', 'Priya N.', 30, 'The done-channel pattern here is exactly what the ingest service is missing. We cancel by killing the process.'),
        T('gp2', 'Dev K.', 26, 'Same. I started a branch that threads a context through the pipeline stages \u2014 will link it when it holds up.'),
        // Your own reply — the second count the item-7 line needs. It lands
        // BEFORE Ada's, so the one turn carrying the unseen tab is one you could
        // not have read: a turn of your own beneath it would prove you had.
        T('gp4', 'You', 3, 'Both worth doing. I will take the shutdown path and thread a context through it this week.'),
        T('gp3', 'Ada L.', 2, 'Worth reading beside the errgroup docs. Half of this file is errgroup now, done better.'),
      ],
    });
    set('https://jvns.ca/blog/2026/02/dns-resolvers/', {
      watching: true, talkSeenAt: NOW - 10 * H,
      thought: { by: 'Priya N.', text: 'Sending this round before the resolver migration \u2014 the diagrams are the clearest I have seen.', at: NOW - 30 * H },
      talk: [
        // The deep group: six replies under one turn, so the collapse and the
        // tail control can be judged. Two of them landed after this card's mark,
        // in the held-back tail — so the group has to open on arrival.
        T('jv0', 'Marcus T.', 28, 'The stub-resolver section is the part I would have everyone read twice. Half our timeouts are the stub giving up, not the upstream.'),
        T('jv0a', 'Ada L.', 26, 'We set a two second timeout in the container image and then wonder why the first lookup of the morning fails.', { replyTo: 'jv0' }),
        T('jv0b', 'Dev K.', 24, 'That is the one. And the retry goes to the same broken resolver, in order, every time.', { replyTo: 'jv0' }),
        T('jv0c', 'Priya N.', 22, 'Migration plan should name the timeout and the attempts explicitly rather than inheriting whatever the base image ships.', { replyTo: 'jv0' }),
        T('jv0d', 'Lena P.', 20, 'Agreed. I will put the current values in the doc so we are arguing about real numbers.', { replyTo: 'jv0' }),
        T('jv0e', 'Sam R.', 6, 'Numbers are in. Two seconds, two attempts, and the search list is five entries long \u2014 that is ten lookups for one name.', { replyTo: 'jv0' }),
        T('jv0f', 'Ada L.', 4, 'Ten lookups explains the morning failures on its own. The search list is where I would start.', { replyTo: 'jv0' }),
        T('jv1', 'Lena P.', 5, 'The negative-caching part explains the ghost outage from March. TTL zero is not \u201cno caching\u201d everywhere.'),
      ],
    });
    // A third of yours, further down Read.
    // Three fresh speakers here against jvns.ca's three and go.dev's one: the
    // rows in the bar carry different numbers of voices, which is how they read
    // in life.
    set('https://go.dev/blog/errors-are-values', {
      attribution: 'Added by you',
      watching: true, talkSeenAt: NOW - 6 * H,
      talk: [
        T('ev1', 'Marcus T.', 2, 'We quote \u201cerrors are values\u201d a lot and still write if err != nil three times a function. The sentinel-error section is the part we actually need.'),
        T('ev2', 'Lena P.', 1, 'The wrapping section dates it a little, but the argument holds.'),
        T('ev3', 'Dev K.', 0.5, 'Took the sentinel list to the ingest service this morning. Two of ours are string comparisons.'),
      ],
    });
    // kernel.org stays bare on purpose — the empty conversation, compose only.

    // ---- New: your own card in Backend Pod (you champion it → item 7's
    // "another circle" line). Read, well-reacted, a real conversation. ----
    const acm = IT('https://queue.acm.org/detail.cfm?id=3712345', 'Added by you', true, [
      { name: 'Priya N.', glyph: '\uD83D\uDD25', intensity: 0.8 },
      { name: 'Marcus T.', glyph: '\uD83D\uDCA1', intensity: 0.5 },
      { name: 'Ada L.', glyph: '\uD83D\uDC4D', intensity: 0.6 },
      { name: 'Lena P.', glyph: '\u2764\uFE0F', intensity: 0.55 },
      { name: 'Sam R.', skipped: true },
    ], { title: 'Postmortems: Learning From Failure at Scale', source: 'ACM Queue', hasImage: false });
    acm.at = NOW - 9 * 24 * H;
    acm.watching = true;
    acm.talkSeenAt = NOW;
    acm.thought = { by: 'You', text: 'Sharing after our own incident review on Tuesday. The section on blameless language is where I want us to raise our bar.', at: NOW - 60 * H };
    acm.talk = [
      T('ac1', 'Priya N.', 50, 'The \u201csecond story\u201d framing is the whole thing. The first story always ends at a person; the second one ends at a system.'),
      // A long tail on one turn — the volume the collapse exists for.
      T('ac1a', 'Marcus T.', 49, 'That is the line I keep coming back to. Our reviews end at a person every time and we call it a root cause.', { replyTo: 'ac1' }),
      T('ac1b', 'Ada L.', 48, 'The second story needs someone to ask for it in the room, though. Nobody volunteers it.', { replyTo: 'ac1' }),
      T('ac1c', 'You', 47, 'That is the facilitator\u2019s job and we have never named who does it.', { replyTo: 'ac1', edited: true }),
      T('ac1d', 'Dev K.', 45, 'We tried rotating it. It works when the facilitator was not on call that week.', { replyTo: 'ac1' }),
      T('ac1e', 'Lena P.', 43, 'Rotating it also stops the same two people carrying every review.', { replyTo: 'ac1' }),
      T('ac2', 'Marcus T.', 46, 'I want the incident channel template rewritten around their four questions. Happy to draft it.'),
      T('ac3', 'You', 44, 'Please do \u2014 bring it to Thursday.', { replyTo: 'ac2' }),
      T('ac4', 'Ada L.', 40, 'The maths on recurrence rates is thin, but the practice holds. The appendix checklist alone is worth the read.', { edited: true }),
      T('ac5', 'Dev K.', 38, '', { deleted: true }),
      T('ac6', 'Lena P.', 36, 'Still true even with that gone: we never schedule the follow-ups we write down.', { replyTo: 'ac5' }),
    ];
    // ---- New: a Backend Pod card with NO metadata — the unfurl failed, so the
    // title everywhere is the URL itself (`candTitleOf` fallback). Watched, with
    // words landed after the mark, so it stands in the returns banner: the row
    // there has a URL where every other row has a title.
    // @fixture return-banner-url-fallback — no SEED_META entry, no meta arg.
    const bare = IT('https://docs.internal-infra-example.org/runbooks/ingest-backfill-2026-03', 'Ada L.', true, [
      { name: 'Marcus T.', glyph: '\uD83D\uDC4D', intensity: 0.5 },
    ]);
    bare.at = NOW - 3 * 24 * H;
    bare.watching = true;
    bare.talkSeenAt = NOW - 8 * H;
    bare.talk = [
      T('bk1', 'Ada L.', 26, 'Backfill steps are right but the ordering is not \u2014 the partition swap has to come before the replay, not after.'),
      T('bk2', 'Marcus T.', 5, 'Fixed the ordering and added the rollback step we needed at 3am last time.'),
      T('bk3', 'Priya N.', 2, 'Can we get a real title on this page while we are in there? It is untitled and impossible to find again.'),
    ];

    const pod = spaces.find(s => s.id === 'sp-backend');
    if (pod) pod.items.push(acm, bare);

    // ---- New: your own card in Tuesday Book Club (Joe M. champions it →
    // item 7's "a circle of your own" line). ----
    const mid = IT('https://www.newyorker.com/culture/the-weekend-essay/rereading-middlemarch', 'Added by you', true, [
      { name: 'Joe M.', glyph: '\u2764\uFE0F', intensity: 0.7 },
      { name: 'Priya N.', glyph: '\u2764\uFE0F', intensity: 0.5 },
      { name: 'Sam R.', glyph: '\uD83D\uDCA1', intensity: 0.45 },
    ], { title: 'Rereading Middlemarch in Middle Age', source: 'The New Yorker' });
    mid.at = NOW - 12 * 24 * H;
    mid.talkSeenAt = NOW;
    mid.thought = { by: 'You', text: 'Second time through and it is a different book. Sharing for the Dorothea chapter alone.', at: NOW - 90 * H };
    mid.talk = [
      T('bc1', 'Joe M.', 80, 'The marriage chapters landed harder at forty than they did at twenty. Casaubon stopped being a villain.'),
      // Exactly two replies: both show whole, no control appears.
      T('bc1a', 'Priya N.', 78, 'He is not a villain, he is a warning. That is worse.', { replyTo: 'bc1' }),
      T('bc1b', 'Sam R.', 76, 'Dorothea marries the idea of him. Eliot is very clear about that and I missed it entirely first time.', { replyTo: 'bc1' }),
      T('bc2', 'Priya N.', 70, 'Reading the essay before the book this time. It spoils nothing \u2014 Eliot tells you everything and it still surprises.'),
      T('bc3', 'Sam R.', 60, 'Adding the audiobook to my week. Juliet Stevenson\u2019s narration is the one.'),
      T('bc4', 'Joe M.', 30, 'Chapter 20 is the hinge. When we get there, slow down.'),
    ];
    const club = spaces.find(s => s.id === 'sp-book');
    if (club) club.items.push(mid);

    return spaces;
  };
})();
