// filterTrophies — kind / grade / text search, plus the spoiler mask for hidden story trophies.
export function filterTrophies(trophies, { kind, grade, query }) {
  const q = (query || '').trim().toLowerCase();
  return trophies.filter((t) => {
    if (kind !== 'all' && !(t.kinds || []).includes(kind)) return false;
    if (grade !== 'all' && t.grade !== grade) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || (t.guide || '').toLowerCase().includes(q))) return false;
    return true;
  });
}

// spoilerMasked — true when the spoiler setting hides this trophy's name and description until earned.
export function spoilerMasked(trophy, spoilerOn, earned) {
  return spoilerOn && trophy.hidden && !earned.has(trophy.id);
}

// countProgress — earned/total overall, per grade and per kind.
export function countProgress(trophies, earned) {
  const byGrade = {};
  const byKind = {};
  for (const t of trophies) {
    byGrade[t.grade] = byGrade[t.grade] || { earned: 0, total: 0 };
    byGrade[t.grade].total += 1;
    if (earned.has(t.id)) byGrade[t.grade].earned += 1;
    for (const k of t.kinds || []) {
      byKind[k] = byKind[k] || { earned: 0, total: 0 };
      byKind[k].total += 1;
      if (earned.has(t.id)) byKind[k].earned += 1;
    }
  }
  return { total: trophies.length, earned: earned.size, byGrade, byKind };
}
