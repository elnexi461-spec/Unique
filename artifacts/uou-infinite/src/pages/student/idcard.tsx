import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, IdCard, Shield, QrCode } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { QRCodeSVG } from "qrcode.react";

const CAMPUS_COLORS: Record<string, string> = {
  Zaria:  "#A78BFA",
  Lagos:  "#34D399",
  Kano:   "#F59E0B",
  HQ:     "#0070FF",
};

export default function StudentIDCard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);

  const campus = (user as any)?.campus ?? "Zaria";
  const campusColor = CAMPUS_COLORS[campus] ?? "#0070FF";
  const studentId = `UOU-ZR-DEMO-001`;
  const programme = (user as any)?.department ?? "Business & Entrepreneurship";
  const expiryDate = "July 2027";
  const qrValue = `https://uou.edu.ng/verify/student/${studentId}`;

  const handleDownload = () => {
    if (!cardRef.current) return;
    const html2canvas = (window as any).html2canvas;
    if (html2canvas) {
      html2canvas(cardRef.current).then((canvas: HTMLCanvasElement) => {
        const link = document.createElement("a");
        link.download = `UOU-StudentID-${studentId}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    } else {
      alert("Download will be available in the published version.");
    }
  };

  return (
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
            <p className="text-muted-foreground text-sm">Official institutional identity document</p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col items-center gap-8">
        {/* The Card */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "min(400px, 100%)" }}
        >
          {/* Front face */}
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{
              background: "linear-gradient(135deg, #020B1A 0%, #040F28 40%, #061440 100%)",
              border: `1px solid ${campusColor}40`,
              boxShadow: `0 0 40px ${campusColor}20, 0 20px 60px rgba(0,0,0,0.6)`,
              aspectRatio: "85.6/54",
            }}
          >
            {/* Holographic shimmer overlay */}
            <motion.div
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.04) 40%, transparent 60%)",
                backgroundSize: "200% 200%",
              }}
            />

            {/* Top stripe */}
            <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, #0040C0, ${campusColor}, #0040C0)` }} />

            <div className="p-5 relative z-20">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <img src="/uou-logo.png" alt="UOU" className="w-8 h-8 object-contain"
                    style={{ filter: "drop-shadow(0 0 6px rgba(0,112,255,0.6))" }} />
                  <div>
                    <div className="text-[8px] font-bold tracking-[0.3em] uppercase" style={{ color: "#0070FF" }}>
                      Unique Open University
                    </div>
                    <div className="text-[6px] tracking-[0.2em] uppercase text-muted-foreground">
                      Student Identity Card
                    </div>
                  </div>
                </div>
                <div className="text-[8px] font-mono" style={{ color: campusColor }}>
                  {campus} Center
                </div>
              </div>

              {/* Body */}
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div
                  className="w-16 h-20 rounded-xl flex items-center justify-center shrink-0 border-2 text-2xl font-black"
                  style={{
                    background: `linear-gradient(135deg, ${campusColor}20, ${campusColor}08)`,
                    borderColor: `${campusColor}50`,
                    color: campusColor,
                  }}
                >
                  {user?.name?.charAt(0) ?? "S"}
                </div>

                {/* Info */}
                <div className="flex-1 space-y-1.5">
                  <div>
                    <div className="text-[8px] uppercase tracking-wider text-muted-foreground">Name</div>
                    <div className="text-sm font-black text-white leading-tight">{user?.name ?? "Demo Scholar"}</div>
                  </div>
                  <div>
                    <div className="text-[8px] uppercase tracking-wider text-muted-foreground">Student ID</div>
                    <div className="text-[11px] font-mono font-bold" style={{ color: campusColor }}>{studentId}</div>
                  </div>
                  <div>
                    <div className="text-[8px] uppercase tracking-wider text-muted-foreground">Programme</div>
                    <div className="text-[10px] font-semibold text-white leading-tight">{programme}</div>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <div>
                      <div className="text-[7px] uppercase tracking-wider text-muted-foreground">Expires</div>
                      <div className="text-[9px] font-mono text-white">{expiryDate}</div>
                    </div>
                    <div>
                      <div className="text-[7px] uppercase tracking-wider text-muted-foreground">Role</div>
                      <div className="text-[9px] font-bold" style={{ color: "#0070FF" }}>SCHOLAR</div>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="shrink-0">
                  <div className="p-1 rounded-lg bg-white">
                    <QRCodeSVG value={qrValue} size={52} bgColor="#ffffff" fgColor="#020B1A" level="M" />
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="mt-4 pt-3 border-t flex items-center justify-between"
                style={{ borderColor: `${campusColor}20` }}>
                <div className="flex items-center gap-1">
                  <Shield size={8} style={{ color: campusColor }} />
                  <span className="text-[7px] font-mono uppercase tracking-wider" style={{ color: campusColor }}>
                    Sentinel Verified
                  </span>
                </div>
                <div className="text-[7px] font-mono text-muted-foreground">
                  uou.edu.ng · 2025/2026
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
            style={{ background: "linear-gradient(135deg, #0040C0, #0070FF)", color: "white", boxShadow: "0 0 20px rgba(0,112,255,0.35)" }}
          >
            <Download size={15} /> Download ID Card
          </motion.button>
        </div>

        {/* Info note */}
        <div className="max-w-sm text-center">
          <div className="rounded-xl border p-4 text-sm"
            style={{ background: "rgba(4,11,26,0.65)", borderColor: "rgba(0,112,255,0.15)" }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <QrCode size={14} style={{ color: "#0070FF" }} />
              <span className="font-semibold text-white text-xs">Verification QR Code</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Scan the QR code on this card to verify your student identity on the UOU public portal. This card is valid until {expiryDate}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
