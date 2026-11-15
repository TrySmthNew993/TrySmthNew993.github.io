/**
 * Apexware — Game Catalog Manifest
 * ---------------------------------
 * Add new GitHub-hosted games here.
 *
 * Next Update (Adding Game Icons):
 * 1. Place icon files inside ./assets/icons/ (e.g. rally.png, formula-manager.png, or .svg/.webp)
 * 2. Set `icon: "./assets/icons/<filename>"` on each game entry below.
 * 3. Any missing or null `icon` automatically renders the Obsidian Frosted Icon Slot placeholder.
 */

window.APEXWARE_CONFIG = {
  brand: "Apexware",
  githubProfile: "https://github.com/TrySmthNew993",
  showSlotHints: true
};

window.APEXWARE_GAMES = [
  {
    id: "apex-group-b-rally",
    title: "Apex Group B Rally",
    subtitle: "1986 WRC Rally Simulator",
    description:
      "First-person 3D WebGL rally simulator with an animated co-pilot, 10 physical terrain surfaces, 4 iconic Group B machines, and 8 international stages.",
    category: "racing",
    status: "LIVE",
    icon: "./assets/icons/rally.jpeg",
    iconSlot: {
      code: "01",
      monogram: "BR",
      accent: "#f43f5e",
      hint: "ICON SLOT"
    },
    pageUrl: "https://trysmthnew993.github.io/apex-group-b-rally/",
    repoUrl: "https://github.com/TrySmthNew993/apex-group-b-rally",
    secondaryLink: {
      label: "Mobile Edition",
      url: "https://trysmthnew993.github.io/apex-group-b-rally/mobile.html"
    },
    tags: ["Three.js", "WebGL", "Cockpit POV", "PC & Mobile"]
  },
  {
    id: "formula-manager",
    title: "Formula Manager",
    subtitle: "2026–2027 Team Principal Sim",
    description:
      "Zero-dependency Grand Prix management simulator featuring active-aero R&D, 3-phase qualifying, live 2D race telemetry, driver contracts, and a Paddock Editor.",
    category: "simulation",
    status: "LIVE",
    icon: "./assets/icons/formula-manager.jpeg",
    iconSlot: {
      code: "02",
      monogram: "FM",
      accent: "#38bdf8",
      hint: "ICON SLOT"
    },
    pageUrl: "https://trysmthnew993.github.io/formula-manager/",
    repoUrl: "https://github.com/TrySmthNew993/formula-manager",
    secondaryLink: null,
    tags: ["Strategy", "Live Telemetry", "60+ Drivers", "Single-File"]
  },
  {
    id: "rookie-chess",
    title: "Rookie Chess",
    subtitle: "Multiplayer WebRTC Chess",
    description:
      "Online and local multiplayer chess with timers, clean board animations, and zero-server peer-to-peer WebRTC networking designed for browser play.",
    category: "strategy",
    status: "LIVE",
    icon: "./assets/icons/chess.jpeg",
    iconSlot: {
      code: "03",
      monogram: "RC",
      accent: "#a855f7",
      hint: "ICON SLOT"
    },
    pageUrl: "https://trysmthnew993.github.io/chess-online/",
    repoUrl: "https://github.com/TrySmthNew993/chess-online",
    secondaryLink: null,
    tags: ["Chess", "WebRTC P2P", "Multiplayer", "Timers"]
  }
];
