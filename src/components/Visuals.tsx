import type { Visual } from "@/lib/types";

const STROKE = "#6b4f12";

function Arrowhead({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill={STROKE} />
      </marker>
    </defs>
  );
}

function AngleDiagram({ deg, label }: { deg: number; label?: string }) {
  const ox = 50, oy = 130, len = 150;
  const rad = (deg * Math.PI) / 180;
  const ex = ox + len * Math.cos(rad);
  const ey = oy - len * Math.sin(rad);
  const r = 34;
  const ax = ox + r * Math.cos(rad), ay = oy - r * Math.sin(rad);
  const mid = rad / 2;
  const lx = ox + (r + 22) * Math.cos(mid), ly = oy - (r + 22) * Math.sin(mid);
  const right = deg === 90;
  return (
    <svg viewBox="0 0 230 160" className="h-36 w-auto" role="img" aria-label={label ?? `${deg}°`}>
      <Arrowhead id="ah" />
      <line x1={ox} y1={oy} x2={ox + len + 10} y2={oy} stroke={STROKE} strokeWidth="4" strokeLinecap="round" markerEnd="url(#ah)" />
      <line x1={ox} y1={oy} x2={ex} y2={ey} stroke={STROKE} strokeWidth="4" strokeLinecap="round" markerEnd="url(#ah)" />
      {right ? (
        <path d={`M${ox + 22} ${oy} L${ox + 22} ${oy - 22} L${ox} ${oy - 22}`} fill="none" stroke={STROKE} strokeWidth="3" />
      ) : (
        <path d={`M${ox + r} ${oy} A${r} ${r} 0 ${deg > 180 ? 1 : 0} 0 ${ax} ${ay}`} fill="none" stroke={STROKE} strokeWidth="3" />
      )}
      <text x={right ? ox + 34 : lx} y={right ? oy - 30 : ly + 5} fontSize="20" fontWeight="700" fill={STROKE} textAnchor="middle">{label ?? `${deg}°`}</text>
    </svg>
  );
}

function Lines({ type }: { type: "parallel" | "perpendicular" | "intersecting" }) {
  return (
    <svg viewBox="0 0 200 130" className="h-32 w-auto" role="img">
      <Arrowhead id="ah2" />
      {type === "parallel" && (
        <>
          <line x1="20" y1="45" x2="180" y2="45" stroke={STROKE} strokeWidth="4" strokeLinecap="round" markerStart="url(#ah2)" markerEnd="url(#ah2)" />
          <line x1="20" y1="90" x2="180" y2="90" stroke={STROKE} strokeWidth="4" strokeLinecap="round" markerStart="url(#ah2)" markerEnd="url(#ah2)" />
        </>
      )}
      {type === "perpendicular" && (
        <>
          <line x1="100" y1="12" x2="100" y2="118" stroke={STROKE} strokeWidth="4" strokeLinecap="round" markerStart="url(#ah2)" markerEnd="url(#ah2)" />
          <line x1="30" y1="95" x2="170" y2="95" stroke={STROKE} strokeWidth="4" strokeLinecap="round" markerStart="url(#ah2)" markerEnd="url(#ah2)" />
          <path d="M100 80 L115 80 L115 95" fill="none" stroke={STROKE} strokeWidth="3" />
        </>
      )}
      {type === "intersecting" && (
        <>
          <line x1="30" y1="25" x2="170" y2="105" stroke={STROKE} strokeWidth="4" strokeLinecap="round" markerStart="url(#ah2)" markerEnd="url(#ah2)" />
          <line x1="40" y1="108" x2="165" y2="22" stroke={STROKE} strokeWidth="4" strokeLinecap="round" markerStart="url(#ah2)" markerEnd="url(#ah2)" />
        </>
      )}
    </svg>
  );
}

function Tri({ type }: { type: "equilateral" | "isosceles" | "scalene" | "right" }) {
  const pts = { equilateral: "100,20 160,120 40,120", isosceles: "100,15 150,120 50,120", scalene: "50,110 175,115 110,25", right: "50,20 50,120 170,120" }[type];
  return (
    <svg viewBox="0 0 220 140" className="h-32 w-auto" role="img">
      <polygon points={pts} fill="#fff1b8" stroke={STROKE} strokeWidth="4" strokeLinejoin="round" />
      {type === "right" && <path d="M50 100 L70 100 L70 120" fill="none" stroke={STROKE} strokeWidth="3" />}
      {type === "equilateral" && (
        <g stroke={STROKE} strokeWidth="3"><path d="M64 66 L76 72" /><path d="M136 66 L124 72" /><path d="M96 114 L104 114 M96 126 L104 126" transform="translate(0 -12)" /></g>
      )}
      {type === "isosceles" && <g stroke={STROKE} strokeWidth="3"><path d="M68 62 L82 66" /><path d="M132 62 L118 66" /></g>}
    </svg>
  );
}

function Shape({ type }: { type: "square" | "rectangle" | "rhombus" | "trapezoid" | "parallelogram" }) {
  const pts = {
    square: "60,25 160,25 160,115 60,115", rectangle: "35,35 185,35 185,110 35,110", rhombus: "110,15 175,70 110,125 45,70",
    trapezoid: "70,30 150,30 190,115 30,115", parallelogram: "60,30 190,30 160,115 30,115",
  }[type];
  return (
    <svg viewBox="0 0 220 140" className="h-32 w-auto" role="img">
      <polygon points={pts} fill="#fff1b8" stroke={STROKE} strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

/** Renders the illustration attached to a slide or a question. */
export default function VisualView({ v }: { v: Visual }) {
  switch (v.kind) {
    case "angle": return <AngleDiagram deg={v.deg} label={v.label} />;
    case "lines": return <Lines type={v.type} />;
    case "triangle": return <Tri type={v.type} />;
    case "shape": return <Shape type={v.type} />;
    case "emoji": return <div className="text-6xl leading-none sm:text-7xl" aria-hidden>{v.text}</div>;
    case "formula":
      return <div className="rounded-2xl bg-honey-100 px-5 py-3 text-center text-xl font-bold leading-snug text-honey-900 sm:text-2xl" dir="rtl">{v.text}</div>;
  }
}
