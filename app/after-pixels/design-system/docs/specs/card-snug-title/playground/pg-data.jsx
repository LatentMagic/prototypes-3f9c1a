// Product data, copied from app/gs-data.jsx (covers, names, the eight Available games).
const GS_SVG = (body) => '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice">' + body + '</svg>';
const GS_ART = {
  delve: { ground: 'wine', extend: 'bottom', svg: GS_SVG('<rect width="160" height="120" fill="#421A28"/><rect x="50" y="40" width="60" height="80" fill="#A390B2"/><circle cx="80" cy="40" r="30" fill="#A390B2"/><rect x="64" y="52" width="32" height="68" fill="#1D1B3A"/><circle cx="80" cy="52" r="16" fill="#1D1B3A"/><rect x="64" y="88" width="32" height="8" fill="#E5A63B"/><rect x="68" y="100" width="24" height="8" fill="#E5A63B"/><rect x="72" y="112" width="16" height="8" fill="#E5A63B"/><rect x="22" y="62" width="6" height="30" fill="#F2EBE0"/><circle cx="25" cy="54" r="8" fill="#D66847"/><rect x="132" y="62" width="6" height="30" fill="#F2EBE0"/><circle cx="135" cy="54" r="8" fill="#D66847"/>') },
  escape: { ground: 'indigo', extend: 'bottom', svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><rect x="60" y="26" width="44" height="94" fill="#328A88"/><circle cx="94" cy="76" r="5" fill="#E5A63B"/><rect x="22" y="22" width="16" height="16" fill="#F2EBE0"/>') },
  murder: { ground: 'wine', extend: 'centre', svg: GS_SVG('<rect width="160" height="120" fill="#421A28"/><circle cx="72" cy="60" r="30" fill="none" stroke="#D66847" stroke-width="12"/><rect x="114" y="24" width="10" height="72" fill="#F2EBE0"/><rect x="114" y="24" width="10" height="20" fill="#E5A63B"/>') },
  // Daily Groups: four rows of four, one colour a group, as a solved board (added 2026-10-09, split-daily-puzzles).
  groups: { ground: 'indigo', extend: 'centre', svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/>' + ['#E5A63B', '#328A88', '#D66847', '#A390B2'].map((c, r) => [0, 1, 2, 3].map((k) => '<rect x="' + (31 + k * 26) + '" y="' + (11 + r * 26) + '" width="20" height="20" fill="' + c + '"/>').join('')).join('')) },
  word: { ground: 'forest', extend: 'centre', svg: GS_SVG('<rect width="160" height="120" fill="#163328"/><rect x="24" y="44" width="32" height="32" fill="#E5A63B"/><rect x="64" y="44" width="32" height="32" fill="#F2EBE0"/><rect x="106" y="46" width="28" height="28" fill="none" stroke="#328A88" stroke-width="4"/>') },
  derelict: { ground: 'indigo', extend: 'centre', svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><circle cx="100" cy="56" r="32" fill="none" stroke="#A390B2" stroke-width="10"/><rect x="28" y="74" width="20" height="20" fill="#D66847"/><circle cx="40" cy="30" r="4" fill="#F2EBE0"/>') },
  barrow: { ground: 'wine', extend: 'bottom', svg: GS_SVG('<rect width="160" height="120" fill="#421A28"/><path d="M12 120L52 52L92 120Z" fill="#E5A63B"/><path d="M68 120L108 64L148 120Z" fill="#F2EBE0"/><rect x="100" y="20" width="16" height="16" fill="#328A88"/>') },
  casebook: { ground: 'indigo', extend: 'bottom', svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><rect x="30" y="40" width="18" height="80" fill="#D66847"/><rect x="62" y="28" width="18" height="92" fill="#A390B2"/><rect x="94" y="46" width="18" height="74" fill="#F2EBE0"/><circle cx="128" cy="26" r="12" fill="#E5A63B"/>') },
  hunter: { ground: 'forest', extend: 'bottom', svg: GS_SVG('<rect width="160" height="120" fill="#163328"/><circle cx="52" cy="74" r="26" fill="#E5A63B"/><path d="M40 120L100 50L160 120Z" fill="#A390B2"/><rect x="18" y="104" width="14" height="14" fill="#328A88"/><rect x="128" y="20" width="10" height="10" fill="#F2EBE0"/>') },
};


const GS_NAME = { casebook: 'Casebook', hunter: '36,000 Summers Ago' };
const GS_GAMES = {
  word: { name: 'Daily Word', category: 'PUZZLE', art: 'word', route: 'word', ed: ['word', 'words'], free: true, daily: true, once: true, blurb: 'Six guesses to find today’s five-letter word.', tags: ['FREE', 'Daily', '10 min'] },
  groups: { name: 'Daily Groups', category: 'PUZZLE', art: 'groups', route: 'groups', ed: ['groups', 'groups'], edLink: 'See all groups', edAll: 'All groups', free: true, daily: true, once: true, blurb: 'Sixteen words hide four groups. Find all four.', tags: ['FREE', 'Daily', '10 min'] },
  mystery: { name: 'Daily Mystery', category: 'PUZZLE', art: 'murder', route: 'mystery', ed: ['case', 'cases'], free: true, daily: true, once: true, blurb: 'There’s a body and a story that doesn’t add up.', tags: ['FREE', 'Daily', '10 min'] },
  escape: { name: 'Escape', category: 'PUZZLE', art: 'escape', route: 'escape', ed: ['room', 'rooms'], free: true, blurb: 'The door’s locked and you’re on the wrong side of it.', tags: ['FREE', 'Weekly', '10 min'] },
  casebook: { name: GS_NAME.casebook, category: 'MYSTERY', art: 'casebook', route: 'casebook', ed: ['case', 'cases'], once: true, blurb: 'Ask the question they haven’t prepared for.', first: true, tags: ['FIRST', 'Weekly', '25–40 min'] },
  delve: { name: 'Delve', category: 'ADVENTURE', art: 'delve', route: 'delve', ed: ['scene', 'scenes'], first: true, blurb: 'Get her out before the drums stop.', tags: ['FIRST', 'Weekly', '25–40 min'] },
  // Added 2026-10-13 (owner asked for it as a new adventure game). Chapters are its editions; a free player gets chapter 1. Content is sample.
  barrow: { name: 'The Barrow of Hollowmere', category: 'ADVENTURE', art: 'barrow', route: 'barrow', ed: ['chapter', 'chapters'], eds: true, edLink: 'All chapters', edAll: 'All chapters', first: true, blurb: 'Something under the hill wants its gold back. Go down anyway.', tags: ['FIRST', '45–60 min'] },
  hunter: { name: GS_NAME.hunter, category: 'LEARNING', art: 'hunter', route: 'hunter', blurb: 'Grey dawn below Chauvet cave. Go where you like.', tags: ['PASS', '2 hours'] },
};
const GS_GAME_ORDER = ['word', 'groups', 'mystery', 'escape', 'casebook', 'delve', 'barrow', 'hunter'];
Object.assign(window,{GS_ART,GS_NAME,GS_GAMES,GS_GAME_ORDER});
