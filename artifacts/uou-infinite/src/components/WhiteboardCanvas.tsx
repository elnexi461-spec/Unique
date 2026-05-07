import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WhiteboardCanvasProps {
  courseCode: string;
  segmentIndex: number;
}

const STROKE = "#60A5FA";
const STROKE_DIM = "rgba(96,165,250,0.45)";
const TEXT_COLOR = "#93C5FD";
const TEXT_DIM = "rgba(147,197,253,0.55)";
const BOX_FILL = "rgba(0, 30, 80, 0.7)";

function ease(delay = 0, duration = 0.8) {
  return { delay, duration, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };
}
function pathEase(delay = 0, duration = 1.0) {
  return { delay, duration, ease: "easeOut" as const };
}

/* ══════════════════════════════════════════════════
   BAM-111 · Business Administration & Management
══════════════════════════════════════════════════ */

function Bam0() {
  return (
    <svg viewBox="0 0 320 210" className="w-full h-full">
      <defs>
        <marker id="arr0" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={STROKE} />
        </marker>
      </defs>
      <motion.rect x={8} y={55} width={110} height={55} rx={6} fill={BOX_FILL} stroke={STROKE} strokeWidth="1.4"
        initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "63px 82px" }}
        transition={ease(0, 0.55)} />
      <motion.text x={63} y={79} textAnchor="middle" fontSize="9" fill={TEXT_COLOR} fontWeight="800" letterSpacing="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.4)}>EFFICIENCY</motion.text>
      <motion.text x={63} y={93} textAnchor="middle" fontSize="8" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.55)}>Doing things right</motion.text>
      <motion.rect x={202} y={55} width={110} height={55} rx={6} fill={BOX_FILL} stroke={STROKE} strokeWidth="1.4"
        initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "257px 82px" }}
        transition={ease(0.15, 0.55)} />
      <motion.text x={257} y={79} textAnchor="middle" fontSize="9" fill={TEXT_COLOR} fontWeight="800" letterSpacing="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.55)}>EFFECTIVENESS</motion.text>
      <motion.text x={257} y={93} textAnchor="middle" fontSize="8" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.7)}>Doing the right things</motion.text>
      <motion.text x={160} y={88} textAnchor="middle" fontSize="24" fill={STROKE} fontWeight="900"
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
        style={{ transformOrigin: "160px 88px" }} transition={ease(0.3, 0.4)}>≠</motion.text>
      <motion.line x1={60} y1={145} x2={260} y2={145} stroke={STROKE_DIM} strokeWidth="1"
        strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={pathEase(0.6, 0.7)} />
      <motion.text x={160} y={162} textAnchor="middle" fontSize="8" fill={TEXT_DIM} letterSpacing="2" fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)}>THE STRATEGIC DISTINCTION</motion.text>
      <motion.text x={160} y={30} textAnchor="middle" fontSize="10" fill={TEXT_COLOR} fontWeight="700" letterSpacing="0.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.2)}>Foundations of Administration</motion.text>
      <motion.rect x={30} y={170} width={260} height={26} rx={4} fill="rgba(0,112,255,0.07)" stroke={STROKE_DIM} strokeWidth="0.8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)} />
      <motion.text x={160} y={187} textAnchor="middle" fontSize="8" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.1)}>Optimising irrelevance is failure at scale</motion.text>
    </svg>
  );
}

function Bam1() {
  const boxes = [
    { x: 115, y: 12, w: 90, h: 34, label: "CHIEF EXEC", sub: "Strategic Authority" },
    { x: 20, y: 82, w: 84, h: 32, label: "OPERATIONS", sub: "COO" },
    { x: 118, y: 82, w: 84, h: 32, label: "FINANCE", sub: "CFO" },
    { x: 216, y: 82, w: 84, h: 32, label: "MARKETING", sub: "CMO" },
    { x: 4, y: 152, w: 68, h: 28, label: "ZARIA", sub: "Ops" },
    { x: 80, y: 152, w: 68, h: 28, label: "LAGOS", sub: "Ops" },
    { x: 156, y: 152, w: 68, h: 28, label: "KANO", sub: "Sales" },
    { x: 232, y: 152, w: 68, h: 28, label: "DIGITAL", sub: "Mkts" },
  ];
  const lines: [number, number, number, number][] = [
    [160, 46, 62, 82], [160, 46, 160, 82], [160, 46, 258, 82],
    [62, 114, 38, 152], [62, 114, 114, 152],
    [258, 114, 190, 152], [258, 114, 266, 152],
  ];
  return (
    <svg viewBox="0 0 320 200" className="w-full h-full">
      {lines.map(([x1, y1, x2, y2], i) => (
        <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={STROKE_DIM} strokeWidth="1.2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={pathEase(0.1 + i * 0.07, 0.45)} />
      ))}
      {boxes.map((b, i) => (
        <g key={i}>
          <motion.rect x={b.x} y={b.y} width={b.w} height={b.h} rx={5} fill={BOX_FILL} stroke={STROKE}
            strokeWidth={i === 0 ? 1.6 : 1.1}
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            style={{ transformOrigin: `${b.x + b.w / 2}px ${b.y + b.h / 2}px` }}
            transition={ease(i * 0.08, 0.4)} />
          <motion.text x={b.x + b.w / 2} y={b.y + b.h / 2 - 4} textAnchor="middle"
            fontSize={i < 4 ? 8 : 7} fill={TEXT_COLOR} fontWeight="800" letterSpacing="0.8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.08 + 0.3)}>
            {b.label}
          </motion.text>
          <motion.text x={b.x + b.w / 2} y={b.y + b.h / 2 + 8} textAnchor="middle"
            fontSize={6.5} fill={TEXT_DIM}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.08 + 0.4)}>
            {b.sub}
          </motion.text>
        </g>
      ))}
      <motion.text x={160} y={195} textAnchor="middle" fontSize="7.5" fill={TEXT_DIM} letterSpacing="2" fontWeight="600"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)}>STRUCTURE FOLLOWS STRATEGY</motion.text>
    </svg>
  );
}

function Bam2() {
  const nodes = [
    { cx: 160, cy: 40, label: "RECRUIT", sub: "Talent Acquisition" },
    { cx: 270, cy: 115, label: "TRAIN", sub: "Competency Build" },
    { cx: 220, cy: 188, label: "EVALUATE", sub: "Performance Mgmt" },
    { cx: 100, cy: 188, label: "REWARD", sub: "Retention Engine" },
    { cx: 50, cy: 115, label: "RETAIN", sub: "Culture & Growth" },
  ];
  const arcs = [
    "M 188 52 Q 250 70 255 100",
    "M 265 140 Q 258 175 238 178",
    "M 195 195 Q 160 205 125 195",
    "M 90 178 Q 62 165 55 140",
    "M 50 90 Q 80 45 132 38",
  ];
  return (
    <svg viewBox="0 0 320 225" className="w-full h-full">
      <defs>
        <marker id="arrhr" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={STROKE} />
        </marker>
      </defs>
      <motion.circle cx={160} cy={115} r={60} fill="none" stroke={STROKE_DIM} strokeWidth="0.8"
        strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={pathEase(0, 1.2)} />
      <motion.text x={160} y={109} textAnchor="middle" fontSize="9" fill={TEXT_COLOR} fontWeight="800" letterSpacing="0.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.8)}>PEOPLE ARE</motion.text>
      <motion.text x={160} y={122} textAnchor="middle" fontSize="9" fill={TEXT_COLOR} fontWeight="800"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)}>APPRECIATING</motion.text>
      <motion.text x={160} y={135} textAnchor="middle" fontSize="9" fill={TEXT_COLOR} fontWeight="800"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>ASSETS</motion.text>
      {arcs.map((d, i) => (
        <motion.path key={i} d={d} fill="none" stroke={STROKE} strokeWidth="1.4"
          markerEnd="url(#arrhr)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={pathEase(0.15 + i * 0.12, 0.5)} />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <motion.circle cx={n.cx} cy={n.cy} r={26} fill={BOX_FILL} stroke={STROKE} strokeWidth="1.3"
            initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
            transition={ease(i * 0.1, 0.45)} />
          <motion.text x={n.cx} y={n.cy - 4} textAnchor="middle" fontSize="7" fill={TEXT_COLOR} fontWeight="800" letterSpacing="0.5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.1 + 0.35)}>
            {n.label}
          </motion.text>
          <motion.text x={n.cx} y={n.cy + 8} textAnchor="middle" fontSize="6" fill={TEXT_DIM}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.1 + 0.45)}>
            {n.sub}
          </motion.text>
        </g>
      ))}
    </svg>
  );
}

function Bam3() {
  const profitPts: [number, number][] = [[30, 160], [75, 135], [120, 110], [165, 88], [210, 65], [260, 42]];
  const cashPts: [number, number][] = [[30, 160], [75, 148], [120, 168], [165, 130], [210, 155], [260, 118]];
  const pathOf = (pts: [number, number][]) =>
    pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  return (
    <svg viewBox="0 0 300 205" className="w-full h-full">
      <motion.line x1="28" y1="20" x2="28" y2="175" stroke={STROKE_DIM} strokeWidth="1"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ transformOrigin: "28px 175px" }}
        transition={pathEase(0, 0.5)} />
      <motion.line x1="28" y1="175" x2="275" y2="175" stroke={STROKE_DIM} strokeWidth="1"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformOrigin: "28px 175px" }}
        transition={pathEase(0, 0.5)} />
      <motion.path d={pathOf(profitPts)} fill="none" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={pathEase(0.3, 1.1)} />
      <motion.path d={pathOf(cashPts)} fill="none" stroke={STROKE} strokeWidth="2.2" strokeLinecap="round"
        strokeDasharray="6 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={pathEase(0.5, 1.1)} />
      {profitPts.map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r={3.5} fill="#34D399"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          style={{ transformOrigin: `${x}px ${y}px` }} transition={ease(0.35 + i * 0.12, 0.3)} />
      ))}
      <motion.rect x={160} y={25} width={5} height={16} rx={1} fill="#34D399"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)} />
      <motion.text x={172} y={37} fontSize="8" fill="#34D399" fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>ACCOUNTING PROFIT</motion.text>
      <motion.rect x={160} y={46} width={5} height={2} rx={1} fill={STROKE} />
      <motion.rect x={168} y={46} width={5} height={2} rx={1} fill={STROKE} />
      <motion.rect x={176} y={46} width={5} height={2} rx={1} fill={STROKE} />
      <motion.text x={185} y={52} fontSize="8" fill={STROKE} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.1)}>ACTUAL CASH FLOW</motion.text>
      <motion.text x={155} y={183} textAnchor="middle" fontSize="7.5" fill={TEXT_DIM} letterSpacing="1.5" fontWeight="600"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.2)}>TIME →</motion.text>
      <motion.text x={155} y={15} textAnchor="middle" fontSize="9" fill={TEXT_COLOR} fontWeight="800"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.1)}>CASH ≠ PROFIT</motion.text>
    </svg>
  );
}

