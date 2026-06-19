// data/archivesEmbeds.js
// Dedicated copy for the Archives page so it stays independent of the Playground.
// Same ellipsis + PreviewModal behaviour as Playground cards.
// Card 1 = Agentic Loaders   Card 2 = Spider Mesh
import SpiderMeshEmbed from "../components/SpiderMeshEmbed";
import AgenticPixelEmbed from "../components/AgenticPixelEmbed";

const CATEGORY = "Playground / Experiments";

const ARCHIVES_EMBEDS = [
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
    inspirationUrl: "https://x.com/k_grajeda/status/2008640405886382541/video/1",
    previewUrl: "https://mattjss.github.io/Agentic-Animations-2/",
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
];

export default ARCHIVES_EMBEDS;