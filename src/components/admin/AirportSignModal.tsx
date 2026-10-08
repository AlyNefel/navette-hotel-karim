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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Compute font size based on name length
  const cssNameSize = clientName.length > 30 ? "24pt" : clientName.length > 22 ? "32pt" : "46pt";
  const previewNameSize = clientName.length > 30 ? 20 : clientName.length > 22 ? 26 : 34;

  const buildHtml = () => {
    const flightHtml = flightNumber
      ? `<div class="flight-badge"><span class="flight-text">&#9992; ${flightNumber}</span></div>`
      : "";

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Welcome Sign – Hotel Karim</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900&family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  @page { size: A4 landscape; margin: 0; }
  html, body { width:297mm; height:210mm; print-color-adjust:exact; -webkit-print-color-adjust:exact; }
  .sign {
    width:297mm; height:210mm;
    background: linear-gradient(135deg, #0a1f38 0%, #0d3561 45%, #0e4a7a 75%, #0a1f38 100%);
    display:flex; flex-direction:row; align-items:stretch;
    position:relative; overflow:hidden;
  }
  .corner { position:absolute; width:50mm; height:50mm; }
  .corner.tl { top:0; left:0; border-top:2.5px solid rgba(224,169,109,.6); border-left:2.5px solid rgba(224,169,109,.6); border-radius:0 0 50% 0; }
  .corner.tr { top:0; right:0; border-top:2.5px solid rgba(224,169,109,.6); border-right:2.5px solid rgba(224,169,109,.6); border-radius:0 0 0 50%; }
  .corner.bl { bottom:0; left:0; border-bottom:2.5px solid rgba(224,169,109,.6); border-left:2.5px solid rgba(224,169,109,.6); border-radius:0 50% 0 0; }
  .corner.br { bottom:0; right:0; border-bottom:2.5px solid rgba(224,169,109,.6); border-right:2.5px solid rgba(224,169,109,.6); border-radius:50% 0 0 0; }
  .glow { position:absolute; border-radius:50%; }
  .g1 { width:220mm; height:220mm; top:-80mm; left:-60mm; background:radial-gradient(circle, rgba(255,255,255,.05) 0%, transparent 70%); }
  .g2 { width:160mm; height:160mm; bottom:-60mm; right:-40mm; background:radial-gradient(circle, rgba(26,107,181,.3) 0%, transparent 70%); }
  /* Left column */
  .left {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    width:80mm; min-width:80mm; border-right:1px solid rgba(224,169,109,.2);
    padding:12mm 10mm; gap:5mm; position:relative; z-index:10;
  }
  .logo-ring {
    width:28mm; height:28mm; border:2px solid rgba(224,169,109,.65); border-radius:50%;
    display:flex; align-items:center; justify-content:center;
  }
  .logo-letter { font-family:'Playfair Display',serif; font-size:22pt; font-weight:900; color:#E0A96D; }
  .hotel-name { font-family:'Playfair Display',serif; font-size:16pt; font-weight:900; color:#E0A96D; letter-spacing:2px; text-transform:uppercase; text-align:center; line-height:1.2; }
  .stars { color:#E0A96D; font-size:12pt; letter-spacing:3px; }
  .divider { width:40mm; height:1px; background:linear-gradient(90deg, transparent, rgba(224,169,109,.7), transparent); }
  .transfer-label { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:10pt; color:rgba(255,255,255,.7); letter-spacing:1px; text-align:center; }
  .location { display: none; }
  /* Right column */
  .right {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    flex:1; padding:12mm 14mm; gap:6mm; position:relative; z-index:10; padding-bottom:22mm;
  }
  .greeting { font-family:'Montserrat',sans-serif; font-size:8pt; font-weight:300; color:rgba(255,255,255,.45); text-transform:uppercase; letter-spacing:4px; text-align:center; }
  .name-frame {
    border:2px solid rgba(224,169,109,.5); border-radius:4mm;
    padding:8mm 14mm; text-align:center;
    background:rgba(255,255,255,.04); width:100%;
  }
  .client-name { font-family:'Playfair Display',serif; font-size:${cssNameSize}; font-weight:700; color:#fff; line-height:1.1; word-break:break-word; }
  .flight-badge {
    display:inline-flex; align-items:center; gap:2mm; margin-top:6mm;
    background:rgba(224,169,109,.15); border:1px solid rgba(224,169,109,.4);
    border-radius:6mm; padding:2mm 6mm;
  }
  .flight-text { font-family:'Montserrat',sans-serif; font-size:9pt; font-weight:600; color:#E0A96D; letter-spacing:2px; }
  /* Quote strip */
  .quote-strip {
    position:absolute; bottom:0; left:0; right:0;
    padding:4mm 14mm; display:flex; align-items:center; justify-content:center; gap:5mm;
    border-top:1px solid rgba(224,169,109,.15); background:rgba(0,0,0,.15);
  }
  .qm { font-family:'Playfair Display',serif; font-size:18pt; color:rgba(224,169,109,.4); line-height:1; }
  .qt { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:11pt; color:rgba(255,255,255,.65); text-align:center; line-height:1.4; }
</style>
</head>
<body>
<div class="sign">
  <div class="corner tl"></div><div class="corner tr"></div>
  <div class="corner bl"></div><div class="corner br"></div>
  <div class="glow g1"></div><div class="glow g2"></div>
  <div class="left">
    <div class="logo-ring"><div class="logo-letter">K</div></div>
    <div class="hotel-name">Hotel<br>Karim</div>
    <div class="stars">&#9733; &#9733;</div>
    <div class="transfer-label">Airport Transfer</div>
  </div>
  <div class="right">
    <div class="greeting">Bienvenue &nbsp;&middot;&nbsp; Welcome &nbsp;&middot;&nbsp; &#1571;&#1607;&#1604;&#1611;&#1611; &#1608;&#1587;&#1607;&#1604;&#1611;&#1611;</div>
    <div class="name-frame">
      <div class="client-name">${clientName}</div>
      ${flightHtml}
    </div>
  </div>
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
        win.onafterprint = () => {
          win.close();
          URL.revokeObjectURL(url);
        };
      }, 800); // small delay to let fonts load
    };
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ width: "min(640px, 96vw)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-800 text-base">Airport Welcome Sign</h2>
            <p className="text-xs text-slate-500 mt-0.5">A4 Landscape · Print-ready</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Landscape preview */}
        <div className="p-5 bg-slate-50 flex justify-center">
          <div
            ref={iframeRef as any}
            style={{
              width: "540px",
              height: "382px",
              background: "linear-gradient(135deg, #0a1f38 0%, #0d3561 45%, #0e4a7a 75%, #0a1f38 100%)",
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
            {[["top:0,left:0", "0 0 40% 0", "Top", "Left"],["top:0,right:0", "0 0 0 40%","Top","Right"],["bottom:0,left:0","0 40% 0 0","Bottom","Left"],["bottom:0,right:0","40% 0 0 0","Bottom","Right"]].map((_, i) => {
              const positions = [
                { top: 0, left: 0, borderTop: "2px solid rgba(224,169,109,.55)", borderLeft: "2px solid rgba(224,169,109,.55)", borderRadius: "0 0 40% 0" },
                { top: 0, right: 0, borderTop: "2px solid rgba(224,169,109,.55)", borderRight: "2px solid rgba(224,169,109,.55)", borderRadius: "0 0 0 40%" },
                { bottom: 0, left: 0, borderBottom: "2px solid rgba(224,169,109,.55)", borderLeft: "2px solid rgba(224,169,109,.55)", borderRadius: "0 40% 0 0" },
                { bottom: 0, right: 0, borderBottom: "2px solid rgba(224,169,109,.55)", borderRight: "2px solid rgba(224,169,109,.55)", borderRadius: "40% 0 0 0" },
              ];
              return <div key={i} style={{ position: "absolute", width: 60, height: 60, ...positions[i] }} />;
            })}
            <div style={{ position: "absolute", width: 400, height: 400, top: -180, left: -120, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.05) 0%, transparent 70%)" }} />

            {/* Left */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 16px", width: 145, minWidth: 145, borderRight: "1px solid rgba(224,169,109,.2)", gap: 8, zIndex: 10 }}>
              <div style={{ width: 48, height: 48, border: "2px solid rgba(224,169,109,.6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "Georgia,serif", fontSize: 22, fontWeight: 900, color: "#E0A96D" }}>K</span>
              </div>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 13, fontWeight: 900, color: "#E0A96D", letterSpacing: 2, textTransform: "uppercase", textAlign: "center", lineHeight: 1.2 }}>Hotel<br />Karim</div>
              <div style={{ color: "#E0A96D", fontSize: 10, letterSpacing: 3 }}>★ ★</div>
              <div style={{ width: 70, height: 1, background: "linear-gradient(90deg, transparent, rgba(224,169,109,.7), transparent)" }} />
              <div style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 8, color: "rgba(255,255,255,.65)", textAlign: "center" }}>Airport Transfer</div>
              <div style={{ fontSize: 7, color: "rgba(255,255,255,.25)", letterSpacing: 2, textTransform: "uppercase", textAlign: "center", display: "none" }}>Hammamet · Tunisia</div>
            </div>

            {/* Right */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "20px 24px", gap: 10, zIndex: 10, paddingBottom: 52 }}>
              <div style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 8, color: "rgba(255,255,255,.4)", letterSpacing: 3, textTransform: "uppercase", textAlign: "center" }}>
                Bienvenue · Welcome · أهلاً وسهلاً
              </div>
              <div style={{ border: "1.5px solid rgba(224,169,109,.45)", borderRadius: 8, padding: "14px 20px", textAlign: "center", background: "rgba(255,255,255,.04)", width: "100%" }}>
                <div style={{ fontFamily: "Georgia,serif", fontSize: previewNameSize, fontWeight: 700, color: "#fff", lineHeight: 1.15, wordBreak: "break-word" }}>
                  {clientName}
                </div>
                {flightNumber && (
                  <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(224,169,109,.15)", border: "1px solid rgba(224,169,109,.4)", borderRadius: 20, padding: "3px 12px" }}>
                    <span style={{ fontSize: 9, fontWeight: 600, color: "#E0A96D", letterSpacing: 2 }}>✈ {flightNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quote */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, borderTop: "1px solid rgba(224,169,109,.15)", background: "rgba(0,0,0,.15)" }}>
              <span style={{ fontFamily: "Georgia,serif", fontSize: 16, color: "rgba(224,169,109,.4)" }}>&ldquo;</span>
              <div style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 9, color: "rgba(255,255,255,.6)", textAlign: "center", lineHeight: 1.4 }}>{quote}</div>
              <span style={{ fontFamily: "Georgia,serif", fontSize: 16, color: "rgba(224,169,109,.4)" }}>&rdquo;</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex items-center justify-between gap-3 border-t border-slate-100 bg-white">
          <button
            onClick={() => setQuote(getRandom())}
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
