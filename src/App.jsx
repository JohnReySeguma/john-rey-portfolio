import "./App.css";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Heading from "./components/Heading";
import ProjectFeature from "./components/ProjectFeature";
import SkillsBoard from "./components/SkillsBoard";
import ExperienceEntry from "./components/ExperienceEntry";
import AwardsWall from "./components/AwardsWall";
import EducationCard from "./components/EducationCard";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import information from "./content/information";
import sections from "./content/sections";
import projects from "./content/projects";
import skills, { categories } from "./content/skills";
import experience from "./content/experience";
import achievements from "./content/achievements";
import education from "./content/education";
import { reveal, staggerContainer } from "./lib/motion";
import useHashScroll from "./lib/useHashScroll";

// Section copy lives in content/sections.js; the JSX order below must match that
// array's order, which is the page order.
const byId = (id) => sections.find((s) => s.id === id);

// Decorative section counter: the hero carries no numeral, so the six titled
// sections are numbered 01..06 in registry order. Derived, never hand-written.
const titled = sections.filter((s) => s.title);
const numeral = (id) =>
  String(titled.findIndex((s) => s.id === id) + 1).padStart(2, "0");

function App() {
  const reduced = useReducedMotion();
  useHashScroll();

  return (
    <MotionConfig reducedMotion="user">
      <Navbar
        firstName={information.userData.firstName}
        lastName={information.userData.lastName}
      />

      <Hero
        img={information.userData.img}
        firstName={information.userData.firstName}
        lastName={information.userData.lastName}
      />

      <section id="projects" className="section section--work">
        <Heading
          eyebrow={byId("projects").eyebrow}
          title={byId("projects").title}
          index={numeral("projects")}
        />

        <div className="project-features">
          {projects.map((project, index) => (
            <ProjectFeature
              key={project.id}
              index={index}
              name={project.name}
              img={project.img}
              imgWidth={project.imgWidth}
              imgHeight={project.imgHeight}
              description={project.description}
              stack={project.stack}
              source={project.sourceCode}
            />
          ))}
        </div>
      </section>

      <section id="skills" className="section section--skills">
        <Heading
          eyebrow={byId("skills").eyebrow}
          title={byId("skills").title}
          index={numeral("skills")}
        />
        <SkillsBoard skills={skills} categories={categories} />
      </section>

      <section id="experience" className="section section--experience">
        <Heading
          eyebrow={byId("experience").eyebrow}
          title={byId("experience").title}
          index={numeral("experience")}
        />
        <motion.ul className="timeline" {...reveal(reduced, staggerContainer)}>
          {experience.map((role) => (
            <ExperienceEntry
              key={role.id}
              company={role.company}
              title={role.title}
              type={role.type}
              start={role.start}
              end={role.end}
              current={role.current}
              highlights={role.highlights}
            />
          ))}
        </motion.ul>
      </section>

      <section id="achievements" className="section section--recognition">
        <Heading
          eyebrow={byId("achievements").eyebrow}
          title={byId("achievements").title}
          index={numeral("achievements")}
        />
        <AwardsWall achievements={achievements} />
      </section>

      <section id="education" className="section section--education">
        <Heading
          eyebrow={byId("education").eyebrow}
          title={byId("education").title}
          index={numeral("education")}
        />
        <motion.ul className="edu-grid" {...reveal(reduced, staggerContainer)}>
          {education.map((entry) => (
            <EducationCard
              key={entry.id}
              institution={entry.institution}
              program={entry.program}
              start={entry.start}
              end={entry.end}
            />
          ))}
        </motion.ul>
      </section>

      <section id="contact" className="section section--contact">
        <Heading
          eyebrow={byId("contact").eyebrow}
          title={byId("contact").title}
          index={numeral("contact")}
          align="center"
        />
        <ContactForm />
      </section>

      <Footer />
    </MotionConfig>
  );
}

export default App;
