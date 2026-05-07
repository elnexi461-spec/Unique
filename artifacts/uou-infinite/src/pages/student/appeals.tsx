import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MessageSquare, Send, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";

const APPEAL_TYPES = [
  "Grade Appeal",
  "Examination Irregularity",
  "Attendance Dispute",
  "Assessment Extension Request",
  "Fee Dispute",
  "Academic Misconduct Response",
  "Other",
];

const EXISTING_APPEALS = [
  {
    ref: "UOU-APL-2026-0041",
    type: "Grade Appeal",
    course: "ENT-101",
    submitted: "May 2, 2026",
    status: "under_review",
    outcome: null,
  },
];

const STATUS_CONFIG = {
  submitted:    { label: "Submitted",    color: "#0070FF", icon: CheckCircle },
  under_review: { label: "Under Review", color: "#F59E0B", icon: Clock       },
  resolved:     { label: "Resolved",     color: "#34D399", icon: CheckCircle },
  rejected:     { label: "Rejected",     color: "#F87171", icon: AlertTriangle },
};

export default function Appeals() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [tab, setTab] = useState<"new" | "history">("new");
  const [form, setForm] = useState({ type: "", course: "", description: "", evidence: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newRef, setNewRef] = useState("");

  const handleSubmit = async () => {
    if (!form.type || !form.course || form.description.length < 20) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    const ref = `UOU-APL-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    setNewRef(ref);
    setSubmitted(true);
    setSubmitting(false);
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
            <MessageSquare size={18} style={{ color: "#0070FF" }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Appeals & Grievances</h1>
            <p className="text-muted-foreground text-sm">Submit and track formal academic appeals</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["new", "history"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-all"
            style={{
              background: tab === t ? "rgba(0,112,255,0.15)" : "transparent",
              borderColor: tab === t ? "rgba(0,112,255,0.4)" : "rgba(255,255,255,0.08)",
              color: tab === t ? "#0070FF" : "rgba(148,163,184,0.7)",
            }}>
            {t === "new" ? "New Appeal" : `Appeal History (${EXISTING_APPEALS.length})`}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* NEW APPEAL */}
        {tab === "new" && (
          <motion.div key="new"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border p-8 text-center space-y-4"
                style={{ background: "rgba(52,211,153,0.07)", borderColor: "rgba(52,211,153,0.3)" }}
              >
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }}>
                  <CheckCircle size={40} className="mx-auto" style={{ color: "#34D399" }} />
                </motion.div>
                <h2 className="text-xl font-black text-foreground">Appeal Submitted</h2>
                <p className="text-muted-foreground text-sm">
                  Your appeal has been received and logged. You will be contacted via your institutional email within 5 working days.
                </p>
                <div className="inline-block rounded-xl border px-4 py-2"
                  style={{ background: "rgba(52,211,153,0.1)", borderColor: "rgba(52,211,153,0.3)" }}>
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground mb-0.5">Reference Number</div>
                  <div className="font-mono font-bold text-sm" style={{ color: "#34D399" }}>{newRef}</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setSubmitted(false); setForm({ type: "", course: "", description: "", evidence: "" }); }}
                  className="px-6 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: "rgba(0,112,255,0.12)", color: "#0070FF", border: "1px solid rgba(0,112,255,0.3)" }}
                >
                  Submit Another Appeal
                </motion.button>
              </motion.div>
            ) : (
              <div className="space-y-5 max-w-2xl">
                <div className="rounded-xl border p-4 text-xs text-muted-foreground leading-relaxed"
                  style={{ background: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.2)" }}>
                  <AlertTriangle size={12} className="inline mr-2" style={{ color: "#F59E0B" }} />
                  Appeals must be submitted within 10 working days of the contested decision. Provide as much detail as possible.
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Appeal Type</label>
                    <select
                      value={form.type}
                      onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm text-white"
                      style={{ background: "rgba(4,11,26,0.8)", border: "1px solid rgba(0,112,255,0.2)", outline: "none" }}
                    >
                      <option value="">Select appeal type…</option>
                      {APPEAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Course Code / Module</label>
                    <input
                      value={form.course}
                      onChange={e => setForm(f => ({ ...f, course: e.target.value }))}
                      placeholder="e.g. ENT-101 or N/A"
                      className="w-full px-3 py-2.5 rounded-xl text-sm text-white"
                      style={{ background: "rgba(4,11,26,0.8)", border: "1px solid rgba(0,112,255,0.2)", outline: "none" }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                      Description <span className="text-muted-foreground/50 normal-case font-normal">(minimum 20 characters)</span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Provide a clear, factual description of your grievance and the outcome you are seeking…"
                      rows={6}
                      className="w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none"
                      style={{ background: "rgba(4,11,26,0.8)", border: "1px solid rgba(0,112,255,0.2)", outline: "none" }}
                    />
                    <div className="text-[10px] font-mono text-muted-foreground mt-1 text-right">
                      {form.description.length} / 2000
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Supporting Evidence (optional)</label>
                    <textarea
                      value={form.evidence}
                      onChange={e => setForm(f => ({ ...f, evidence: e.target.value }))}
                      placeholder="List any supporting documents, emails, or references you can provide…"
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none"
                      style={{ background: "rgba(4,11,26,0.8)", border: "1px solid rgba(0,112,255,0.2)", outline: "none" }}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={!form.type || !form.course || form.description.length < 20 || submitting}
                    className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                    style={{
                      background: (!form.type || !form.course || form.description.length < 20)
                        ? "rgba(0,112,255,0.2)"
                        : "linear-gradient(135deg, #0040C0, #0070FF)",
                      color: "white",
                      cursor: (!form.type || !form.course || form.description.length < 20) ? "not-allowed" : "pointer",
                    }}
                  >
                    {submitting ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
                        <Clock size={15} />
                      </motion.div>
                    ) : <Send size={15} />}
                    {submitting ? "Submitting…" : "Submit Appeal"}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* HISTORY */}
        {tab === "history" && (
          <motion.div key="history"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}
            className="space-y-3">
            {EXISTING_APPEALS.map((a, i) => {
              const cfg = STATUS_CONFIG[a.status as keyof typeof STATUS_CONFIG];
              const Icon = cfg.icon;
              return (
                <motion.div key={a.ref}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border p-5"
                  style={{ background: "rgba(4,11,26,0.65)", borderColor: "rgba(0,112,255,0.15)" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-sm font-bold text-foreground mb-1">{a.type}</div>
                      <div className="text-xs text-muted-foreground mb-2">
                        Course: <span className="font-mono text-foreground">{a.course}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                        <span>Ref: {a.ref}</span>
                        <span>·</span>
                        <span>Submitted: {a.submitted}</span>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl"
                      style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}>
                      <Icon size={12} style={{ color: cfg.color }} />
                      <span className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                    </div>
                  </div>
                  {a.outcome && (
                    <div className="mt-3 pt-3 border-t text-sm text-muted-foreground"
                      style={{ borderColor: "rgba(0,112,255,0.1)" }}>
                      {a.outcome}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