function Bam4() {
  const quads = [
    { x: 12, y: 30, label: "FINANCIAL", sub: "Revenue · Margins · ROI", color: "#34D399" },
    { x: 168, y: 30, label: "CUSTOMER", sub: "Satisfaction · Loyalty · NPS", color: "#60A5FA" },
    { x: 12, y: 122, label: "INTERNAL PROCESS", sub: "Quality · Cycle Time · Cost", color: "#A78BFA" },
    { x: 168, y: 122, label: "LEARNING & GROWTH", sub: "Skills · Culture · Innovation", color: "#F59E0B" },
  ];
  return (
    <svg viewBox="0 0 320 215" className="w-full h-full">
      <motion.line x1={160} y1={18} x2={160} y2={200} stroke={STROKE_DIM} strokeWidth="1"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ transformOrigin: "160px 18px" }}
        transition={pathEase(0, 0.5)} />
      <motion.line x1={8} y1={115} x2={312} y2={115} stroke={STROKE_DIM} strokeWidth="1"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformOrigin: "8px 115px" }}
        transition={pathEase(0, 0.5)} />
      {quads.map((q, i) => (
        <g key={i}>
          <motion.rect x={q.x} y={q.y} width={140} height={78} rx={6}
            fill={`rgba(${i === 0 ? "52,211,153" : i === 1 ? "96,165,250" : i === 2 ? "167,139,250" : "245,158,11"},0.06)`}
            stroke={q.color} strokeWidth="1.2"
            initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
            style={{ transformOrigin: `${q.x + 70}px ${q.y + 39}px` }}
            transition={ease(i * 0.13, 0.5)} />
          <motion.text x={q.x + 70} y={q.y + 28} textAnchor="middle" fontSize="8.5"
            fill={q.color} fontWeight="800" letterSpacing="0.8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.13 + 0.35)}>
            {q.label}
          </motion.text>
          <motion.text x={q.x + 70} y={q.y + 42} textAnchor="middle" fontSize="7" fill={TEXT_DIM}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.13 + 0.5)}>
            {q.sub}
          </motion.text>
        </g>
      ))}
      <motion.rect x={128} y={98} width={64} height={36} rx={8}
        fill="rgba(0,30,80,0.95)" stroke={STROKE} strokeWidth="1.5"
        initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "160px 116px" }}
        transition={ease(0.5, 0.45)} />
      <motion.text x={160} y={111} textAnchor="middle" fontSize="7.5" fill={TEXT_COLOR} fontWeight="900" letterSpacing="1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.7)}>BALANCED</motion.text>
      <motion.text x={160} y={124} textAnchor="middle" fontSize="7.5" fill={TEXT_COLOR} fontWeight="900" letterSpacing="1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.8)}>SCORECARD</motion.text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   ENT-101 · Principles of Entrepreneurship
══════════════════════════════════════════════════ */

function Ent0() {
  /* Entrepreneurial Mindset Triangle */
  const verts = [
    { x: 160, y: 18, label: "UNCERTAINTY", sub: "Operating condition", ay: -12, sy: 2 },
    { x: 28, y: 188, label: "RISK", sub: "Calculated bet", ay: 18, sy: 30 },
    { x: 292, y: 188, label: "AMBIGUITY", sub: "No map exists", ay: 18, sy: 30 },
  ];
  const lines: [number, number, number, number][] = [
    [160, 18, 28, 188], [160, 18, 292, 188], [28, 188, 292, 188],
  ];
  return (
    <svg viewBox="0 0 320 215" className="w-full h-full">
      {lines.map(([x1, y1, x2, y2], i) => (
        <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={STROKE_DIM} strokeWidth="1.5" strokeDasharray="6 3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={pathEase(i * 0.18, 0.75)} />
      ))}
      {verts.map((v, i) => (
        <motion.line key={`cv${i}`} x1={160} y1={120} x2={v.x} y2={v.y}
          stroke={STROKE} strokeWidth="0.9" strokeDasharray="3 3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={pathEase(0.5 + i * 0.1, 0.45)} />
      ))}
      <motion.circle cx={160} cy={120} r={36} fill={BOX_FILL} stroke={STROKE} strokeWidth="1.6"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        style={{ transformOrigin: "160px 120px" }} transition={ease(0.3, 0.55)} />
      <motion.text x={160} y={115} textAnchor="middle" fontSize="8" fill={TEXT_COLOR} fontWeight="900" letterSpacing="0.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.65)}>ENTREPRENEUR</motion.text>
      <motion.text x={160} y={128} textAnchor="middle" fontSize="8" fill={TEXT_COLOR} fontWeight="900"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.75)}>MINDSET</motion.text>
      {verts.map((v, i) => (
        <g key={`lv${i}`}>
          <motion.text x={v.x} y={v.y + v.ay} textAnchor="middle" fontSize="8.5"
            fill={TEXT_COLOR} fontWeight="800" letterSpacing="0.8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.2 + i * 0.12)}>
            {v.label}
          </motion.text>
          <motion.text x={v.x} y={v.y + v.sy} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.35 + i * 0.12)}>
            {v.sub}
          </motion.text>
        </g>
      ))}
    </svg>
  );
}

function Ent1() {
  /* Market Validation 2×2 Matrix */
  const quadrants = [
    { x: 10, y: 10, label: "SYMPATHY\nMARKET", sub: "They care, won't pay", color: STROKE_DIM },
    { x: 162, y: 10, label: "PMF\nZONE", sub: "High pain + willing to pay", color: "#34D399" },
    { x: 10, y: 110, label: "DEAD\nZONE", sub: "No pain, no payment", color: "rgba(96,165,250,0.3)" },
    { x: 162, y: 110, label: "NICHE\nOPPORTUNITY", sub: "Low pain, specific value", color: STROKE },
  ];
  return (
    <svg viewBox="0 0 320 210" className="w-full h-full">
      <motion.line x1={155} y1={8} x2={155} y2={196} stroke={STROKE_DIM} strokeWidth="1"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ transformOrigin: "155px 8px" }}
        transition={pathEase(0, 0.5)} />
      <motion.line x1={8} y1={103} x2={312} y2={103} stroke={STROKE_DIM} strokeWidth="1"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformOrigin: "8px 103px" }}
        transition={pathEase(0, 0.5)} />
      {quadrants.map((q, i) => (
        <g key={i}>
          <motion.rect x={q.x} y={q.y} width={140} height={88} rx={5}
            fill={i === 1 ? "rgba(52,211,153,0.08)" : "rgba(0,20,60,0.4)"}
            stroke={q.color} strokeWidth={i === 1 ? 1.6 : 0.9}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.12, 0.5)} />
          <motion.text x={q.x + 70} y={q.y + 32} textAnchor="middle" fontSize="8.5"
            fill={q.color} fontWeight="800" letterSpacing="0.6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.12 + 0.3)}>
            {q.label.split("\n")[0]}
          </motion.text>
          <motion.text x={q.x + 70} y={q.y + 44} textAnchor="middle" fontSize="8.5"
            fill={q.color} fontWeight="800"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.12 + 0.35)}>
            {q.label.split("\n")[1]}
          </motion.text>
          <motion.text x={q.x + 70} y={q.y + 62} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.12 + 0.45)}>
            {q.sub}
          </motion.text>
        </g>
      ))}
      <motion.text x={155} y={205} textAnchor="middle" fontSize="7.5" fill={TEXT_DIM} letterSpacing="2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.7)}>WILLINGNESS TO PAY →</motion.text>
      <motion.text x={6} y={103} textAnchor="middle" fontSize="7.5" fill={TEXT_DIM} letterSpacing="1"
        transform="rotate(-90 6 103)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.7)}>PAIN INTENSITY</motion.text>
    </svg>
  );
}

function Ent2() {
  /* Business Model Canvas (compact 9-block) */
  const blocks = [
    { x: 8,   y: 8,  w: 60, h: 90,  label: "KEY\nPARTNERS",    delay: 0.0 },
    { x: 72,  y: 8,  w: 60, h: 42,  label: "KEY\nACTIVITIES",  delay: 0.08 },
    { x: 72,  y: 54, w: 60, h: 44,  label: "KEY\nRESOURCES",   delay: 0.12 },
    { x: 136, y: 8,  w: 62, h: 90,  label: "VALUE\nPROP",      delay: 0.16 },
    { x: 202, y: 8,  w: 55, h: 42,  label: "CUSTOMER\nRELS",   delay: 0.22 },
    { x: 202, y: 54, w: 55, h: 44,  label: "CHANNELS",          delay: 0.26 },
    { x: 261, y: 8,  w: 56, h: 90,  label: "CUSTOMER\nSEGS",   delay: 0.30 },
    { x: 8,   y: 102, w: 153, h: 36, label: "COST STRUCTURE",  delay: 0.38 },
    { x: 165, y: 102, w: 152, h: 36, label: "REVENUE STREAMS", delay: 0.44 },
  ];
  return (
    <svg viewBox="0 0 320 145" className="w-full h-full">
      {blocks.map((b, i) => (
        <g key={i}>
          <motion.rect x={b.x} y={b.y} width={b.w} height={b.h} rx={4}
            fill={BOX_FILL} stroke={STROKE} strokeWidth="1"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ transformOrigin: `${b.x + b.w / 2}px ${b.y + b.h / 2}px` }}
            transition={ease(b.delay, 0.4)} />
          {b.label.split("\n").map((line, li) => (
            <motion.text key={li} x={b.x + b.w / 2}
              y={b.y + b.h / 2 + (b.label.includes("\n") ? li * 10 - 4 : 3)}
              textAnchor="middle" fontSize={b.h > 80 ? 7.5 : 7}
              fill={TEXT_COLOR} fontWeight="700" letterSpacing="0.4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(b.delay + 0.3)}>
              {line}
            </motion.text>
          ))}
        </g>
      ))}
      <motion.text x={160} y={142} textAnchor="middle" fontSize="7" fill={TEXT_DIM} letterSpacing="2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.6)}>BUSINESS MODEL CANVAS — OSTERWALDER</motion.text>
    </svg>
  );
}

