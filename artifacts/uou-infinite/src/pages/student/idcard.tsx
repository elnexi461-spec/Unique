import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, Download, IdCard, Shield, QrCode, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { QRCodeSVG } from "qrcode.react";
import { PageTransition } from "@/components/PageTransition";

const CAMPUS_COLORS: Record<string, string> = {
  Zaria: "#A78BFA",
  Lagos: "#34D399",
  Kano:  "#F59E0B",
  HQ:    "#0070FF",
};

const MAJORS: Record<string, string> = {
  student:     "Business & Entrepreneurship",
  lecturer:    "Faculty — AI & Digital Systems",
  coordinator: "Academic Coordination",
  founder:     "Institutional Leadership",
};

function HolographicCard({
  campusColor,
  campus,
  studentId,
  programme,
  expiryDate,
  qrValue,
  userName,
  major,
  year,
}: {
  campusColor: string;
  campus: string;
  studentId: string;
  programme: string;
  expiryDate: string;
  qrValue: string;
  userName: string;
  major: string;
  year: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Spring physics for smooth inertia
  const rotateX = useSpring(0, { stiffness: 140, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 140, damping: 22 });
  const glareX  = useSpring(50, { stiffness: 120, damping: 18 });
  const glareY  = useSpring(50, { stiffness: 120, damping: 18 });

  // Transform spring values → CSS-usable range
  const cardRotateX = useTransform(rotateX, v => `${v}deg`);
  const cardRotateY = useTransform(rotateY, v => `${v}deg`);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    rotateX.set(-dy * 14);
    rotateY.set( dx * 18);
    glareX.set((e.clientX - rect.left) / rect.width  * 100);
    glareY.set((e.clientY - rect.top)  / rect.height * 100);
  }, [rotateX, rotateY, glareX, glareY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  }, [rotateX, rotateY, glareX, glareY]);

  // Mobile auto-tilt — gyroscope DeviceOrientation
  useEffect(() => {
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (!isMobile) return;

    let frame = 0;
    // Slow auto-tilt when no gyroscope permission
    const autoTilt = () => {
      const t = Date.now() / 3000;
      rotateX.set(Math.sin(t * 0.7) * 8);
      rotateY.set(Math.cos(t * 0.5) * 12);
      glareX.set(50 + Math.sin(t * 0.9) * 35);
      glareY.set(50 + Math.cos(t * 0.6) * 25);
      frame = requestAnimationFrame(autoTilt);
    };

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      cancelAnimationFrame(frame);
      rotateX.set(Math.max(-18, Math.min(18, (e.beta  - 45) * 0.5)));
      rotateY.set(Math.max(-22, Math.min(22,  e.gamma        * 0.6)));
    };

    if (typeof DeviceOrientationEvent !== "undefined" &&
        typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      // iOS 13+ — start auto-tilt; user must tap to enable gyro
      frame = requestAnimationFrame(autoTilt);
    } else {
      window.addEventListener("deviceorientation", onOrientation);
      frame = requestAnimationFrame(autoTilt);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, [rotateX, rotateY, glareX, glareY]);

  return (
    <div
      ref={cardRef}
      style={{ perspective: "900px", width: "min(420px, 100%)", cursor: "default" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX: cardRotateX,
          rotateY: cardRotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Card body */}
        <div
          className="rounded-3xl overflow-hidden relative select-none"
          style={{
            background: "linear-gradient(145deg, #020B1A 0%, #040F28 45%, #061540 100%)",
            border: `1px solid ${campusColor}45`,
            boxShadow: `
              0 0 0 1px rgba(0,112,255,0.08),
              0 4px 32px rgba(0,0,0,0.7),
              0 0 60px ${campusColor}18,
              inset 0 1px 0 rgba(255,255,255,0.06)
            `,
            aspectRatio: "85.6/54",
          }}
        >
          {/* ── Rainbow hologram foil overlay ── */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20 rounded-3xl"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(ellipse at ${gx}% ${gy}%,
                    rgba(255,255,255,0.18) 0%,
                    rgba(0,112,255,0.12) 20%,
                    rgba(167,139,250,0.09) 38%,
                    rgba(52,211,153,0.07) 55%,
                    rgba(245,158,11,0.05) 70%,
                    transparent 85%
                  )`
              ),
              mixBlendMode: "screen",
            }}
          />

          {/* ── Iridescent shimmer scan lines ── */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-10 rounded-3xl overflow-hidden"
            style={{ opacity: 0.35 }}
          >
            <motion.div
              animate={{ backgroundPosition: ["0% 0%", "0% 100%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `
                  repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 3px,
                    rgba(0,112,255,0.06) 3px,
                    rgba(0,112,255,0.06) 4px
                  )
                `,
                backgroundSize: "100% 8px",
              }}
            />
          </motion.div>

          {/* ── Moving diagonal shimmer ── */}
          <motion.div
            animate={{ x: ["-120%", "220%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
            className="absolute inset-y-0 w-1/3 z-30 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.09) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.09) 55%, transparent 100%)",
              transform: "skewX(-18deg)",
            }}
          />

          {/* Top color stripe */}
          <div
            className="h-1.5 w-full relative z-40"
            style={{ background: `linear-gradient(90deg, #0040C0, ${campusColor}, #60A5FA, ${campusColor}, #0040C0)` }}
          />

          {/* Card content */}
          <div className="p-5 relative z-40">
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <img src={import.meta.env.BASE_URL + "uou-logo.png"} alt="UOU"
                  className="w-8 h-8 object-contain"
                  style={{ filter: "drop-shadow(0 0 8px rgba(0,112,255,0.7))" }} />
                <div>
                  <div className="text-[8px] font-black tracking-[0.3em] uppercase" style={{ color: "#0070FF" }}>
                    Unique Open University
                  </div>
                  <div className="text-[6px] tracking-[0.2em] uppercase" style={{ color: "rgba(148,163,184,0.6)" }}>
                    Federal Republic of Nigeria — Est. 2021
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <div className="text-[8px] font-bold font-mono" style={{ color: campusColor }}>
                  {campus} Campus
                </div>
                <div className="text-[6px] font-mono" style={{ color: "rgba(148,163,184,0.5)" }}>
                  {year}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <motion.div
                animate={{ boxShadow: [`0 0 12px ${campusColor}40`, `0 0 24px ${campusColor}80`, `0 0 12px ${campusColor}40`] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="w-[52px] h-[64px] rounded-xl flex items-center justify-center shrink-0 text-xl font-black border-2"
                style={{
                  background: `linear-gradient(135deg, ${campusColor}25, ${campusColor}0a)`,
                  borderColor: `${campusColor}55`,
                  color: campusColor,
                }}
              >
                {userName.charAt(0)}
              </motion.div>

              {/* Info columns */}
              <div className="flex-1 min-w-0 space-y-1">
                <div>
                  <div className="text-[7px] uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.5)" }}>Full Name</div>
                  <div className="text-[11px] font-black text-white leading-tight truncate">{userName}</div>
                </div>
                <div>
                  <div className="text-[7px] uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.5)" }}>Student ID</div>
                  <div className="text-[10px] font-mono font-bold" style={{ color: campusColor }}>{studentId}</div>
                </div>
                <div>
                  <div className="text-[7px] uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.5)" }}>Programme</div>
                  <div className="text-[9px] font-semibold text-white leading-tight truncate">{major || programme}</div>
                </div>
                <div className="flex items-center gap-3 pt-0.5">
                  <div>
                    <div className="text-[6px] uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.45)" }}>Expires</div>
                    <div className="text-[8px] font-mono text-white">{expiryDate}</div>
                  </div>
                  <div>
                    <div className="text-[6px] uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.45)" }}>Status</div>
                    <div className="text-[8px] font-bold" style={{ color: "#34D399" }}>ACTIVE</div>
                  </div>
                  <div>
                    <div className="text-[6px] uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.45)" }}>Role</div>
                    <div className="text-[8px] font-bold" style={{ color: "#0070FF" }}>SCHOLAR</div>
                  </div>
                </div>
              </div>

              {/* QR */}
              <div className="shrink-0">
                <div className="p-1 rounded-lg bg-white" style={{ boxShadow: `0 0 12px ${campusColor}50` }}>
                  <QRCodeSVG value={qrValue} size={54} bgColor="#ffffff" fgColor="#020B1A" level="M" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-3 pt-2 border-t flex items-center justify-between"
              style={{ borderColor: `${campusColor}20` }}>
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full" style={{ background: "#34D399" }} />
                <Shield size={8} style={{ color: campusColor }} />
                <span className="text-[7px] font-mono font-bold uppercase tracking-wider" style={{ color: campusColor }}>
                  Sentinel Verified
                </span>
              </div>
              <div className="text-[6.5px] font-mono" style={{ color: "rgba(148,163,184,0.4)" }}>
                uou.edu.ng · 2025/2026
              </div>
            </div>
          </div>

          {/* Corner chip */}
          <div
            className="absolute top-8 right-4 w-6 h-8 rounded-sm z-40 border"
            style={{
              background: `linear-gradient(135deg, ${campusColor}30, ${campusColor}60)`,
              borderColor: `${campusColor}60`,
              boxShadow: `0 0 8px ${campusColor}40`,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default function StudentIDCard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const campus    = (user as any)?.campus ?? "Zaria";
  const campusColor = CAMPUS_COLORS[campus] ?? "#0070FF";
  const role      = user?.role ?? "student";
  const major     = (user as any)?.major ?? MAJORS[role] ?? "Business & Entrepreneurship";
  const year      = (user as any)?.year  ?? "Year 2";

  const studentId  = `UOU-${campus.slice(0,2).toUpperCase()}-${String(user?.id || "001").padStart(5, "0")}`;
  const programme  = MAJORS[role] ?? "Business & Entrepreneurship";
  const expiryDate = "July 2027";
  const qrValue    = `https://uou.edu.ng/verify/student/${studentId}`;
  const userName   = user?.name ?? "Demo Scholar";

  return (
    <PageTransition>
      <div className="space-y-6 pb-8">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ x: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setLocation("/student")}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border"
            style={{ background: "rgba(4,11,26,0.6)", borderColor: "rgba(0,112,255,0.25)", color: "rgba(100,160,255,0.9)", backdropFilter: "blur(12px)" }}
          >
            <ArrowLeft size={14} /> Back to Portal
          </motion.button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border"
              style={{ background: "rgba(0,112,255,0.1)", borderColor: "rgba(0,112,255,0.3)" }}>
              <IdCard size={18} style={{ color: "#0070FF" }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Student ID Card</h1>
              <p className="text-muted-foreground text-sm">Hover or tilt for holographic effect</p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col items-center gap-8">
          <HolographicCard
            campusColor={campusColor}
            campus={campus}
            studentId={studentId}
            programme={programme}
            expiryDate={expiryDate}
            qrValue={qrValue}
            userName={userName}
            major={major}
            year={year}
          />

          {/* Hint badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs"
            style={{ background: "rgba(0,112,255,0.07)", borderColor: "rgba(0,112,255,0.2)", color: "rgba(100,160,255,0.8)" }}
          >
            <Sparkles size={12} style={{ color: "#0070FF" }} />
            Move your cursor across the card to activate the hologram
          </motion.div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => alert("Download available in published version.")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, #0040C0, #0070FF)", color: "white", boxShadow: "0 0 20px rgba(0,112,255,0.35)" }}
            >
              <Download size={15} /> Download ID Card
            </motion.button>
          </div>

          {/* Info note */}
          <div className="max-w-sm text-center">
            <div className="rounded-xl border p-4"
              style={{ background: "rgba(4,11,26,0.65)", borderColor: "rgba(0,112,255,0.15)" }}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <QrCode size={14} style={{ color: "#0070FF" }} />
                <span className="font-semibold text-white text-xs">Sentinel Verified Identity</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Scan the QR code to verify this student on the UOU public portal.
                Card valid until {expiryDate}. Chip-encoded with cryptographic binding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
