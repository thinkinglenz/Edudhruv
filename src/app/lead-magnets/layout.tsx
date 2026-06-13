/**
 * Clean layout for /lead-magnets/* routes — strips site chrome so the
 * guide content prints cleanly to PDF (Cmd+P → Save as PDF).
 *
 * No header, no footer, no ads.
 */
export default function LeadMagnetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white print:bg-white">
      {children}
    </div>
  );
}