function Ent3() {
  /* Equity Dilution Timeline */
  const rounds = [
    { label: "FOUNDER", equity: 100, color: "#60A5FA", x: 28 },
    { label: "SEED", equity: 80, color: "#A78BFA", x: 98 },
    { label: "SERIES A", equity: 55, color: "#F59E0B", x: 178 },
    { label: "SERIES B", equity: 38, color: "#34D399", x: 248 },
  ];
  const barH = 120;
  return (
    <svg viewBox="0 0 320 205" className="w-full h-full">
      <motion.line x1={18} y1={25} x2={18} y2={165} stroke={STROKE_DIM} strokeWidth="1"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ transformOrigin: "18px 165px" }}
        transition={pathEase(0, 0.4)} />
      <motion.line x1={18} y1={165} x2={305} y2={165} stroke={STROKE_DIM} strokeWidth="1"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformOrigin: "18px 165px" }}
        transition={pathEase(0, 0.4)} />
      {rounds.map((r, i) => {
        const h = (r.equity / 100) * barH;
        return (
          <g key={i}>
            <motion.rect x={r.x} y={165 - h} width={42} height={h} rx={4}
              fill={`${r.color}22`} stroke={r.color} strokeWidth="1.3"
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
              style={{ transformOrigin: `${r.x + 21}px 165px` }}
              transition={pathEase(0.2 + i * 0.12, 0.55)} />
            <motion.text x={r.x + 21} y={165 - h - 6} textAnchor="middle" fontSize="8.5"
              fill={r.color} fontWeight="800"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.4 + i * 0.12)}>
              {r.equity}%
            </motion.text>
            <motion.text x={r.x + 21} y={178} textAnchor="middle" fontSize="6.5"
              fill={TEXT_DIM} fontWeight="600"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.5 + i * 0.12)}>
              {r.label}
            </motion.text>
          </g>
        );
      })}
      {rounds.slice(0, -1).map((r, i) => (
        <motion.line key={i} x1={r.x + 43} y1={165 - (r.equity / 100) * barH}
          x2={rounds[i + 1]!.x} y2={165 - (rounds[i + 1]!.equity / 100) * barH}
          stroke={STROKE_DIM} strokeWidth="1" strokeDasharray="4 3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={pathEase(0.5 + i * 0.12, 0.35)} />
      ))}
      <motion.text x={160} y={196} textAnchor="middle" fontSize="7.5" fill={TEXT_DIM} letterSpacing="2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)}>FOUNDER EQUITY DILUTION OVER FUNDING ROUNDS</motion.text>
      <motion.text x={160} y={18} textAnchor="middle" fontSize="9" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.0)}>Capital Is a Multiplier</motion.text>
    </svg>
  );
}

function Ent4() {
  /* Scaling Staircase */
  const steps = [
    { label: "INSTITUTION", sub: "Culture & memory", color: "#F59E0B", y: 20 },
    { label: "SYSTEMS", sub: "Encoded decisions", color: "#A78BFA", y: 68 },
    { label: "TEAM", sub: "Delegated tasks", color: "#60A5FA", y: 116 },
    { label: "FOUNDER", sub: "Personal execution", color: "#34D399", y: 164 },
  ];
  return (
    <svg viewBox="0 0 320 210" className="w-full h-full">
      {steps.map((s, i) => {
        const w = 80 + i * 52;
        const x = 160 - w / 2;
        return (
          <g key={i}>
            <motion.rect x={x} y={s.y} width={w} height={40} rx={5}
              fill={`${s.color}14`} stroke={s.color} strokeWidth="1.3"
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              style={{ transformOrigin: "160px 40px" }}
              transition={ease((3 - i) * 0.1, 0.5)} />
            <motion.text x={160} y={s.y + 17} textAnchor="middle" fontSize="8.5"
              fill={s.color} fontWeight="800" letterSpacing="0.8"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease((3 - i) * 0.1 + 0.3)}>
              {s.label}
            </motion.text>
            <motion.text x={160} y={s.y + 29} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease((3 - i) * 0.1 + 0.4)}>
              {s.sub}
            </motion.text>
          </g>
        );
      })}
      <motion.text x={160} y={205} textAnchor="middle" fontSize="7.5" fill={TEXT_DIM} letterSpacing="2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.7)}>SCALING MATURITY MODEL</motion.text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   AI-201 · AI Safety & Ethics
══════════════════════════════════════════════════ */

function Ai0() {
  /* Alignment Problem: intended goal vs proxy metric */
  return (
    <svg viewBox="0 0 320 215" className="w-full h-full">
      <defs>
        <marker id="arrai0a" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="#34D399" />
        </marker>
        <marker id="arrai0b" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="#F87171" />
        </marker>
      </defs>
      {[55, 38, 22].map((r, i) => (
        <motion.circle key={i} cx={160} cy={108} r={r}
          fill="none" stroke={STROKE_DIM} strokeWidth="1"
          strokeDasharray={i === 0 ? "none" : "4 3"}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          style={{ transformOrigin: "160px 108px" }}
          transition={ease(i * 0.12, 0.5)} />
      ))}
      <motion.circle cx={160} cy={108} r={10} fill={BOX_FILL} stroke="#34D399" strokeWidth="1.8"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        style={{ transformOrigin: "160px 108px" }} transition={ease(0.4, 0.4)} />
      <motion.text x={160} y={112} textAnchor="middle" fontSize="7" fill="#34D399" fontWeight="800"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.6)}>GOAL</motion.text>
      <motion.path d="M 100 60 L 152 100" stroke="#34D399" strokeWidth="2"
        markerEnd="url(#arrai0a)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={pathEase(0.6, 0.5)} />
      <motion.text x={85} y={52} textAnchor="middle" fontSize="8" fill="#34D399" fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.8)}>Aligned AI</motion.text>
      <motion.path d="M 220 60 L 200 145" stroke="#F87171" strokeWidth="2"
        markerEnd="url(#arrai0b)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={pathEase(0.7, 0.55)} />
      <motion.circle cx={200} cy={150} r={8} fill="rgba(248,113,113,0.15)"
        stroke="#F87171" strokeWidth="1.5"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        style={{ transformOrigin: "200px 150px" }} transition={ease(0.9, 0.35)} />
      <motion.text x={220} y={55} textAnchor="middle" fontSize="8" fill="#F87171" fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.75)}>Misaligned AI</motion.text>
      <motion.text x={210} y={163} textAnchor="middle" fontSize="7" fill="#F87171"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>Proxy Metric</motion.text>
      <motion.text x={160} y={20} textAnchor="middle" fontSize="10" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.0)}>The Alignment Problem</motion.text>
      <motion.rect x={22} y={175} width={276} height={24} rx={4}
        fill="rgba(248,113,113,0.06)" stroke="rgba(248,113,113,0.25)" strokeWidth="0.8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.1)} />
      <motion.text x={160} y={191} textAnchor="middle" fontSize="7.5" fill="rgba(248,113,113,0.8)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.2)}>Goodhart's Law: when measure becomes target, it ceases to be good measure</motion.text>
    </svg>
  );
}

function Ai1() {
  /* RLHF Feedback Loop */
  const nodes = [
    { cx: 160, cy: 30, label: "HUMAN", sub: "Feedback" },
    { cx: 280, cy: 112, label: "REWARD", sub: "Model" },
    { cx: 220, cy: 192, label: "POLICY", sub: "AI System" },
    { cx: 100, cy: 192, label: "OUTPUT", sub: "Generated" },
    { cx: 40, cy: 112, label: "EVALUATE", sub: "Preference" },
  ];
  const arcs = [
    "M 185 38 Q 255 55 270 92",
    "M 278 135 Q 268 178 248 185",
    "M 195 198 Q 160 208 125 198",
    "M 82 185 Q 52 168 45 135",
    "M 42 90 Q 70 38 135 30",
  ];
  return (
    <svg viewBox="0 0 320 225" className="w-full h-full">
      <defs>
        <marker id="arrrlhf" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={STROKE} />
        </marker>
      </defs>
      {arcs.map((d, i) => (
        <motion.path key={i} d={d} fill="none" stroke={STROKE} strokeWidth="1.4"
          markerEnd="url(#arrrlhf)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={pathEase(0.15 + i * 0.12, 0.5)} />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <motion.circle cx={n.cx} cy={n.cy} r={24} fill={BOX_FILL} stroke={STROKE} strokeWidth="1.3"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
            transition={ease(i * 0.1, 0.4)} />
          <motion.text x={n.cx} y={n.cy - 3} textAnchor="middle" fontSize="7" fill={TEXT_COLOR} fontWeight="800" letterSpacing="0.5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.1 + 0.3)}>
            {n.label}
          </motion.text>
          <motion.text x={n.cx} y={n.cy + 9} textAnchor="middle" fontSize="6" fill={TEXT_DIM}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.1 + 0.4)}>
            {n.sub}
          </motion.text>
        </g>
      ))}
      <motion.text x={160} y={122} textAnchor="middle" fontSize="8" fill={STROKE_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.8)}>RLHF</motion.text>
      <motion.text x={160} y={134} textAnchor="middle" fontSize="8" fill={STROKE_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)}>LOOP</motion.text>
    </svg>
  );
}

