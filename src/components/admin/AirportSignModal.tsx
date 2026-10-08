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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const nameFontSize = clientName.length > 30 ? "24pt" : clientName.length > 22 ? "32pt" : "46pt";
  const nameFontSizePx = clientName.length > 30 ? 22 : clientName.length > 22 ? 28 : 36;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=1100,height=800");
    if (!printWindow) return;
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome Sign</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4 landscape; margin: 0; }
    body { width: 297mm; height: 210mm; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .sign {
      width: 297mm; height: 210mm;
      background: linear-gradient(135deg, #0a2d50 0%, #0F4C81 45%, #1a6bb5 75%, #0a2d50 100%);
      display: flex; flex-direction: row; align-items: stretch;
      position: relative; overflow: hidden;
    }
    .corner { position: absolute; width: 50mm; height: 50mm; }
    .corner.tl { top:0; left:0; border-top: 2.5px solid rgba(224,169,109,0.6); border-left: 2.5px solid rgba(224,169,109,0.6); border-radius: 0 0 50% 0; }
    .corner.tr { top:0; right:0; border-top: 2.5px solid rgba(224,169,109,0.6); border-right: 2.5px solid rgba(224,169,109,0.6); border-radius: 0 0 0 50%; }
    .corner.bl { bottom:0; left:0; border-bottom: 2.5px solid rgba(224,169,109,0.6); border-left: 2.5px solid rgba(224,169,109,0.6); border-radius: 0 50% 0 0; }
    .corner.br { bottom:0; right:0; border-bottom: 2.5px solid rgba(224,169,109,0.6); border-right: 2.5px solid rgba(224,169,109,0.6); border-radius: 50% 0 0 0; }
    .glow { position: absolute; border-radius: 50%; }
    .glow1 { width:220mm; height:220mm; top:-80mm; left:-60mm; background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%); }
    .glow2 { width:160mm; height:160mm; bottom:-60mm; right:-40mm; background: radial-gradient(circle, rgba(26,107,181,0.3) 0%, transparent 70%); }
    .left-col {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 12mm 10mm; width: 80mm; min-width: 80mm;
      border-right: 1px solid rgba(224,169,109,0.2);
      gap: 5mm; position: relative; z-index: 10;
    }
    .logo-ring {
      width: 28mm; height: 28mm; border: 2px solid rgba(224,169,109,0.65); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
    }
    .logo-letter { font-family: 'Playfair Display', serif; font-size: 22pt; font-weight: 900; color: #E0A96D; }
    .hotel-name { font-family: 'Playfair Display', serif; font-size: 16pt; font-weight: 900; color: #E0A96D; letter-spacing: 2px; text-transform: uppercase; text-align: center; line-height: 1.2; }
    .stars { color: #E0A96D; font-size: 12pt; letter-spacing: 3px; }
    .divider { width: 40mm; height: 1px; background: linear-gradient(90deg, transparent, rgba(224,169,109,0.7), transparent); }
    .transfer-label { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 10pt; color: rgba(255,255,255,0.7); letter-spacing: 1px; text-align: center; }
    .location { font-family: 'Montserrat', sans-serif; font-size: 7pt; font-weight: 300; color: rgba(255,255,255,0.3); letter-spacing: 3px; text-transform: uppercase; }
    .right-col {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      flex: 1; padding: 12mm 14mm; gap: 6mm; position: relative; z-index: 10; padding-bottom: 22mm;
    }
    .greeting { font-family: 'Montserrat', sans-serif; font-size: 8pt; font-weight: 300; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 4px; text-align: center; }
    .name-frame {
      border: 2px solid rgba(224,169,109,0.5); border-radius: 4mm;
      padding: 8mm 14mm; text-align: center;
      background: rgba(255,255,255,0.04); width: 100%;
    }
    .client-name { font-family: 'Playfair Display', serif; font-size: ${nameFontSize}; font-weight: 700; color: #ffffff; line-height: 1.1; word-break: break-word; }
    .flight-badge {
      display: inline-flex; align-items: center; gap: 2mm; margin-top: 6mm;
      background: rgba(224,169,109,0.15); border: 1px solid rgba(224,169,109,0.4);
      border-radius: 6mm; padding: 2mm 6mm;
    }
    .flight-text { font-family: 'Montserrat', sans-serif; font-size: 9pt; font-weight: 600; color: #E0A96D; letter-spacing: 2px; }
    .quote-strip {
      position: absolute; bottom: 0; left: 0; right: 0;
      padding: 4mm 14mm; display: flex; align-items: center; justify-content: center; gap: 5mm;
      border-top: 1px solid rgba(224,169,109,0.15); background: rgba(0,0,0,0.15);
    }
    .qm { font-family: 'Playfair Display', serif; font-size: 18pt; color: rgba(224,169,109,0.4); line-height: 1; }
    .qt { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 11pt; color: rgba(255,255,255,0.65); text-align: center; line-height: 1.4; }
  </style>
</head>
<body>
<div class="sign">
  <div class="corner tl"></div>
  <div class="corner tr"></div>
  <div class="corner bl"></div>
  <div class="corner br"></div>
  <div class="glow glow1"></div>
  <div class="glow glow2"></div>

  <div class="left-col">
    <div class="logo-ring"><div class="logo-letter">K</div></div>
    <div class="hotel-name">Hotel<br>Karim</div>
    <div class="stars">★ ★</div>
    <div class="divider"></div>
    <div class="transfer-label">Airport Transfer</div>
    <div class="location">Hammamet · Tunisia</div>
  </div>

  <div class="right-col">
    <div class="greeting">Bienvenue &nbsp;·&nbsp; Welcome &nbsp;·&nbsp; أهلاً وسهلاً</div>
    <div class="name-frame">
      <div class="client-name">${clientName}</div>
      ${flightNumber ? `<div class="flight-badge"><span class="flight-text">✈ ${flightNumber}</span></div>` : ""}
    </div>
  </div>

  <div class="quote-strip">
    <div class="qm">"</div>
    <div class="qt">${quote}</div>
    <div class="qm">"</div>
  </div>
</div>
<script>window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; };</script>
</body>
</html>`;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ width: "min(640px, 96vw)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-800 text-base">Airport Welcome Sign</h2>
            <p className="text-xs text-slate-500 mt-0.5">Print-ready · A4 Landscape</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview – landscape */}
        <div className="p-5 bg-slate-50 flex justify-center">
          <div
            ref={printRef}
            style={{
              width: "520px",
              height: "368px",
              background: "linear-gradient(135deg, #0a2d50 0%, #0F4C81 45%, #1a6bb5 75%, #0a2d50 100%)",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "row",
              alignItems: "stretch",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(15,76,129,0.5)",
            }}
          >
            {/* Corners */}
            <div style={{ position: "absolute", top: 0, left: 0, width: 60, height: 60, borderTop: "2px solid rgba(224,169,109,0.55)", borderLeft: "2px solid rgba(224,169,109,0.55)", borderRadius: "0 0 40% 0" }} />
            <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, borderTop: "2px solid rgba(224,169,109,0.55)", borderRight: "2px solid rgba(224,169,109,0.55)", borderRadius: "0 0 0 40%" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, width: 60, height: 60, borderBottom: "2px solid rgba(224,169,109,0.55)", borderLeft: "2px solid rgba(224,169,109,0.55)", borderRadius: "0 40% 0 0" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 60, height: 60, borderBottom: "2px solid rgba(224,169,109,0.55)", borderRight: "2px solid rgba(224,169,109,0.55)", borderRadius: "40% 0 0 0" }} />
            <div style={{ position: "absolute", width: 400, height: 400, top: -180, left: -120, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)" }} />

            {/* Left col */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 16px", width: "140px", minWidth: "140px", borderRight: "1px solid rgba(224,169,109,0.2)", gap: 8, zIndex: 10 }}>
              <div style={{ width: 48, height: 48, border: "2px solid rgba(224,169,109,0.6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 900, color: "#E0A96D" }}>K</span>
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 900, color: "#E0A96D", letterSpacing: 2, textTransform: "uppercase", textAlign: "center", lineHeight: 1.2 }}>Hotel<br />Karim</div>
              <div style={{ color: "#E0A96D", fontSize: 10, letterSpacing: 3 }}>★ ★</div>
              <div style={{ width: 70, height: 1, background: "linear-gradient(90deg, transparent, rgba(224,169,109,0.7), transparent)" }} />
              <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 8, color: "rgba(255,255,255,0.65)", textAlign: "center" }}>Airport Transfer</div>
              <div style={{ fontSize: 7, color: "rgba(255,255,255,0.25)", letterSpacing: 2, textTransform: "uppercase", textAlign: "center" }}>Hammamet · Tunisia</div>
            </div>

            {/* Right col */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "20px 24px", gap: 10, zIndex: 10, paddingBottom: 52 }}>
              <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 8, color: "rgba(255,255,255,0.4)", letterSpacing: 3, textTransform: "uppercase", textAlign: "center" }}>
                Bienvenue · Welcome · أهلاً وسهلاً
              </div>
              <div style={{ border: "1.5px solid rgba(224,169,109,0.45)", borderRadius: 8, padding: "14px 20px", textAlign: "center", background: "rgba(255,255,255,0.04)", width: "100%" }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: nameFontSizePx, fontWeight: 700, color: "#ffffff", lineHeight: 1.15, wordBreak: "break-word" }}>
                  {clientName}
                </div>
                {flightNumber && (
                  <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(224,169,109,0.15)", border: "1px solid rgba(224,169,109,0.4)", borderRadius: 20, padding: "3px 12px" }}>
                    <span style={{ fontSize: 9, fontWeight: 600, color: "#E0A96D", letterSpacing: 2 }}>✈ {flightNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quote strip */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, borderTop: "1px solid rgba(224,169,109,0.15)", background: "rgba(0,0,0,0.15)" }}>
              <span style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "rgba(224,169,109,0.4)" }}>"</span>
              <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 9, color: "rgba(255,255,255,0.6)", textAlign: "center", lineHeight: 1.4 }}>{quote}</div>
              <span style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "rgba(224,169,109,0.4)" }}>"</span>
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
