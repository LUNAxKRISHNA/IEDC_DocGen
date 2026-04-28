import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getTemplate, previewTemplate } from "../api";
import DynamicForm from "../components/DynamicForm";
import LivePreview from "../components/LivePreview";
import DownloadButtons from "../components/DownloadButtons";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function initFormData(schema) {
  if (!schema?.fields) return {};
  return schema.fields.reduce((acc, f) => {
    acc[f.name] = f.type === "table" ? [] : "";
    return acc;
  }, {});
}

export default function TemplateEditor() {
  const { name } = useParams();
  const [schema, setSchema] = useState(null);
  const [formData, setFormData] = useState({});
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [pageError, setPageError] = useState(null);
  const debouncedForm = useDebounce(formData, 500);

  // Fetch schema on mount
  useEffect(() => {
    setPageError(null);
    getTemplate(name)
      .then((res) => {
        setSchema(res.data.schema);
        setFormData(initFormData(res.data.schema));
      })
      .catch(() => setPageError("Could not load template. Is the backend running?"));
  }, [name]);

  // Refresh preview on form change (debounced)
  useEffect(() => {
    if (!schema) return;
    const hasAnyValue = Object.values(debouncedForm).some((v) =>
      Array.isArray(v) ? v.length > 0 : Boolean(v)
    );
    if (!hasAnyValue) return;

    setPreviewLoading(true);
    previewTemplate(name, debouncedForm)
      .then((res) => setPreviewHtml(res.data.html))
      .catch(() => {})
      .finally(() => setPreviewLoading(false));
  }, [debouncedForm, name, schema]);

  const handleFormChange = useCallback((newData) => {
    setFormData(newData);
  }, []);

  const resetForm = () => {
    setFormData(initFormData(schema));
    setPreviewHtml("");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="bg-ink text-white shrink-0 z-10">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm"
              id="back-to-dashboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Dashboard
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-sm font-semibold">{schema?.name || name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="reset-form-btn"
              onClick={resetForm}
              className="text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              Reset
            </button>
            <DownloadButtons
              templateName={name}
              formData={formData}
              disabled={!schema}
            />
          </div>
        </div>
      </header>

      {pageError && (
        <div className="shrink-0 bg-primary-50 border-b border-primary-200 px-6 py-3 text-sm text-primary-700">
          ⚠ {pageError}
        </div>
      )}

      {/* Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT — Form Panel */}
        <div className="w-[380px] shrink-0 flex flex-col border-r border-gray-200 bg-white overflow-hidden">
          {/* Panel header */}
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50 shrink-0">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Document Fields
            </h2>
            {schema && (
              <p className="text-xs text-ink-faint mt-0.5">{schema.description}</p>
            )}
          </div>

          {/* Form scroll area */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-5">
            {!schema ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
                    <div className="h-9 bg-gray-100 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : (
              <DynamicForm
                schema={schema}
                formData={formData}
                onChange={handleFormChange}
              />
            )}
          </div>
        </div>

        {/* RIGHT — Preview Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Panel header */}
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50 shrink-0 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Live Preview
            </h2>
            {previewLoading && (
              <span className="text-xs text-primary-600 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Updating…
              </span>
            )}
          </div>

          {/* Preview scroll area */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-6 bg-gray-100">
            <LivePreview html={previewHtml} loading={previewLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
