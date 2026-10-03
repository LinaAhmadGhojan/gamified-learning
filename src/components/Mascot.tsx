export type Mood = "happy" | "cheer" | "sad" | "think";

/** نمّور: the tiger mascot, drawn as SVG so it stays sharp at any size. */
export default function Mascot({ mood = "happy", size = 180, className = "" }: { mood?: Mood; size?: number; className?: string }) {
  const mouth =
    mood === "sad"
      ? "M84 138 Q100 126 116 138"
      : mood === "think"
        ? "M88 134 L112 134"
        : "M82 130 Q100 152 118 130";
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 200 220" className={className} role="img" aria-label="نمّور">
      {/* tail */}
      <path d="M150 190 Q192 190 180 150 Q176 138 168 146" fill="none" stroke="#ff9a1f" strokeWidth="14" strokeLinecap="round" />
      <path d="M176 160 L186 156 M172 174 L184 172" stroke="#8a3b00" strokeWidth="5" strokeLinecap="round" />
      {/* body */}
      <ellipse cx="100" cy="182" rx="44" ry="36" fill="#ff9a1f" />
      <ellipse cx="100" cy="188" rx="26" ry="26" fill="#ffe2bd" />
      <path d="M60 170 L72 174 M60 186 L72 186 M140 170 L128 174 M140 186 L128 186" stroke="#8a3b00" strokeWidth="5" strokeLinecap="round" />
      {/* arms */}
      {mood === "cheer" ? (
        <>
          <path d="M62 168 Q36 150 40 112" fill="none" stroke="#ff9a1f" strokeWidth="16" strokeLinecap="round" />
          <path d="M138 168 Q164 150 160 112" fill="none" stroke="#ff9a1f" strokeWidth="16" strokeLinecap="round" />
          <circle cx="40" cy="108" r="12" fill="#ffe2bd" />
          <circle cx="160" cy="108" r="12" fill="#ffe2bd" />
        </>
      ) : (
        <>
          <path d="M62 170 Q48 186 56 204" fill="none" stroke="#ff9a1f" strokeWidth="16" strokeLinecap="round" />
          <path d="M138 170 Q152 186 144 204" fill="none" stroke="#ff9a1f" strokeWidth="16" strokeLinecap="round" />
        </>
      )}
      {/* feet */}
      <ellipse cx="80" cy="212" rx="18" ry="8" fill="#ffe2bd" />
      <ellipse cx="120" cy="212" rx="18" ry="8" fill="#ffe2bd" />
      {/* ears */}
      <circle cx="48" cy="50" r="22" fill="#ff9a1f" />
      <circle cx="152" cy="50" r="22" fill="#ff9a1f" />
      <circle cx="48" cy="52" r="11" fill="#ffc9a0" />
      <circle cx="152" cy="52" r="11" fill="#ffc9a0" />
      {/* head */}
      <ellipse cx="100" cy="92" rx="62" ry="58" fill="#ff9a1f" />
      <path d="M86 40 L92 62 M100 36 L100 60 M114 40 L108 62" stroke="#8a3b00" strokeWidth="6" strokeLinecap="round" />
      <path d="M40 84 L58 88 M40 102 L58 100 M160 84 L142 88 M160 102 L142 100" stroke="#8a3b00" strokeWidth="6" strokeLinecap="round" />
      {/* muzzle */}
      <ellipse cx="100" cy="116" rx="36" ry="28" fill="#fff1dc" />
      {mood === "cheer" && <path d="M82 130 Q100 158 118 130 Z" fill="#a83232" />}
      <path d={mouth} fill="none" stroke="#6b2d00" strokeWidth="4" strokeLinecap="round" />
      <path d="M92 108 Q100 102 108 108 Q104 118 100 118 Q96 118 92 108Z" fill="#c2504a" />
      {/* eyes */}
      {mood === "cheer" ? (
        <>
          <path d="M66 88 Q78 76 90 88" fill="none" stroke="#3b1c00" strokeWidth="5" strokeLinecap="round" />
          <path d="M110 88 Q122 76 134 88" fill="none" stroke="#3b1c00" strokeWidth="5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="78" cy="88" r="13" fill="#fff" />
          <circle cx="122" cy="88" r="13" fill="#fff" />
          <circle cx={mood === "think" ? 82 : 78} cy={mood === "sad" ? 92 : 89} r="7" fill="#3b1c00" />
          <circle cx={mood === "think" ? 126 : 122} cy={mood === "sad" ? 92 : 89} r="7" fill="#3b1c00" />
          <circle cx="80" cy="86" r="2.5" fill="#fff" />
          <circle cx="124" cy="86" r="2.5" fill="#fff" />
        </>
      )}
      {mood === "sad" && <path d="M64 70 L88 76 M136 70 L112 76" stroke="#3b1c00" strokeWidth="4" strokeLinecap="round" />}
      <circle cx="60" cy="108" r="8" fill="#ff7a59" opacity="0.35" />
      <circle cx="140" cy="108" r="8" fill="#ff7a59" opacity="0.35" />
    </svg>
  );
}
