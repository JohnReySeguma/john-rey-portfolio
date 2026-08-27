// Tech-stack tiles. `file` is the exact case-sensitive filename in public/skills/,
// `label` is the display string (also used as the img alt text).
// `category` must be one of `categories` below; `categories` is also the tab order.
// React Native has no dedicated mark in public/skills/ — it ships the React atom
// as its official logo, so it correctly reuses `react.svg`. Because `file` is
// therefore no longer unique, components key tiles by `label`.
export const categories = [
  "Frontend",
  "Mobile",
  "Languages & Backend",
  "Data",
  "Cloud & DevOps",
  "Tooling",
];

const skills = [
  { file: "react.svg", label: "React", category: "Frontend" },
  { file: "nextjs.png", label: "Next.js", category: "Frontend" },
  { file: "angular.png", label: "Angular", category: "Frontend" },
  { file: "js.svg", label: "JavaScript", category: "Frontend" },
  { file: "html.svg", label: "HTML5", category: "Frontend" },
  { file: "css.svg", label: "CSS3", category: "Frontend" },
  { file: "tailwind.svg", label: "Tailwind CSS", category: "Frontend" },
  { file: "bootstrap.svg", label: "Bootstrap", category: "Frontend" },
  { file: "flutter.png", label: "Flutter", category: "Mobile" },
  { file: "react.svg", label: "React Native", category: "Mobile" },
  { file: "capacitor.svg", label: "Capacitor", category: "Mobile" },
  { file: "java.svg", label: "Java", category: "Languages & Backend" },
  { file: "c++.png", label: "C++", category: "Languages & Backend" },
  { file: "php.png", label: "PHP", category: "Languages & Backend" },
  { file: "nodejs.svg", label: "Node.js", category: "Languages & Backend" },
  { file: "laravel.png", label: "Laravel", category: "Languages & Backend" },
  { file: "django.svg", label: "Django", category: "Languages & Backend" },
  { file: "mysql.png", label: "MySQL", category: "Data" },
  { file: "postgre.png", label: "PostgreSQL", category: "Data" },
  { file: "mongodb.svg", label: "MongoDB", category: "Data" },
  { file: "firebase.png", label: "Firebase", category: "Data" },
  { file: "aws.svg", label: "AWS", category: "Cloud & DevOps" },
  { file: "docker.png", label: "Docker", category: "Cloud & DevOps" },
  { file: "xampp.svg", label: "XAMPP", category: "Cloud & DevOps" },
  { file: "git.svg", label: "Git", category: "Tooling" },
  { file: "github.svg", label: "GitHub", category: "Tooling" },
  { file: "gitlab.png", label: "GitLab", category: "Tooling" },
];

export default skills;
