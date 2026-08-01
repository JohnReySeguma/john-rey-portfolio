import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Missions" },
  { id: "skills", label: "Systems" },
  { id: "contact", label: "Transmit" },
];

const Navbar = ({ firstName, lastName }) => {
  const [active, setActive] = useState("about");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="hud-nav">
      <a href="#about" className="hud-nav__logo">
        {firstName}
        <span>{lastName}</span>
      </a>

      <button
        className="hud-nav__toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`hud-nav__menu ${open ? "is-open" : ""}`}>
        <ul>
          {SECTIONS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={active === id ? "is-active" : ""}
                onClick={() => setOpen(false)}
              >
                <span className="hud-nav__blip" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hud-nav__status">
        <span className="hud-nav__pulse" />
        ONLINE
      </div>
    </header>
  );
};

Navbar.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

export default Navbar;
