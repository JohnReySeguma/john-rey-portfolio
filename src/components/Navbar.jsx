import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { IoClose, IoMenu } from "react-icons/io5";
import sections from "../content/sections";

const Navbar = ({ firstName, lastName }) => {
  const [active, setActive] = useState("about");
  const [open, setOpen] = useState(false);
  const visible = useRef(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.current.add(entry.target.id);
          else visible.current.delete(entry.target.id);
        });

        // Deterministic: the first section in registry order that is currently
        // intersecting wins, so exactly one entry is ever highlighted.
        const current = sections.find(({ id }) => visible.current.has(id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className={`site-nav${open ? " is-open" : ""}`}>
      <div className="site-nav__inner">
        <a href="#about" className="site-nav__logo" onClick={() => setOpen(false)}>
          {firstName} <span>{lastName}</span>
        </a>

        <button
          type="button"
          className="site-nav__toggle"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="site-nav-menu"
        >
          {open ? <IoClose aria-hidden="true" /> : <IoMenu aria-hidden="true" />}
        </button>

        <nav id="site-nav-menu" className="site-nav__menu">
          <ul>
            {sections.map(({ id, navLabel }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`site-nav__link${active === id ? " is-active" : ""}`}
                  aria-current={active === id ? "true" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {navLabel}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

export default Navbar;