function Ai2() {
  /* Governance Frameworks: 3-column comparison */
  const cols = [
    { x: 14, label: "EU AI ACT", color: "#60A5FA", rows: ["Risk-tiered", "High-risk regs", "Banned uses"] },
    { x: 118, label: "NIST RMF", color: "#A78BFA", rows: ["Map·Measure", "Manage·Govern", "Framework"] },
    { x: 222, label: "AFRICA AI", color: "#F59E0B", rows: ["Sovereignty", "Data governance", "Local context"] },
  ];
  return (
    <svg viewBox="0 0 320 210" className="w-full h-full">
      <motion.text x={160} y={18} textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0)}>Global AI Governance Frameworks</motion.text>
      {cols.map((c, ci) => (
        <g key={ci}>
          <motion.rect x={c.x} y={25} width={90} height={32} rx={5}
            fill={`${c.color}18`} stroke={c.color} strokeWidth="1.4"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            transition={ease(ci * 0.1, 0.45)} />
          <motion.text x={c.x + 45} y={45} textAnchor="middle" fontSize="8.5"
            fill={c.color} fontWeight="800" letterSpacing="0.6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(ci * 0.1 + 0.3)}>
            {c.label}
          </motion.text>
          {c.rows.map((row, ri) => (
            <g key={ri}>
              <motion.rect x={c.x} y={64 + ri * 42} width={90} height={34} rx={4}
                fill="rgba(0,20,60,0.5)" stroke={`${c.color}50`} strokeWidth="0.8"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={ease(0.3 + ci * 0.1 + ri * 0.08, 0.4)} />
              <motion.text x={c.x + 45} y={85 + ri * 42} textAnchor="middle" fontSize="7"
                fill={TEXT_DIM}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={ease(0.45 + ci * 0.1 + ri * 0.08)}>
                {row}
              </motion.text>
            </g>
          ))}
        </g>
      ))}
      <motion.line x1={110} y1={25} x2={110} y2={197} stroke={STROKE_DIM} strokeWidth="0.6"
        strokeDasharray="3 3" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        style={{ transformOrigin: "110px 25px" }} transition={pathEase(0.4, 0.6)} />
      <motion.line x1={214} y1={25} x2={214} y2={197} stroke={STROKE_DIM} strokeWidth="0.6"
        strokeDasharray="3 3" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        style={{ transformOrigin: "214px 25px" }} transition={pathEase(0.4, 0.6)} />
    </svg>
  );
}

function Ai3() {
  /* Fairness Incompatibility: Demographic Parity vs Equalised Odds */
  return (
    <svg viewBox="0 0 320 215" className="w-full h-full">
      <motion.text x={160} y={18} textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0)}>Competing Fairness Definitions</motion.text>
      <motion.circle cx={100} cy={115} r={62} fill="rgba(96,165,250,0.07)" stroke={STROKE} strokeWidth="1.5"
        initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "100px 115px" }}
        transition={ease(0.1, 0.6)} />
      <motion.circle cx={220} cy={115} r={62} fill="rgba(167,139,250,0.07)" stroke="#A78BFA" strokeWidth="1.5"
        initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "220px 115px" }}
        transition={ease(0.2, 0.6)} />
      <motion.text x={82} y={108} textAnchor="middle" fontSize="8.5" fill={STROKE} fontWeight="800"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.6)}>DEMOGRAPHIC</motion.text>
      <motion.text x={82} y={120} textAnchor="middle" fontSize="8.5" fill={STROKE} fontWeight="800"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.65)}>PARITY</motion.text>
      <motion.text x={82} y={134} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.7)}>Equal selection rates</motion.text>
      <motion.text x={238} y={108} textAnchor="middle" fontSize="8.5" fill="#A78BFA" fontWeight="800"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.65)}>EQUALISED</motion.text>
      <motion.text x={238} y={120} textAnchor="middle" fontSize="8.5" fill="#A78BFA" fontWeight="800"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.7)}>ODDS</motion.text>
      <motion.text x={238} y={134} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.75)}>Equal error rates</motion.text>
      <motion.text x={160} y={107} textAnchor="middle" fontSize="14" fill="#F87171" fontWeight="900"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        style={{ transformOrigin: "160px 107px" }} transition={ease(0.8, 0.4)}>✕</motion.text>
      <motion.text x={160} y={120} textAnchor="middle" fontSize="6.5" fill="rgba(248,113,113,0.8)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>Incompatible</motion.text>
      <motion.rect x={22} y={178} width={276} height={22} rx={4}
        fill="rgba(248,113,113,0.06)" stroke="rgba(248,113,113,0.2)" strokeWidth="0.8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.1)} />
      <motion.text x={160} y={193} textAnchor="middle" fontSize="7" fill="rgba(248,113,113,0.7)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.2)}>Cannot both be satisfied when base rates differ across groups</motion.text>
    </svg>
  );
}

function Ai4() {
  /* AI Capability Timeline */
  const zones = [
    { x: 10,  w: 70,  label: "TODAY", sub: "Narrow AI", color: "#34D399" },
    { x: 85,  w: 90,  label: "NEAR-TERM", sub: "Agentic AI", color: "#60A5FA" },
    { x: 180, w: 70,  label: "AGI", sub: "Boundary", color: "#F59E0B" },
    { x: 255, w: 55,  label: "BEYOND", sub: "Unknown", color: "#F87171" },
  ];
  return (
    <svg viewBox="0 0 320 205" className="w-full h-full">
      <motion.text x={160} y={18} textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0)}>Long-term Risk Trajectories</motion.text>
      {zones.map((z, i) => (
        <g key={i}>
          <motion.rect x={z.x} y={55} width={z.w} height={80} rx={4}
            fill={`${z.color}10`} stroke={z.color}
            strokeWidth={i === 2 ? 1.6 : 1}
            strokeDasharray={i === 3 ? "5 3" : "none"}
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
            style={{ transformOrigin: `${z.x + z.w / 2}px 135px` }}
            transition={pathEase(i * 0.12, 0.5)} />
          <motion.text x={z.x + z.w / 2} y={92} textAnchor="middle" fontSize={z.w < 70 ? 7 : 8}
            fill={z.color} fontWeight="800" letterSpacing="0.5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.12 + 0.3)}>
            {z.label}
          </motion.text>
          <motion.text x={z.x + z.w / 2} y={106} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.12 + 0.45)}>
            {z.sub}
          </motion.text>
        </g>
      ))}
      <motion.rect x={10} y={55} width={165} height={80} rx={4}
        fill="none" stroke="#34D399" strokeWidth="1.5" strokeDasharray="none"
        style={{ filter: "drop-shadow(0 0 4px rgba(52,211,153,0.3))" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.7)} />
      <motion.text x={92} y={150} textAnchor="middle" fontSize="7" fill="#34D399"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.8)}>← Decision Window (Now)</motion.text>
      <motion.text x={160} y={175} textAnchor="middle" fontSize="7.5" fill={TEXT_DIM} letterSpacing="1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)}>Decisions today constrain solutions for the next century</motion.text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   DIG-301 · Digital Innovation Lab
══════════════════════════════════════════════════ */

function Dig0() {
  /* Systems Thinking: Reinforcing + Balancing Loops */
  return (
    <svg viewBox="0 0 320 210" className="w-full h-full">
      <defs>
        <marker id="arrdig0" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={STROKE} />
        </marker>
      </defs>
      <motion.text x={160} y={18} textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0)}>Systems Thinking: Feedback Loops</motion.text>
      {/* Reinforcing loop (left) */}
      <motion.ellipse cx={82} cy={115} rx={62} ry={48} fill="none"
        stroke="#34D399" strokeWidth="1.3" strokeDasharray="6 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={pathEase(0.1, 1.2)} />
      <motion.text x={82} y={108} textAnchor="middle" fontSize="9" fill="#34D399" fontWeight="900"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.8)}>R</motion.text>
      <motion.text x={82} y={122} textAnchor="middle" fontSize="7" fill="#34D399"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)}>Reinforcing</motion.text>
      <motion.text x={28} y={88} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>+</motion.text>
      <motion.text x={136} y={88} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>+</motion.text>
      <motion.text x={82} y={75} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>Growth ↑</motion.text>
      <motion.text x={82} y={162} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>Demand ↑</motion.text>
      {/* Balancing loop (right) */}
      <motion.ellipse cx={238} cy={115} rx={62} ry={48} fill="none"
        stroke="#F59E0B" strokeWidth="1.3" strokeDasharray="6 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={pathEase(0.3, 1.2)} />
      <motion.text x={238} y={108} textAnchor="middle" fontSize="9" fill="#F59E0B" fontWeight="900"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)}>B</motion.text>
      <motion.text x={238} y={122} textAnchor="middle" fontSize="7" fill="#F59E0B"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>Balancing</motion.text>
      <motion.text x={238} y={75} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>Capacity ↑</motion.text>
      <motion.text x={238} y={162} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>Backlog ↓</motion.text>
      <motion.text x={184} y={88} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>+</motion.text>
      <motion.text x={292} y={88} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>-</motion.text>
      <motion.text x={160} y={198} textAnchor="middle" fontSize="7" fill={TEXT_DIM} letterSpacing="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.1)}>IDENTIFY LEVERAGE POINTS — INTERVENE AT ROOT CAUSE</motion.text>
    </svg>
  );
}

function Dig1() {
  /* Double Diamond: Human-Centred Design */
  const diamonds = [
    { cx: 85, label1: "DISCOVER", label2: "DEFINE", color: "#60A5FA", sub: "Problem Space" },
    { cx: 235, label1: "DEVELOP", label2: "DELIVER", color: "#34D399", sub: "Solution Space" },
  ];
  return (
    <svg viewBox="0 0 320 210" className="w-full h-full">
      <motion.text x={160} y={18} textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0)}>Human-Centred Design — Double Diamond</motion.text>
      {diamonds.map((d, di) => {
        const pts = `${d.cx},38 ${d.cx + 65},108 ${d.cx},178 ${d.cx - 65},108`;
        return (
          <g key={di}>
            <motion.polygon points={pts}
              fill={`${d.color}08`} stroke={d.color} strokeWidth="1.4"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              style={{ transformOrigin: `${d.cx}px 108px` }}
              transition={ease(di * 0.15, 0.6)} />
            <motion.text x={d.cx} y={98} textAnchor="middle" fontSize="8.5"
              fill={d.color} fontWeight="800"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(di * 0.15 + 0.4)}>
              {d.label1}
            </motion.text>
            <motion.text x={d.cx} y={112} textAnchor="middle" fontSize="8.5"
              fill={d.color} fontWeight="800"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(di * 0.15 + 0.5)}>
              {d.label2}
            </motion.text>
            <motion.text x={d.cx} y={195} textAnchor="middle" fontSize="7" fill={TEXT_DIM}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(di * 0.15 + 0.55)}>
              {d.sub}
            </motion.text>
          </g>
        );
      })}
      <motion.line x1={150} y1={108} x2={170} y2={108} stroke={STROKE_DIM} strokeWidth="1.5"
        strokeDasharray="4 2"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        style={{ transformOrigin: "150px 108px" }}
        transition={pathEase(0.5, 0.3)} />
    </svg>
  );
}

