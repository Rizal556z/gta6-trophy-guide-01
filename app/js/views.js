// Views — renders the checklist with its detail pane, the roadmap stages and the missables list.
import { spoilerMasked } from './filters.js';

const ROADMAP_STAGES = [
  { stage: 1, title: 'Stage 1 — Story: opening to finale', text: 'Play the story in order: opening mission Gone Fishing, Chapters 1–4, then the final mission. Earn each chapter and mission trophy as you go — mission replayability is unconfirmed at launch.' },
  { stage: 2, title: 'Stage 2 — Story missions, contacts & strangers', text: 'The named story missions (Breakfast Run, The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown, Operation Savage Glory), the five contact strands (Andy, Kenton, Billy, Randy, Tyrone) and 8 stranger strands. Partner trophies Hot Together and Retail Therapy belong here too — they need your partner present.' },
  { stage: 3, title: 'Stage 3 — Collectibles', text: '3 card sets, WAiNK It at 100 locations, meditate at 18 spots, explore 52 areas, discover 100 vehicles, buy 8 garage properties, register 10 vehicles. None of these is missable — do them any time, including after the story.' },
  { stage: 4, title: 'Stage 4 — Activities & grinds', text: '250 stunts, 42 Shooting Range gold medals, 20 races, Top Fun drone races at every location, 50 challenges, and the one-off feats (fishing, arcade, hunting, vaults, showroom, bowling). Finish with 100% completion.' },
  { stage: 5, title: 'Stage 5 — Money & cleanup, then the platinum', text: 'Launder $250,000 of marked bills through your contacts, then spend $100,000 across all shops. Once every other trophy is earned, the platinum — Vice Got a Price! — pops.' },
];

const MISSABLE_REASONS = {
  story: 'Story-gated: earn it during that chapter or mission — mission replayability is unconfirmed at launch.',
  partner: 'Needs your partner present: earn it while partner missions and free-roam partner time are available.',
  choice: 'Choice or event: a decision or one-time moment that may not be undoable or repeatable.',
};

function missableReason(t) {
  if ([33, 34].includes(t.id)) return MISSABLE_REASONS.partner;
  if ([37, 38, 39, 44, 47, 48, 49, 50, 51].includes(t.id)) return MISSABLE_REASONS.choice;
  return MISSABLE_REASONS.story;
}

function badge(text, cls) {
  const s = document.createElement('span');
  s.className = 'badge ' + cls;
  s.textContent = text;
  return s;
}

function trophyBadges(t) {
  const wrap = document.createElement('span');
  wrap.className = 'badges';
  wrap.append(badge(t.grade, t.grade));
  if (t.count != null) wrap.append(badge('× ' + t.count.toLocaleString(), ''));
  if (t.missable) wrap.append(badge('Missable', 'missable'));
  if (t.hidden) wrap.append(badge('Hidden', 'hidden'));
  return wrap;
}

// renderChecklist — the tracker list; clicking a row opens its guide in the detail pane.
export function renderChecklist(listEl, trophies, earned, spoilerOn, selectedId, onToggle, onSelect) {
  listEl.replaceChildren();
  for (const t of trophies) {
    const li = document.createElement('li');
    if (earned.has(t.id)) li.classList.add('earned');
    if (t.id === selectedId) li.classList.add('selected');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', 'Earned: ' + t.name);
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => onToggle(t.id, box.checked));
    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'trophy-name';
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    if (spoilerMasked(t, spoilerOn, earned)) {
      name.textContent = 'Hidden trophy — earn it to reveal';
      desc.textContent = 'A hidden story trophy. Its name and description stay hidden until earned.';
    } else {
      name.textContent = t.name;
      desc.textContent = t.description;
    }
    body.append(name, desc, trophyBadges(t));
    li.append(box, body);
    li.addEventListener('click', () => onSelect(t.id));
    listEl.append(li);
  }
}

// renderDetail — the selected trophy's full guide and its sources, beside the checklist.
export function renderDetail(detailEl, trophy, earned, spoilerOn) {
  detailEl.replaceChildren();
  if (!trophy) {
    detailEl.textContent = 'Select a trophy to see its guide.';
    return;
  }
  const h = document.createElement('h2');
  const p = document.createElement('p');
  p.className = 'guide';
  const sources = document.createElement('div');
  sources.className = 'sources';
  if (spoilerMasked(trophy, spoilerOn, earned)) {
    h.textContent = 'Hidden trophy';
    p.textContent = 'This story trophy is hidden until earned. Turn the spoiler setting off, or earn it, to see its guide.';
  } else {
    h.textContent = trophy.name;
    p.textContent = trophy.guide;
    const label = document.createElement('strong');
    label.textContent = 'Sources: ';
    sources.append(label);
    (trophy.sources || []).forEach((s, i) => {
      if (i) sources.append(document.createTextNode(' · '));
      const a = document.createElement('a');
      a.href = s.url;
      a.textContent = s.name;
      sources.append(a);
    });
    const note = document.createElement('p');
    note.textContent = 'Guide in our own words, drawn from the official description. The game released 19 Nov 2026 and in-game details are not yet verified.';
    sources.append(note);
  }
  detailEl.append(h, trophyBadges(trophy), p, sources);
}

// renderRoadmap — the five stages of the road to the platinum.
export function renderRoadmap(el, trophies) {
  el.replaceChildren();
  for (const s of ROADMAP_STAGES) {
    const div = document.createElement('div');
    div.className = 'stage';
    const h = document.createElement('h3');
    h.textContent = s.title;
    const p = document.createElement('p');
    p.textContent = s.text;
    const chips = document.createElement('div');
    chips.className = 'chips';
    for (const t of trophies.filter((t) => t.roadmap_stage === s.stage)) {
      const c = document.createElement('span');
      c.className = 'chip';
      c.textContent = t.name + ' (' + t.grade + ')';
      chips.append(c);
    }
    div.append(h, p, chips);
    el.append(div);
  }
}

// renderMissables — every missable trophy with why it can be missed.
export function renderMissables(el, trophies) {
  el.replaceChildren();
  for (const t of trophies.filter((t) => t.missable)) {
    const div = document.createElement('div');
    div.className = 'missable-item';
    const name = document.createElement('strong');
    name.textContent = t.name + ' — ' + t.description;
    const why = document.createElement('p');
    why.className = 'why';
    why.textContent = 'Why it can be missed: ' + missableReason(t);
    div.append(name, trophyBadges(t), why);
    el.append(div);
  }
}
