import { Link } from "react-router-dom";

const iconBg = {
  "📋": "bg-blue-50 text-blue-600",
  "💰": "bg-emerald-50 text-emerald-600",
  "📊": "bg-violet-50 text-violet-600",
  "📄": "bg-gray-50 text-gray-600",
};

export default function TemplateCard({ template }) {
  const { id, name, description, icon } = template;
  const iconClass = iconBg[icon] || "bg-gray-50 text-gray-600";

  return (
    <div className="card p-6 flex flex-col gap-4 group">
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${iconClass}`}>
        {icon}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="text-base font-semibold text-ink mb-1">{name}</h3>
        <p className="text-sm text-ink-muted leading-relaxed">{description}</p>
      </div>

      {/* CTA */}
      <Link
        to={`/template/${id}`}
        className="btn-primary w-full justify-center mt-auto"
        id={`template-card-${id}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Use Template
      </Link>
    </div>
  );
}
