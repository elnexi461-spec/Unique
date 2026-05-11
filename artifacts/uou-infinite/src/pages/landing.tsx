import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  motion, useScroll, useTransform, AnimatePresence,
  MotionValue,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Shield, Users, BookOpen, GraduationCap, MapPin, Zap, Globe,
  ChevronDown, Award, ChevronRight, X, Menu, Phone, Mail,
  Facebook, Twitter, Instagram, Youtube, ArrowUpRight, Check,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { CinematicIntro } from "@/components/CinematicIntro";
import { DemoPersonaSelector } from "@/pages/demo-persona";

/* ─────────────────────────── colour tokens ─────────────────────────── */
const C = {
  navy:    "#04112A",
  brand:   "#1D4ED8",
  electric:"#3B82F6",
  glow:    "#60A5FA",
  gold:    "#F59E0B",
  goldLt:  "#FDE68A",
  card:    "rgba(4,11,26,0.70)",
  border:  "rgba(30,64,175,0.22)",
};

/* ─────────────────────────── easing ────────────────────────────────── */
const EC = [0.22, 1, 0.36, 1] as const;

/* ─────────────────────────── data ──────────────────────────────────── */
const NAV_LINKS = [
  { label: "Home",         href: "/" },
  { label: "About Us",     href: "#about" },
  { label: "Programs",     href: "#programs" },
  { label: "Student Life", href: "#student-life" },
  { label: "Fees",         href: "#fees" },
  { label: "Contact Us",   href: "#contact" },
];
const STATS_HERO = [
  { value: "100%", label: "NUC Accredited Programs" },
  { value: "95%",  label: "Internship Placement Rate" },
  { value: "500+", label: "Scholarships Annually" },
  { value: "50+",  label: "Enrolled Scholars" },
];
const DEGREE_PROGRAMS       = ["Business Administration","Accounting","Computer Science & Data Analytics","Nursing Science","Hospitality Management"];
const PROFESSIONAL_PROGRAMS = ["Project Management","Oil & Gas Management","Health & Safety","Quality Assurance"];
const TECH_PROGRAMS         = ["Artificial Intelligence & Robotics","Ethical Hacking","Advanced Computing Courses","ICT & Digital Management"];
const STUDENT_LIFE_ITEMS = [
  { title:"Internships & Career Support",   desc:"Real-world experience with top organisations across Africa and beyond.",    img:"https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80" },
  { title:"Global Community & Culture",     desc:"A vibrant, diverse campus culture that celebrates every background.",       img:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80" },
  { title:"Fun & Engaging Learning",        desc:"Interactive lectures, group projects, and innovation challenges.",           img:"https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=900&q=80" },
];
const NEWS = [
  { id:1, category:"Scholarship 2026", title:"UOU announces 50 full-tuition scholarships for top Vanguard scholars — applications open now",           date:"May 2026" },
  { id:2, category:"Scholarship 2026", title:"Merit-based Excellence Awards: ₦2.5M pool for highest Gold Card earners this semester",                  date:"May 2026" },
  { id:3, category:"AI Update",        title:"Vanguard Guardian AI module launched — personal performance diagnostics for every scholar",               date:"May 2026" },
  { id:4, category:"Academic",         title:"Week 18 Friday Brief: Zaria Center achieves 15% punctuality surge under Sentinel optimisation",          date:"May 2026" },
];
const FEES = [
  { label:"Application Fee",            amount:"₦10,000" },
  { label:"Acceptance Fee",             amount:"₦10,000" },
  { label:"School Fees (per semester)", amount:"₦75,000–₦120,000" },
  { label:"Examination Fee",            amount:"₦5,000" },
];
const CAMPUS_CENTERS = [
  { id:1, name:"Lagos Main Campus", x:28, y:52, active:true  },
  { id:2, name:"Abuja Centre",      x:48, y:38, active:true  },
  { id:3, name:"Kano Hub",          x:50, y:22, active:true  },
  { id:4, name:"Port Harcourt",     x:35, y:65, active:true  },
  { id:5, name:"Enugu Centre",      x:45, y:57, active:false },
  { id:6, name:"Zaria Center",      x:46, y:28, active:true  },
];

type LandingPhase = "intro" | "persona" | "landing";

/* ═══════════════════════════════════════════════════════════════════════
   SCROLL-LINKED FADE WRAPPER
   Fades in as element enters the viewport from below,
   fades out as it exits the viewport from above.
   This is a TRUE scroll-position-linked animation (not a one-time trigger).
═══════════════════════════════════════════════════════════════════════ */
interface SectionFadeProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** "tight" = short headlines; "loose" = tall card grids that need longer visible window */
  variant?: "tight" | "loose";
}

