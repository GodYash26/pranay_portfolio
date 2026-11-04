export type Section = {
  label: [string, string]; tag: string;
  c: string; k: string; acc: string; // face colour, dark shade, accent on the dark wall
  kicker: string; h: [string, string, string];
  p?: string; list?: [string, string][]; chips?: string[]; cta?: { text: string; href: string };
};

// TODO: replace the email, stats and project list with Debbie's real details.
export const SECTIONS: Section[] = [
  { label: ["PORT", "FOLIO"], tag: "DEBBIE", c: "#e5322d", k: "#a91f1b", acc: "#ff6b63", kicker: "01 / HELLO", h: ["Hi, I'm ", "Debbie", "."],
    p: "A vibe coder with a curious mind, building playful digital experiences. Every container in the pile holds a piece of my work." },
  { label: ["THE", "WORK"], tag: "02", c: "#f26a1f", k: "#b84a10", acc: "#ff9455", kicker: "02 / SELECTED WORK", h: ["The ", "work", "."],
    list: [["Zenwood Keyboard", "a portfolio you click like a keyboard"], ["Retro Portfolio Machine", "a yellow computer that types my story"], ["Portfolio Console", "a graphite case with terminal keys"]] },
  { label: ["ABOUT", "ME"], tag: "03", c: "#1d55d8", k: "#123a9c", acc: "#7aa5ff", kicker: "03 / ABOUT ME", h: ["A little about ", "me", "."],
    p: "I design with AI as a creative partner: Figma, Claude and a lot of heart. 50 apps built and trusted by 30 brands along the way." },
  { label: ["PRO", "CESS"], tag: "04", c: "#f6b919", k: "#c08a0a", acc: "#ffd23f", kicker: "04 / PROCESS", h: ["How I ", "build", "."],
    list: [["01 Talk", "we start with a conversation"], ["02 Sketch", "shape the idea together"], ["03 Build & launch", "ship it, then keep improving"]] },
  { label: ["TOOL", "KIT"], tag: "05", c: "#97a1ad", k: "#6c7682", acc: "#c9d2dc", kicker: "05 / TOOLKIT", h: ["What's in the ", "box", "."],
    chips: ["Figma", "Claude", "React", "CSS", "Motion", "Prototyping"] },
  { label: ["WHAT", "I DO"], tag: "06", c: "#e5322d", k: "#a91f1b", acc: "#ff6b63", kicker: "06 / WHAT I DO", h: ["What I ", "do", "."],
    chips: ["Interaction design", "Motion design", "Prototyping", "UI / UX design"] },
  { label: ["SAY", "HELLO"], tag: "07", c: "#2546b8", k: "#172f80", acc: "#8fa8ff", kicker: "07 / SAY HELLO", h: ["Got an ", "idea", "?"],
    p: "Have a project in mind, a half-formed idea, or just want to say hi?", cta: { text: "hello@debbie.example ↗", href: "mailto:hello@debbie.example" } },
];

// [desktop x,y] [phone x,y] as fractions of the stage; tilt = rotateX, rotateY, rotateZ
export const PILE: { d: [number, number]; m: [number, number]; t: [number, number, number] }[] = [
  { d: [.48, .66], m: [.50, .64], t: [-14, -24, 6] },
  { d: [.13, .86], m: [.17, .91], t: [-16, 28, 16] },
  { d: [.36, .90], m: [.50, .93], t: [-12, -20, -10] },
  { d: [.60, .88], m: [.84, .90], t: [-14, 24, 12] },
  { d: [.86, .86], m: [.20, .77], t: [-16, -30, -14] },
  { d: [.25, .68], m: [.52, .79], t: [-14, 30, -12] },
  { d: [.73, .68], m: [.82, .76], t: [-14, -26, 16] },
];

// TODO: swap the seeds for real screenshots (put files in /public and use "/name.jpg").
export const WORKS = [
  { title: "Zenwood Keyboard", note: "A portfolio you click like a keyboard", year: "2026", tags: ["React", "Motion"], img: "https://picsum.photos/seed/zenwood/900/700" },
  { title: "Retro Portfolio Machine", note: "A yellow computer that types my story", year: "2026", tags: ["Interaction", "CSS"], img: "https://picsum.photos/seed/retro-machine/900/700" },
  { title: "Portfolio Console", note: "A graphite case with terminal keys", year: "2025", tags: ["UI / UX", "Prototyping"], img: "https://picsum.photos/seed/console-case/900/700" },
  { title: "Harbor Weather", note: "Tide and wind, drawn as postcards", year: "2025", tags: ["Figma", "React"], img: "https://picsum.photos/seed/harbor/900/700" },
  { title: "Pocket Studio", note: "A tiny mobile app for mood boards", year: "2025", tags: ["Mobile", "Claude"], img: "https://picsum.photos/seed/pocket-studio/900/700" },
  { title: "Orbit Notes", note: "Notes that drift toward what matters", year: "2024", tags: ["Motion", "UI / UX"], img: "https://picsum.photos/seed/orbit-notes/900/700" },
  { title: "Graphic Design", note: "Notes that drift toward what matters", year: "2024", tags: ["Motion", "UI / UX"], img: "https://picsum.photos/seed/orbit-notes/900/700" },  
  { title: "UI UX Design", note: "Notes that drift toward what matters", year: "2024", tags: ["Motion", "UI / UX"], img: "https://picsum.photos/seed/orbit-notes/900/700" },  
];
