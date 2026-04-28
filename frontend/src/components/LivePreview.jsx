import { useEffect, useRef, useState } from "react";

export default function LivePreview({ html, loading }) {
  const iframeRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html || getPlaceholder());
    doc.close();
  }, [html]);

  // Scale iframe to fit panel while maintaining A4 aspect ratio
  useEffect(() => {
    const calcScale = () => {
      const panel = iframeRef.current?.parentElement;
      if (!panel) return;
      const panelW = panel.clientWidth - 32; // 16px padding each side
      setScale(Math.min(1, panelW / 794));
    };
    calcScale();
    window.addEventListener("resize", calcScale);
    return () => window.removeEventListener("resize", calcScale);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      {/* A4 paper shadow container */}
      <div
        className="relative bg-white shadow-lifted rounded overflow-hidden"
        style={{
          width: 794,
          minHeight: 1123,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          marginBottom: `${(1123 * scale) - 1123}px`,
        }}
      >
        {/* Loading shimmer */}
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/70 flex items-center justify-center">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary-600 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          title="Document Preview"
          id="live-preview-iframe"
          className="w-full border-0"
          style={{ height: 1123 }}
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}

function getPlaceholder() {
  return `<!DOCTYPE html><html><head><style>
    body { font-family: Arial,sans-serif; display:flex; align-items:center; justify-content:center;
           height:100%; min-height:1123px; background:#fafafa; color:#9ca3af; flex-direction:column; gap:12px; }
    .icon { font-size:48px; opacity:.4; }
    p { font-size:14px; }
  </style></head><body>
    <div class="icon">📄</div>
    <p>Fill in the form to see a live preview</p>
  </body></html>`;
}
