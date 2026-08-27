// Neutral closing line. No external link is asserted here — the verified
// profiles live in content/socials.js and are rendered by Hero and Contact.
const Footer = () => {
  return (
    <footer className="site-footer">
      <span className="site-footer__rule" aria-hidden="true" />

      <div className="site-footer__inner">
        <span className="site-footer__mark" aria-hidden="true">
          JS
        </span>
        <p className="site-footer__line">
          © {new Date().getFullYear()} John Rey Seguma
        </p>
        <a className="site-footer__top" href="#about">
          Back to top
        </a>
      </div>
    </footer>
  );
};

export default Footer;
