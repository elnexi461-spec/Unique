import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Key, Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PerformanceLedgerEntry {
  key: string;
  tier: "GOLD" | "SILVER" | "BRONZE";
  submittedAt: string;
}

function getLedger(): PerformanceLedgerEntry[] {
  try {
    return JSON.parse(localStorage.getItem("UOU_Performance_Ledger") || "[]");
  } catch {
    return [];
  }
}

const TIER_RE = /^UOU-(GOLD|SILVER|BRONZE)-[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}-\d{1,3}$/;
const TIER_RE_NEW = /^UOU-(GOLD|SILVER|BRONZE)-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

function isValidKey(k: string): boolean {
  return TIER_RE.test(k) || TIER_RE_NEW.test(k);
}

function extractTier(k: string): "GOLD" | "SILVER" | "BRONZE" {
  if (k.includes("-GOLD-"))   return "GOLD";
  if (k.includes("-SILVER-")) return "SILVER";
  return "BRONZE";
}

const TIER_STYLE = {
  GOLD:   { color: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)", emoji: "🥇" },
  SILVER: { color: "#94A3B8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.3)", emoji: "🥈" },
  BRONZE: { color: "#D97706", bg: "rgba(180,83,9,0.08)",  border: "rgba(180,83,9,0.3)",   emoji: "🥉" },
};

export function KeySubmitPanel() {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState("");
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [ledger, setLedger]   = useState<PerformanceLedgerEntry[]>(getLedger);

  const handleSubmit = () => {
    setError(""); setSuccess("");
    const trimmed = input.trim().toUpperCase();
    if (!trimmed) { setError("Please enter your Performance Key."); return; }
    if (!isValidKey(trimmed)) {
      setError("Invalid key format. Expected: UOU-GOLD/SILVER/BRONZE-XXXXXX-… Copy it directly from your Achievement Card.");
      return;
    }
    if (ledger.some(e => e.key === trimmed)) {
      setError("This key has already been submitted to the institutional ledger.");
      return;
    }
    const tier = extractTier(trimmed);
    const entry: PerformanceLedgerEntry = { key: trimmed, tier, submittedAt: new Date().toISOString() };
    const updated = [...ledger, entry];
    localStorage.setItem("UOU_Performance_Ledger", JSON.stringify(updated));
    setLedger(updated);
    setInput("");
    setSuccess(`${tier} achievement recorded on the institutional ledger.`);
    setTimeout(() => setSuccess(""), 5000);
  };

  const gold   = ledger.filter(e => e.tier === "GOLD").length;
  const silver = ledger.filter(e => e.tier === "SILVER").length;
  const bronze = ledger.filter(e => e.tier === "BRONZE").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-xl border overflow-hidden"
      style={{ background: "rgba(8,20,60,0.7)", borderColor: "rgba(59,130,246,0.2)" }}
    >
      {/* Header — always visible */}
      <button
        className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-white/[0.03]"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)" }}
          >
            <Trophy size={16} style={{ color: "#F59E0B" }} />
          </div>
          <div>
            <div className="font-bold text-sm text-foreground">Submit Performance Key</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {ledger.length > 0
                ? `${gold} Gold · ${silver} Silver · ${bronze} Bronze on ledger`
                : "Log your Academic Gauntlet achievement keys"}
            </div>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: "rgba(59,130,246,0.12)" }}>
              <p className="text-xs text-muted-foreground pt-3 leading-relaxed">
                After completing an Academic Gauntlet, tap your Achievement Card to copy the key, then paste it here to record it on the institutional ledger permanently.
              </p>

              {/* Tier counters */}
              <div className="grid grid-cols-3 gap-2">
                {(["GOLD", "SILVER", "BRONZE"] as const).map(tier => {
                  const s = TIER_STYLE[tier];
                  const count = ledger.filter(e => e.tier === tier).length;
                  return (
                    <div key={tier} className="rounded-lg p-2 text-center" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                      <div className="text-lg">{s.emoji}</div>
                      <div className="text-xs font-bold" style={{ color: s.color }}>{count}</div>
                      <div className="text-[10px] text-muted-foreground">{tier}</div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Key size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={input}
                    onChange={e => { setInput(e.target.value); setError(""); setSuccess(""); }}
                    onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }}
                    placeholder="UOU-GOLD-XXXXXX-…"
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg font-mono focus:outline-none transition-all text-foreground placeholder:text-muted-foreground"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: error ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(59,130,246,0.2)",
                    }}
                  />
                </div>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  className="shrink-0 font-semibold"
                  style={{ background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "#fff" }}
                >
                  Submit
                </Button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-start gap-2 text-xs rounded-lg p-2.5"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5" }}
                  >
                    <XCircle size={13} className="shrink-0 mt-0.5" />
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-xs rounded-lg p-2.5"
                    style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", color: "#6EE7B7" }}
                  >
                    <CheckCircle size={13} />
                    <span className="font-semibold">{success}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recent ledger entries */}
              {ledger.length > 0 && (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {[...ledger].reverse().slice(0, 5).map((entry, i) => {
                    const s = TIER_STYLE[entry.tier];
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
                        style={{ background: s.bg, border: `1px solid ${s.border}` }}
                      >
                        <span className="text-sm">{s.emoji}</span>
                        <span className="font-mono text-[10px] flex-1 truncate" style={{ color: s.color }}>
                          {entry.key}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {new Date(entry.submittedAt).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