function Dig2() {
  /* Prototype Fidelity Spectrum */
  const stages = [
    { label: "PAPER", sub: "Sketch", cost: "₦0", learn: 60, color: STROKE_DIM },
    { label: "WIRE-\nFRAME", sub: "Digital", cost: "₦2K", learn: 80, color: STROKE },
    { label: "MOCKUP", sub: "Visual", cost: "₦15K", learn: 72, color: "#A78BFA" },
    { label: "FUNCTIONAL", sub: "Working", cost: "₦80K", learn: 55, color: "#F59E0B" },
  ];
  const maxH = 90;
  return (
    <svg viewBox="0 0 320 205" className="w-full h-full">
      <motion.text x={160} y={18} textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0)}>Prototype Fidelity vs Learning/Cost</motion.text>
      {stages.map((s, i) => {
        const bw = 50; const bx = 22 + i * 70; const h = (s.learn / 100) * maxH;
        return (
          <g key={i}>
            <motion.rect x={bx} y={135 - h} width={bw} height={h} rx={4}
              fill={`${s.color}18`} stroke={s.color} strokeWidth="1.2"
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
              style={{ transformOrigin: `${bx + bw / 2}px 135px` }}
              transition={pathEase(0.15 + i * 0.12, 0.55)} />
            <motion.text x={bx + bw / 2} y={130 - h} textAnchor="middle" fontSize="7.5"
              fill={s.color} fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.35 + i * 0.12)}>
              {s.learn}
            </motion.text>
            {s.label.split("\n").map((l, li) => (
              <motion.text key={li} x={bx + bw / 2} y={148 + li * 11} textAnchor="middle"
                fontSize="7" fill={TEXT_COLOR} fontWeight="700"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.4 + i * 0.12)}>
                {l}
              </motion.text>
            ))}
            <motion.text x={bx + bw / 2} y={172} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.5 + i * 0.12)}>
              {s.cost}
            </motion.text>
          </g>
        );
      })}
      <motion.line x1={18} y1={45} x2={18} y2={137} stroke={STROKE_DIM} strokeWidth="1"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ transformOrigin: "18px 137px" }}
        transition={pathEase(0, 0.4)} />
      <motion.line x1={18} y1={137} x2={302} y2={137} stroke={STROKE_DIM} strokeWidth="1"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformOrigin: "18px 137px" }}
        transition={pathEase(0, 0.4)} />
      <motion.text x={12} y={92} textAnchor="middle" fontSize="7" fill={TEXT_DIM} transform="rotate(-90 12 92)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.6)}>Learning/Cost</motion.text>
      <motion.text x={160} y={195} textAnchor="middle" fontSize="7" fill={TEXT_DIM} letterSpacing="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)}>PURPOSE OF PROTOTYPE: GENERATE LEARNING, NOT SHOW SOLUTION</motion.text>
    </svg>
  );
}

function Dig3() {
  /* TRL Ladder */
  const rungs = [
    { trl: 9, label: "Proven in Production", color: "#34D399" },
    { trl: 8, label: "System Complete", color: "#34D399" },
    { trl: 7, label: "System Demo", color: "#34D399" },
    { trl: 6, label: "Technology Demo", color: "#F59E0B" },
    { trl: 5, label: "Validated in Environment", color: "#F59E0B" },
    { trl: 4, label: "Validated in Lab", color: "#60A5FA" },
    { trl: 3, label: "Proof of Concept", color: "#60A5FA" },
    { trl: 2, label: "Concept Formulated", color: "#A78BFA" },
    { trl: 1, label: "Basic Principles", color: "#A78BFA" },
  ];
  return (
    <svg viewBox="0 0 320 210" className="w-full h-full">
      <motion.text x={160} y={14} textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0)}>Technology Readiness Levels (TRL)</motion.text>
      {rungs.map((r, i) => {
        const y = 22 + i * 20;
        const w = 80 + (8 - i) * 10;
        return (
          <g key={i}>
            <motion.rect x={160 - w / 2} y={y} width={w} height={17} rx={3}
              fill={`${r.color}14`} stroke={r.color} strokeWidth="1"
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              style={{ transformOrigin: "160px 31px" }}
              transition={ease((8 - i) * 0.05, 0.4)} />
            <motion.text x={160 - w / 2 - 6} y={y + 12} textAnchor="end" fontSize="7.5"
              fill={r.color} fontWeight="800"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease((8 - i) * 0.05 + 0.25)}>
              {r.trl}
            </motion.text>
            <motion.text x={163} y={y + 12} fontSize="6.5" fill={TEXT_DIM}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease((8 - i) * 0.05 + 0.3)}>
              {r.label}
            </motion.text>
          </g>
        );
      })}
      <motion.rect x={152} y={82} width={16} height={40} rx={2}
        fill="rgba(248,113,113,0.12)" stroke="#F87171" strokeWidth="1" strokeDasharray="3 2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.7)} />
      <motion.text x={255} y={100} textAnchor="middle" fontSize="7" fill="#F87171"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.85)}>Valley of Death</motion.text>
      <motion.line x1={175} y1={100} x2={250} y2={100} stroke="#F87171" strokeWidth="0.8"
        strokeDasharray="3 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={pathEase(0.85, 0.3)} />
    </svg>
  );
}

function Dig4() {
  /* IP Strategy Decision Tree */
  return (
    <svg viewBox="0 0 320 210" className="w-full h-full">
      <defs>
        <marker id="arrdig4" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={STROKE} />
        </marker>
      </defs>
      <motion.text x={160} y={14} textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0)}>IP Strategy: Where Is Your Moat?</motion.text>
      <motion.rect x={110} y={22} width={100} height={32} rx={5} fill={BOX_FILL} stroke={STROKE} strokeWidth="1.4"
        initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "160px 38px" }}
        transition={ease(0.05, 0.45)} />
      <motion.text x={160} y={36} textAnchor="middle" fontSize="8" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.3)}>Competitive Advantage</motion.text>
      <motion.text x={160} y={47} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.4)}>Where does it live?</motion.text>
      {[
        { x: 18, y: 100, w: 82, label: "TECHNOLOGY", sub: "The invention", res: "PATENT", rSub: "Protect novel method", color: "#60A5FA", lx: 59 },
        { x: 118, y: 100, w: 84, label: "APPLICATION", sub: "How it's used", res: "TRADE\nSECRET", rSub: "Keep formula hidden", color: "#A78BFA", lx: 160 },
        { x: 218, y: 100, w: 84, label: "NETWORK", sub: "Ecosystem built", res: "OPEN\nSOURCE", rSub: "Accelerate adoption", color: "#34D399", lx: 260 },
      ].map((b, i) => (
        <g key={i}>
          <motion.line x1={160} y1={54} x2={b.lx} y2={b.y}
            stroke={STROKE_DIM} strokeWidth="1"
            markerEnd="url(#arrdig4)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={pathEase(0.3 + i * 0.1, 0.4)} />
          <motion.rect x={b.x} y={b.y} width={b.w} height={30} rx={4}
            fill="rgba(0,20,60,0.5)" stroke={b.color} strokeWidth="1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={ease(0.4 + i * 0.1, 0.4)} />
          <motion.text x={b.x + b.w / 2} y={b.y + 13} textAnchor="middle" fontSize="7.5"
            fill={b.color} fontWeight="700"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.55 + i * 0.1)}>
            {b.label}
          </motion.text>
          <motion.text x={b.x + b.w / 2} y={b.y + 24} textAnchor="middle" fontSize="6" fill={TEXT_DIM}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.65 + i * 0.1)}>
            {b.sub}
          </motion.text>
          <motion.line x1={b.lx} y1={b.y + 30} x2={b.lx} y2={b.y + 55}
            stroke={b.color} strokeWidth="1" strokeDasharray="3 2"
            markerEnd="url(#arrdig4)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={pathEase(0.6 + i * 0.1, 0.3)} />
          <motion.rect x={b.x} y={b.y + 58} width={b.w} height={30} rx={4}
            fill={`${b.color}14`} stroke={b.color} strokeWidth="1.2"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{ transformOrigin: `${b.x + b.w / 2}px ${b.y + 73}px` }}
            transition={ease(0.7 + i * 0.1, 0.4)} />
          {b.res.split("\n").map((l, li) => (
            <motion.text key={li} x={b.x + b.w / 2}
              y={b.y + 70 + (b.res.includes("\n") ? li * 10 - 4 : 0)}
              textAnchor="middle" fontSize="8" fill={b.color} fontWeight="800"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.85 + i * 0.1)}>
              {l}
            </motion.text>
          ))}
        </g>
      ))}
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   LAW-201 · Constitutional Law & Governance
══════════════════════════════════════════════════ */

function Law0() {
  /* Separation of Powers: 3-column with checks */
  const pillars = [
    { x: 16, label: "EXECUTIVE", sub: "Implements law", icon: "⚡", color: "#60A5FA" },
    { x: 116, label: "LEGISLATIVE", sub: "Makes law", icon: "📜", color: "#A78BFA" },
    { x: 216, label: "JUDICIAL", sub: "Interprets law", icon: "⚖", color: "#34D399" },
  ];
  return (
    <svg viewBox="0 0 320 210" className="w-full h-full">
      <motion.rect x={60} y={8} width={200} height={30} rx={5}
        fill="rgba(96,165,250,0.1)" stroke={STROKE} strokeWidth="1.4"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        style={{ transformOrigin: "160px 23px" }} transition={ease(0, 0.5)} />
      <motion.text x={160} y={28} textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontWeight="800" letterSpacing="1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.3)}>CONSTITUTION</motion.text>
      {[76, 160, 244].map((x, i) => (
        <motion.line key={i} x1={x} y1={38} x2={pillars[i]!.x + 42} y2={62}
          stroke={STROKE_DIM} strokeWidth="1.2" strokeDasharray="4 3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={pathEase(0.3 + i * 0.1, 0.4)} />
      ))}
      {pillars.map((p, i) => (
        <g key={i}>
          <motion.rect x={p.x} y={62} width={84} height={95} rx={5}
            fill={`${p.color}10`} stroke={p.color} strokeWidth="1.3"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={ease(0.3 + i * 0.12, 0.5)} />
          <motion.text x={p.x + 42} y={88} textAnchor="middle" fontSize="8.5"
            fill={p.color} fontWeight="800" letterSpacing="0.6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.5 + i * 0.12)}>
            {p.label}
          </motion.text>
          <motion.text x={p.x + 42} y={104} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.6 + i * 0.12)}>
            {p.sub}
          </motion.text>
        </g>
      ))}
      {[[58, 110, 116, 110], [202, 110, 216, 110]].map(([x1, y1, x2, y2], i) => (
        <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={STROKE_DIM} strokeWidth="1" strokeDasharray="3 2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={pathEase(0.8, 0.3)} />
      ))}
      <motion.text x={160} y={175} textAnchor="middle" fontSize="7" fill={TEXT_DIM} letterSpacing="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)}>CHECKS AND BALANCES — NO BRANCH IS SUPREME</motion.text>
      <motion.text x={160} y={190} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>Supremacy Clause · Amendment Procedures · Judicial Review</motion.text>
    </svg>
  );
}

