// Leonida Platinum — GTA 6 Trophy Guide & Tracker (gta6-trophy-guide-01).
// Boot: loads the official trophy list, wires the tracker tabs, filters, spoiler
// setting and progress export/import, then renders the checklist with a guide open.
import { loadTrophies } from './data.js';
import { loadEarned, saveEarned, loadSpoiler, saveSpoiler, exportProgress, importProgressFile } from './store.js';
import { filterTrophies, countProgress } from './filters.js';
import { renderChecklist, renderDetail, renderRoadmap, renderMissables } from './views.js';

const $ = (id) => document.getElementById(id);
const tabs = ['tracker', 'roadmap', 'missables'];

function currentTab() {
  const hash = (location.hash || '#tracker').slice(1);
  return tabs.includes(hash) ? hash : 'tracker';
}

function showTab(tab) {
  for (const t of tabs) {
    $('view-' + t).hidden = t !== tab;
    $('tab-' + t).classList.toggle('active', t === tab);
  }
  $('onlineNote').hidden = true;
}

async function bootLeonidaPlatinumGuide() {
  const trophies = await loadTrophies();
  let earned = loadEarned();
  let spoilerOn = loadSpoiler();
  let selectedId = 17;

  const searchEl = $('search');
  const kindEl = $('kind');
  const gradeEl = $('grade');
  const spoilerEl = $('spoiler');
  spoilerEl.checked = spoilerOn;

  function visible() {
    return filterTrophies(trophies, { kind: kindEl.value, grade: gradeEl.value, query: searchEl.value });
  }

  function renderProgress() {
    const c = countProgress(trophies, earned);
    $('progressBig').textContent = c.earned + ' of ' + c.total + ' earned';
    $('progressBar').style.width = (c.total ? Math.round((100 * c.earned) / c.total) : 0) + '%';
    $('progressCounts').textContent = ['platinum', 'gold', 'silver', 'bronze'].map((g) => g + ' ' + c.byGrade[g].earned + '/' + c.byGrade[g].total).join(' · ');
    $('progressKinds').textContent = ['story', 'missable', 'collectibles', 'activities'].map((k) => k + ' ' + (c.byKind[k] ? c.byKind[k].earned + '/' + c.byKind[k].total : '0/0')).join(' · ');
  }

  function renderAll() {
    const list = visible();
    $('resultCount').textContent = list.length + ' of 55 trophies shown';
    $('onlineNote').hidden = kindEl.value !== 'online';
    renderChecklist($('rows'), list, earned, spoilerOn, selectedId,
      (id, checked) => {
        if (checked) earned.add(id); else earned.delete(id);
        saveEarned(earned);
        renderProgress();
        renderAll();
      },
      (id) => { selectedId = id; renderAll(); });
    const selected = trophies.find((t) => t.id === selectedId) || list[0];
    if (selected) selectedId = selected.id;
    renderDetail($('detail'), selected, earned, spoilerOn);
    renderProgress();
  }

  renderRoadmap($('roadmap'), trophies);
  renderMissables($('missables'), trophies);

  searchEl.addEventListener('input', renderAll);
  kindEl.addEventListener('change', renderAll);
  gradeEl.addEventListener('change', renderAll);
  spoilerEl.addEventListener('change', () => { spoilerOn = spoilerEl.checked; saveSpoiler(spoilerOn); renderAll(); });
  $('export').addEventListener('click', () => exportProgress(earned));
  $('import').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      earned = await importProgressFile(file);
      saveEarned(earned);
      renderAll();
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
    e.target.value = '';
  });
  window.addEventListener('hashchange', () => showTab(currentTab()));

  showTab(currentTab());
  renderAll();
  window.__shotReady = true;
}

bootLeonidaPlatinumGuide();
