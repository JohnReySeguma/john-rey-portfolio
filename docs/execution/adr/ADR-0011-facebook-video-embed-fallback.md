# ADR-0011 — Facebook video: plugin iframe behind an evidence-gated flag, with a mandatory fallback

- **Status:** Accepted · **Iteration:** 02 · **Date:** 2026-08-27 · **Deciders:** Ponta
- **Relates to:** PRD §I2.4, §I2.5 A1 · plan T6 · ADR-0010 (`Lightbox` `children` slot)

## Context
`https://www.facebook.com/share/v/19N5bPPYJk/` is a share short-link and may not resolve
inside the FB video plugin. A cross-origin iframe gives **no failure signal** — `onError`
never fires and `onLoad` fires for an error page — so "detect at runtime and fall back" is
not implementable. T6 AC3 still forbids ever showing a blank box or an error frame.

## Decision
`FacebookEmbed.jsx`, rendered only inside the Kabataan Inyovator lightbox, contains:

1. the poster `awards/kabataan_inyovator.jpg`, **always in the DOM**;
2. the iframe `https://www.facebook.com/plugins/video.php?href=<encodeURIComponent(url)>&show_text=false&width=560`,
   mounted **only when `video.embed === true`**, with `title`, `allowFullScreen`,
   `scrolling="no"`, `frameBorder="0"`, `loading="lazy"`;
3. an always-visible anchor **"Watch on Facebook"** → the share URL, `target="_blank"
   rel="noopener noreferrer"`.

`video.embed` is a content flag in `achievements.js` **set by observation, never by
assumption**: the developer opens the record in the running app; if the iframe does not play
the video, the flag is set to `false`, the poster + link stand alone, and the observation is
recorded in `execution-log.md`. Only this one record carries a `video` object, so no other
record can render an embed (T6 AC4 is structural).

## Consequences
- **+** T6 AC1/AC2/AC3 pass in both worlds; the user never sees a blank or error frame.
- **+** A third-party outage degrades to a poster and a link, not to a broken section.
- **−** One non-self-hosted runtime resource, and it is a tracking-capable third-party frame.
  Mitigated: lazy-loaded and mounted only inside an opened lightbox, so it costs nothing on
  first load and never runs unless the visitor asks for that record.
- **−** `embed: false` would be a permanent hand-set flag; re-testing later is a data edit.
