import { useRef } from "react";
import PropTypes from "prop-types";

// The only tab/filter affordance in the app (ADR-0010). Purely presentational:
// the active value and the filtering itself live in the caller.
// Keyboard: roving tabindex + ArrowLeft/ArrowRight/Home/End.
// Iteration 03: each tab may carry a count mark, supplied by the caller so the
// number can never drift from the data it describes. The mark is aria-hidden so
// the tab's accessible name stays the plain category name.
const TabFilter = ({ label, tabs, value, onChange, panelId, idPrefix, counts }) => {
  const refs = useRef([]);
  const activeIndex = Math.max(tabs.indexOf(value), 0);

  const select = (i) => {
    const next = (i + tabs.length) % tabs.length;
    onChange(tabs[next]);
    const el = refs.current[next];
    if (el) el.focus();
  };

  const onKeyDown = (event) => {
    const keys = {
      ArrowRight: () => select(activeIndex + 1),
      ArrowLeft: () => select(activeIndex - 1),
      Home: () => select(0),
      End: () => select(tabs.length - 1),
    };
    const handler = keys[event.key];
    if (!handler) return;
    event.preventDefault();
    handler();
  };

  return (
    <div className="tab-filter" role="tablist" aria-label={label} onKeyDown={onKeyDown}>
      {tabs.map((tab, i) => (
        <button
          key={tab}
          type="button"
          role="tab"
          id={`${idPrefix}-tab-${i}`}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={`tab-filter__tab${tab === value ? " is-active" : ""}`}
          aria-selected={tab === value}
          aria-controls={panelId}
          tabIndex={tab === value ? 0 : -1}
          onClick={() => onChange(tab)}
        >
          {tab}
          {counts && counts[tab] !== undefined && (
            <span className="tab-filter__count" aria-hidden="true">
              {counts[tab]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

TabFilter.propTypes = {
  label: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  panelId: PropTypes.string.isRequired,
  idPrefix: PropTypes.string.isRequired,
  counts: PropTypes.objectOf(PropTypes.number),
};

export default TabFilter;
