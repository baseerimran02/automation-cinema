import { useEffect, useRef, useState } from "react";

/**
 * Minimal desktop cursor. Reads `data-cursor` on hovered elements to switch
 * label states (VIEW / OPEN / RUN / CONNECT / TRACE / EXPLORE).
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf = 0;

    const move = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = (e.target as HTMLElement | null)?.closest?.("[data-cursor]");
      setLabel(el ? (el.getAttribute("data-cursor") ?? "") : "");
      if (dot.current) dot.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.16;
      pos.y += (target.y - pos.y) * 0.16;
      if (ring.current) ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={dot}
        className="absolute -ml-[2px] -mt-[2px] h-1 w-1 rounded-full bg-signal"
      />
      <div
        ref={ring}
        className="absolute flex items-center justify-center rounded-full border border-signal/60 transition-[width,height,background-color] duration-300"
        style={{
          width: label ? 68 : 26,
          height: label ? 68 : 26,
          marginLeft: label ? -34 : -13,
          marginTop: label ? -34 : -13,
          backgroundColor: label ? "oklch(0.82 0.14 194 / 12%)" : "transparent",
        }}
      >
        <span className="label-mono text-[9px] text-signal">{label}</span>
      </div>
    </div>
  );
}
