# Apexware — Game Library

A minimalistic, GitHub Pages–ready **Obsidian Frosted Glass** game library linking live browser builds and GitHub repositories, with reserved **76×76 squircle icon slots** for every game.

## Features

- **Steam-Style Library Controls**: Instant search, genre & Favorites (`★`, saved in `localStorage`) filtering, sorting (`Featured`, `A–Z`, `Favorites First`), and click-to-inspect game detail modal.
- **Icon-Ready Grid**: Every game card reserves a `76×76` squircle icon slot that automatically displays custom artwork once added, or falls back to a clean monogram slot.
- **GitHub Pages Ready**: Zero build step, relative `./` paths, and `.nojekyll` included.

## Adding Game Icons (Next Update)

1. Drop square icon files (e.g. `apex-group-b-rally.png`, `formula-manager.png`) into `assets/icons/`.
2. Set `icon: "./assets/icons/<filename>"` on each entry in `games.js`.
