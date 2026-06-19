import FlockEmbed from "../components/FlockEmbed";
import SpiderMeshEmbed from "../components/SpiderMeshEmbed";
import SyncEmbed from "../components/SyncEmbed";
import SatoshiEmbed from "../components/SatoshiEmbed";
import SaveButtonEmbed from "../components/SaveButtonEmbed";
import VectorEmbed from "../components/VectorEmbed";
import ClothEmbed from "../components/ClothEmbed";
import LogoCarouselEmbed from "../components/LogoCarouselEmbed";
import MatrixLoaderEmbed from "../components/MatrixLoaderEmbed";
import AgenticPixelEmbed from "../components/AgenticPixelEmbed";
import TactileEmbed from "../components/TactileEmbed";

// Modal content fields per project:
//   brand      -> title shown in the modal head
//   project    -> the "PROJECT" value
//   summary    -> the "SUMMARY" paragraph (leave "" to hide the section)
//   tools      -> [{ name, icon }] (omit to hide the section)
//   previewUrl  -> the modal's "Preview" button (opens the live app in a new tab)
//   inspiration -> optional "Inspired by …" link shown in the footer (omit to hide)
//   inspirationUrl -> where that link points
//   category    -> footer tag
// `open` is kept for the ellipsis aria-label; `previewUrl` drives the modal button.
const CATEGORY = "Playground / Experiments";

