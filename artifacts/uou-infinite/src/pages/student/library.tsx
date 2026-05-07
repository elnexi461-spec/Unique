import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Search, ExternalLink, Download, Star, Clock } from "lucide-react";
import { useLocation } from "wouter";

const RESOURCES = [
  { id: 1,  title: "The Lean Startup",                      author: "Eric Ries",           dept: "Business",  type: "eBook",   year: 2011, rating: 4.8, available: true  },
  { id: 2,  title: "Alignment Problem",                     author: "Brian Christian",     dept: "AI",        type: "eBook",   year: 2020, rating: 4.9, available: true  },
  { id: 3,  title: "Nigerian Constitutional Law (6th Ed.)", author: "Nwabueze",            dept: "Law",       type: "eBook",   year: 2022, rating: 4.6, available: true  },
  { id: 4,  title: "Human Centred Design Toolkit",          author: "IDEO",                dept: "Engineering",type: "PDF",    year: 2015, rating: 4.7, available: true  },
  { id: 5,  title: "Zero to One",                           author: "Peter Thiel",         dept: "Business",  type: "eBook",   year: 2014, rating: 4.8, available: false },
  { id: 6,  title: "Weapons of Math Destruction",          author: "Cathy O'Neil",        dept: "AI",        type: "eBook",   year: 2016, rating: 4.7, available: true  },
  { id: 7,  title: "Africa's Business Revolution",         author: "Leke et al.",         dept: "Business",  type: "eBook",   year: 2018, rating: 4.5, available: true  },
  { id: 8,  title: "Engineering Systems Thinking",         author: "Ulrich & Eppinger",   dept: "Engineering",type: "eBook",  year: 2019, rating: 4.4, available: true  },
  { id: 9,  title: "Law of Contracts in Nigeria",          author: "Sagay",               dept: "Law",       type: "PDF",     year: 2021, rating: 4.3, available: false },
  { id: 10, title: "Global Health: A Challenge",           author: "Paul Farmer",         dept: "Health",    type: "eBook",   year: 2013, rating: 4.6, available: true  },
];

const JOURNALS = [
  { name: "African Journal of Business", issues: 48, access: "Full" },
  { name: "IEEE Transactions on AI",     issues: 120, access: "Full" },
  { name: "West African Law Review",     issues: 36, access: "Full" },
  { name: "Nature Medicine Africa",      issues: 24, access: "Partial" },
];

const DEPT_COLORS: Record<string, string> = {
  Business:    "#0070FF",
  AI:          "#34D399",
  Law:         "#A78BFA",
  Engineering: "#F59E0B",
  Health:      "#F87171",
};

export default function Library() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [borrowed, setBorrowed] = useState<Set<number>>(new Set());

  const depts = ["All", "Business", "AI", "Law", "Engineering", "Health"];
  const filtered = RESOURCES.filter(r => {
    const matchQ = !query || r.title.toLowerCase().includes(query.toLowerCase()) || r.author.toLowerCase().includes(query.toLowerCase());
    const matchD = deptFilter === "All" || r.dept === deptFilter;
    return matchQ && matchD;
  });

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
            <BookOpen size={18} style={{ color: "#0070FF" }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Digital Library</h1>
            <p className="text-muted-foreground text-sm">{RESOURCES.length} resources · 4 academic journals</p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by title or author…"
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white"
          style={{ background: "rgba(4,11,26,0.8)", border: "1px solid rgba(0,112,255,0.2)", outline: "none" }}
        />
      </div>

      {/* Dept filters */}
      <div className="flex gap-2 flex-wrap">
        {depts.map(d => (
          <button key={d} onClick={() => setDeptFilter(d)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
            style={{
              background: deptFilter === d ? "rgba(0,112,255,0.15)" : "transparent",
              borderColor: deptFilter === d ? "rgba(0,112,255,0.4)" : "rgba(255,255,255,0.08)",
              color: deptFilter === d ? "#0070FF" : "rgba(148,163,184,0.7)",
            }}>
            {d}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Book grid */}
        <div className="lg:col-span-2">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Resources ({filtered.length})
          </div>
          <div className="space-y-3">
            {filtered.map((r, i) => {
              const deptColor = DEPT_COLORS[r.dept] ?? "#0070FF";
              const isBorrowed = borrowed.has(r.id);
              return (
                <motion.div key={r.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border p-4 flex items-start gap-4"
                  style={{ background: "rgba(4,11,26,0.65)", borderColor: "rgba(0,112,255,0.12)" }}>
                  <div className="w-10 h-12 rounded-lg flex items-center justify-center shrink-0 border"
                    style={{ background: `${deptColor}15`, borderColor: `${deptColor}30` }}>
                    <BookOpen size={16} style={{ color: deptColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground leading-snug">{r.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.author} · {r.year}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: `${deptColor}15`, color: deptColor }}>{r.dept}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: "rgba(255,255,255,0.06)", color: "rgba(148,163,184,0.7)" }}>{r.type}</span>
                      <span className="flex items-center gap-1 text-[9px]" style={{ color: "#F59E0B" }}>
                        <Star size={8} fill="#F59E0B" /> {r.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    {r.available || isBorrowed ? (
                      <>
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => setBorrowed(prev => new Set(prev).add(r.id))}
                          className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg"
                          style={{ background: isBorrowed ? "rgba(52,211,153,0.15)" : "rgba(0,112,255,0.12)", color: isBorrowed ? "#34D399" : "#0070FF", border: `1px solid ${isBorrowed ? "rgba(52,211,153,0.3)" : "rgba(0,112,255,0.3)"}` }}>
                          {isBorrowed ? <Clock size={10} /> : <Download size={10} />}
                          {isBorrowed ? "Borrowed" : "Borrow"}
                        </motion.button>
                        <button className="flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded-lg"
                          style={{ background: "transparent", color: "rgba(148,163,184,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <ExternalLink size={10} /> Read Online
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] font-bold px-3 py-1.5 rounded-lg text-center"
                        style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.25)" }}>
                        On Loan
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Journals sidebar */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Academic Journals</div>
          {JOURNALS.map((j, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className="rounded-xl border p-4"
              style={{ background: "rgba(4,11,26,0.65)", borderColor: "rgba(0,112,255,0.12)" }}>
              <div className="text-sm font-semibold text-foreground mb-1">{j.name}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{j.issues} issues</span>
                <span className="font-bold px-2 py-0.5 rounded"
                  style={{ background: j.access === "Full" ? "rgba(52,211,153,0.12)" : "rgba(245,158,11,0.12)", color: j.access === "Full" ? "#34D399" : "#F59E0B" }}>
                  {j.access} Access
                </span>
              </div>
            </motion.div>
          ))}

          <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mt-6">Your Borrowed Books</div>
          {borrowed.size === 0 ? (
            <p className="text-xs text-muted-foreground">No active loans.</p>
          ) : (
            Array.from(borrowed).map(id => {
              const r = RESOURCES.find(r => r.id === id);
              return r ? (
                <div key={id} className="rounded-lg border p-3 text-xs"
                  style={{ background: "rgba(52,211,153,0.06)", borderColor: "rgba(52,211,153,0.2)" }}>
                  <div className="font-semibold text-foreground">{r.title}</div>
                  <div className="text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock size={10} /> Due in 14 days
                  </div>
                </div>
              ) : null;
            })
          )}
        </div>
      </div>
    </div>
  );
}
