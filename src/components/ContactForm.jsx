import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";
import socials from "../content/socials";
import { consoleRise, reveal, viewportConsole } from "../lib/motion";

const EMAIL = "thisisjohnrey@gmail.com";
const ALT_EMAIL = "johnreycseguma@gmail.com";
const PHONE = "+63 926 171 4623";
const LOCATION = "Isulan, Sultan Kudarat, Philippines";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LEAD =
  "Have a project, a role or a question? Send a note and it lands straight in my inbox.";

const EMPTY = { name: "", email: "", message: "" };

// There is no backend (architecture §1). A valid submit composes a mailto: URL
// and shows a neutral status line — it never claims the message was delivered.
const validate = (values) => {
  const next = {};
  if (!values.name.trim()) next.name = "Please enter your name.";
  if (!values.email.trim()) next.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(values.email.trim()))
    next.email = "Please enter a valid email address, for example name@example.com.";
  if (!values.message.trim()) next.message = "Please enter a message.";
  return next;
};

const ContactForm = () => {
  const reduced = useReducedMotion();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");

  const change = (field) => (event) => {
    const next = { ...values, [field]: event.target.value };
    setValues(next);
    if (submitted) setErrors(validate(next));
  };

  // Blur only re-validates after the first submit attempt, so a visitor is
  // never scolded for a field they have not finished filling in yet.
  const blur = () => {
    if (submitted) setErrors(validate(values));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      setStatus("");
      return;
    }

    const subject = encodeURIComponent(`Portfolio enquiry from ${values.name.trim()}`);
    const body = encodeURIComponent(`${values.message.trim()}\n\n— ${values.name.trim()}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setStatus("Your email app should now open with this message ready to send.");
  };

  const field = (name) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    onChange: change(name),
    onBlur: blur,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    className: `contact-form__input${errors[name] ? " is-invalid" : ""}`,
  });

  return (
    <motion.div
      className="contact"
      {...reveal(reduced, consoleRise, viewportConsole)}
    >
      <div className="contact__lead">
        <span className="contact__lead-mark" aria-hidden="true" />
        <p className="contact__lead-line">{LEAD}</p>
      </div>

      <form className="contact-form" onSubmit={onSubmit} noValidate>
        <div className="contact-form__field">
          <label htmlFor="contact-name">Name</label>
          <input type="text" autoComplete="name" {...field("name")} />
          {errors.name && (
            <p className="contact-form__error" id="contact-name-error" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-email">Email</label>
          <input type="email" autoComplete="email" {...field("email")} />
          {errors.email && (
            <p className="contact-form__error" id="contact-email-error" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-message">Message</label>
          <textarea rows={5} {...field("message")} />
          {errors.message && (
            <p className="contact-form__error" id="contact-message-error" role="alert">
              {errors.message}
            </p>
          )}
        </div>

        <button type="submit" className="contact-form__submit">
          Compose email
        </button>

        <p className="contact-form__status" role="status">
          {status}
        </p>
      </form>

      <div className="contact-channels">
        <h3 className="contact-channels__title">Direct channels</h3>

        <ul className="contact-channels__list">
          <li>
            <MdEmail className="contact-channels__icon" aria-hidden="true" />
            <span>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a className="contact-channels__alt" href={`mailto:${ALT_EMAIL}`}>
                {ALT_EMAIL}
              </a>
            </span>
          </li>
          <li>
            <FaPhoneAlt className="contact-channels__icon" aria-hidden="true" />
            <a href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a>
          </li>
          <li>
            <IoLocation className="contact-channels__icon" aria-hidden="true" />
            <span>{LOCATION}</span>
          </li>
        </ul>

        <ul className="contact-channels__socials">
          {socials.map((social) => (
            <li key={social.url}>
              <a
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
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default ContactForm;
