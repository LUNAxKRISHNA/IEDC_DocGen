import { Link } from "react-router-dom";

export default function TemplateCard({ template, featured = false }) {
  const { id, name, description } = template;

  return (
    <div className={`group relative rounded-2xl border transition-all duration-300 flex flex-col ${
      featured 
        ? "bg-gray-50 border-gray-100 p-5 min-h-[160px] shadow-none hover:bg-white hover:shadow-lg hover:border-gray-200" 
        : "bg-white border-gray-200 p-8 min-h-[220px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
    } hover:-translate-y-1`}>
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-50 rounded-t-2xl overflow-hidden">
        <div className="h-full w-0 bg-[#E53935] transition-all duration-500 group-hover:w-full" />
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 
          className={`font-extrabold text-[#0f172a] tracking-tighter leading-tight group-hover:text-[#E53935] transition-colors ${
            featured ? "text-xl mb-2" : "text-2xl sm:text-3xl mb-3"
          }`}
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          {name}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed font-medium">
          {description}
        </p>
      </div>

      {/* CTA */}
      <div className="mt-8 flex items-center justify-between">
        <Link
          to={`/template/${id}`}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0f172a] hover:text-[#E53935] transition-colors group/btn"
          id={`template-card-${id}`}
        >
          Use Template
          <svg 
            className="w-4 h-4 transform transition-transform group-hover/btn:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
