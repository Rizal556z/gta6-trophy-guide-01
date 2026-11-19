# Leonida Platinum — GTA 6 Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Rizal556z/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Rizal556z/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze), built for the make.fun gta6-trophy-guide-01 bounty.

## What it does

- **Tracker** — a checklist of all 55 trophies with the official name, description and grade for each. Progress is saved in localStorage and can be exported to a JSON file and imported back. Filters by kind (story, missable, collectibles, activities, online — the official list holds no online trophies, so that filter plainly shows 0 results) and by grade, plus text search. A spoiler setting hides the names and descriptions of hidden story trophies until they are earned. Progress counters (earned/total, per grade, per kind) and a progress bar sit at the top, and a detail pane shows the full guide and sources for the selected trophy.
- **Roadmap** — five stages to the platinum, built from the official descriptions: story first (opening mission Gone Fishing, Chapters 1–4, final mission), then story missions and contact/stranger strands, then collectibles with their counts, then activities and grinds, then money and cleanup before the platinum pops.
- **Missables** — a dedicated tab listing all 28 missable trophies with why each can be missed. Story-chapter and story-mission trophies are story-gated (mission replayability is unconfirmed at launch), as are partner, choice and event trophies. Collectibles and count-based activities are NOT missable — the guide says so explicitly.
- **Cited guidance** — every trophy's guide is in our own words (2–4 sentences: what to do, where, and when it can be missed) and cites its sources beside it: the official list on Exophase and PSNProfiles for the name, description, grade and count, plus the honest line that the game released 19 Nov 2026 and in-game details are not yet verified wherever the guide goes beyond the description. No specific location or step is invented — where the official description does not pin a place down, the guide says so plainly.

## How to run it

```sh
node serve.ts
```

Then open http://localhost:8080. The app is static files under `app/` with no build step and no network requests at runtime.

## Originality

Guides are written in our own words for this entry; official trophy names, descriptions and grades are shown as PlayStation publishes them. No Rockstar logo, wordmark, official artwork, character or font is used — the look is our own (system font stack only).

## How to hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT
