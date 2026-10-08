"use client";

import { useRef, useEffect, useState } from "react";
import { X, Printer, RefreshCw } from "lucide-react";

// Curated set of elegant welcome/hospitality quotes
const QUOTES = [
  "Your comfort is our greatest pleasure. Welcome to Tunisia.",
  "A warm welcome awaits — let us make your stay unforgettable.",
  "From our family to yours, welcome to Hotel Karim.",
  "The finest journeys begin with a warm welcome.",
  "Travel far, arrive in comfort. Welcome, dear guest.",
  "Where the Mediterranean breeze meets genuine hospitality.",
  "Every great adventure starts with a warm greeting.",
  "Welcome — your home away from home awaits you.",
  "We are honoured to accompany you on your journey.",
  "Tunisia's heart is open, and so are our doors.",
  "May your stay be as beautiful as the Tunisian sun.",
  "Your journey ends here. Your adventure begins now.",
];

function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

interface AirportSignModalProps {
  clientName: string;
  flightNumber?: string;
  onClose: () => void;
}

export function AirportSignModal({ clientName, flightNumber, onClose }: AirportSignModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [quote, setQuote] = useState(getRandomQuote);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=800,height=1100");
    if (!printWindow) return;
    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Airport Sign – ${clientName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4 portrait; margin: 0; }
    body { width: 210mm; height: 297mm; background: white; font-family: 'Montserrat', sans-serif; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .sign { width: 210mm; height: 297mm; background: linear-gradient(160deg, #0a2d50 0%, #0F4C81 40%, #1a6bb5 70%, #0a2d50 100%); display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 18mm 14mm; position: relative; overflow: hidden; }
    .corner-ornament { position: absolute; width: 60mm; height: 60mm; opacity: 0.12; }
    .corner-ornament.tl { top: 0; left: 0; border-top: 3px solid #E0A96D; border-left: 3px solid #E0A96D; border-radius: 0 0 50% 0; }
    .corner-ornament.tr { top: 0; right: 0; border-top: 3px solid #E0A96D; border-right: 3px solid #E0A96D; border-radius: 0 0 0 50%; }
    .corner-ornament.bl { bottom: 0; left: 0; border-bottom: 3px solid #E0A96D; border-left: 3px solid #E0A96D; border-radius: 0 50% 0 0; }
    .corner-ornament.br { bottom: 0; right: 0; border-bottom: 3px solid #E0A96D; border-right: 3px solid #E0A96D; border-radius: 50% 0 0 0; }
    .bg-circle { position: absolute; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%); }
    .bg-circle.c1 { width: 200mm; height: 200mm; top: -60mm; left: -60mm; }
    .bg-circle.c2 { width: 150mm; height: 150mm; bottom: -40mm; right: -40mm; }
    /* Top section */
    .top-section { display: flex; flex-direction: column; align-items: center; gap: 6mm; width: 100%; }
    .hotel-name { font-family: 'Playfair Display', serif; font-size: 22pt; font-weight: 900; color: #E0A96D; letter-spacing: 3px; text-transform: uppercase; text-align: center; line-height: 1.2; }
    .hotel-stars { color: #E0A96D; font-size: 16pt; letter-spacing: 4px; margin-top: 1mm; }
    .divider-top { width: 70mm; height: 1px; background: linear-gradient(90deg, transparent, #E0A96D, transparent); margin: 4mm auto; }
    .welcome-label { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 14pt; color: rgba(255,255,255,0.75); letter-spacing: 2px; text-align: center; }
    /* Middle - Client Name */
    .name-section { display: flex; flex-direction: column; align-items: center; width: 100%; flex: 1; justify-content: center; }
    .name-frame { border: 2px solid rgba(224,169,109,0.5); border-radius: 4mm; padding: 10mm 16mm; text-align: center; position: relative; background: rgba(255,255,255,0.04); backdrop-filter: blur(4px); }
    .name-frame::before { content: ''; position: absolute; top: -4px; left: -4px; right: -4px; bottom: -4px; border: 1px solid rgba(224,169,109,0.2); border-radius: 6mm; }
    .greeting-small { font-family: 'Montserrat', sans-serif; font-size: 9pt; font-weight: 300; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 4px; margin-bottom: 5mm; }
    .client-name { font-family: 'Playfair Display', serif; font-size: 38pt; font-weight: 700; color: #ffffff; letter-spacing: 1px; line-height: 1.15; word-break: break-word; }
    .client-name.long { font-size: 28pt; }
    .flight-badge { margin-top: 6mm; display: inline-flex; align-items: center; gap: 2mm; background: rgba(224,169,109,0.15); border: 1px solid rgba(224,169,109,0.4); border-radius: 6mm; padding: 2mm 6mm; }
    .flight-text { font-family: 'Montserrat', sans-serif; font-size: 9pt; font-weight: 600; color: #E0A96D; letter-spacing: 2px; }
    /* Quote section */
    .quote-section { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 5mm; }
    .divider-bottom { width: 50mm; height: 1px; background: linear-gradient(90deg, transparent, rgba(224,169,109,0.6), transparent); }
    .quote-mark { font-family: 'Playfair Display', serif; font-size: 28pt; color: rgba(224,169,109,0.4); line-height: 1; }
    .quote-text { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 13pt; color: rgba(255,255,255,0.7); text-align: center; line-height: 1.6; max-width: 150mm; }
    .bottom-brand { font-family: 'Montserrat', sans-serif; font-size: 8pt; font-weight: 300; color: rgba(255,255,255,0.3); letter-spacing: 3px; text-transform: uppercase; margin-top: 4mm; }
  </style>
</head>
<body>
  <div class="sign">
    <div class="corner-ornament tl"></div>
    <div class="corner-ornament tr"></div>
    <div class="corner-ornament bl"></div>
    <div class="corner-ornament br"></div>
    <div class="bg-circle c1"></div>
    <div class="bg-circle c2"></div>

    <div class="top-section">
      <div class="hotel-name">Hotel Karim</div>
      <div class="hotel-stars">★ ★</div>
      <div class="divider-top"></div>
      <div class="welcome-label">Airport Transfer · Welcome</div>
    </div>

    <div class="name-section">
      <div class="name-frame">
        <div class="greeting-small">Bienvenue · Welcome · أهلاً</div>
        <div class="client-name \${clientName.length > 18 ? 'long' : ''}">\${clientName}</div>
        \${flightNumber ? \`<div class="flight-badge"><span class="flight-text">✈ \${flightNumber}</span></div>\` : ""}
      </div>
    </div>

    <div class="quote-section">
      <div class="divider-bottom"></div>
      <div class="quote-mark">"</div>
      <div class="quote-text">\${quote}</div>
      <div class="bottom-brand">Hotel Karim · Hammamet · Tunisia</div>
    </div>
  </div>
  <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }</script>
</body>
</html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ width: "min(480px, 95vw)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-800 text-base">Airport Welcome Sign</h2>
            <p className="text-xs text-slate-500 mt-0.5">Print-ready portrait · A4</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sign preview */}
        <div className="p-5 bg-slate-50 flex justify-center">
          {/* A4 preview scaled to fit */}
          <div
            ref={printRef}
            style={{
              width: "260px",
              height: "368px",
              background: "linear-gradient(160deg, #0a2d50 0%, #0F4C81 40%, #1a6bb5 70%, #0a2d50 100%)",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "24px 20px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(15,76,129,0.5)",
            }}
          >
            {/* Corner ornaments */}
            <div style={{ position: "absolute", top: 0, left: 0, width: 70, height: 70, borderTop: "2px solid rgba(224,169,109,0.5)", borderLeft: "2px solid rgba(224,169,109,0.5)", borderRadius: "0 0 40% 0" }} />
            <div style={{ position: "absolute", top: 0, right: 0, width: 70, height: 70, borderTop: "2px solid rgba(224,169,109,0.5)", borderRight: "2px solid rgba(224,169,109,0.5)", borderRadius: "0 0 0 40%" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, width: 70, height: 70, borderBottom: "2px solid rgba(224,169,109,0.5)", borderLeft: "2px solid rgba(224,169,109,0.5)", borderRadius: "0 40% 0 0" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 70, height: 70, borderBottom: "2px solid rgba(224,169,109,0.5)", borderRight: "2px solid rgba(224,169,109,0.5)", borderRadius: "40% 0 0 0" }} />
            {/* BG glow */}
            <div style={{ position: "absolute", width: 280, height: 280, top: -120, left: -100, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)" }} />

            {/* Top */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, zIndex: 10 }}>
              <div style={{ fontFamily: "'Georgia', serif", fontSize: 14, fontWeight: 900, color: "#E0A96D", letterSpacing: 3, textTransform: "uppercase", textAlign: "center" }}>
                Hotel Karim
              </div>
              <div style={{ color: "#E0A96D", fontSize: 10, letterSpacing: 4 }}>★ ★</div>
              <div style={{ width: 80, height: 1, background: "linear-gradient(90deg, transparent, #E0A96D, transparent)", margin: "4px auto" }} />
              <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 9, color: "rgba(255,255,255,0.65)", letterSpacing: 1 }}>
                Airport Transfer · Welcome
              </div>
            </div>

            {/* Name */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, justifyContent: "center", width: "100%", zIndex: 10 }}>
              <div style={{ border: "1.5px solid rgba(224,169,109,0.45)", borderRadius: 8, padding: "14px 18px", textAlign: "center", background: "rgba(255,255,255,0.04)", width: "100%" }}>
                <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 7, color: "rgba(255,255,255,0.45)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
                  Bienvenue · Welcome · أهلاً
                </div>
                <div style={{
                  fontFamily: "Georgia, serif",
                  fontSize: clientName.length > 18 ? 18 : 24,
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1.2,
                  wordBreak: "break-word",
                }}>
                  {clientName}
                </div>
                {flightNumber && (
                  <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(224,169,109,0.15)", border: "1px solid rgba(224,169,109,0.4)", borderRadius: 20, padding: "2px 10px" }}>
                    <span style={{ fontSize: 7, fontWeight: 600, color: "#E0A96D", letterSpacing: 2 }}>✈ {flightNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quote */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: "100%", zIndex: 10 }}>
              <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, rgba(224,169,109,0.5), transparent)" }} />
              <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "rgba(224,169,109,0.4)", lineHeight: 1 }}>"</div>
              <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 8, color: "rgba(255,255,255,0.65)", textAlign: "center", lineHeight: 1.5, maxWidth: 200 }}>
                {quote}
              </div>
              <div style={{ fontSize: 6, color: "rgba(255,255,255,0.25)", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>
                Hotel Karim · Hammamet · Tunisia
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex items-center justify-between gap-3 border-t border-slate-100 bg-white">
          <button
            onClick={() => setQuote(getRandomQuote())}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0F4C81] transition font-medium px-3 py-2 rounded-xl hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4" />
            New Quote
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0F4C81] hover:bg-[#1a6bb5] text-white font-bold rounded-xl transition shadow-md text-sm"
          >
            <Printer className="w-4 h-4" />
            Print Sign
          </button>
        </div>
      </div>
    </div>
  );
}
