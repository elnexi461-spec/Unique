import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Filter, ArrowLeft, Clock, Star, Search, Vault } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { GOLD_CARD_HISTORY } from "@/data/mockDatabase";
import { PageTransition } from "@/components/PageTransition";

interface VaultEntry {
  id: string;
  courseCode: string;
  courseName?: string;
  score: number;
  grade: string;
  privateKey: string;
  mintedAt: string;
  source: "local" | "demo";
}

const COURSE_NAMES: Record<string, string> = {
  "ENT-101": "Principles of Entrepreneurship",
  "AI-201": "AI Safety & Ethics",
  "DIG-301": "Digital Innovation Lab",
  "LAW-201": "Constitutional Law & Governance",
  "HSM-301": "Health Systems Management",
  "BAM-111": "Business Administration & Management",
};

function gradeFromScore(score: number) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function scoreColor(score: number) {
  if (score >= 90) return "#FCD34D";
  if (score >= 75) return "#34D399";
  if (score >= 60) return "#60A5FA";
  return "#F87171";
}

const ALL_COURSES = ["All", ...Object.keys(COURSE_NAMES)];
const SORT_OPTIONS = ["Newest", "Highest Score", "Lowest Score"] as const;

export default function GoldCardVault() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState<typeof SORT_OPTIONS[number]>("Newest");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<VaultEntry | null>(null);

  useEffect(() => {
    const local: VaultEntry[] = [];

    if (user?.id) {
      try {
        const stored = JSON.parse(localStorage.getItem(`uou_vault_${user.id}`) ?? "[]");
        for (const e of stored) {
          local.push({
            id: `local-${e.mintedAt}`,
            courseCode: e.courseName?.split(" ")?.[0] ?? "ENT",
            courseName: e.courseName,
            score: e.score,
            grade: e.grade,
            privateKey: e.privateKey,
            mintedAt: e.mintedAt,
            source: "local",
          });
        }
      } catch {/* ignore */}
    }

    const demo: VaultEntry[] = GOLD_CARD_HISTORY.slice(0, 40).map(c => ({
      id: `demo-${c.id}`,
      courseCode: c.courseCode,
      courseName: COURSE_NAMES[c.courseCode],
      score: c.score,
      grade: gradeFromScore(c.score),
      privateKey: c.keyHash,
      mintedAt: c.mintedAt,
      source: "demo" as const,
    }));

    setEntries([...local, ...demo]);
  }, [user?.id]);

  const filtered = entries
    .filter(e => filter === "All" || e.courseCode === filter)
    .filter(e => !search || e.courseName?.toLowerCase().includes(search.toLowerCase()) || e.courseCode.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "Newest") return new Date(b.mintedAt).getTime() - new Date(a.mintedAt).getTime();
      if (sort === "Highest Score") return b.score - a.score;
      return a.score - b.score;
    });

  const totalScore = filtered.length ? Math.round(filtered.reduce((s, e) => s + e.score, 0) / filtered.length) : 0;
  const bestCourse = entries.length
    ? Object.entries(
        entries.reduce((acc, e) => { acc[e.courseCode] = (acc[e.courseCode] ?? 0) + 1; return acc; }, {} as Record<string, number>)
      ).sort((a, b) => b[1] - a[1])[0]?.[0]
    : "—";

  return (
    <PageTransition>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <motion.button whileHover={{ x: -2 }} whileTap={{ scale: 0.97 }}
            onClick={() => setLocation("/student")}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border"
            style={{ background: "rgba(4,11,26,0.6)", borderColor: "rgba(0,112,255,0.25)", color: "rgba(100,160,255,0.9)", backdropFilter: "blur(12px)" }}>
            <ArrowLeft size={14} /> Back to Portal
          </motion.button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border"
              style={{ background: "rgba(245,158,11,0.12)", borderColor: "rgba(245,158,11,0.3)" }}>
              <Award size={18} style={{ color: "#F59E0B" }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Gold Card Vault</h1>
              <p className="text-muted-foreground text-sm">{entries.length} cards minted · Sentinel verified</p>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Minted", value: entries.length, color: "#F59E0B", icon: Award },
            { label: "Avg Score", value: `${totalScore}%`, color: "#34D399", icon: Star },
            { label: "Top Course", value: bestCourse ?? "—", color: "#0070FF", icon: Filter },
          ].map((stat) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border p-3 text-center"
              style={{ background: "rgba(4,11,26,0.65)", borderColor: `${stat.color}20` }}>
              <div className="text-lg font-black" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by course..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            style={{ borderColor: "rgba(0,112,255,0.2)", background: "rgba(4,11,26,0.5)" }}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ALL_COURSES.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
              style={{
                background: filter === c ? "rgba(245,158,11,0.18)" : "transparent",
                borderColor: filter === c ? "rgba(245,158,11,0.45)" : "rgba(255,255,255,0.08)",
                color: filter === c ? "#F59E0B" : "rgba(148,163,184,0.7)",
              }}>
              {c}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          {SORT_OPTIONS.map(s => (
            <button key={s} onClick={() => setSort(s)}
              className="px-3 py-1 rounded-lg text-[11px] font-semibold border transition-all"
              style={{
                background: sort === s ? "rgba(0,112,255,0.12)" : "transparent",
                borderColor: sort === s ? "rgba(0,112,255,0.35)" : "rgba(255,255,255,0.07)",
                color: sort === s ? "#60A5FA" : "rgba(148,163,184,0.6)",
              }}>
              {s}
            </button>
          ))}
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence>
            {filtered.map((card, i) => (
              <motion.div key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.025, duration: 0.3 }}
                onClick={() => setSelected(card)}
                className="cursor-pointer rounded-2xl overflow-hidden relative border hover:scale-[1.02] transition-transform"
                style={{
                  background: "linear-gradient(135deg, #1c0a00, #3d1c00, #b45309, #f59e0b, #b45309)",
                  backgroundSize: "300% 300%",
                  animation: "gold-shimmer-card 5s linear infinite",
                  borderColor: "rgba(253,230,138,0.25)",
                  boxShadow: `0 0 20px rgba(245,158,11,0.15)`,
                }}>
                {/* Shimmer overlay */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)" }} />
                {/* Card content */}
                <div className="relative z-10 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: "rgba(28,15,0,0.6)" }}>
                      {card.courseCode}
                    </div>
                    <div className="text-[9px] font-mono" style={{ color: "rgba(28,15,0,0.45)" }}>
                      {new Date(card.mintedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                    </div>
                  </div>
                  <div className="text-xs font-bold leading-tight mb-3 line-clamp-2" style={{ color: "#1c0a00" }}>
                    {card.courseName ?? card.courseCode}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black" style={{ color: scoreColor(card.score), textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}>
                      {card.score}%
                    </div>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center border"
                      style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(28,15,0,0.2)", color: "#1c0a00", fontWeight: 900, fontSize: 13 }}>
                      {card.grade}
                    </div>
                  </div>
                  <div className="mt-2 text-[8px] font-mono truncate" style={{ color: "rgba(28,15,0,0.4)" }}>
                    {card.privateKey.slice(0, 22)}…
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              <Award size={36} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">No Gold Cards found. Complete a lecture to mint your first.</p>
              <motion.button whileHover={{ scale: 1.03 }} onClick={() => setLocation("/student/courses")}
                className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #0040C0, #0070FF)", color: "white" }}>
                Browse Courses
              </motion.button>
            </div>
          )}
        </div>

        {/* Detail modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: "rgba(4,11,26,0.85)", backdropFilter: "blur(12px)" }}
              onClick={() => setSelected(null)}>
              <motion.div
                initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="rounded-3xl overflow-hidden max-w-sm w-full border"
                style={{
                  background: "linear-gradient(135deg, #1c0a00, #3d1c00, #b45309, #f59e0b, #fde68a, #f59e0b)",
                  backgroundSize: "300% 300%",
                  animation: "gold-shimmer-card 3s linear infinite",
                  borderColor: "rgba(253,230,138,0.4)",
                  boxShadow: "0 0 60px rgba(245,158,11,0.4)",
                }}>
                <div className="p-7 relative">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: "rgba(28,15,0,0.65)" }}>Unique Open University</div>
                      <div className="text-[9px] tracking-[0.2em] uppercase" style={{ color: "rgba(28,15,0,0.45)" }}>Academic Achievement Certificate</div>
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center border-2"
                      style={{ background: "radial-gradient(circle, #60A5FA, #1D4ED8)", borderColor: "rgba(253,230,138,0.5)" }}>
                      <span className="text-white font-black text-[9px]">UOU</span>
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "rgba(28,15,0,0.5)" }}>Scholar</div>
                  <div className="text-2xl font-black mb-4" style={{ color: "#1c0a00" }}>{user?.name ?? "Scholar"}</div>
                  <div className="flex items-end gap-4 mb-4">
                    <div className="flex-1">
                      <div className="text-[9px] uppercase tracking-wider mb-0.5" style={{ color: "rgba(28,15,0,0.5)" }}>Course</div>
                      <div className="text-sm font-bold leading-tight" style={{ color: "#1c0a00" }}>{selected.courseName ?? selected.courseCode}</div>
                    </div>
                    <div className="text-3xl font-black" style={{ color: scoreColor(selected.score), textShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>{selected.score}%</div>
                    <div className="text-3xl font-black" style={{ color: "#1c0a00" }}>{selected.grade}</div>
                  </div>
                  <div className="rounded-xl p-3 border mb-4" style={{ background: "rgba(28,15,0,0.15)", borderColor: "rgba(28,15,0,0.22)" }}>
                    <div className="text-[8px] font-bold tracking-[0.3em] uppercase mb-1 flex items-center gap-1" style={{ color: "rgba(28,15,0,0.55)" }}>
                      <Award size={8} /> Cryptographic Attendance Key
                    </div>
                    <div className="font-mono text-[10px] font-bold break-all" style={{ color: "#1c0a00" }}>{selected.privateKey}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock size={10} style={{ color: "rgba(28,15,0,0.5)" }} />
                      <span className="text-[9px] font-mono" style={{ color: "rgba(28,15,0,0.5)" }}>
                        {new Date(selected.mintedAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                    <button onClick={() => setSelected(null)}
                      className="text-[10px] font-semibold px-3 py-1 rounded-full"
                      style={{ background: "rgba(28,15,0,0.2)", color: "rgba(28,15,0,0.7)" }}>
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