function Law1() {
  /* Nigerian Three-Tier Federalism */
  const tiers = [
    { label: "FEDERAL GOVERNMENT", sub: "Exclusive list · Defence · Foreign policy", w: 220, color: "#60A5FA", y: 22 },
    { label: "STATE GOVERNMENTS (36)", sub: "Concurrent list · Education · Health", w: 280, color: "#A78BFA", y: 82 },
    { label: "LOCAL GOVERNMENT (774)", sub: "Residual powers · Local services", w: 310, color: "#34D399", y: 142 },
  ];
  return (
    <svg viewBox="0 0 320 205" className="w-full h-full">
      <motion.text x={160} y={14} textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0)}>Nigerian Federal Architecture (1999 Constitution)</motion.text>
      {tiers.map((t, i) => (
        <g key={i}>
          <motion.rect x={160 - t.w / 2} y={t.y} width={t.w} height={48} rx={5}
            fill={`${t.color}10`} stroke={t.color}
            strokeWidth={2 - i * 0.4}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            style={{ transformOrigin: "160px 46px" }}
            transition={ease(i * 0.15, 0.5)} />
          <motion.text x={160} y={t.y + 20} textAnchor="middle" fontSize="8.5"
            fill={t.color} fontWeight="800" letterSpacing="0.6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.15 + 0.3)}>
            {t.label}
          </motion.text>
          <motion.text x={160} y={t.y + 33} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.15 + 0.45)}>
            {t.sub}
          </motion.text>
          {i < 2 && (
            <motion.line x1={160} y1={t.y + 48} x2={160} y2={t.y + 58}
              stroke={STROKE_DIM} strokeWidth="1.2" strokeDasharray="3 2"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={pathEase(i * 0.15 + 0.5, 0.3)} />
          )}
        </g>
      ))}
      <motion.text x={160} y={198} textAnchor="middle" fontSize="7" fill={TEXT_DIM} letterSpacing="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.8)}>FISCAL ALLOCATION: FEDERAL 52.7% · STATE 26.7% · LOCAL 20.6%</motion.text>
    </svg>
  );
}

function Law2() {
  /* Rights Balance: Textual vs Lived */
  return (
    <svg viewBox="0 0 320 210" className="w-full h-full">
      <motion.text x={160} y={16} textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0)}>Fundamental Rights: The Enforcement Gap</motion.text>
      {/* Balance pole */}
      <motion.line x1={160} y1={35} x2={160} y2={110}
        stroke={STROKE_DIM} strokeWidth="2"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        style={{ transformOrigin: "160px 35px" }} transition={pathEase(0.1, 0.4)} />
      <motion.circle cx={160} cy={35} r={6} fill={BOX_FILL} stroke={STROKE} strokeWidth="1.5"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        style={{ transformOrigin: "160px 35px" }} transition={ease(0.05, 0.3)} />
      {/* Beam (tilted - gap shows textual is "heavier"/grander but not matched by lived) */}
      <motion.line x1={50} y1={105} x2={270} y2={120}
        stroke={STROKE} strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={pathEase(0.3, 0.6)} />
      {/* Left pan: Constitution */}
      <motion.line x1={75} y1={105} x2={75} y2={145}
        stroke={STROKE_DIM} strokeWidth="1.2"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        style={{ transformOrigin: "75px 105px" }} transition={pathEase(0.6, 0.3)} />
      <motion.rect x={35} y={145} width={80} height={28} rx={5}
        fill="rgba(96,165,250,0.12)" stroke={STROKE} strokeWidth="1.3"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        style={{ transformOrigin: "75px 159px" }} transition={ease(0.7, 0.4)} />
      <motion.text x={75} y={157} textAnchor="middle" fontSize="7.5" fill={TEXT_COLOR} fontWeight="800"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.85)}>TEXTUAL</motion.text>
      <motion.text x={75} y={169} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)}>GUARANTEE</motion.text>
      {/* Right pan: Lived (lower/heavier — enforcement gap) */}
      <motion.line x1={245} y1={120} x2={245} y2={170}
        stroke={STROKE_DIM} strokeWidth="1.2"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        style={{ transformOrigin: "245px 120px" }} transition={pathEase(0.6, 0.35)} />
      <motion.rect x={205} y={170} width={80} height={28} rx={5}
        fill="rgba(245,158,11,0.1)" stroke="#F59E0B" strokeWidth="1.3"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        style={{ transformOrigin: "245px 184px" }} transition={ease(0.75, 0.4)} />
      <motion.text x={245} y={182} textAnchor="middle" fontSize="7.5" fill="#F59E0B" fontWeight="800"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)}>LIVED</motion.text>
      <motion.text x={245} y={194} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.95)}>EXPERIENCE</motion.text>
      <motion.text x={160} y={200} textAnchor="middle" fontSize="7.5" fill={STROKE_DIM} letterSpacing="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>STRATEGIC LITIGATION CLOSES THIS GAP</motion.text>
    </svg>
  );
}

function Law3() {
  /* Administrative Law Flow */
  const boxes = [
    { label: "PUBLIC POWER", sub: "Government action", color: STROKE, x: 95, y: 22 },
    { label: "LEGAL AUTHORITY?", sub: "Ultra vires test", color: "#F59E0B", x: 95, y: 86 },
    { label: "PROCEED", sub: "Lawful exercise", color: "#34D399", x: 18, y: 150 },
    { label: "JUDICIAL REVIEW", sub: "Illegality · Irrationality · Procedural", color: "#F87171", x: 170, y: 150 },
  ];
  return (
    <svg viewBox="0 0 320 210" className="w-full h-full">
      <defs>
        <marker id="arrl3" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={STROKE} />
        </marker>
      </defs>
      {boxes.map((b, i) => (
        <g key={i}>
          <motion.rect x={b.x} y={b.y} width={130} height={38} rx={5}
            fill={`${b.color}12`} stroke={b.color} strokeWidth="1.2"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{ transformOrigin: `${b.x + 65}px ${b.y + 19}px` }}
            transition={ease(i * 0.12, 0.45)} />
          <motion.text x={b.x + 65} y={b.y + 17} textAnchor="middle" fontSize="7.5"
            fill={b.color} fontWeight="800"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.12 + 0.3)}>
            {b.label}
          </motion.text>
          <motion.text x={b.x + 65} y={b.y + 29} textAnchor="middle" fontSize="6" fill={TEXT_DIM}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.12 + 0.4)}>
            {b.sub}
          </motion.text>
        </g>
      ))}
      <motion.line x1={160} y1={60} x2={160} y2={86}
        stroke={STROKE_DIM} strokeWidth="1.2" markerEnd="url(#arrl3)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={pathEase(0.4, 0.3)} />
      <motion.line x1={120} y1={124} x2={83} y2={150}
        stroke="#34D399" strokeWidth="1.2" markerEnd="url(#arrl3)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={pathEase(0.55, 0.35)} />
      <motion.text x={84} y={140} textAnchor="middle" fontSize="7" fill="#34D399"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.65)}>YES</motion.text>
      <motion.line x1={200} y1={124} x2={235} y2={150}
        stroke="#F87171" strokeWidth="1.2" markerEnd="url(#arrl3)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={pathEase(0.6, 0.35)} />
      <motion.text x={236} y={140} textAnchor="middle" fontSize="7" fill="#F87171"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.7)}>NO</motion.text>
      <motion.text x={160} y={200} textAnchor="middle" fontSize="7" fill={TEXT_DIM} letterSpacing="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>EVERY EXERCISE OF PUBLIC POWER MUST TRACE TO LEGAL AUTHORITY</motion.text>
    </svg>
  );
}

function Law4() {
  /* Constitutional Reform: Coalition Diagram */
  const inputs = [
    { label: "POLITICAL\nWILL", sub: "Elite commitment", cx: 70, cy: 65, color: "#60A5FA" },
    { label: "SOCIAL\nCONSENSUS", sub: "Popular legitimacy", cx: 250, cy: 65, color: "#A78BFA" },
    { label: "ELITE\nBARGAIN", sub: "Power redistribution", cx: 160, cy: 40, color: "#F59E0B" },
  ];
  return (
    <svg viewBox="0 0 320 210" className="w-full h-full">
      <motion.text x={160} y={14} textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0)}>Constitutional Reform Theory</motion.text>
      {inputs.map((n, i) => (
        <g key={i}>
          <motion.circle cx={n.cx} cy={n.cy} r={30} fill={`${n.color}12`}
            stroke={n.color} strokeWidth="1.3"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
            transition={ease(i * 0.12, 0.5)} />
          {n.label.split("\n").map((l, li) => (
            <motion.text key={li} x={n.cx} y={n.cy + li * 12 - (n.label.includes("\n") ? 4 : 0)}
              textAnchor="middle" fontSize="7.5" fill={n.color} fontWeight="800"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.12 + 0.35)}>
              {l}
            </motion.text>
          ))}
          <motion.text x={n.cx} y={n.cy + 20} textAnchor="middle" fontSize="6" fill={TEXT_DIM}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.12 + 0.5)}>
            {n.sub}
          </motion.text>
          <motion.line x1={n.cx} y1={n.cy + 30} x2={160} y2={132}
            stroke={STROKE_DIM} strokeWidth="1.3" strokeDasharray="5 3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={pathEase(0.5 + i * 0.1, 0.4)} />
        </g>
      ))}
      <motion.rect x={105} y={132} width={110} height={42} rx={6}
        fill="rgba(0,112,255,0.12)" stroke={STROKE} strokeWidth="1.6"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        style={{ transformOrigin: "160px 153px" }} transition={ease(0.6, 0.5)} />
      <motion.text x={160} y={151} textAnchor="middle" fontSize="9" fill={TEXT_COLOR} fontWeight="900"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.8)}>CONSTITUTIONAL</motion.text>
      <motion.text x={160} y={165} textAnchor="middle" fontSize="9" fill={TEXT_COLOR} fontWeight="900"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.85)}>CHANGE</motion.text>
      <motion.text x={160} y={198} textAnchor="middle" fontSize="7" fill={TEXT_DIM} letterSpacing="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>REFORM IS POLITICAL NEGOTIATION — NOT TECHNICAL EXERCISE</motion.text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   HSM-301 · Health Systems Management
