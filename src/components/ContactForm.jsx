import { motion } from "framer-motion";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";
import socials from "../content/socials";

const ContactForm = () => {
  return (
    <motion.div
      className="console"
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="console__lead">
        <p className="console__prompt">&gt; awaiting your transmission_</p>
        <h3>Let&apos;s build something that isn&apos;t plain.</h3>
        <a href="mailto:johnreycseguma@gmail.com" className="console__cta">
          Open channel <MdEmail />
        </a>
      </div>

      <div className="console__grid">
        <div className="console__row">
          <MdEmail className="console__icon" />
          <div>
            <p>thisisjohnrey@gmail.com</p>
            <p className="console__dim">johnreycseguma@gmail.com</p>
          </div>
        </div>
        <div className="console__row">
          <FaPhoneAlt className="console__icon" />
          <p>+63 926 171 4623</p>
        </div>
        <div className="console__row">
          <IoLocation className="console__icon" />
          <p>Isulan, Sultan Kudarat, Philippines</p>
        </div>
      </div>

      <div className="console__channels">
        <span className="console__dim">other frequencies</span>
        <div className="console__channels-row">
          {socials.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.icon.replace(".svg", "")}
            >
              <img
                src={`${import.meta.env.BASE_URL}socials/${social.icon}`}
                alt={social.icon.replace(".svg", "")}
              />
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ContactForm;
