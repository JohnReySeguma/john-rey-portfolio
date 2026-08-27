import PropTypes from "prop-types";
import { FaFacebook } from "react-icons/fa";

// ADR-0011 / architecture §15.5. Three parts, in DOM order: the poster (always
// present), the plugin iframe (only when video.embed === true, with a
// percent-encoded href), and the always-visible link to the post. There is no
// runtime detection: a cross-origin iframe emits no usable failure signal, so
// `embed` is a content flag set from observation in the running app.
const FacebookEmbed = ({ video, posterAlt }) => {
  const src = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
    video.url
  )}&show_text=false&width=560`;

  return (
    <div className={`fb-embed${video.embed ? " fb-embed--live" : ""}`}>
      <div className="fb-embed__frame">
        <img
          className="fb-embed__poster"
          src={`${import.meta.env.BASE_URL}awards/${video.poster}`}
          alt={posterAlt}
        />

        {video.embed && (
          <iframe
            className="fb-embed__iframe"
            src={src}
            title={video.label}
            loading="lazy"
            allowFullScreen
            frameBorder="0"
            scrolling="no"
          />
        )}
      </div>

      <a
        className="fb-embed__link"
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaFacebook aria-hidden="true" /> {video.label}
      </a>
    </div>
  );
};

FacebookEmbed.propTypes = {
  video: PropTypes.shape({
    url: PropTypes.string.isRequired,
    poster: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    embed: PropTypes.bool.isRequired,
  }).isRequired,
  posterAlt: PropTypes.string.isRequired,
};

export default FacebookEmbed;
