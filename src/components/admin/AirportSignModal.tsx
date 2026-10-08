"use client";

import { useEffect, useRef, useState } from "react";
import { X, Printer, RefreshCw } from "lucide-react";

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

function getRandom() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

interface Props {
  clientName: string;
  flightNumber?: string;
  onClose: () => void;
}

export function AirportSignModal({ clientName, flightNumber, onClose }: Props) {
  const [quote, setQuote] = useState(getRandom);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const cssNameSize = clientName.length > 30 ? "28pt" : clientName.length > 22 ? "40pt" : "58pt";
  const previewNameSize = clientName.length > 30 ? 24 : clientName.length > 22 ? 32 : 48;

  const buildHtml = () => {
    const flightHtml = flightNumber
      ? `<div class="flight-badge"><span class="flight-text">&#9992; ${flightNumber}</span></div>`
      : "";

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Welcome Sign – Hotel Karim</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  @page { size: A4 landscape; margin: 0; }
  html, body { width:297mm; height:210mm; print-color-adjust:exact; -webkit-print-color-adjust:exact; }

  /* ── Sidi Bou Said palette ──
     Cobalt blue doors:  #1B3A8A / #163275
     Whitewashed walls:  #FAFAF7
     Gold gradient:      #B8863A → #F5D98A → #C9963E
  */
  .sign {
    width:297mm; height:210mm;
    background: #FAFAF7;
    display:flex; flex-direction:row; align-items:stretch;
    position:relative; overflow:hidden;
  }

  /* Subtle blue arch decoration top-right */
  .arch {
    position:absolute; top:-30mm; right:-20mm;
    width:100mm; height:100mm;
    border:18mm solid rgba(27,58,138,0.07);
    border-radius:50%;
  }
  .arch2 {
    position:absolute; bottom:-20mm; left:68mm;
    width:60mm; height:60mm;
    border:8mm solid rgba(27,58,138,0.05);
    border-radius:50%;
  }

  /* ── Left cobalt panel ── */
  .left {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    width:82mm; min-width:82mm;
    background: linear-gradient(170deg, #1B3A8A 0%, #163272 60%, #0f2255 100%);
    padding:12mm 10mm; gap:5mm; position:relative; z-index:10;
  }

  /* Inner glow on blue panel */
  .left::before {
    content:''; position:absolute;
    top:0; left:0; right:0; bottom:0;
    background: radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 65%);
  }

  /* Corner ornaments on the blue panel */
  .left .co {
    position:absolute; width:22mm; height:22mm;
  }
  .left .co.tl { top:5mm; left:5mm; border-top:1.5px solid rgba(245,217,138,0.5); border-left:1.5px solid rgba(245,217,138,0.5); border-radius:0 0 40% 0; }
  .left .co.br { bottom:5mm; right:5mm; border-bottom:1.5px solid rgba(245,217,138,0.5); border-right:1.5px solid rgba(245,217,138,0.5); border-radius:40% 0 0 0; }

  /* Gold gradient text helper */
  .gold-text {
    background: linear-gradient(135deg, #B8863A 0%, #F5D98A 45%, #C9963E 75%, #F5D260 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .logo-ring {
    width:26mm; height:26mm;
    border:2px solid transparent;
    background:
      linear-gradient(#163272,#163272) padding-box,
      linear-gradient(135deg, #B8863A, #F5D98A, #C9963E) border-box;
    border-radius:50%;
    display:flex; align-items:center; justify-content:center;
  }
  .logo-letter {
    font-family:'Playfair Display',serif; font-size:20pt; font-weight:900;
    background: linear-gradient(135deg, #B8863A 0%, #F5D98A 50%, #C9963E 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }

  .hotel-name {
    font-family:'Playfair Display',serif; font-size:15pt; font-weight:900;
    letter-spacing:2px; text-transform:uppercase; text-align:center; line-height:1.2;
    background: linear-gradient(135deg, #B8863A 0%, #F5D98A 45%, #C9963E 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }

  .gold-divider {
    width:36mm; height:1.5px;
    background: linear-gradient(90deg, transparent, #F5D98A, transparent);
  }

  .transfer-label {
    font-family:'Cormorant Garamond',serif; font-style:italic; font-size:10pt;
    color:rgba(255,255,255,0.72); letter-spacing:1px; text-align:center;
  }

  /* ── Right white panel ── */
  .right {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    flex:1; padding:10mm 14mm; gap:5mm; position:relative; z-index:10;
    padding-bottom:20mm;
  }

  .greeting {
    font-family:'Montserrat',sans-serif; font-size:7.5pt; font-weight:300;
    color:#8a9bc0; text-transform:uppercase; letter-spacing:4px; text-align:center;
  }

  /* Name frame: white card with cobalt border and gold corners */
  .name-frame {
    border:1.5px solid #1B3A8A;
    border-radius:3mm;
    padding:8mm 14mm; text-align:center;
    background:#ffffff;
    width:100%; position:relative;
    box-shadow: 0 4px 24px rgba(27,58,138,0.08);
  }
  /* Gold corner accents on name frame */
  .name-frame::before, .name-frame::after {
    content:''; position:absolute; width:10mm; height:10mm;
  }
  .name-frame::before {
    top:-1.5px; left:-1.5px;
    border-top:3px solid #C9963E; border-left:3px solid #C9963E;
    border-radius:3mm 0 0 0;
  }
  .name-frame::after {
    bottom:-1.5px; right:-1.5px;
    border-bottom:3px solid #C9963E; border-right:3px solid #C9963E;
    border-radius:0 0 3mm 0;
  }

  .client-name {
    font-family:'Playfair Display',serif; font-size:${cssNameSize};
    font-weight:900; line-height:1.1; word-break:break-word;
    background: linear-gradient(135deg, #1B3A8A 0%, #2651b8 50%, #163272 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }

  .flight-badge {
    display:inline-flex; align-items:center; gap:2mm; margin-top:5mm;
    background:rgba(27,58,138,0.07); border:1px solid rgba(27,58,138,0.3);
    border-radius:6mm; padding:2mm 6mm;
  }
  .flight-text {
    font-family:'Montserrat',sans-serif; font-size:9pt; font-weight:600;
    color:#1B3A8A; letter-spacing:2px;
  }

  /* ── Bottom gold quote strip ── */
  .quote-strip {
    position:absolute; bottom:0; left:0; right:0;
    padding:3.5mm 14mm; display:flex; align-items:center; justify-content:center; gap:5mm;
    background: linear-gradient(135deg, #1B3A8A 0%, #163272 50%, #1B3A8A 100%);
    border-top: 2px solid transparent;
  }
  .qm {
    font-family:'Playfair Display',serif; font-size:16pt;
    background: linear-gradient(135deg, #B8863A 0%, #F5D98A 50%, #C9963E 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    line-height:1;
  }
  .qt {
    font-family:'Cormorant Garamond',serif; font-style:italic; font-size:11pt;
    color:rgba(255,255,255,0.82); text-align:center; line-height:1.4;
  }

  /* White vertical divider */
  .v-divider {
    width:0; height:100%;
    border-left:1px solid rgba(27,58,138,0.12);
    position:absolute; left:82mm; top:0; z-index:5;
  }
</style>
</head>
<body>
<div class="sign">
  <div class="arch"></div>
  <div class="arch2"></div>
  <div class="v-divider"></div>

  <!-- Left cobalt panel -->
  <div class="left">
    <div class="co tl"></div>
    <div class="co br"></div>
    <div class="logo-ring"><div class="logo-letter">K</div></div>
    <div class="hotel-name">Hotel<br>Karim</div>
    <div class="gold-divider"></div>
    <div class="transfer-label">Airport Transfer</div>
  </div>

  <!-- Right white panel -->
  <div class="right">
    <div class="greeting">Bienvenue &nbsp;&middot;&nbsp; Welcome &nbsp;&middot;&nbsp; أهلاً وسهلاً</div>
    <div class="name-frame">
      <div class="client-name">${clientName}</div>
      ${flightHtml}
    </div>
  </div>

  <!-- Gold quote strip -->
  <div class="quote-strip">
    <div class="qm">&ldquo;</div>
    <div class="qt">${quote}</div>
    <div class="qm">&rdquo;</div>
  </div>
</div>
</body>
</html>`;
  };

  const handlePrint = () => {
    const html = buildHtml();
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (!win) {
      alert("Please allow popups for this site to print the sign.");
      return;
    }
    win.onload = () => {
      setTimeout(() => {
        win.print();
        win.onafterprint = () => { win.close(); URL.revokeObjectURL(url); };
      }, 900);
    };
  };

  // ── Preview colours (match print) ──
  const cobalPanel = "linear-gradient(170deg, #1B3A8A 0%, #163272 60%, #0f2255 100%)";
  const goldGrad   = "linear-gradient(135deg, #B8863A 0%, #F5D98A 45%, #C9963E 100%)";
  const blueGrad   = "linear-gradient(135deg, #1B3A8A 0%, #2651b8 50%, #163272 100%)";
  const quoteStrip = "linear-gradient(135deg, #1B3A8A 0%, #163272 50%, #1B3A8A 100%)";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ width: "min(660px, 96vw)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-800 text-base">Airport Welcome Sign</h2>
            <p className="text-xs text-slate-500 mt-0.5">Sidi Bou Said · A4 Landscape</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview */}
        <div className="p-5 bg-slate-100 flex justify-center">
          <div style={{
            width: "540px", height: "382px",
            background: "#FAFAF7",
            borderRadius: "12px",
            display: "flex", flexDirection: "row", alignItems: "stretch",
            position: "relative", overflow: "hidden",
            boxShadow: "0 20px 60px rgba(27,58,138,0.18), 0 4px 16px rgba(0,0,0,0.08)",
          }}>
            {/* Arch decoration */}
            <div style={{ position: "absolute", top: -60, right: -40, width: 190, height: 190, border: "36px solid rgba(27,58,138,0.06)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", bottom: -40, left: 140, width: 115, height: 115, border: "15px solid rgba(27,58,138,0.04)", borderRadius: "50%" }} />

            {/* Left cobalt panel */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 158, minWidth: 158, background: cobalPanel, padding: "20px 16px", gap: 10, zIndex: 10, position: "relative" }}>
              {/* Corner ornaments */}
              <div style={{ position: "absolute", top: 10, left: 10, width: 36, height: 36, borderTop: "1.5px solid rgba(245,217,138,0.5)", borderLeft: "1.5px solid rgba(245,217,138,0.5)", borderRadius: "0 0 35% 0" }} />
              <div style={{ position: "absolute", bottom: 10, right: 10, width: 36, height: 36, borderBottom: "1.5px solid rgba(245,217,138,0.5)", borderRight: "1.5px solid rgba(245,217,138,0.5)", borderRadius: "35% 0 0 0" }} />
              {/* Inner glow */}
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 60%)" }} />

              {/* Logo ring */}
              <div style={{ width: 50, height: 50, borderRadius: "50%", border: "2px solid #C9963E", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(22,50,114,0.5)" }}>
                <span style={{ fontFamily: "Georgia,serif", fontSize: 22, fontWeight: 900, background: goldGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>K</span>
              </div>

              <div style={{ fontFamily: "Georgia,serif", fontSize: 13, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", textAlign: "center", lineHeight: 1.2, background: goldGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Hotel<br />Karim
              </div>

              <div style={{ width: 70, height: 1.5, background: "linear-gradient(90deg, transparent, #F5D98A, transparent)" }} />

              <div style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 8, color: "rgba(255,255,255,0.72)", textAlign: "center" }}>
                Airport Transfer
              </div>
            </div>

            {/* Divider line */}
            <div style={{ position: "absolute", left: 158, top: 0, bottom: 0, width: 1, background: "rgba(27,58,138,0.12)", zIndex: 5 }} />

            {/* Right white panel */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "20px 24px", gap: 10, zIndex: 10, paddingBottom: 52 }}>
              <div style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 8, color: "#8a9bc0", letterSpacing: 3, textTransform: "uppercase", textAlign: "center" }}>
                Bienvenue · Welcome · أهلاً وسهلاً
              </div>

              {/* Name card */}
              <div style={{ border: "1.5px solid #1B3A8A", borderRadius: 8, padding: "14px 20px", textAlign: "center", background: "#fff", width: "100%", position: "relative", boxShadow: "0 4px 20px rgba(27,58,138,0.07)" }}>
                {/* Gold corner accents */}
                <div style={{ position: "absolute", top: -2, left: -2, width: 18, height: 18, borderTop: "3px solid #C9963E", borderLeft: "3px solid #C9963E", borderRadius: "8px 0 0 0" }} />
                <div style={{ position: "absolute", bottom: -2, right: -2, width: 18, height: 18, borderBottom: "3px solid #C9963E", borderRight: "3px solid #C9963E", borderRadius: "0 0 8px 0" }} />

                <div style={{ fontFamily: "Georgia,serif", fontSize: previewNameSize, fontWeight: 900, lineHeight: 1.15, wordBreak: "break-word", background: blueGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {clientName}
                </div>

                {flightNumber && (
                  <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(27,58,138,0.07)", border: "1px solid rgba(27,58,138,0.25)", borderRadius: 20, padding: "3px 12px" }}>
                    <span style={{ fontSize: 9, fontWeight: 600, color: "#1B3A8A", letterSpacing: 2 }}>✈ {flightNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Gold quote strip */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "7px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, background: quoteStrip }}>
              <span style={{ fontFamily: "Georgia,serif", fontSize: 16, background: goldGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>&ldquo;</span>
              <div style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 9, color: "rgba(255,255,255,0.82)", textAlign: "center", lineHeight: 1.4 }}>{quote}</div>
              <span style={{ fontFamily: "Georgia,serif", fontSize: 16, background: goldGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>&rdquo;</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex items-center justify-between gap-3 border-t border-slate-100 bg-white">
          <button
            onClick={() => setQuote(getRandom())}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#1B3A8A] transition font-medium px-3 py-2 rounded-xl hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4" />
            New Quote
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1B3A8A] hover:bg-[#163272] text-white font-bold rounded-xl transition shadow-md text-sm"
          >
            <Printer className="w-4 h-4" />
            Print Sign
          </button>
        </div>
      </div>
    </div>
  );
}
