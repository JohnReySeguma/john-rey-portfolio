// The section registry: single source of truth for page order, anchor ids, nav
// labels and section heading copy. Array order IS page order.
// `eyebrow`/`title` are null for `about`: the hero owns the page's single <h1>.
const sections = [
  { id: "about", navLabel: "About", eyebrow: null, title: null },
  { id: "projects", navLabel: "Work", eyebrow: "Projects", title: "Selected Work" },
  { id: "skills", navLabel: "Skills", eyebrow: "Toolbox", title: "Tech Stack" },
  { id: "experience", navLabel: "Experience", eyebrow: "Career", title: "Experience" },
  {
    id: "achievements",
    navLabel: "Recognition",
    eyebrow: "Competitions & Research",
    title: "Tech Events & Awards",
  },
  { id: "education", navLabel: "Education", eyebrow: "Background", title: "Education" },
  { id: "contact", navLabel: "Contact", eyebrow: "Say hello", title: "Get in Touch" },
];

export default sections;
