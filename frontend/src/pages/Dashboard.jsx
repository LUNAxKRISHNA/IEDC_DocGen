import { useEffect, useState, useRef } from "react";
import { getTemplates } from "../api";
import TemplateCard from "../components/TemplateCard";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [templates, setTemplates] = useState([]);
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    getTemplates()
      .then((res) => {
        const data = res.data;
        setTemplates(data);
        if (data.length > 0) {
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          setFeaturedTemplates(shuffled.slice(0, 2));
        }
      })
      .catch(() => setError("Cannot connect to backend. Make sure FastAPI is running on port 8000."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isHome={true} />

      {/* Hero */}
      <div className="bg-white border-b border-gray-100 pt-[120px] pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

            {/* Left: Typography */}
            <div className="flex-1 flex justify-center lg:justify-end w-full pr-0 lg:pr-10">
              <div className="flex flex-col items-center lg:items-start font-extrabold tracking-tighter text-[#0f172a] leading-[0.85]">
                <div
                  className="text-[4.5rem] sm:text-[6rem] lg:text-[7.5rem] uppercase"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  CREATE.
                </div>
                <div
                  className="text-[5rem] sm:text-[7rem] lg:text-[8.5rem] bold italic text-[#E53935] lowercase font-normal -mt-13 sm:-mt-25 lg:ml-8"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  inspire.
                </div>
                <div
                  className="text-[4.5rem] sm:text-[6rem] lg:text-[7.5rem] uppercase -mt-13 sm:-mt-25"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  TRANSFORM.
                </div>
              </div>
            </div>

            {/* Right: Featured Templates */}
            <div className="flex-1 w-full max-w-md mx-auto lg:mx-0 lg:pl-10">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px bg-gray-200 flex-1" />
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Featured Templates</h3>
                  <div className="h-px bg-gray-200 flex-1" />
                </div>

                {loading && (
                  <div className="card p-6 space-y-4 animate-pulse">
                    <div className="w-12 h-12 rounded-xl bg-gray-100" />
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                  </div>
                )}

                {featuredTemplates.map(tpl => (
                  <TemplateCard key={tpl.id} template={tpl} />
                ))}

                {!loading && !error && (
                  <button
                    onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="mt-4 flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-500 hover:border-black hover:text-black hover:bg-white transition-all font-semibold group"
                  >
                    Explore all templates
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Template Grid */}
      <main ref={gridRef} className="max-w-6xl mx-auto px-6 py-20">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
          <div className="rounded-xl border border-primary-200 bg-primary-50 p-6 text-sm text-primary-700">
            <div className="font-semibold mb-1">⚠ Backend Unavailable</div>
            {error}
            <div className="mt-3 font-mono text-xs bg-white/60 rounded-lg p-3 text-ink-soft">
              cd backend &amp;&amp; uvicorn main:app --reload
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="text-xs text-ink-faint font-medium uppercase tracking-wide mb-5">
              {templates.length} template{templates.length !== 1 ? "s" : ""} available
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((tpl) => (
                <TemplateCard key={tpl.id} template={tpl} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
