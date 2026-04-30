import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTemplates } from "../api";
import TemplateCard from "../components/TemplateCard";
import Logo from "../components/Logo";

import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTemplates()
      .then((res) => setTemplates(res.data))
      .catch(() => setError("Cannot connect to backend. Make sure FastAPI is running on port 8000."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isHome={true} />

      {/* Hero */}
      <div className="bg-white border-b border-gray-100 pt-24">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-start gap-4">
            <div className="w-48 h- rounded-xl bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden p-2">
              <Logo variant="black" className="h-full" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink mb-1">Document Templates</h1>
              <p className="text-ink-muted max-w-xl">
                Select a template below to open the editor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Template Grid */}
      <main className="max-w-6xl mx-auto px-6 py-10">
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
