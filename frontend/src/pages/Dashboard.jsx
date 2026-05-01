import { useEffect, useState, useRef } from "react";
import { getTemplates } from "../api";
import TemplateCard from "../components/TemplateCard";
import { useNavbar } from "../context/NavbarContext";

// Words that float in the background
const BG_WORDS = [
  "Innovation", "Documentation", "Templates", "Reports", "Budgets",
  "Events", "Proposals", "Collaborate", "Create", "Export",
  "Automate", "Workflow", "Structure", "Generate", "Publish",
  "Records", "Outlines", "Vision", "Impact", "Design",
];

// Deterministic positions & animation params per word
const wordStyles = BG_WORDS.map((_, i) => ({
  top: `${5 + (i * 4.5) % 90}%`,
  left: `${3 + (i * 13.7 + i * i * 2.3) % 90}%`,
  animationDuration: `${18 + (i * 3.7) % 14}s`,
  animationDelay: `${-(i * 2.9) % 12}s`,
  fontSize: `${0.7 + (i % 4) * 0.18}rem`,
  opacity: 0.045 + (i % 5) * 0.012,
  rotate: `${-8 + (i * 5.3) % 16}deg`,
}));

export default function Dashboard() {
  const [templates, setTemplates] = useState([]);
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const gridRef = useRef(null);
  const { setNavbarProps } = useNavbar();

  useEffect(() => {
    setNavbarProps({ isHome: true });
  }, [setNavbarProps]);

  useEffect(() => {
    getTemplates()
      .then((res) => {
        const data = res.data;
        setTemplates(data);
        if (data.length > 0) {
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          setFeaturedTemplates(shuffled.slice(0, 3));
        }
      })
      .catch(() => setError("Cannot connect to backend. Make sure FastAPI is running on port 8000."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── FLOATING WORD KEYFRAMES ── */}
      <style>{`
        @keyframes floatWord {
          0%   { transform: translateY(0px) rotate(var(--r)); }
          50%  { transform: translateY(-28px) rotate(var(--r)); }
          100% { transform: translateY(0px) rotate(var(--r)); }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-screen flex items-center border-b border-gray-100 bg-white">

        {/* Floating background words */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {BG_WORDS.map((word, i) => (
            <span
              key={word}
              className="absolute font-extrabold tracking-tighter text-[#0f172a] uppercase whitespace-nowrap"
              style={{
                top: wordStyles[i].top,
                left: wordStyles[i].left,
                fontSize: wordStyles[i].fontSize,
                opacity: wordStyles[i].opacity,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                animation: `floatWord ${wordStyles[i].animationDuration} ease-in-out ${wordStyles[i].animationDelay} infinite`,
                '--r': wordStyles[i].rotate,
              }}
            >
              {word}
            </span>
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-24 pb-20">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

            {/* Left: Headline */}
            <div className="flex-1 flex flex-col items-center lg:items-start">
              <h1
                className="font-extrabold tracking-tighter text-[#0f172a] leading-[0.9] mb-6 text-center lg:text-left flex flex-col items-center lg:items-start"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                <span className="block text-[4rem] sm:text-[5.5rem] lg:text-[7.5rem] uppercase">
                  Create.
                </span>

                <span
                  className="block text-[4rem] sm:text-[6rem] lg:text-[8.5rem] italic font-bold lowercase text-[#E53935]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  document.
                </span>
                <span className="block text-[4rem] sm:text-[5.5rem] lg:text-[7.5rem] uppercase">
                  Transform.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-500 max-w-md text-center lg:text-left leading-relaxed mb-8">
                Instantly generate documents like event reports, budgets, proposals and more from structured templates.
              </p>

              <button
                onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center gap-3 bg-[#0f172a] text-white font-semibold px-6 py-3.5 rounded-full text-sm hover:bg-[#E53935] transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Browse all templates
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            {/* Right: Featured Templates */}
            <div className="flex-1 w-full max-w-sm mx-auto lg:mx-0">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-[0.2em]">Quick Start Templates</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              <div className="flex flex-col gap-3">
                {loading && [1, 2].map(i => (
                  <div key={i} className="card p-5 flex gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3.5 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                    </div>
                  </div>
                ))}

                {featuredTemplates.map(tpl => (
                  <TemplateCard key={tpl.id} template={tpl} featured />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ── ALL TEMPLATES GRID ── */}
      <main ref={gridRef} className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-16 text-center">
          <h2
            className="text-7xl sm:text-8xl font-extrabold text-[#0f172a] tracking-tight mb-3"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            All Templates
          </h2>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="card p-6 space-y-4 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-gray-100" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
                <div className="h-9 bg-gray-100 rounded-lg mt-2" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
            <div className="font-semibold mb-1">⚠ Backend Unavailable</div>
            {error}
            <div className="mt-3 font-mono text-xs bg-white/60 rounded-lg p-3 text-gray-500">
              cd backend &amp;&amp; uvicorn main:app --reload
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tpl) => (
              <TemplateCard key={tpl.id} template={tpl} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-400 font-medium tracking-wide">
        CVV-IEDC Document Generator
      </footer>
    </div>
  );
}