function SectionFade({ children, className, style: s, variant = "tight" }: SectionFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: variant === "tight"
      ? ["start 0.93", "end 0.10"]   // headlines: appears at 93% viewport, exits at 10%
      : ["start 0.96", "end 0.02"],  // card grids: stays visible much longer
  });

  // Opacity: 0 → 1 on enter, 1 → 0 on exit
  const opacity = useTransform(
    scrollYProgress,
    variant === "tight" ? [0, 0.18, 0.82, 1] : [0, 0.07, 0.93, 1],
    [0, 1, 1, 0],
  );
  // Y: slides up on enter, continues sliding up on exit
  const y = useTransform(
    scrollYProgress,
    variant === "tight" ? [0, 0.18, 0.82, 1] : [0, 0.07, 0.93, 1],
    [56, 0, 0, -40],
  );

  return (
    <motion.div ref={ref} style={{ opacity, y, ...s }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── Individual staggered child inside a SectionFade ── */
/* once:false means elements re-animate on every scroll-up return  */
const VP_REPEAT = { once: false, margin: "-48px" };

function FadeChild({
  children, delay = 0, x = 0, className, style: s,
}: {
  children: React.ReactNode; delay?: number; x?: number;
  className?: string; style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 44, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={VP_REPEAT}
      transition={{ duration: 0.72, delay, ease: EC }}
      className={className}
      style={s}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [phase, setPhase]       = useState<LandingPhase>("persona");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredCenter, setHoveredCenter] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY       = useTransform(scrollYProgress, [0, 0.28], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0]);

  useEffect(() => {
    if (user) {
      const r: Record<string, string> = { founder:"/founder", coordinator:"/coordinator", lecturer:"/lecturer", student:"/student" };
      if (r[user.role]) setLocation(r[user.role]);
    }
  }, [user]);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    if (href === "/") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
  };

  if (phase === "intro") return <CinematicIntro onComplete={() => setPhase("persona")} />;

  return (
    <AnimatePresence mode="wait">
      {phase === "persona" && (
        <DemoPersonaSelector key="persona" onSkip={() => setPhase("landing")} />
      )}

      {phase === "landing" && (
        <motion.div
          key="landing"
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen overflow-x-hidden"
          style={{ background: C.navy }}
        >

          {/* ══════════ STICKY NAVBAR ══════════ */}
          <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{ background: scrolled ? "rgba(4,11,26,0.95)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "none" }}>
            <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
              <button onClick={() => scrollTo("/")} className="flex items-center gap-3 group">
                <img src={import.meta.env.BASE_URL + "uou-logo.png"} alt="UOU"
                  className="w-10 h-10 object-contain transition-transform group-hover:scale-105"
                  style={{ filter: "drop-shadow(0 0 10px rgba(59,130,246,0.5))" }} />
                <span className="hidden sm:block text-white font-black text-lg leading-tight">
                  Unique Open<br /><span style={{ color: C.electric }}>University</span>
                </span>
              </button>

              <nav className="hidden lg:flex items-center gap-1">
                {NAV_LINKS.map(l => (
                  <button key={l.label} onClick={() => scrollTo(l.href)}
                    className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white rounded-lg transition-colors hover:bg-white/5">
                    {l.label}
                  </button>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button size="sm" className="hidden sm:flex h-9 px-5 font-bold text-white border-0"
                    style={{ background:`linear-gradient(135deg,${C.gold},#D97706)`, boxShadow:"0 0 20px rgba(245,158,11,0.4)" }}>
                    Apply Now
                  </Button>
                </Link>
                <button onClick={() => setMenuOpen(v => !v)} aria-label="Open menu"
                  className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border transition-colors"
                  style={{ borderColor:C.border, background:"rgba(29,78,216,0.1)", color:"white" }}>
                  {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </header>

          {/* Mobile sidebar */}
          <AnimatePresence>
            {menuOpen && (
              <>
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40"
                  style={{ background:"rgba(4,11,26,0.75)", backdropFilter:"blur(4px)" }} />
                <motion.aside initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}}
                  transition={{type:"spring",stiffness:320,damping:38}}
                  className="fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col"
                  style={{ background:"rgba(6,14,38,0.98)", borderLeft:`1px solid ${C.border}` }}>
                  <div className="flex items-center justify-between p-5 border-b" style={{ borderColor:C.border }}>
                    <span className="text-white font-black text-lg">Menu</span>
                    <button onClick={() => setMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white"><X size={18}/></button>
                  </div>
                  <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                    {NAV_LINKS.map((l, i) => (
                      <motion.button key={l.label} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                        onClick={() => scrollTo(l.href)}
                        className="w-full text-left px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 font-medium transition-colors flex items-center justify-between group">
                        {l.label}<ChevronRight size={14} className="opacity-0 group-hover:opacity-60 transition-opacity"/>
                      </motion.button>
                    ))}
                  </nav>
                  <div className="p-5 space-y-3 border-t" style={{ borderColor:C.border }}>
                    <Link href="/login" onClick={() => setMenuOpen(false)}>
                      <Button className="w-full font-bold text-white border-0" style={{ background:`linear-gradient(135deg,${C.gold},#D97706)` }}>Apply Now</Button>
                    </Link>
                    <Link href="/login" onClick={() => setMenuOpen(false)}>
                      <Button variant="outline" className="w-full font-semibold" style={{ borderColor:C.border, color:C.electric }}>Student Login</Button>
                    </Link>
                    <button onClick={() => { setMenuOpen(false); setPhase("persona"); }}
                      className="w-full text-center text-xs text-white/40 hover:text-white/70 transition-colors py-1">Demo Mode →</button>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* ══════════ HERO — scroll-linked parallax (template for all other sections) ══════════ */}
          <motion.section style={{ y: heroY, opacity: heroOpacity }}
            className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
            <div className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage:"url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80')" }} />
            <div className="absolute inset-0"
              style={{ background:"linear-gradient(to bottom, rgba(4,11,26,0.72) 0%, rgba(4,17,42,0.82) 50%, rgba(4,11,26,0.96) 100%)" }} />
            <motion.div
              animate={{ scale:[1,1.2,1], opacity:[0.08,0.18,0.08] }}
              transition={{ duration:8, repeat:Infinity, ease:"easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
              style={{ background:"radial-gradient(circle, rgba(29,78,216,0.35), transparent 70%)" }} />

            <div className="text-center max-w-5xl relative z-10">
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}}
                className="w-24 h-24 mx-auto mb-8">
                <motion.img src={import.meta.env.BASE_URL+"uou-logo.png"} alt="UOU" className="w-full h-full object-contain"
                  animate={{ filter:["drop-shadow(0 0 12px rgba(59,130,246,0.4))","drop-shadow(0 0 28px rgba(59,130,246,0.7))","drop-shadow(0 0 12px rgba(59,130,246,0.4))"] }}
                  transition={{ duration:3, repeat:Infinity }} />
              </motion.div>

              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.28,duration:0.6,ease:EC}}
                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full mb-6"
                style={{ background:"rgba(29,78,216,0.25)", border:"1px solid rgba(59,130,246,0.3)", color:C.glow }}>
                NUC Accredited · Digital University · Nigeria
              </motion.div>

              <div className="overflow-hidden mb-5">
                <motion.h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
                  {["Unique","Open","University"].map((w, wi) => (
                    <motion.span key={w}
                      initial={{opacity:0,y:80}} animate={{opacity:1,y:0}}
                      transition={{delay:0.38+wi*0.18,duration:0.85,ease:EC}}
                      style={{ display:"inline-block", marginRight:wi<2?"0.3em":0,
                        color:w==="Open"?C.electric:"white",
                        textShadow:w==="Open"?"0 0 60px rgba(59,130,246,0.5)":undefined }}>
                      {w}
                    </motion.span>
                  ))}
                </motion.h1>
              </div>

              <motion.p initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
                transition={{delay:0.75,duration:0.7,ease:EC}}
                className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
                Making world-class education accessible to everyone.
                NUC-accredited degrees, flexible learning, and strong career support.
              </motion.p>

              <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
                transition={{delay:0.92,duration:0.6,ease:EC}}
                className="flex items-center justify-center gap-4 flex-wrap mb-14">
                <Link href="/login">
                  <motion.div whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}}>
                    <Button size="lg" className="h-14 px-8 text-base font-black text-white border-0"
                      style={{ background:`linear-gradient(135deg,${C.gold},#D97706)`, boxShadow:"0 0 32px rgba(245,158,11,0.45)" }}>
                      <Award size={16} className="mr-2"/> Apply Now
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/login">
                  <motion.div whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}}>
                    <Button variant="outline" size="lg" className="h-14 px-8 text-base font-semibold"
                      style={{ borderColor:"rgba(59,130,246,0.4)", color:C.electric }}>
                      <Zap size={16} className="mr-2"/> Enter Digital Campus
                    </Button>
                  </motion.div>
                </Link>
                <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
                  onClick={() => setPhase("persona")}
                  className="h-14 px-6 text-sm font-medium text-white/50 hover:text-white/80 transition-colors">
                  Demo Mode →
                </motion.button>
              </motion.div>

              <div className="flex items-center justify-center gap-8 flex-wrap">
                {STATS_HERO.map((s, i) => (
                  <motion.div key={s.label}
                    initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
                    transition={{delay:1.05+i*0.1,duration:0.6,ease:EC}}
                    className="text-center">
                    <div className="text-3xl font-black" style={{ color:C.electric }}>{s.value}</div>
                    <div className="text-xs text-white/50 uppercase tracking-wider mt-0.5">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div animate={{y:[0,8,0]}} transition={{duration:2.5,repeat:Infinity}}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30">
              <ChevronDown size={24}/>
            </motion.div>
          </motion.section>

          {/* ══════════ ABOUT ══════════
              SectionFade wraps the header — fades in on scroll-down, fades out on scroll-up-past */}
          <section id="about" className="py-24 px-6" style={{ background:"rgba(6,14,38,0.8)" }}>
            <div className="max-w-6xl mx-auto">

              {/* Headline block — scroll-linked fade */}
              <SectionFade className="text-center mb-14">
                <div className="inline-block text-xs font-bold tracking-[0.3em] uppercase px-4 py-1.5 rounded-full mb-4"
                  style={{ background:"rgba(29,78,216,0.12)", border:`1px solid ${C.border}`, color:C.electric }}>
                  About UOU
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-5">Our Mission</h2>
                <p className="text-lg text-white/65 max-w-3xl mx-auto leading-relaxed">
                  At Unique Open University, we make world-class education accessible to everyone.
                  With NUC-accredited degrees, flexible learning, and strong career support,
                  we are your trusted path to professional excellence.
                </p>
              </SectionFade>

              {/* Mission + Vision cards — scroll-linked, with staggered children */}
              <SectionFade variant="loose" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon:"🎯", title:"Our Mission", body:"To provide affordable, high-quality, and flexible education that empowers individuals to achieve their academic and career goals, regardless of location or circumstance." },
                  { icon:"🏛️", title:"Our Vision",  body:"To build a leading global open university where learning knows no boundaries — connecting Nigeria and Africa to the world through knowledge and innovation." },
                ].map((card, i) => (
                  <FadeChild key={card.title} delay={i*0.14} x={i===0?-32:32}>
                    <div className="rounded-2xl p-8 border h-full"
                      style={{ background:C.card, borderColor:"rgba(29,78,216,0.28)" }}>
                      <div className="text-4xl mb-4">{card.icon}</div>
                      <h3 className="text-xl font-black mb-3" style={{ color:C.electric }}>{card.title}</h3>
                      <p className="text-white/65 leading-relaxed">{card.body}</p>
                    </div>
                  </FadeChild>
                ))}
              </SectionFade>

              {/* Stats strip */}
              <SectionFade variant="loose" className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 rounded-2xl p-8" style={{ background:C.brand }}>
                {[
                  { val:"100%", label:"NUC Accredited Programs" },
                  { val:"95%",  label:"Internship Placement Rate" },
                  { val:"500+", label:"Scholarships Awarded Annually" },
                ].map((s, i) => (
                  <FadeChild key={s.label} delay={i*0.13}>
                    <div className="text-center">
                      <div className="text-5xl font-black text-white mb-1">{s.val}</div>
                      <div className="text-white/75 text-sm">{s.label}</div>
                    </div>
                  </FadeChild>
                ))}
              </SectionFade>
            </div>
          </section>

          {/* ══════════ PROGRAMS ══════════ */}
          <section id="programs" className="py-24 px-6" style={{ background:C.navy }}>
            <div className="max-w-6xl mx-auto">

              <SectionFade className="mb-14">
                <div className="inline-block text-xs font-bold tracking-[0.3em] uppercase px-4 py-1.5 rounded-full mb-4"
                  style={{ background:"rgba(29,78,216,0.12)", border:`1px solid ${C.border}`, color:C.electric }}>
                  Academics
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white">Our Programs</h2>
                <p className="mt-3 text-white/55 text-lg max-w-xl">
                  Degrees, professional certifications, and digital skills — all in one place.
                </p>
              </SectionFade>

              <SectionFade variant="loose" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Degree Programs */}
                <FadeChild delay={0} x={-40}>
                  <div className="relative rounded-2xl overflow-hidden h-full"
                    style={{ background:"linear-gradient(160deg,rgba(30,58,138,0.9) 0%,rgba(15,23,80,0.95) 100%)", border:"1px solid rgba(59,130,246,0.2)" }}>
                    <div className="absolute inset-0 bg-center bg-cover opacity-15"
                      style={{ backgroundImage:"url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80')" }} />
                    <div className="relative z-10 p-7">
                      <h3 className="text-2xl font-black text-white mb-1">Degree Programs</h3>
                      <div className="w-12 h-0.5 mb-5" style={{ background:C.electric }} />
                      <div className="space-y-2">
                        {DEGREE_PROGRAMS.map((prog, i) => (
                          <motion.button key={prog}
                            initial={{opacity:0,x:-14}} whileInView={{opacity:1,x:0}} viewport={VP_REPEAT}
                            transition={{delay:0.06*i,duration:0.5,ease:EC}}
                            whileHover={{x:5}}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left text-sm font-medium text-white transition-all"
                            style={{ borderColor:i===0?"rgba(147,197,253,0.5)":"rgba(59,130,246,0.2)", background:i===0?"rgba(147,197,253,0.15)":"rgba(29,78,216,0.08)" }}>
                            {prog}<ChevronRight size={14} className="opacity-50 shrink-0"/>
                          </motion.button>
                        ))}
                      </div>
                      <Link href="/login">
                        <button className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold text-white hover:bg-white/5 transition-all"
                          style={{ borderColor:"rgba(59,130,246,0.4)" }}>
                          View All Degrees<ChevronRight size={14}/>
                        </button>
                      </Link>
                    </div>
                  </div>
                </FadeChild>

                {/* Professional Programs */}
                <FadeChild delay={0.12}>
                  <div className="rounded-2xl p-7 h-full"
                    style={{ background:C.brand, border:"1px solid rgba(59,130,246,0.15)" }}>
                    <h3 className="text-2xl font-black text-white mb-1">Professional Programs</h3>
                    <div className="w-12 h-0.5 mb-5" style={{ background:C.goldLt }} />
                    <div className="space-y-2">
                      {PROFESSIONAL_PROGRAMS.map((prog, i) => (
                        <motion.button key={prog}
                          initial={{opacity:0,x:-14}} whileInView={{opacity:1,x:0}} viewport={VP_REPEAT}
                          transition={{delay:0.06*i,duration:0.5,ease:EC}}
                          whileHover={{x:5}}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left text-sm font-medium text-white hover:bg-white/5 transition-all"
                          style={{ borderColor:"rgba(255,255,255,0.2)" }}>
                          {prog}<ChevronRight size={14} className="opacity-50 shrink-0"/>
                        </motion.button>
                      ))}
                    </div>
                    <Link href="/login">
                      <button className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold text-white hover:bg-white/10 transition-all"
                        style={{ borderColor:"rgba(255,255,255,0.3)" }}>
                        View All Courses<ChevronRight size={14}/>
                      </button>
                    </Link>
                  </div>
                </FadeChild>

                {/* Digital & Tech */}
                <FadeChild delay={0} x={40}>
                  <div className="relative rounded-2xl overflow-hidden h-full"
                    style={{ border:"1px solid rgba(59,130,246,0.2)" }}>
                    <div className="absolute inset-0 bg-center bg-cover"
                      style={{ backgroundImage:"url('https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&q=80')" }} />
                    <div className="absolute inset-0"
                      style={{ background:"linear-gradient(160deg,rgba(4,11,26,0.88),rgba(15,23,80,0.92))" }} />
                    <div className="relative z-10 p-7">
                      <h3 className="text-2xl font-black text-white mb-1">Digital &amp; Tech Skills</h3>
                      <div className="w-12 h-0.5 mb-5" style={{ background:C.gold }} />
                      <div className="space-y-2">
                        {TECH_PROGRAMS.map((prog, i) => (
                          <motion.button key={prog}
                            initial={{opacity:0,x:-14}} whileInView={{opacity:1,x:0}} viewport={VP_REPEAT}
                            transition={{delay:0.06*i,duration:0.5,ease:EC}}
                            whileHover={{x:5}}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left text-sm font-medium text-white transition-all"
                            style={{ borderColor:"rgba(59,130,246,0.22)", background:"rgba(29,78,216,0.08)" }}>
                            {prog}<ChevronRight size={14} className="opacity-50 shrink-0"/>
                          </motion.button>
                        ))}
                      </div>
                      <Link href="/login">
                        <button className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold text-white hover:bg-white/5 transition-all"
                          style={{ borderColor:"rgba(59,130,246,0.4)" }}>
                          View All Tech Courses<ChevronRight size={14}/>
                        </button>
                      </Link>
                    </div>
                  </div>
                </FadeChild>
              </SectionFade>
            </div>
          </section>

          {/* ══════════ STUDENT LIFE ══════════ */}
          <section id="student-life" className="py-24 px-6" style={{ background:"rgba(6,14,38,0.85)" }}>
            <div className="max-w-6xl mx-auto">
              <SectionFade className="mb-14">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
                  Student Life
                  <span className="inline-block ml-3 text-yellow-400" style={{ fontFamily:"serif" }}>✦</span>
                </h2>
                <p className="text-white/60 text-lg max-w-xl">
                  Building a vibrant community of creative and accomplished people from around the world.
                </p>
              </SectionFade>

              <div className="space-y-14">
                {STUDENT_LIFE_ITEMS.map((item, i) => (
                  <SectionFade key={item.title} variant="loose">
                    <FadeChild delay={0}>
                      <div className="w-full text-left flex items-center justify-between pb-3 border-b mb-5 group cursor-default"
                        style={{ borderColor:"rgba(59,130,246,0.2)" }}>
                        <span className="text-xl font-bold text-white">{item.title}</span>
                        <ArrowUpRight size={18} className="text-white/40"/>
                      </div>
                    </FadeChild>
                    <FadeChild delay={0.1}>
                      <div className="relative rounded-2xl overflow-hidden aspect-[16/7] group">
                        <img src={item.img} alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy"/>
                        <div className="absolute inset-0"
                          style={{ background:"linear-gradient(to top, rgba(4,11,26,0.7) 0%, transparent 60%)" }}/>
                        <div className="absolute bottom-4 left-6 right-6">
                          <p className="text-white/80 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    </FadeChild>
                  </SectionFade>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════ CAMPUS LOCATOR ══════════ */}
          <section className="py-24 px-6" style={{ background:C.navy }}>
            <div className="max-w-6xl mx-auto">
              {/* Headline — scroll-linked */}
              <SectionFade className="text-center mb-16">
                <div className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-4 py-1.5 mb-4 border"
                  style={{ background:"rgba(29,78,216,0.1)", borderColor:C.border, color:C.electric }}>
                  <Globe size={14}/> Learning Centers Network
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">Campus Center Locator</h2>
                <p className="text-white/50 text-lg">Active learning hubs across Nigeria.</p>
              </SectionFade>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Map */}
                <SectionFade variant="loose">
                  <div className="relative rounded-2xl overflow-hidden border aspect-[4/3]"
                    style={{ background:"rgba(8,18,50,0.85)", borderColor:C.border }}>
                    <svg viewBox="0 0 100 100" className="w-full h-full opacity-20 absolute inset-0">
                      <path d="M20,30 L30,20 L50,18 L65,22 L75,28 L80,40 L75,55 L65,68 L55,75 L40,78 L28,70 L22,58 L18,45 Z"
                        fill="none" stroke={C.electric} strokeWidth="0.8"/>
                    </svg>
                    {CAMPUS_CENTERS.map(c => (
                      <motion.button key={c.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left:`${c.x}%`, top:`${c.y}%` }}
                        whileHover={{ scale:1.5 }}
                        onHoverStart={() => setHoveredCenter(c.id)}
                        onHoverEnd={() => setHoveredCenter(null)}>
                        <div className="relative">
                          <motion.div
                            animate={{ scale:c.active?[1,2,1]:1, opacity:c.active?[0.6,0,0.6]:0.3 }}
                            transition={{ duration:2, repeat:Infinity, ease:"easeOut" }}
                            className="absolute inset-0 rounded-full"
                            style={{ background:c.active?C.electric:"#555", transform:"scale(2)" }}/>
                          <div className="w-3 h-3 rounded-full relative z-10 border-2"
                            style={{ background:c.active?C.electric:"#2d3a5e", borderColor:c.active?C.glow:"#3d4d7e", boxShadow:c.active?"0 0 10px rgba(59,130,246,0.8)":"none" }}/>
                        </div>
                        <AnimatePresence>
                          {hoveredCenter===c.id && (
                            <motion.div initial={{opacity:0,y:-4,scale:0.9}} animate={{opacity:1,y:-8,scale:1}} exit={{opacity:0}}
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap text-xs font-medium px-2 py-1 rounded-md z-20"
                              style={{ background:"rgba(8,18,50,0.95)", border:"1px solid rgba(59,130,246,0.4)", color:C.electric }}>
                              {c.name}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    ))}
                  </div>
                </SectionFade>

                {/* Campus list — scroll-linked text */}
                <SectionFade variant="loose" className="space-y-3">
                  {CAMPUS_CENTERS.map((c, i) => (
                    <FadeChild key={c.id} delay={i*0.08} x={32}>
                      <motion.div
                        whileHover={{ x:5 }}
                        className="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all"
                        style={{ background:hoveredCenter===c.id?"rgba(29,78,216,0.12)":C.card, borderColor:hoveredCenter===c.id?"rgba(59,130,246,0.4)":C.border }}
                        onMouseEnter={() => setHoveredCenter(c.id)} onMouseLeave={() => setHoveredCenter(null)}>
                        <MapPin size={16} style={{ color:c.active?C.electric:"#555" }}/>
                        <span className="text-sm font-medium text-white flex-1">{c.name}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full border"
                          style={{ background:c.active?"rgba(29,78,216,0.12)":"rgba(80,80,100,0.1)", color:c.active?C.electric:"#666", borderColor:c.active?"rgba(59,130,246,0.3)":"rgba(80,80,100,0.2)" }}>
                          {c.active?"ONLINE":"OFFLINE"}
                        </span>
                      </motion.div>
                    </FadeChild>
                  ))}
                </SectionFade>
              </div>
            </div>
          </section>

          {/* ══════════ SCHOLARSHIPS ══════════ */}
          <section className="relative py-28 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage:"url('https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=1400&q=80')" }}/>
            <div className="absolute inset-0" style={{ background:"rgba(4,11,26,0.78)" }}/>
            <div className="max-w-3xl mx-auto text-center relative z-10">
              <SectionFade>
                <div className="inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full mb-6"
                  style={{ background:"rgba(29,78,216,0.25)", border:"1px solid rgba(59,130,246,0.3)", color:C.glow }}>
                  <Award size={14}/> Financial Support
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  Scholarships &amp; Financial Aid
                </h2>
                <p className="text-white/75 text-lg mb-10 leading-relaxed">
                  We believe in rewarding excellence and supporting dreams. Unique Open University
                  offers a range of merit-based and need-based scholarships for both local and
                  international students to ensure that financial constraints do not hinder academic pursuits.
                </p>
                <Link href="/login">
                  <motion.div whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}}>
                    <Button size="lg" className="h-14 px-10 font-bold text-white border-0"
                      style={{ background:C.brand, boxShadow:"0 0 32px rgba(29,78,216,0.5)" }}>
                      Explore Scholarships<ArrowUpRight size={16} className="ml-2"/>
                    </Button>
                  </motion.div>
                </Link>
              </SectionFade>
            </div>
          </section>

          {/* ══════════ FEES ══════════ */}
          <section id="fees" className="py-24 px-6" style={{ background:"rgba(6,14,38,0.9)" }}>
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Left */}
                <SectionFade>
                  <div className="inline-block text-xs font-bold tracking-[0.3em] uppercase px-4 py-1.5 rounded-full mb-5"
                    style={{ background:"rgba(29,78,216,0.12)", border:`1px solid ${C.border}`, color:C.electric }}>
                    Tuition &amp; Fees
                  </div>
                  <h2 className="text-4xl font-black text-white mb-4">Affordable &amp; Flexible Fees</h2>
                  <p className="text-white/60 mb-8 leading-relaxed">
                    We believe in making education accessible. Our fees are designed to fit your budget,
                    with flexible payment plans and special discounts available.
                  </p>
                  <Button size="lg" className="font-bold text-white border-0 mb-8" style={{ background:C.brand }}
                    onClick={() => scrollTo("#contact")}>
                    Contact Us<ArrowUpRight size={14} className="ml-2"/>
                  </Button>
                  <div className="rounded-2xl p-7 mt-2" style={{ background:C.brand }}>
                    <h3 className="text-xl font-black text-white mb-1">Degree Programs</h3>
                    <p className="text-sm font-semibold underline mb-4" style={{ color:C.goldLt }}>Key Benefits</p>
                    <div className="space-y-3">
                      {["Affordable Tuition","Flexible Installment Plans","Scholarships Available","No Hidden Charges"].map(b => (
                        <div key={b} className="flex items-center gap-3 text-white/85">
                          <Check size={16} style={{ color:C.goldLt }} className="shrink-0"/>
                          <span className="text-sm">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionFade>

                {/* Right — fee table */}
                <SectionFade>
                  <div className="rounded-2xl border overflow-hidden"
                    style={{ borderColor:"rgba(59,130,246,0.2)" }}>
                    <div className="relative h-44 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&q=80" alt="UOU campus"
                        className="w-full h-full object-cover"/>
                      <div className="absolute inset-0 flex flex-col items-start justify-end p-6"
                        style={{ background:"linear-gradient(to top, rgba(4,11,26,0.85) 0%, transparent 60%)" }}>
                        <p className="text-white/50 text-xs mb-1">Home &gt; Tuition &amp; Fees</p>
                        <h3 className="text-2xl font-black text-white">Unique Open University</h3>
                      </div>
                    </div>
                    <div className="p-7" style={{ background:C.card }}>
                      <h3 className="text-xl font-black text-white mb-1">Tuition &amp; Fees</h3>
                      <p className="text-sm text-white/50 mb-6">Affordable education for everyone.</p>
                      <div className="rounded-xl p-5 border" style={{ background:"rgba(255,255,255,0.03)", borderColor:C.border }}>
                        <h4 className="text-lg font-black text-white mb-4">A. Application &amp; Registration Fees</h4>
                        <div className="space-y-3">
                          {FEES.map((fee, i) => (
                            <motion.div key={fee.label}
                              initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={VP_REPEAT}
                              transition={{delay:0.1+i*0.08,duration:0.5,ease:EC}}
                              className="flex items-center justify-between py-2 border-b last:border-0"
                              style={{ borderColor:"rgba(59,130,246,0.1)" }}>
                              <span className="text-sm text-white/60">{fee.label}</span>
                              <span className="text-sm font-black" style={{ color:C.electric }}>{fee.amount}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <Link href="/login">
                        <Button className="w-full mt-5 font-bold text-white border-0"
                          style={{ background:`linear-gradient(135deg,${C.gold},#D97706)`, boxShadow:"0 0 24px rgba(245,158,11,0.3)" }}>
                          Apply Now — It&apos;s Free to Explore
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SectionFade>
              </div>
            </div>
          </section>

          {/* ══════════ NEWS ══════════ */}
          <section className="py-24 px-6" style={{ background:C.navy }}>
            <div className="max-w-6xl mx-auto">
              {/* Section headline — scroll-linked */}
              <SectionFade className="flex items-end justify-between mb-12">
                <div>
                  <div className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color:C.electric }}>
                    Live Intelligence Feed
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-1">Latest News &amp; Articles</h2>
                  <p className="text-white/50 text-sm">Latest from Unique Open University</p>
                </div>
                <Zap style={{ color:C.electric }} size={28}/>
              </SectionFade>

              {/* News cards — scroll-linked grid, each card re-animates on return */}
              <SectionFade variant="loose" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {NEWS.map((item, i) => (
                  <FadeChild key={item.id} delay={i*0.13}>
                    <motion.article
                      whileHover={{ y:-6, scale:1.01 }}
                      className="relative p-6 rounded-2xl border cursor-pointer group h-full"
                      style={{ background:C.card, borderColor:C.border, backdropFilter:"blur(12px)" }}>
                      <div className="absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background:`linear-gradient(90deg, transparent, ${C.electric}, transparent)` }}/>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                          style={{ background:"rgba(29,78,216,0.15)", color:C.electric }}>{item.category}</span>
                        <span className="text-xs text-white/40 font-mono">{item.date}</span>
                      </div>
                      <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug">
                        {item.title}
                      </h3>
                    </motion.article>
                  </FadeChild>
                ))}
              </SectionFade>
            </div>
          </section>

          {/* ══════════ PORTAL ROLES ══════════ */}
          <section className="py-24 px-6" style={{ background:"rgba(6,14,38,0.85)" }}>
            <div className="max-w-6xl mx-auto">
              <SectionFade className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">Four Portals, One System</h2>
                <p className="text-white/50 text-lg">Each role gets a bespoke command interface.</p>
              </SectionFade>

              {/* Four portal cards — scroll-linked, each fades/slides in with stagger */}
              <SectionFade variant="loose" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title:"Founder",      Icon:Shield,        desc:"Command center for institutional KPIs",        color:C.gold     },
                  { title:"Coordinator",  Icon:Users,         desc:"Manage students, lecturers, and courses",      color:"#34D399"  },
                  { title:"Lecturer",     Icon:BookOpen,      desc:"Manage courses and assessment grades",         color:"#A78BFA"  },
                  { title:"Student",      Icon:GraduationCap, desc:"Access courses, Gold Cards, and credentials", color:C.electric },
                ].map((r, i) => (
                  <FadeChild key={r.title} delay={i*0.13}>
                    <motion.div
                      whileHover={{ y:-8, scale:1.03 }}
                      onClick={() => setLocation("/login")}
                      className="relative group cursor-pointer rounded-2xl p-6 border overflow-hidden h-full"
                      style={{ background:C.card, borderColor:C.border }}>
                      <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background:"radial-gradient(circle at 50% 0%, rgba(29,78,216,0.15), transparent 70%)" }}/>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 border"
                        style={{ background:`${r.color}18`, borderColor:`${r.color}30`, color:r.color }}>
                        <r.Icon size={20}/>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{r.title}</h3>
                      <p className="text-sm text-white/50 leading-relaxed">{r.desc}</p>
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                        style={{ background:`linear-gradient(90deg, ${r.color}, transparent)` }}/>
                    </motion.div>
                  </FadeChild>
                ))}
              </SectionFade>
            </div>
          </section>

          {/* ══════════ FINAL CTA ══════════ */}
          <section className="py-28 px-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background:"radial-gradient(ellipse 60% 60% at 50% 50%, rgba(29,78,216,0.12), transparent 70%)" }}/>
            <SectionFade className="max-w-2xl mx-auto relative z-10">
              <div className="flex justify-center mb-6">
                <Award size={40} style={{ color:C.gold }} className="gold-glow"/>
              </div>
              <h2 className="text-5xl font-black text-white mb-4 leading-tight">
                Ready to Begin Your Journey?
              </h2>
              <p className="text-white/50 mb-10 text-lg">
                Your future starts with one click. Join thousands of scholars building their
                futures at Unique Open University.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/login">
                  <motion.div whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}}>
                    <Button size="lg" className="h-14 px-12 text-lg font-black text-white border-0"
                      style={{ background:`linear-gradient(135deg,${C.gold},#D97706)`, boxShadow:"0 0 48px rgba(245,158,11,0.4)" }}>
                      <Award size={18} className="mr-2"/> Apply Now
                    </Button>
                  </motion.div>
                </Link>
                <motion.div whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}}
                  onClick={() => setPhase("persona")} style={{ cursor:"pointer" }}>
                  <Button variant="outline" size="lg" className="h-14 px-12 text-lg font-black"
                    style={{ borderColor:"rgba(59,130,246,0.4)", color:C.electric }}>
                    <Zap size={16} className="mr-2"/> Demo Mode
                  </Button>
                </motion.div>
              </div>
            </SectionFade>
          </section>

          {/* ══════════ FOOTER ══════════ */}
          <footer id="contact" className="border-t"
            style={{ background:"rgba(3,8,22,0.98)", borderColor:C.border }}>
            <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
              <SectionFade variant="loose" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                {/* Brand */}
                <FadeChild delay={0} x={-24}>
                  <div className="flex items-center gap-3 mb-4">
                    <img src={import.meta.env.BASE_URL+"uou-logo.png"} alt="UOU"
                      className="w-12 h-12 object-contain"
                      style={{ filter:"drop-shadow(0 0 8px rgba(59,130,246,0.5))" }}/>
                    <div>
                      <div className="text-white font-black text-sm leading-tight">Unique Open</div>
                      <div className="text-sm font-black" style={{ color:C.electric }}>University</div>
                    </div>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed mb-5">
                    NUC Accredited · Knowledge for Global Impact.
                    Making world-class education accessible to everyone.
                  </p>
                  <div className="flex items-center gap-3">
                    {[Facebook,Twitter,Instagram,Youtube].map((Icon,i) => (
                      <a key={i} href="https://uou.edu.ng" target="_blank" rel="noopener noreferrer"
                        className="w-8 h-8 flex items-center justify-center rounded-lg border transition-colors hover:border-blue-500/50 hover:bg-blue-500/10"
                        style={{ borderColor:C.border, color:"rgba(255,255,255,0.4)" }}>
                        <Icon size={14}/>
                      </a>
                    ))}
                  </div>
                </FadeChild>

                {/* Quick Links */}
                <FadeChild delay={0.1}>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
                  <ul className="space-y-2">
                    {["About Us","Our Programs","Admissions","Tuition & Fees","Student Life","Scholarships"].map(link => (
                      <li key={link}>
                        <button
                          onClick={() => scrollTo(link==="About Us"?"#about":link==="Our Programs"?"#programs":link==="Tuition & Fees"?"#fees":link==="Student Life"?"#student-life":"#contact")}
                          className="text-sm text-white/40 hover:text-white/80 transition-colors">
                          {link}
                        </button>
                      </li>
                    ))}
                  </ul>
                </FadeChild>

                {/* Programs */}
                <FadeChild delay={0.2}>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Programs</h4>
                  <ul className="space-y-2">
                    {["Business Administration","Computer Science","Nursing Science","Project Management","AI & Robotics","Ethical Hacking"].map(prog => (
                      <li key={prog}>
                        <Link href="/login">
                          <span className="text-sm text-white/40 hover:text-white/80 transition-colors cursor-pointer">{prog}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </FadeChild>

                {/* Contact */}
                <FadeChild delay={0.3} x={24}>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact Us</h4>
                  <div className="space-y-4">
                    {[
                      { Icon:MapPin, el:<p className="text-sm text-white/40 leading-relaxed">Unique Open University<br/>Zaria, Kaduna State, Nigeria<br/>(Also in Lagos &amp; Kano)</p> },
                      { Icon:Phone, el:<a href="tel:+2348012345678" className="text-sm text-white/40 hover:text-white/70 transition-colors">+234 801 234 5678</a> },
                      { Icon:Mail,  el:<a href="mailto:info@uou.edu.ng" className="text-sm text-white/40 hover:text-white/70 transition-colors">info@uou.edu.ng</a> },
                      { Icon:Globe, el:<a href="https://uou.edu.ng" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white/70 transition-colors">www.uou.edu.ng</a> },
                    ].map(({ Icon, el }, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Icon size={16} className="shrink-0 mt-0.5" style={{ color:C.electric }}/>
                        {el}
                      </div>
                    ))}
                  </div>
                </FadeChild>
              </SectionFade>

              <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
                style={{ borderColor:C.border }}>
                <p className="text-xs text-white/25">
                  © {new Date().getFullYear()} Unique Open University. All rights reserved. NUC Accredited.
                </p>
                <div className="flex items-center gap-4">
                  {["Privacy Policy","Terms of Use","Cookie Policy"].map(item => (
                    <button key={item} className="text-xs text-white/25 hover:text-white/50 transition-colors">{item}</button>
                  ))}
                </div>
              </div>
              <p className="text-center text-xs text-white/20 mt-4">
                Student portal access is by invitation only.{" "}
                <Link href="/login">
                  <span className="underline hover:text-white/40 transition-colors cursor-pointer">Contact the Registrar</span>
                </Link>
                {" "}to enrol.
              </p>
            </div>
          </footer>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
