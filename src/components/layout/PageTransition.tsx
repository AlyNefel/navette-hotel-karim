"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Pro Smoke Dissolve Transition
 * Only triggers when navigating to the /transfers page.
 * The car image starts full screen, then dissolves, accompanied by volumetric smoke drifting to the sides.
 */
export function PageTransition() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<"enter" | "exit">("enter");
  const prevPath = useRef(pathname);
  const timer1 = useRef<NodeJS.Timeout | undefined>(undefined);
  const timer2 = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    
    const isEnteringTransfers = pathname.endsWith('/transfers');
    prevPath.current = pathname;

    if (!isEnteringTransfers) return;

    // Clear any running timers
    clearTimeout(timer1.current);
    clearTimeout(timer2.current);

    setPhase("enter");
    setActive(true);

    // Hold the full image for a brief moment, then trigger the smoke dissolve
    timer1.current = setTimeout(() => {
      setPhase("exit");
    }, 400);

    // After 2500ms total, the animation finishes and we hide the overlay
    timer2.current = setTimeout(() => {
      setActive(false);
    }, 2500);

    return () => {
      clearTimeout(timer1.current);
      clearTimeout(timer2.current);
    };
  }, [pathname]);

  if (!active) return null;

  const isExit = phase === "exit";

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Background overlay to ensure smooth blending */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          backgroundColor: 'white',
          opacity: isExit ? 0 : 1,
        }}
      />
      
      {/* Main Dissolving Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/black-ford-ranger.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: "multiply",
          
          // The Smoke Effect: As it exits, it blurs heavily, drifts upwards slightly, and scales up while fading
          transition: "all 1.8s cubic-bezier(0.25, 1, 0.5, 1)",
          opacity: isExit ? 0 : 1,
          filter: isExit ? "blur(25px) brightness(1.2)" : "blur(0px) brightness(1)",
          transform: isExit 
            ? "scale(1.1) translateY(-2vh)" 
            : "scale(1) translateY(0)",
        }}
      />

      {/* Volumetric Smoke Particles (Sides) */}
      {[
        // Left side smoke
        { id: 'smoke-1', top: '20%', left: '-10%', exitTransform: 'translate(-30vw, -10vh) scale(3)', delay: '0s' },
        { id: 'smoke-2', top: '60%', left: '-15%', exitTransform: 'translate(-40vw, 10vh) scale(4)', delay: '0.1s' },
        // Right side smoke
        { id: 'smoke-3', top: '30%', left: '80%', exitTransform: 'translate(30vw, -15vh) scale(3.5)', delay: '0.05s' },
        { id: 'smoke-4', top: '70%', left: '85%', exitTransform: 'translate(40vw, 20vh) scale(4)', delay: '0.15s' },
      ].map((smoke) => (
        <div
          key={smoke.id}
          className="absolute rounded-full"
          style={{
            width: '40vw',
            height: '40vw',
            top: smoke.top,
            left: smoke.left,
            background: 'radial-gradient(circle, rgba(200,200,200,0.6) 0%, rgba(255,255,255,0) 70%)',
            filter: 'blur(40px)',
            mixBlendMode: 'screen',
            transition: `all 2s cubic-bezier(0.25, 1, 0.5, 1) ${smoke.delay}`,
            opacity: isExit ? 0 : (phase === "enter" ? 0.8 : 0),
            transform: isExit ? smoke.exitTransform : 'translate(0, 0) scale(1)',
          }}
        />
      ))}
    </div>
  );
}
