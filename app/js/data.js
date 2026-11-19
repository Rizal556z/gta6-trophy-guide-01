// loadTrophies — fetches the official trophy list from app/data/trophies.json (a file under app/, never the network).
export async function loadTrophies() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('Could not load data/trophies.json');
  const doc = await response.json();
  return doc.trophies;
}
