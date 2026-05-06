import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Users, BookOpen, GraduationCap, MapPin, Zap, Globe, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { CinematicIntro } from "@/components/CinematicIntro";

const NEWS = [
  { id: 1, category: "AI Update",   title: "UOU Sentinel AI now tracks at-risk students in real time",             date: "May 2026" },
  { id: 2, category: "Academic",    title: "New semester timetable published — check your portal now",             date: "Apr 2026" },
  { id: 3, category: "Technology",  title: "Cryptographic Proof of Attendance now live for all courses",           date: "Mar 2026" },
  { id: 4, category: "Research",    title: "UOU partners with 12 research institutions across West Africa",        date: "Feb 2026" },
  { id: 5, category: "Achievement", title: "Gold Card ceremony minted 1,200 attendance proofs this semester",      date: "Jan 2026" },
  { id: 6, category: "Innovation",  title: "Neural Ledger micro-learning engine reduces knowledge gap by 43%",     date: "Dec 2025" },
];

const CAMPUS_CENTERS = [
  { id: 1, name: "Lagos Main Campus",  x: 28, y: 52, active: true  },
  { id: 2, name: "Abuja Centre",       x: 48, y: 38, active: true  },
  { id: 3, name: "Kano Hub",           x: 50, y: 22, active: false },
  { id: 4, name: "Port Harcourt",      x: 35, y: 65, active: true  },
  { id: 5, name: "Enugu Centre",       x: 45, y: 57, active: false },
  { id: 6, name: "Ibadan Node",        x: 25, y: 48, active: true  },
];

/* UOU brand blue palette */
const B = {
  primary:   "#3B82F6",
  electric:  "#60A5FA",
  brand:     "#1D4ED8",
  aura:      "rgba(59,130,246,0.15)",
  border:    "rgba(59,130,246,0.18)",
  card:      "rgba(8,18,50,0.65)",
};

