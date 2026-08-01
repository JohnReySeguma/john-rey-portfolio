import { useEffect, useRef } from "react";

// Fixed full-viewport canvas: drifting nebula glow + twinkling parallax stars.
// Respects prefers-reduced-motion by freezing the field after one paint.
const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width, height, stars, frame;
    const STAR_COUNT_DIVISOR = 3200;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const count = Math.floor((width * height) / STAR_COUNT_DIVISOR);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.3 + 0.2,
        depth: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, width, height);

      // nebula glow blobs
      const nebulas = [
        { x: width * 0.15, y: height * 0.2, r: width * 0.35, c: "rgba(255,110,168,0.10)" },
        { x: width * 0.85, y: height * 0.6, r: width * 0.4, c: "rgba(124,92,255,0.12)" },
        { x: width * 0.5, y: height * 0.9, r: width * 0.3, c: "rgba(67,232,216,0.08)" },
      ];
      nebulas.forEach((n) => {
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        grad.addColorStop(0, n.c);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      });

      stars.forEach((s) => {
        const twinkle = reduceMotion ? 1 : 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.phase);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,243,255,${0.25 + twinkle * 0.75 * s.depth})`;
        ctx.fill();
      });

      if (!reduceMotion) {
        frame = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(draw);
    if (reduceMotion) draw(0);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield-canvas" aria-hidden="true" />;
};

export default Starfield;
