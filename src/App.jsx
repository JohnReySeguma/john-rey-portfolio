import "./App.css";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Heading from "./components/Heading";
import ProjectCard from "./components/ProjectCard";
import Skill from "./components/Skill";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Starfield from "./components/Starfield";
import FlightPath from "./components/FlightPath";
import information from "./content/information";
import projects from "./content/projects";
import skills from "./content/skills";

const gridContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function App() {
  return (
    <>
      <Starfield />
      <FlightPath />

      <Navbar
        firstName={information.userData.firstName}
        lastName={information.userData.lastName}
      />

      <Hero
        img={information.userData.img}
        description={information.userData.description}
        title={information.userData.title}
      />

      <section id="projects" className="station">
        <Heading eyebrow="mission log" firstWord="My" secondWord="Projects" />
        <div className="mission-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.name}
              index={index}
              name={project.name}
              img={project.img}
              description={project.description}
              stack={project.stack}
              source={project.sourceCode}
              preview={project.preview}
            />
          ))}
        </div>
      </section>

      <section id="skills" className="station">
        <Heading eyebrow="cargo hold" firstWord="Skills" secondWord="&Tools" />
        <motion.div
          className="module-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={gridContainer}
        >
          {skills.map((skill, index) => (
            <Skill key={index} skill={skill} />
          ))}
        </motion.div>
      </section>

      <section id="contact" className="station">
        <Heading eyebrow="ground control" firstWord="Contact" secondWord="Me" />
        <ContactForm />
      </section>

      <Footer />
    </>
  );
}

export default App;