const PLAYGROUND_ITEMS = [
  {
    kind: "component",
    Component: FlockEmbed,
    sound: true,
    open: { href: "https://mattjss.github.io/flock/", label: "Open Flock" },
    brand: "State Machine",
    brandIcon: "/icons/state-machine.svg",
    project: "Flock",
    summary: "Herd a flock of birds into a target ring and earn a high score. Your cursor scares them.",
    tools: [{ name: "Claude Code", icon: "/icons/claude.svg" }],
    previewUrl: "https://mattjss.github.io/flock/",
    category: CATEGORY,
  },
  {
    kind: "component",
    Component: SpiderMeshEmbed,
    sound: true,
    open: { href: "https://mattjss.github.io/Spider-Mesh/", label: "Open Spider Mesh" },
    brand: "State Machine",
    brandIcon: "/icons/state-machine.svg",
    project: "Spider Mesh",
    summary:
      "Move around and the nearest dots stretch toward you, forming a web of legs around your cursor. Left click and a ripple travels outward through the whole grid, displacing everything in its path. Right click to swap colors.",
    tools: [{ name: "Cursor", icon: "/preview-icon/Cursor.svg" }],
    previewUrl: "https://mattjss.github.io/Spider-Mesh/",
    category: CATEGORY,
  },
  {
    kind: "component",
    Component: AgenticPixelEmbed,
    open: { href: "https://mattjss.github.io/Agentic-Animations-2/", label: "Open Agentic Loaders" },
    brand: "State Machine",
    brandIcon: "/icons/state-machine.svg",
    project: "Agentic Pixel Loaders",
    summary:
      "A growing library of loading state animations built for agentic UI. Prototyping motion patterns for AI-driven interfaces.",
    tools: [
      { name: "Figma", icon: "/icons/figma.svg" },
      { name: "Cursor", icon: "/preview-icon/Cursor.svg" },
    ],
    inspiration: "Inspired by Kevin Grajeda",
    inspirationUrl: "https://x.com/k_grajeda/status/2008640405886382541/video/1",   // ← add Kevin Grajeda's link here
    previewUrl: "https://mattjss.github.io/Agentic-Animations-2/",
    category: CATEGORY,
  },
  {
    kind: "component",
    Component: SyncEmbed,
    sound: true,
    open: { href: "https://mattjss.github.io/Sync/", label: "Open Sync" },
    brand: "Sync",
    project: "Sync",
    brandIcon: "/icons/state-machine.svg",
    summary: "Interaction design for an AI calendar sync interface. Exploration for communicating background AI activity clearly.",
    tools: [{ name: "Claude Code", icon: "/icons/claude.svg" }],
    inspiration: "Inspired by David Hill",
    inspirationUrl: "https://x.com/iamdavidhill/status/1991865714823565517?s=12",   // ← add Kevin Grajeda's link here
    previewUrl: "https://mattjss.github.io/Sync/",
    category: CATEGORY,
  },
  {
    kind: "component",
    Component: SatoshiEmbed,
    sound: true,
    open: { href: "https://mattjss.github.io/satoshi/", label: "Open Satoshi" },
    brand: "State Machine",
    brandIcon: "/icons/state-machine.svg",
    project: "Satoshi",
    summary: "Live BTC price chart with a cinematic 12h draw-in, mood-reactive green/red colors, scrub crosshair, and a rotating crypto meme to match the day.",
    tools: [
      { name: "Figma", icon: "/icons/figma.svg" },
      { name: "Claude Code", icon: "/icons/claude.svg" },
    ],
    previewUrl: "https://mattjss.github.io/satoshi/",
    category: CATEGORY,
  },
  {
    kind: "component",
    Component: SaveButtonEmbed,
    sound: true,
    open: { href: "https://mattjss.github.io/Save-Button/", label: "Open Save Button" },
    brand: "State Machine",
    brandIcon: "/icons/state-white.svg",
    project: "Save",
    summary: "A save button with layered micro-interaction states.",
    tools: [
      { name: "Figma", icon: "/icons/figma.svg" },
      { name: "Cursor", icon: "/preview-icon/Cursor.svg" },
    ],
    previewUrl: "https://mattjss.github.io/Save-Button/",
    category: CATEGORY,
  },
  {
    kind: "component",
    Component: VectorEmbed,
    sound: true,
    open: { href: "https://mattjss.github.io/Vector/", label: "Open Vector" },
    brand: "State Machine",
    brandIcon: "/icons/state-white.svg",
    project: "Vector",
    summary: "A 16×16 grid of bars that rotate in unison to face your cursor like compass needles. Click fires a rotational shockwave that ripples across the field.",
    tools: [
      { name: "Claude Code", icon: "/icons/claude.svg" },
    ],
    previewUrl: "https://mattjss.github.io/Vector/",
    category: CATEGORY,
  },
  {
    kind: "component",
    Component: MatrixLoaderEmbed,
    sound: true,
    open: { href: "https://mattjss.github.io/Matrix-Loader/", label: "Open Matrix Loader" },
    brand: "State Machine",
    brandIcon: "/icons/state-white.svg",
    project: "Matrix Loader",
    summary: "An interaction design exploration.",
    tools: [
      { name: "Claude Code", icon: "/icons/claude.svg" },
      { name: "v0", icon: "/icons/vo-logo.svg" },
    ],
    previewUrl: "https://mattjss.github.io/Matrix-Loader/",
    category: CATEGORY,
  },
  {
    kind: "component",
    Component: ClothEmbed,
    sound: true,
    open: { href: "https://mattjss.github.io/cloth/", label: "Open Cloth" },
    brandIcon: "/icons/state-machine.svg",
    brand: "State Machine",
    project: "Fabric",
    summary: "Moving your cursor across the surface makes the threads under the most stress glow brighter as tension builds. Click to send a pulse wave and watch it ripple back into place.",
    previewUrl: "https://mattjss.github.io/cloth/",
     tools: [{ name: "Claude Code", icon: "/icons/claude.svg" }],
    category: CATEGORY,
  },
  {
    kind: "component",
    Component: TactileEmbed,
    sound: false,
    brand: "State Machine",
    brandIcon: "/icons/state-white.svg",
    project: "Tactile",
    summary: "A daily UI exploration recreating tactile buttons with realistic light and depth.",
    previewUrl: "",
    tools: [
      { name: "Figma", icon: "/icons/figma.svg" },
    ],
    category: CATEGORY,
    className: "pg-tactile",
  },
  {
    kind: "component",
    Component: LogoCarouselEmbed,
    sound: false,
    open: { href: "https://mattjss.github.io/Logo-Carousel/", label: "Open Logo Carousel" },
    brand: "State Machine",
    brandIcon: "/icons/state-white.svg",
    project: "Logo Carousel",
    summary: "A seamlessly looping logo carousel with edge fades.",
    tools: [
      { name: "Figma", icon: "/icons/figma.svg" },
      { name: "Cursor", icon: "/preview-icon/Cursor.svg" },
    ],
     inspiration: "Inspired by Rauno Freiberg",
    inspirationUrl: "https://rauno.me/craft/logo-carousel",   // ← add Kevin Grajeda's link here
    previewUrl: "https://mattjss.github.io/Logo-Carousel/",
    category: CATEGORY,
  },
];

export default PLAYGROUND_ITEMS;