══════════════════════════════════════════════════ */

function Hsm0() {
  /* WHO Building Blocks: 2×3 grid */
  const blocks = [
    { label: "SERVICE\nDELIVERY", color: "#60A5FA" },
    { label: "HEALTH\nWORKFORCE", color: "#A78BFA" },
    { label: "HEALTH\nINFORMATION", color: "#34D399" },
    { label: "MEDICAL\nPRODUCTS", color: "#F59E0B" },
    { label: "HEALTH\nFINANCING", color: "#60A5FA" },
    { label: "LEADERSHIP &\nGOVERNANCE", color: "#34D399" },
  ];
  return (
    <svg viewBox="0 0 320 210" className="w-full h-full">
      <motion.text x={160} y={14} textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0)}>WHO Health System Building Blocks</motion.text>
      {blocks.map((b, i) => {
        const col = i % 3; const row = Math.floor(i / 3);
        const x = 12 + col * 100; const y = 22 + row * 72;
        return (
          <g key={i}>
            <motion.rect x={x} y={y} width={92} height={62} rx={6}
              fill={`${b.color}10`} stroke={b.color} strokeWidth="1.2"
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              style={{ transformOrigin: `${x + 46}px ${y + 31}px` }}
              transition={ease(i * 0.09, 0.45)} />
            {b.label.split("\n").map((l, li) => (
              <motion.text key={li} x={x + 46}
                y={y + 30 + (b.label.includes("\n") ? li * 13 - 5 : 0)}
                textAnchor="middle" fontSize="8"
                fill={b.color} fontWeight="800"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.09 + 0.3)}>
                {l}
              </motion.text>
            ))}
          </g>
        );
      })}
      <motion.rect x={52} y={164} width={216} height={26} rx={5}
        fill="rgba(52,211,153,0.1)" stroke="#34D399" strokeWidth="1.3"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        style={{ transformOrigin: "160px 177px" }} transition={ease(0.7, 0.5)} />
      <motion.text x={160} y={181} textAnchor="middle" fontSize="8" fill="#34D399" fontWeight="800" letterSpacing="0.8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)}>→ IMPROVED HEALTH OUTCOMES ←</motion.text>
    </svg>
  );
}

function Hsm1() {
  /* Health Financing Comparison */
  const bars = [
    { label: "TAXATION", sub: "Equitable risk pool", h: 110, color: "#34D399", note: "Most equitable" },
    { label: "SOCIAL\nINSURANCE", sub: "Contributory scheme", h: 80, color: "#60A5FA", note: "Balanced" },
    { label: "OUT-OF-\nPOCKET", sub: "Direct payment", h: 95, color: "#F87171", note: "CATASTROPHIC RISK" },
  ];
  return (
    <svg viewBox="0 0 320 205" className="w-full h-full">
      <motion.text x={160} y={14} textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0)}>Health Financing Mechanisms</motion.text>
      <motion.line x1={22} y1={22} x2={22} y2={158} stroke={STROKE_DIM} strokeWidth="1"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ transformOrigin: "22px 158px" }}
        transition={pathEase(0, 0.4)} />
      <motion.line x1={22} y1={158} x2={305} y2={158} stroke={STROKE_DIM} strokeWidth="1"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformOrigin: "22px 158px" }}
        transition={pathEase(0, 0.4)} />
      {bars.map((b, i) => {
        const x = 40 + i * 90;
        return (
          <g key={i}>
            <motion.rect x={x} y={158 - b.h} width={65} height={b.h} rx={4}
              fill={`${b.color}14`} stroke={b.color} strokeWidth="1.3"
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
              style={{ transformOrigin: `${x + 32}px 158px` }}
              transition={pathEase(0.18 + i * 0.12, 0.55)} />
            <motion.text x={x + 32} y={158 - b.h - 6} textAnchor="middle" fontSize="7"
              fill={b.color} fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.38 + i * 0.12)}>
              {b.note}
            </motion.text>
            {b.label.split("\n").map((l, li) => (
              <motion.text key={li} x={x + 32} y={168 + li * 11} textAnchor="middle"
                fontSize="7.5" fill={TEXT_COLOR} fontWeight="700"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.45 + i * 0.12)}>
                {l}
              </motion.text>
            ))}
            <motion.text x={x + 32} y={193} textAnchor="middle" fontSize="6" fill={TEXT_DIM}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.55 + i * 0.12)}>
              {b.sub}
            </motion.text>
          </g>
        );
      })}
      <motion.text x={14} y={90} textAnchor="middle" fontSize="7" fill={TEXT_DIM} transform="rotate(-90 14 90)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.7)}>Equity &amp; Coverage</motion.text>
    </svg>
  );
}

function Hsm2() {
  /* Workforce Ratio: Nigeria vs WHO */
  return (
    <svg viewBox="0 0 320 210" className="w-full h-full">
      <motion.text x={160} y={14} textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0)}>Human Resources for Health</motion.text>
      {/* Nigeria bar — 1 doctor : 5000 patients = tiny ratio */}
      <motion.rect x={22} y={40} width={26} height={100} rx={4}
        fill="rgba(248,113,113,0.15)" stroke="#F87171" strokeWidth="1.4"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        style={{ transformOrigin: "35px 140px" }} transition={pathEase(0.1, 0.6)} />
      <motion.text x={35} y={38} textAnchor="middle" fontSize="8" fill="#F87171" fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.5)}>1:5,000</motion.text>
      <motion.text x={35} y={155} textAnchor="middle" fontSize="7.5" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.6)}>NIGERIA</motion.text>
      {/* WHO bar — 1:1000 */}
      <motion.rect x={75} y={80} width={26} height={60} rx={4}
        fill="rgba(52,211,153,0.15)" stroke="#34D399" strokeWidth="1.4"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        style={{ transformOrigin: "88px 140px" }} transition={pathEase(0.2, 0.5)} />
      <motion.text x={88} y={78} textAnchor="middle" fontSize="8" fill="#34D399" fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.6)}>1:1,000</motion.text>
      <motion.text x={88} y={155} textAnchor="middle" fontSize="7.5" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.7)}>WHO STD</motion.text>
      {/* Gap annotation */}
      <motion.rect x={118} y={40} width={184} height={100} rx={6}
        fill="rgba(96,165,250,0.05)" stroke={STROKE_DIM} strokeWidth="0.8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.5)} />
      <motion.text x={210} y={72} textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontWeight="800"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.7)}>THE WORKFORCE CRISIS</motion.text>
      <motion.text x={210} y={90} textAnchor="middle" fontSize="7.5" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.8)}>Nigeria needs 5× more doctors</motion.text>
      <motion.text x={210} y={105} textAnchor="middle" fontSize="7.5" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.85)}>to meet WHO minimum standard</motion.text>
      <motion.text x={210} y={122} textAnchor="middle" fontSize="8" fill="#F59E0B" fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)}>Task-shifting is a design decision,</motion.text>
      <motion.text x={210} y={134} textAnchor="middle" fontSize="8" fill="#F59E0B" fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.95)}>not a compromise.</motion.text>
      <motion.text x={160} y={170} textAnchor="middle" fontSize="7.5" fill={TEXT_DIM} letterSpacing="1.2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>Brain drain root causes: pay · working conditions · opportunity</motion.text>
    </svg>
  );
}

function Hsm3() {
  /* Donabedian Triangle + PDSA Cycle */
  return (
    <svg viewBox="0 0 320 210" className="w-full h-full">
      <motion.text x={160} y={14} textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0)}>Quality Improvement: Donabedian + PDSA</motion.text>
      {/* Triangle */}
      {([[55, 170], [160, 28], [265, 170]] as [number, number][]).map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r={26} fill={BOX_FILL}
          stroke={["#60A5FA", "#A78BFA", "#34D399"][i]} strokeWidth="1.4"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          style={{ transformOrigin: `${x}px ${y}px` }}
          transition={ease(i * 0.12, 0.45)} />
      ))}
      <motion.text x={55} y={167} textAnchor="middle" fontSize="7.5" fill="#60A5FA" fontWeight="800"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.4)}>STRUCTURE</motion.text>
      <motion.text x={55} y={178} textAnchor="middle" fontSize="6" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.5)}>Resources</motion.text>
      <motion.text x={160} y={25} textAnchor="middle" fontSize="7.5" fill="#A78BFA" fontWeight="800"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.5)}>PROCESS</motion.text>
      <motion.text x={160} y={36} textAnchor="middle" fontSize="6" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.6)}>Clinical care</motion.text>
      <motion.text x={265} y={167} textAnchor="middle" fontSize="7.5" fill="#34D399" fontWeight="800"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.6)}>OUTCOME</motion.text>
      <motion.text x={265} y={178} textAnchor="middle" fontSize="6" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.7)}>Patient health</motion.text>
      {[[55, 170, 160, 54], [160, 54, 265, 170], [265, 170, 55, 170]].map(([x1, y1, x2, y2], i) => (
        <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={STROKE_DIM} strokeWidth="1.2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={pathEase(0.3 + i * 0.1, 0.5)} />
      ))}
      {/* PDSA mini cycle (bottom center) */}
      {[
        { label: "PLAN", cx: 130, cy: 185, color: "#60A5FA" },
        { label: "DO", cx: 160, cy: 198, color: "#A78BFA" },
        { label: "STUDY", cx: 190, cy: 185, color: "#34D399" },
        { label: "ACT", cx: 160, cy: 172, color: "#F59E0B" },
      ].map((n, i) => (
        <g key={i}>
          <motion.circle cx={n.cx} cy={n.cy} r={9} fill={BOX_FILL}
            stroke={n.color} strokeWidth="1"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
            transition={ease(0.7 + i * 0.07, 0.3)} />
          <motion.text x={n.cx} y={n.cy + 3} textAnchor="middle" fontSize="5.5"
            fill={n.color} fontWeight="800"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.85 + i * 0.07)}>
            {n.label}
          </motion.text>
        </g>
      ))}
    </svg>
  );
}

