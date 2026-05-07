import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CreditCard, CheckCircle, AlertTriangle, Clock, Download } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";

const PAYMENT_HISTORY = [
  { ref: "UOU-PAY-2026-0112", desc: "Semester 1 Tuition",          amount: 85000, date: "Jan 10, 2026", status: "paid"    },
  { ref: "UOU-PAY-2026-0113", desc: "Student Union Levy",           amount:  5000, date: "Jan 10, 2026", status: "paid"    },
  { ref: "UOU-PAY-2026-0114", desc: "Library Access Fee",           amount:  3500, date: "Jan 10, 2026", status: "paid"    },
  { ref: "UOU-PAY-2026-0215", desc: "Digital Resources Levy",       amount:  2000, date: "Feb 01, 2026", status: "paid"    },
  { ref: "UOU-PAY-2026-0488", desc: "Semester 2 Tuition",          amount: 85000, date: "Due May 15",   status: "pending" },
  { ref: "UOU-PAY-2026-0489", desc: "Exam Registration Fee",       amount:  7500, date: "Due May 20",   status: "pending" },
];

const BURSARY_ITEMS = [
  { label: "Academic Scholarship (Merit)",   amount: 25000, type: "credit" },
  { label: "Departmental Prize — Week 12",   amount:  5000, type: "credit" },
];

export default function FeeStatus() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [payingId, setPayingId] = useState<string | null>(null);
  const [paid, setPaid] = useState<Set<string>>(new Set());

  const totalDue = PAYMENT_HISTORY
    .filter(p => p.status === "pending" && !paid.has(p.ref))
    .reduce((s, p) => s + p.amount, 0);
  const totalCredits = BURSARY_ITEMS
    .filter(b => b.type === "credit")
    .reduce((s, b) => s + b.amount, 0);
  const netBalance = totalDue - totalCredits;

  const handlePay = async (ref: string) => {
    setPayingId(ref);
    await new Promise(r => setTimeout(r, 1800));
    setPaid(prev => new Set(prev).add(ref));
    setPayingId(null);
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
            <CreditCard size={18} style={{ color: "#0070FF" }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Fee Status</h1>
            <p className="text-muted-foreground text-sm">{user?.name} · Semester 2 · 2025/2026</p>
          </div>
        </div>
      </motion.div>

      {/* Balance summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Outstanding Balance", value: `₦${netBalance.toLocaleString()}`, color: netBalance > 0 ? "#F87171" : "#34D399", icon: netBalance > 0 ? AlertTriangle : CheckCircle },
          { label: "Total Credits Applied", value: `₦${totalCredits.toLocaleString()}`, color: "#34D399", icon: CheckCircle },
          { label: "Payment Deadline", value: "May 15, 2026", color: "#F59E0B", icon: Clock },
        ].map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border p-5"
            style={{ background: "rgba(4,11,26,0.7)", borderColor: "rgba(0,112,255,0.15)" }}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={14} style={{ color: s.color }} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Urgent banner if dues pending */}
      {netBalance > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-4 flex items-start gap-3"
          style={{ background: "rgba(248,113,113,0.07)", borderColor: "rgba(248,113,113,0.3)" }}
        >
          <AlertTriangle size={16} className="mt-0.5 shrink-0" style={{ color: "#F87171" }} />
          <div>
            <div className="text-sm font-bold" style={{ color: "#F87171" }}>Payment Required</div>
            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
              ₦{netBalance.toLocaleString()} outstanding. Late payments after May 15, 2026 attract a 5% surcharge and may result in suspension from assessments.
            </p>
          </div>
        </motion.div>
      )}

      {/* Payment history */}
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">Payment Ledger</div>
        <div className="space-y-3">
          {PAYMENT_HISTORY.map((p, i) => {
            const isPaid = p.status === "paid" || paid.has(p.ref);
            const isPaying = payingId === p.ref;
            return (
              <motion.div key={p.ref}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border p-4 flex items-center gap-4"
                style={{
                  background: isPaid ? "rgba(4,11,26,0.5)" : "rgba(248,113,113,0.06)",
                  borderColor: isPaid ? "rgba(0,112,255,0.1)" : "rgba(248,113,113,0.25)",
                  opacity: isPaid ? 0.8 : 1,
                }}>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">{p.desc}</div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{p.ref} · {p.date}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-base" style={{ color: isPaid ? "#34D399" : "#F87171" }}>
                    ₦{p.amount.toLocaleString()}
                  </div>
                </div>
                {!isPaid && (
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => handlePay(p.ref)}
                    disabled={!!payingId}
                    className="shrink-0 px-4 py-2 rounded-lg text-xs font-bold"
                    style={{ background: "linear-gradient(135deg, #0040C0, #0070FF)", color: "white", opacity: payingId ? 0.6 : 1 }}
                  >
                    {isPaying ? "Processing…" : "Pay Now"}
                  </motion.button>
                )}
                {isPaid && (
                  <div className="shrink-0 flex items-center gap-1 text-xs" style={{ color: "#34D399" }}>
                    <CheckCircle size={12} /> Paid
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bursary / Credits */}
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">Bursary & Credits</div>
        <div className="space-y-3">
          {BURSARY_ITEMS.map((b, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-xl border p-4 flex items-center gap-4"
              style={{ background: "rgba(52,211,153,0.06)", borderColor: "rgba(52,211,153,0.22)" }}>
              <CheckCircle size={14} style={{ color: "#34D399" }} />
              <div className="flex-1 text-sm font-medium text-foreground">{b.label}</div>
              <div className="font-black text-base" style={{ color: "#34D399" }}>- ₦{b.amount.toLocaleString()}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border"
        style={{ background: "rgba(0,112,255,0.08)", borderColor: "rgba(0,112,255,0.25)", color: "#0070FF" }}
      >
        <Download size={13} /> Download Fee Statement (PDF)
      </motion.button>
    </div>
  );
}
