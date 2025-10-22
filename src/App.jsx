import React, { useState } from "react";

// Responsive Search Ad Preview - Single-file React component
// - Uses Tailwind classes (assumes Tailwind is available in the host project)
// - Export default component so it can be previewed directly
// - Simulates Google Search result with truncation rules for headlines and descriptions

export default function ResponsiveAdPreview() {
  // Character limits (typical Google limits)
  const HL_LIMIT = 30; // headline max chars
  const DESC_LIMIT = 90; // description max chars

  const [headlines, setHeadlines] = useState(["", "", ""]);
  const [descriptions, setDescriptions] = useState(["", ""]);
  const [path1, setPath1] = useState("");
  const [path2, setPath2] = useState("");
  const [device, setDevice] = useState("desktop");
  const [showAllHeadlines, setShowAllHeadlines] = useState(true);

  // helpers
  const truncate = (text, limit) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    // prefer truncating at word boundary if possible
    const clipped = text.slice(0, limit - 1);
    const lastSpace = clipped.lastIndexOf(" ");
    if (lastSpace > Math.floor(limit * 0.5)) {
      return clipped.slice(0, lastSpace) + "…";
    }
    return clipped + "…";
  };

  // choose which headline(s) appear in the preview
  const getPreviewHeadline = () => {
    // mimic ad headline behavior: combine up to 3 headlines separated by " | " or choose first non-empty
    const nonEmpty = headlines.filter((h) => h.trim().length > 0);
    if (nonEmpty.length === 0) return "Your headline here";

    // Try to show as many as space allows; here we simulate by joining with " — "
    const joined = nonEmpty.join(" — ");
    return truncate(joined, HL_LIMIT * 2 + 15); // allow longer line to show combination effect
  };

  const getPreviewDescription = () => {
    const nonEmpty = descriptions.filter((d) => d.trim().length > 0);
    if (nonEmpty.length === 0) return "Your description will appear here."
    const joined = nonEmpty.join(" ");
    return truncate(joined, DESC_LIMIT);
  };

  // UI widths for devices
  const deviceStyles = {
    desktop: "w-full max-w-3xl",
    tablet: "w-3/4 max-w-xl",
    mobile: "w-80",
  };

  // handlers
  const setHeadline = (idx, value) => {
    const copy = [...headlines];
    copy[idx] = value;
    setHeadlines(copy);
  };
  const setDescription = (idx, value) => {
    const copy = [...descriptions];
    copy[idx] = value;
    setDescriptions(copy);
  };

  // small utility to copy HTML preview to clipboard
  const copyHTML = async () => {
    const html = document.getElementById("serp-preview").outerHTML;
    try {
      await navigator.clipboard.writeText(html);
      alert("Preview HTML copied to clipboard");
    } catch (e) {
      alert("Could not copy — your browser may block clipboard access.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-6">
      <header className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold">Responsive Search Ad Preview</h1>
        <p className="text-sm text-gray-600 mt-1">
          Edit headlines & descriptions below. This is an independent reimplementation that
          simulates truncation and responsive preview (desktop / tablet / mobile).
        </p>
      </header>

      <main className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        {/* Left - Form */}
        <section className="space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <h2 className="font-medium">Headlines</h2>
            <p className="text-xs text-gray-500">Up to 3 headlines (30 characters each suggested).</p>

            {headlines.map((h, i) => (
              <div key={i} className="mt-3">
                <label className="text-xs text-gray-700">Headline {i + 1}</label>
                <div className="mt-1 flex gap-2">
                  <input
                    value={h}
                    onChange={(e) => setHeadline(i, e.target.value)}
                    placeholder={`Headline ${i + 1}`}
                    className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none"
                  />
                  <div className="text-xs text-gray-600 w-14 text-right">
                    {h.length}/{HL_LIMIT}
                  </div>
                </div>
                {h.length > HL_LIMIT && (
                  <div className="text-xs text-red-600 mt-1">Over {HL_LIMIT} chars — will be truncated.</div>
                )}
              </div>
            ))}

            <div className="mt-4">
              <label className="text-xs text-gray-700">Path (display URL)</label>
              <div className="mt-1 flex gap-2">
                <input value={path1} onChange={(e) => setPath1(e.target.value)} placeholder="example-path" className="border rounded px-3 py-2 text-sm flex-1" />
                <input value={path2} onChange={(e) => setPath2(e.target.value)} placeholder="another" className="border rounded px-3 py-2 text-sm w-36" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Display URL: example.com/{path1}{path2 && `/${path2}`}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <h2 className="font-medium">Descriptions</h2>
            <p className="text-xs text-gray-500 mt-1">Up to 2 descriptions (90 characters each suggested).</p>

            {descriptions.map((d, i) => (
              <div key={i} className="mt-3">
                <label className="text-xs text-gray-700">Description {i + 1}</label>
                <textarea
                  value={d}
                  onChange={(e) => setDescription(i, e.target.value)}
                  rows={3}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                />
                <div className="text-xs text-gray-600 text-right">{d.length}/{DESC_LIMIT}</div>
                {d.length > DESC_LIMIT && <div className="text-xs text-red-600">Over {DESC_LIMIT} chars — will be truncated.</div>}
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col gap-3">
            <h3 className="font-medium">Options</h3>
            <div className="flex gap-2">
              <button className={`px-3 py-1 rounded ${device === 'desktop'? 'bg-sky-600 text-white':'border'}`} onClick={()=>setDevice('desktop')}>Desktop</button>
              <button className={`px-3 py-1 rounded ${device === 'tablet'? 'bg-sky-600 text-white':'border'}`} onClick={()=>setDevice('tablet')}>Tablet</button>
              <button className={`px-3 py-1 rounded ${device === 'mobile'? 'bg-sky-600 text-white':'border'}`} onClick={()=>setDevice('mobile')}>Mobile</button>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={showAllHeadlines} onChange={(e)=>setShowAllHeadlines(e.target.checked)} />
              Show all headlines joined in preview
            </label>

            <div className="flex gap-2">
              <button onClick={copyHTML} className="px-3 py-2 bg-gray-900 text-white rounded">Copy preview HTML</button>
              <button onClick={() => {
                setHeadlines(["Buy now", "Free shipping", "Limited offer"]);
                setDescriptions(["Shop our top products with fast delivery.", "Limited time — great prices."]);
                setPath1("deals");
                setPath2("sale");
              }} className="px-3 py-2 border rounded">Load example</button>
            </div>
          </div>
        </section>

        {/* Right - Preview */}
        <aside className="flex flex-col items-center">
          <div className={`bg-white rounded-2xl p-6 shadow w-full flex justify-center ${deviceStyles[device]}`}>
            <div id="serp-preview" className="w-full">
              {/* small faux SERP header */}
              <div className="mb-4">
                <div className="h-3 w-36 bg-gray-200 rounded" />
              </div>

              {/* SERP card */}
              <div className="border-b pb-4">
                <div className="text-sm font-medium truncate">
                  {/* Headline */}
                  <span className="text-sky-700 text-base font-semibold block">
                    {showAllHeadlines ? getPreviewHeadline() : truncate(headlines[0] || "Your headline here", HL_LIMIT)}
                  </span>
                  <div className="text-xs text-gray-600 mt-1">{`example.com/${path1 || 'path'}`}{path2 ? `/${path2}` : ''}</div>
                </div>

                <p className="mt-2 text-sm text-gray-700">{getPreviewDescription()}</p>
              </div>

              {/* visual note about truncation */}
              <div className="mt-3 text-xs text-gray-500">
                <div>Headline limit: {HL_LIMIT} chars. Description limit: {DESC_LIMIT} chars.</div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 max-w-full">
            <strong className="block">Preview controls</strong>
            <ul className="list-disc pl-5 mt-2">
              <li>Switch device to see width changes.</li>
              <li>Characters over the limit will be truncated and shown with an ellipsis.</li>
              <li>Click <em>Copy preview HTML</em> to copy the preview markup for sharing.</li>
            </ul>
          </div>
        </aside>
      </main>

      <footer className="max-w-4xl mx-auto text-xs text-gray-500">
        This tool is a reimplementation for previewing ad copy only and is not affiliated with any third-party service.
      </footer>
    </div>
  );
}
