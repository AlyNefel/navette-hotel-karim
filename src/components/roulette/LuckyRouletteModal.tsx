"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X, Loader2, Sparkles, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

type PrizeItem = {
  _id?: string;
  id?: string; // from API response
  name: string;
  color: string;
  icon: string;
  isGrandPrize?: boolean;
};

export function LuckyRouletteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState<"form" | "wheel" | "result">("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wonPrize, setWonPrize] = useState<PrizeItem | null>(null);
  
  // Dynamic Prizes
  const [prizes, setPrizes] = useState<PrizeItem[]>([]);
  const [loadingPrizes, setLoadingPrizes] = useState(true);

  // Wheel states
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Fetch prizes & reset states when opened
  useEffect(() => {
    if (isOpen) {
      setStep("form");
      setName("");
      setPhone("");
      setError("");
      setWonPrize(null);
      setIsSpinning(false);
      setRotation(0);
      
      const fetchPrizes = async () => {
        setLoadingPrizes(true);
        try {
          const res = await fetch("/api/gifts");
          const data = await res.json();
          if (Array.isArray(data)) {
            // Only active prizes
            setPrizes(data.filter(g => g.isActive));
          }
        } catch (err) {
          console.error("Failed to load prizes", err);
        } finally {
          setLoadingPrizes(false);
        }
      };
      
      fetchPrizes();
    }
  }, [isOpen]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    if (prizes.length === 0) {
      setError("No prizes available to spin.");
      return;
    }
    setStep("wheel");
  };

  const startSpin = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setError("");

    try {
      const res = await fetch("/api/roulette/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to spin. Try again.");
        setIsSpinning(false);
        setStep("form");
        return;
      }

      // data.prize is { id, name, icon }
      const prizeId = data.prize.id;
      // Match against the dynamically loaded prizes via _id
      const targetIndex = prizes.findIndex((p) => p._id === prizeId);
      const prizeObj = targetIndex >= 0 ? prizes[targetIndex] : { ...data.prize, color: '#10b981' };
      
      setWonPrize(prizeObj);

      const actualTargetIndex = targetIndex >= 0 ? targetIndex : 0;
      const sliceAngle = 360 / Math.max(prizes.length, 1);
      
      // To bring slice N to the top (which is 0deg offset when looking at the arrow),
      // we rotate the wheel backwards by its center angle
      const targetAngle = 360 - (actualTargetIndex * sliceAngle + (sliceAngle / 2));
      
      const extraSpins = 5 * 360; // 5 full spins for dramatic effect
      const randomOffset = Math.floor(Math.random() * (sliceAngle * 0.8)) - (sliceAngle * 0.4); // slight offset within the slice
      
      const finalRotation = rotation + extraSpins + targetAngle + randomOffset;
      setRotation(finalRotation);

      // Wait 5 seconds for CSS transition to finish
      setTimeout(() => {
        setStep("result");
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0F4C81', '#E0A96D', '#10b981']
        });
      }, 5000);

    } catch (err) {
      setError("Network error. Please try again.");
      setIsSpinning(false);
      setStep("form");
    }
  };

  // Generate dynamic conic gradient string
  const getConicGradient = () => {
    if (prizes.length === 0) return "conic-gradient(#ccc 0deg 360deg)";
    
    const sliceAngle = 360 / prizes.length;
    const parts = prizes.map((p, i) => {
      const start = i * sliceAngle;
      const end = (i + 1) * sliceAngle;
      return `${p.color} ${start}deg ${end}deg`;
    });
    
    return `conic-gradient(${parts.join(', ')})`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={!isSpinning ? onClose : undefined}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-[#0F4C81] to-[#1a6bb5] p-6 text-center text-white relative shrink-0">
              <button 
                onClick={onClose}
                disabled={isSpinning}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition disabled:opacity-0"
              >
                <X className="w-5 h-5" />
              </button>
              <Gift className={`w-10 h-10 mx-auto mb-2 text-white ${step === 'form' ? 'animate-bounce' : ''}`} />
              <h2 className="text-2xl font-bold font-heading">Lucky Spin!</h2>
              <p className="text-sm text-white/80 mt-1">Win authentic Tunisian gifts instantly.</p>
            </div>

            <div className="p-6 overflow-y-auto">
              {loadingPrizes ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#0F4C81]" />
                  <p>Loading prizes...</p>
                </div>
              ) : (
                <>
                  {step === "form" && (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      {prizes.find(p => p.isGrandPrize) && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center mb-6">
                          <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                          <p className="text-xs font-semibold text-amber-800 uppercase tracking-widest">Grand Prize Included!</p>
                          <p className="text-sm text-amber-900 mt-1">You have the chance to win a free ride to Sidi Bou Said & Carthage!</p>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Your Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Sarah Smith"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+216 XX XXX XXX"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81]"
                        />
                      </div>

                      {error && <p className="text-sm text-red-500 font-medium text-center">{error}</p>}

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#0F4C81] to-[#E0A96D] hover:from-[#1a6bb5] hover:to-[#eaba83] text-white font-bold rounded-xl py-3.5 transition flex items-center justify-center gap-2 mt-2 shadow-lg"
                      >
                        <Sparkles className="w-5 h-5" /> Next: Spin the Wheel
                      </button>
                    </form>
                  )}

                  {step === "wheel" && (
                    <div className="py-4 flex flex-col items-center animate-in fade-in duration-500">
                      <h3 className={`text-xl font-bold text-slate-800 mb-6 text-center ${isSpinning ? 'animate-pulse' : ''}`}>
                        {isSpinning ? 'Good Luck! 🍀' : `Ready, ${name}?`}
                      </h3>
                      
                      {/* Wheel Container */}
                      <div className="relative w-[280px] h-[280px] mx-auto mb-6">
                        {/* Top Pointer (Arrow) */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                          <div className="w-8 h-10 bg-red-600 shadow-md" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}></div>
                        </div>

                        {/* Wheel */}
                        <div 
                          className="w-full h-full rounded-full border-[6px] border-[#0F4C81] shadow-2xl relative overflow-hidden"
                          style={{ 
                            transform: `rotate(${rotation}deg)`, 
                            transition: "transform 5s cubic-bezier(0.2, 0.8, 0.1, 1)"
                          }}
                        >
                          {/* CSS slices using dynamic conic-gradient */}
                          <div 
                            className="absolute inset-0 w-full h-full"
                            style={{ background: getConicGradient() }}
                          ></div>
                          
                          {/* Slices Text/Icons */}
                          {prizes.map((prize, idx) => {
                            const sliceAngle = 360 / prizes.length;
                            const deg = idx * sliceAngle;
                            // Rotate half a slice more so text is centered in the slice
                            return (
                              <div 
                                key={prize._id || prize.name}
                                className="absolute inset-0 w-full h-full"
                                style={{ transform: `rotate(${deg}deg)` }}
                              >
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center text-white" style={{ transform: `rotate(${sliceAngle / 2}deg)`, transformOrigin: "bottom center", height: "50%" }}>
                                  {prize.icon.startsWith('/') ? (
                                    <img src={prize.icon} alt={prize.name} className="w-10 h-10 object-cover rounded-full border border-white/50 drop-shadow-md mt-4" />
                                  ) : (
                                    <span className="text-3xl mt-4 drop-shadow-md">{prize.icon}</span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Center Button */}
                        <button 
                          onClick={startSpin}
                          disabled={isSpinning}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] bg-white rounded-full border-[5px] border-[#0F4C81] z-10 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100"
                        >
                          <span className="text-[#0F4C81] font-bold text-lg">SPIN</span>
                        </button>
                      </div>
                      
                      {error && <p className="text-sm text-red-500 font-medium text-center mb-2">{error}</p>}
                    </div>
                  )}

                  {step === "result" && wonPrize && (
                    <div className="text-center py-6 animate-in zoom-in duration-300">
                      <div className="w-24 h-24 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4 border-[3px] border-green-200 overflow-hidden">
                        {wonPrize.icon.startsWith('/') ? (
                          <img src={wonPrize.icon} alt={wonPrize.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-5xl drop-shadow-sm">{wonPrize.icon}</span>
                        )}
                      </div>
                      <h3 className="text-3xl font-bold text-slate-800 mb-2 font-heading">You Won!</h3>
                      <div className="inline-block bg-[#0F4C81]/5 border border-[#0F4C81]/20 rounded-xl px-6 py-4 mb-6 shadow-sm">
                        <p className="text-xl font-bold text-[#0F4C81]">{wonPrize.name}</p>
                      </div>
                      <p className="text-sm text-slate-500 mb-8 max-w-xs mx-auto">
                        We have saved your details. Our team will contact you on <strong className="text-slate-700">{phone}</strong> to arrange your gift!
                      </p>
                      <button
                        onClick={onClose}
                        className="w-full bg-[#0F4C81] hover:bg-[#1a6bb5] text-white font-bold rounded-xl py-4 transition text-lg shadow-lg"
                      >
                        Awesome, thanks!
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
