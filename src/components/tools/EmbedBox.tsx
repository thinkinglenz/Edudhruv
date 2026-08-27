"use client";
import { useState } from "react";

/**
 * "Embed this tool on your website" box — the backlink engine.
 *
 * Gives other site owners a copy-paste snippet: an <iframe> of the widget
 * PLUS an attribution <a> that sits OUTSIDE the iframe on their page. That
 * outside link is the real backlink (a link inside the iframe would only
 * count on our own domain). The functional widget is the incentive to embed;
 * the attribution link is what we earn.
 */
export default function EmbedBox({
  embedUrl,
  toolUrl,
  title,
  height = 900,
}: {
  embedUrl: string;
  toolUrl: string;
  title: string;
  height?: number;
}) {
  const [copied, setCopied] = useState(false);

  const snippet = `<iframe src="${embedUrl}" width="100%" height="${height}" style="border:1px solid #e5e7eb;border-radius:16px;max-width:820px" title="${title}" loading="lazy"></iframe>
<p style="font-size:13px;font-family:sans-serif">Powered by <a href="${toolUrl}" target="_blank" rel="noopener">EduDhruv ${title}</a></p>`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — user can still select the text manually */
    }
  }

  return (
    <section className="my-12">
      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-1">
              📋 Embed this free calculator on your website
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl">
              Run an education blog, coaching centre, or student community?
              Add this calculator to your site for free — just paste the code
              below. It stays up to date automatically.
            </p>
          </div>
          <button
            onClick={copy}
            className="shrink-0 inline-flex items-center gap-1.5 font-bold px-5 py-2.5 rounded-xl text-white transition-colors"
            style={{ background: copied ? "#10B981" : "#3AAFE5" }}
          >
            {copied ? "✓ Copied!" : "Copy embed code"}
          </button>
        </div>

        <textarea
          readOnly
          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
          value={snippet}
          rows={4}
          className="mt-4 w-full font-mono text-xs bg-white border border-gray-200 rounded-lg p-3 text-gray-700 resize-none"
        />
        <p className="mt-2 text-xs text-gray-400">
          Please keep the “Powered by EduDhruv” credit — it’s how we keep the
          tool free.
        </p>
      </div>
    </section>
  );
}