export default function LandingPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [introComplete, setIntroComplete] = useState(() =>
    sessionStorage.getItem("uou_intro_done") === "1"
  );
  const [hoveredCenter, setHoveredCenter] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY       = useTransform(scrollYProgress, [0, 0.3],  [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    if (user) {
      const routes: Record<string, string> = {
        founder: "/founder", coordinator: "/coordinator",
        lecturer: "/lecturer", student: "/student",
      };
      if (routes[user.role]) setLocation(routes[user.role]);
    }
  }, [user]);

  const handleIntroComplete = () => {
    sessionStorage.setItem("uou_intro_done", "1");
    setIntroComplete(true);
  };

  const roles = [
    { title: "Founder",     icon: Shield,        desc: "Command center for institutional KPIs",          role: "founder" },
    { title: "Coordinator", icon: Users,          desc: "Manage students, lecturers, and courses",        role: "coordinator" },
    { title: "Lecturer",    icon: BookOpen,       desc: "Manage courses and assessment grades",           role: "lecturer" },
    { title: "Student",     icon: GraduationCap,  desc: "Access courses, Gold Cards, and credentials",   role: "student" },
  ];

  if (!introComplete) {
    return <CinematicIntro onComplete={handleIntroComplete} />;
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden">

      {/* ─── HERO ─── */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      >
        {/* Luminous radial stage — deep blue-black edges, electric blue center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(29,78,216,0.12) 0%, rgba(4,11,26,0) 70%)",
          }}
        />

        {/* Grid */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#3B82F6" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        {/* Central glow orb */}
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)" }}
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-5xl relative z-10"
        >
          {/* Logo orb */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            animate={{ boxShadow: ["0 0 24px rgba(59,130,246,0.25)", "0 0 48px rgba(59,130,246,0.5)", "0 0 24px rgba(59,130,246,0.25)"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center border mb-8 cursor-default"
            style={{
              background: "radial-gradient(circle at 35% 35%, #60A5FA, #1D4ED8 60%, #0B1E4A)",
              borderColor: "rgba(59,130,246,0.4)",
              backdropFilter: "blur(20px)",
            }}
          >
            <span className="text-white font-black text-xl tracking-tight">UOU</span>
          </motion.div>

          {/* Main headline — staggered per word */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none"
            >
              {["Unique", "Open", "University"].map((word, wi) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + wi * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: "inline-block",
                    marginRight: wi < 2 ? "0.3em" : 0,
                    color: word === "Open" ? B.electric : "white",
                    textShadow: word === "Open"
                      ? "0 0 60px rgba(59,130,246,0.5), 0 0 120px rgba(59,130,246,0.25)"
                      : undefined,
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            A next-generation Institutional Operating System.{" "}
            <span style={{ color: "rgba(147,197,253,0.8)" }}>Precise, intelligent, and self-healing.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link href="/login">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  className="h-12 px-8 text-base font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
                    boxShadow: "0 0 32px rgba(59,130,246,0.45)",
                    border: "none",
                  }}
                >
                  Begin Session
                </Button>
              </motion.div>
            </Link>
            <Link href="/register">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base font-semibold"
                  style={{ borderColor: "rgba(59,130,246,0.4)", color: B.electric }}
                >
                  Initialize Account
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.section>

      {/* ─── ROLE CARDS — blue glassmorphism, staggered ─── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Four Portals, One System</h2>
            <p className="text-muted-foreground text-lg">Each role gets a bespoke command interface.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -7, scale: 1.03 }}
                onClick={() => setLocation(`/register?role=${r.role}`)}
                className="relative group cursor-pointer rounded-2xl p-6 border overflow-hidden"
                style={{
                  background: B.card,
                  borderColor: B.border,
                  backdropFilter: "blur(20px)",
                }}
              >
                {/* Blue hover glow */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{
                    background: "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.15), transparent 70%)",
                  }}
                />
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 border transition-all group-hover:scale-110"
                  style={{ background: "rgba(59,130,246,0.12)", borderColor: "rgba(59,130,246,0.25)", color: B.electric }}
                >
                  <r.icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
                {/* Underline sweep */}
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: `linear-gradient(90deg, ${B.brand}, transparent)` }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CAMPUS LOCATOR ─── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.05), transparent 70%)" }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div
              className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-4 py-1.5 mb-4 border"
              style={{ background: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.2)", color: B.electric }}
            >
              <Globe size={14} /> Learning Centers Network
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Campus Center Locator</h2>
            <p className="text-muted-foreground text-lg">Active learning hubs across Nigeria.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden border aspect-[4/3]"
              style={{ background: "rgba(8,18,50,0.85)", borderColor: B.border }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full opacity-25 absolute inset-0">
                <path d="M20,30 L30,20 L50,18 L65,22 L75,28 L80,40 L75,55 L65,68 L55,75 L40,78 L28,70 L22,58 L18,45 Z"
                  fill="none" stroke="#3B82F6" strokeWidth="0.8" />
              </svg>
              <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 opacity-8">
                <defs>
                  <pattern id="map-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#3B82F6" strokeWidth="0.3"/>
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#map-grid)" />
              </svg>
              {CAMPUS_CENTERS.map(c => (
                <motion.button
                  key={c.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${c.x}%`, top: `${c.y}%` }}
                  whileHover={{ scale: 1.5 }}
                  onHoverStart={() => setHoveredCenter(c.id)}
                  onHoverEnd={() => setHoveredCenter(null)}
                >
                  <div className="relative">
                    <motion.div
                      animate={{ scale: c.active ? [1,2,1] : 1, opacity: c.active ? [0.6,0,0.6] : 0.3 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full"
                      style={{ background: c.active ? "#3B82F6" : "#555", transform: "scale(2)" }}
                    />
                    <div className="w-3 h-3 rounded-full relative z-10 border-2"
                      style={{
                        background:     c.active ? "#3B82F6" : "#2d3a5e",
                        borderColor:    c.active ? "#60A5FA" : "#3d4d7e",
                        boxShadow:      c.active ? "0 0 10px rgba(59,130,246,0.8)" : "none",
                      }}
                    />
                  </div>
                  <AnimatePresence>
                    {hoveredCenter === c.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.9 }}
                        animate={{ opacity: 1, y: -8, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap text-xs font-medium px-2 py-1 rounded-md z-20"
                        style={{ background: "rgba(8,18,50,0.95)", border: `1px solid rgba(59,130,246,0.4)`, color: B.electric }}
                      >
                        {c.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </motion.div>

            <div className="space-y-3">
              {CAMPUS_CENTERS.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all"
                  style={{
                    background:    hoveredCenter === c.id ? "rgba(59,130,246,0.1)" : B.card,
                    borderColor:   hoveredCenter === c.id ? "rgba(59,130,246,0.4)" : B.border,
                  }}
                  onMouseEnter={() => setHoveredCenter(c.id)}
                  onMouseLeave={() => setHoveredCenter(null)}
                >
                  <MapPin size={16} className={c.active ? "text-primary" : "text-muted-foreground"} />
                  <span className="text-sm font-medium text-foreground flex-1">{c.name}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full border"
                    style={{
                      background:   c.active ? "rgba(59,130,246,0.1)" : "rgba(80,80,100,0.1)",
                      color:        c.active ? B.electric : "#666",
                      borderColor:  c.active ? "rgba(59,130,246,0.3)" : "rgba(80,80,100,0.2)",
                    }}>
                    {c.active ? "ONLINE" : "OFFLINE"}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEWS — staggered bento grid ─── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-xs font-bold tracking-[0.3em] uppercase mb-2"
                style={{ color: B.primary }}
              >
                Live Intelligence Feed
              </motion.div>
              <h2 className="text-4xl font-bold text-white mb-1">News &amp; Updates</h2>
              <p className="text-muted-foreground text-sm">Latest from Unique Open University</p>
            </div>
            <Zap className="text-primary" size={28} />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NEWS.map((item, i) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5, borderColor: "rgba(59,130,246,0.45)" }}
                className="p-6 rounded-2xl border cursor-pointer group transition-all"
                style={{ background: B.card, borderColor: B.border, backdropFilter: "blur(12px)" }}
              >
                {/* Glassmorphism top shine */}
                <div
                  className="absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${B.electric}, transparent)` }}
                />
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{ background: "rgba(59,130,246,0.12)", color: B.electric }}
                  >
                    {item.category}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">{item.date}</span>
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-primary transition-colors leading-snug">
                  {item.title}
                </h3>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 px-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(29,78,216,0.12), transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto relative z-10"
        >
          <h2 className="text-5xl font-black text-white mb-4 leading-tight">
            Ready to enter the system?
          </h2>
          <p className="text-muted-foreground mb-10 text-lg">
            Your institutional operating system is online and waiting.
          </p>
          <Link href="/login">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  "0 0 32px rgba(59,130,246,0.35)",
                  "0 0 64px rgba(59,130,246,0.6)",
                  "0 0 32px rgba(59,130,246,0.35)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="inline-block"
              style={{ borderRadius: 12 }}
            >
              <Button
                size="lg"
                className="h-14 px-14 text-lg font-black text-white"
                style={{
                  background: "linear-gradient(135deg, #0F3E8A, #1D4ED8, #3B82F6)",
                  border: "1px solid rgba(96,165,250,0.3)",
                }}
              >
                Begin Session →
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