function Hsm4() {
  /* Digital Health Technology Stack */
  const layers = [
    { label: "AI DIAGNOSTICS", sub: "Decision support · Pattern recognition", color: "#A78BFA", y: 28 },
    { label: "TELEMEDICINE", sub: "Remote care · Liability framework", color: "#60A5FA", y: 88 },
    { label: "ELECTRONIC HEALTH RECORDS", sub: "Interoperability · Privacy · Sovereignty", color: "#34D399", y: 148 },
  ];
  return (
    <svg viewBox="0 0 320 210" className="w-full h-full">
      <motion.text x={160} y={14} textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0)}>Digital Health Technology Stack</motion.text>
      {layers.map((l, i) => (
        <g key={i}>
          <motion.rect x={22} y={l.y} width={256} height={48} rx={5}
            fill={`${l.color}10`} stroke={l.color}
            strokeWidth={1.6 - i * 0.2}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            style={{ transformOrigin: "150px 52px" }}
            transition={ease((2 - i) * 0.12, 0.5)} />
          <motion.text x={150} y={l.y + 22} textAnchor="middle" fontSize="8.5"
            fill={l.color} fontWeight="800" letterSpacing="0.6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease((2 - i) * 0.12 + 0.3)}>
            {l.label}
          </motion.text>
          <motion.text x={150} y={l.y + 35} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease((2 - i) * 0.12 + 0.45)}>
            {l.sub}
          </motion.text>
          {i < 2 && (
            <motion.line x1={150} y1={l.y + 48} x2={150} y2={l.y + 56}
              stroke={STROKE_DIM} strokeWidth="1.2" strokeDasharray="3 2"
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
              style={{ transformOrigin: `150px ${l.y + 48}px` }}
              transition={pathEase((2 - i) * 0.12 + 0.5, 0.25)} />
          )}
        </g>
      ))}
      <motion.rect x={22} y={198} width={256} height={6} rx={3}
        fill="rgba(52,211,153,0.2)" stroke="#34D399" strokeWidth="0.8"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        style={{ transformOrigin: "150px 201px" }} transition={ease(0.6, 0.5)} />
      <motion.text x={300} y={125} textAnchor="end" fontSize="7.5" fill="#F59E0B" fontWeight="700"
        transform="rotate(90 300 125)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)}>AMPLIFIER — NOT REPLACEMENT</motion.text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   Generic fallback (unknown courses)
══════════════════════════════════════════════════ */
function GenericMindMap({ segIdx }: { segIdx: number }) {
  const diagrams = [
    <svg key="flow" viewBox="0 0 310 200" className="w-full h-full">
      {[0, 1, 2, 3].map((i) => {
        const x = 18 + i * 72;
        const labels = ["INPUT", "PROCESS", "OUTPUT", "OUTCOME"];
        const subs = ["Data · Context", "Transform", "Artifact", "Value Created"];
        return (
          <g key={i}>
            <motion.rect x={x} y={70} width={64} height={44} rx={5} fill={BOX_FILL} stroke={STROKE} strokeWidth="1.2"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={ease(i * 0.12, 0.45)} />
            <motion.text x={x + 32} y={89} textAnchor="middle" fontSize="8" fill={TEXT_COLOR} fontWeight="800"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.12 + 0.3)}>
              {labels[i]}
            </motion.text>
            <motion.text x={x + 32} y={102} textAnchor="middle" fontSize="6.5" fill={TEXT_DIM}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.12 + 0.4)}>
              {subs[i]}
            </motion.text>
            {i < 3 && (
              <motion.path d={`M ${x + 66} 92 L ${x + 70} 92`} fill="none" stroke={STROKE} strokeWidth="1.5"
                markerEnd="url(#arrg)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={pathEase(i * 0.12 + 0.2, 0.3)} />
            )}
          </g>
        );
      })}
      <defs>
        <marker id="arrg" markerWidth="5" markerHeight="5" refX="2" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={STROKE} />
        </marker>
      </defs>
      <motion.text x={155} y={30} textAnchor="middle" fontSize="10" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0)}>System Transformation Model</motion.text>
    </svg>,

    <svg key="pyramid" viewBox="0 0 300 210" className="w-full h-full">
      {[
        { x: 128, y: 20, w: 44, label: "VISION" },
        { x: 98, y: 68, w: 104, label: "STRATEGY" },
        { x: 62, y: 118, w: 176, label: "OPERATIONS" },
        { x: 22, y: 168, w: 256, label: "FOUNDATION" },
      ].map((l, i) => (
        <g key={i}>
          <motion.rect x={l.x} y={l.y} width={l.w} height={36} rx={4}
            fill={`rgba(0,32,100,${0.55 + i * 0.1})`} stroke={STROKE} strokeWidth={0.9 + i * 0.25}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            style={{ transformOrigin: `${l.x + l.w / 2}px ${l.y + 18}px` }}
            transition={ease((3 - i) * 0.11, 0.55)} />
          <motion.text x={l.x + l.w / 2} y={l.y + 21} textAnchor="middle" fontSize="8.5"
            fill={TEXT_COLOR} fontWeight="700" letterSpacing="1.2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease((3 - i) * 0.11 + 0.3)}>
            {l.label}
          </motion.text>
        </g>
      ))}
    </svg>,

    <svg key="venn" viewBox="0 0 280 210" className="w-full h-full">
      <motion.circle cx={100} cy={110} r={70} fill="rgba(0,40,160,0.1)" stroke={STROKE_DIM} strokeWidth="1.4"
        initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "100px 110px" }}
        transition={ease(0, 0.65)} />
      <motion.circle cx={180} cy={110} r={70} fill="rgba(0,112,255,0.1)" stroke={STROKE} strokeWidth="1.4"
        initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "180px 110px" }}
        transition={ease(0.2, 0.65)} />
      <motion.text x={78} y={110} textAnchor="middle" fontSize="8" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.6)}>CURRENT</motion.text>
      <motion.text x={202} y={110} textAnchor="middle" fontSize="8" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.7)}>TARGET</motion.text>
      <motion.text x={140} y={107} textAnchor="middle" fontSize="8" fill={STROKE} fontWeight="800"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)}>GAP</motion.text>
    </svg>,

    <svg key="feedback" viewBox="0 0 280 210" className="w-full h-full">
      <defs>
        <marker id="arrfb" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={STROKE} />
        </marker>
      </defs>
      {[{ cx: 80, cy: 70, label: "INPUT" }, { cx: 200, cy: 70, label: "SYSTEM" }, { cx: 140, cy: 165, label: "FEEDBACK" }].map((n, i) => (
        <g key={i}>
          <motion.circle cx={n.cx} cy={n.cy} r={32} fill={BOX_FILL} stroke={STROKE} strokeWidth="1.3"
            initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
            transition={ease(i * 0.16, 0.45)} />
          <motion.text x={n.cx} y={n.cy + 4} textAnchor="middle" fontSize="8.5" fill={TEXT_COLOR} fontWeight="800"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(i * 0.16 + 0.3)}>
            {n.label}
          </motion.text>
        </g>
      ))}
      {[[80, 70, 200, 70], [200, 70, 140, 165], [140, 165, 80, 70]].map(([x1, y1, x2, y2], i) => (
        <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={STROKE_DIM} strokeWidth="1.3"
          strokeDasharray="5 3" markerEnd="url(#arrfb)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={pathEase(0.5 + i * 0.15, 0.5)} />
      ))}
    </svg>,

    <svg key="chart" viewBox="0 0 300 200" className="w-full h-full">
      {(() => {
        const pts: [number, number][] = [[28, 165], [68, 142], [108, 120], [148, 98], [188, 72], [238, 42]];
        const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
        return (
          <>
            <motion.line x1="25" y1="15" x2="25" y2="175" stroke={STROKE_DIM} strokeWidth="1"
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ transformOrigin: "25px 175px" }}
              transition={pathEase(0, 0.45)} />
            <motion.line x1="25" y1="175" x2="255" y2="175" stroke={STROKE_DIM} strokeWidth="1"
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformOrigin: "25px 175px" }}
              transition={pathEase(0, 0.45)} />
            <motion.path d={d} fill="none" stroke={STROKE} strokeWidth="2.4" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={pathEase(0.3, 1.2)} />
            {pts.map(([x, y], i) => (
              <motion.circle key={i} cx={x} cy={y} r={4} fill={STROKE}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{ transformOrigin: `${x}px ${y}px` }} transition={ease(0.35 + i * 0.13, 0.3)} />
            ))}
            <motion.text x={142} y={25} textAnchor="middle" fontSize="9" fill={TEXT_COLOR} fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.1)}>Growth Trajectory</motion.text>
          </>
        );
      })()}
    </svg>,
  ];
  return diagrams[segIdx % diagrams.length] ?? diagrams[0]!;
}

/* ══════════════════════════════════════════════════
   Segment lookup map
══════════════════════════════════════════════════ */
const COURSE_SEGMENTS: Record<string, React.FC[]> = {
  "BAM-111": [Bam0, Bam1, Bam2, Bam3, Bam4],
  "ENT-101": [Ent0, Ent1, Ent2, Ent3, Ent4],
  "AI-201":  [Ai0,  Ai1,  Ai2,  Ai3,  Ai4],
  "DIG-301": [Dig0, Dig1, Dig2, Dig3, Dig4],
  "LAW-201": [Law0, Law1, Law2, Law3, Law4],
  "HSM-301": [Hsm0, Hsm1, Hsm2, Hsm3, Hsm4],
};

/* ══════════════════════════════════════════════════
   Export
══════════════════════════════════════════════════ */
export function WhiteboardCanvas({ courseCode, segmentIndex }: WhiteboardCanvasProps) {
  const seg = Math.max(0, Math.min(4, segmentIndex));
  const segments = COURSE_SEGMENTS[courseCode];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${courseCode}-${seg}`}
        initial={{ opacity: 0, scale: 0.93, filter: "blur(5px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 1.04, filter: "blur(4px)" }}
        transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full"
      >
        {segments ? (
          (() => {
            const Comp = segments[seg]!;
            return <Comp />;
          })()
        ) : (
          <GenericMindMap segIdx={seg} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
