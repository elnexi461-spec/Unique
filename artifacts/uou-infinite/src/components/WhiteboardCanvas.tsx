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

/* ── BAM-111 SEGMENT 0: Efficiency vs Effectiveness ── */
function Bam0() {
  return (
    <svg viewBox="0 0 320 210" className="w-full h-full">
      <defs>
        <marker id="arr0" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={STROKE} />
        </marker>
      </defs>
      {/* Left box: Efficiency */}
      <motion.rect x={8} y={55} width={110} height={55} rx={6} fill={BOX_FILL} stroke={STROKE} strokeWidth="1.4"
        initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "63px 82px" }}
        transition={ease(0, 0.55)} />
      <motion.text x={63} y={79} textAnchor="middle" fontSize="9" fill={TEXT_COLOR} fontWeight="800" letterSpacing="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.4)}>EFFICIENCY</motion.text>
      <motion.text x={63} y={93} textAnchor="middle" fontSize="8" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.55)}>Doing things right</motion.text>

      {/* Right box: Effectiveness */}
      <motion.rect x={202} y={55} width={110} height={55} rx={6} fill={BOX_FILL} stroke={STROKE} strokeWidth="1.4"
        initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "257px 82px" }}
        transition={ease(0.15, 0.55)} />
      <motion.text x={257} y={79} textAnchor="middle" fontSize="9" fill={TEXT_COLOR} fontWeight="800" letterSpacing="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.55)}>EFFECTIVENESS</motion.text>
      <motion.text x={257} y={93} textAnchor="middle" fontSize="8" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.7)}>Doing the right things</motion.text>

      {/* "≠" separator */}
      <motion.text x={160} y={88} textAnchor="middle" fontSize="24" fill={STROKE} fontWeight="900"
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
        style={{ transformOrigin: "160px 88px" }} transition={ease(0.3, 0.4)}>≠</motion.text>

      {/* Bottom label */}
      <motion.line x1={60} y1={145} x2={260} y2={145} stroke={STROKE_DIM} strokeWidth="1"
        strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={pathEase(0.6, 0.7)} />
      <motion.text x={160} y={162} textAnchor="middle" fontSize="8" fill={TEXT_DIM} letterSpacing="2" fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)}>THE STRATEGIC DISTINCTION</motion.text>

      {/* Top note */}
      <motion.text x={160} y={30} textAnchor="middle" fontSize="10" fill={TEXT_COLOR} fontWeight="700" letterSpacing="0.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.2)}>Foundations of Administration</motion.text>

      {/* Bottom insight */}
      <motion.rect x={30} y={170} width={260} height={26} rx={4} fill="rgba(0,112,255,0.07)" stroke={STROKE_DIM} strokeWidth="0.8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)} />
      <motion.text x={160} y={187} textAnchor="middle" fontSize="8" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.1)}>Optimising irrelevance is failure at scale</motion.text>
    </svg>
  );
}

/* ── BAM-111 SEGMENT 1: Org Structure Hierarchy ── */
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

/* ── BAM-111 SEGMENT 2: HR Cycle ── */
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

/* ── BAM-111 SEGMENT 3: Cash vs Profit ── */
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
      <motion.text x={18} y={100} textAnchor="middle" fontSize="7.5" fill={TEXT_DIM} letterSpacing="1"
        transform="rotate(-90 18 100)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={ease(1.2)}>₦</motion.text>

      <motion.text x={155} y={15} textAnchor="middle" fontSize="9" fill={TEXT_COLOR} fontWeight="800"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.1)}>CASH ≠ PROFIT</motion.text>
    </svg>
  );
}

/* ── BAM-111 SEGMENT 4: Balanced Scorecard ── */
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

/* ── GENERIC Segment visuals for non-BAM courses ── */
function GenericMindMap({ segIdx }: { segIdx: number }) {
  const diagrams = [
    /* 0: Process flow */
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

    /* 1: Pyramid */
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

    /* 2: Radar/Venn */
    <svg key="venn" viewBox="0 0 280 210" className="w-full h-full">
      <motion.circle cx={100} cy={110} r={70} fill="rgba(0,40,160,0.1)" stroke={STROKE_DIM} strokeWidth="1.4"
        initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "100px 110px" }}
        transition={ease(0, 0.65)} />
      <motion.circle cx={180} cy={110} r={70} fill="rgba(0,112,255,0.1)" stroke={STROKE} strokeWidth="1.4"
        initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "180px 110px" }}
        transition={ease(0.2, 0.65)} />
      <motion.text x={78} y={110} textAnchor="middle" fontSize="8" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.6)}>CURRENT</motion.text>
      <motion.text x={78} y={122} textAnchor="middle" fontSize="7" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.7)}>State</motion.text>
      <motion.text x={202} y={110} textAnchor="middle" fontSize="8" fill={TEXT_COLOR} fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.7)}>TARGET</motion.text>
      <motion.text x={202} y={122} textAnchor="middle" fontSize="7" fill={TEXT_DIM}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.8)}>State</motion.text>
      <motion.text x={140} y={107} textAnchor="middle" fontSize="8" fill={STROKE} fontWeight="800"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)}>GAP</motion.text>
      <motion.text x={140} y={120} textAnchor="middle" fontSize="7" fill={STROKE}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(1.0)}>ANALYSIS</motion.text>
    </svg>,

    /* 3: Feedback Loop */
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

    /* 4: Growth Chart */
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
            <motion.path d={`${d} L 238 175 L 28 175 Z`} fill="rgba(0,112,255,0.07)"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={ease(0.9)} />
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

const BAM_SEGMENTS = [Bam0, Bam1, Bam2, Bam3, Bam4];

export function WhiteboardCanvas({ courseCode, segmentIndex }: WhiteboardCanvasProps) {
  const seg = Math.max(0, Math.min(4, segmentIndex));

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${courseCode}-${seg}`}
        initial={{ opacity: 0, scale: 0.94, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 1.03, filter: "blur(3px)" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full"
      >
        {courseCode === "BAM-111" ? (
          (() => {
            const Comp = BAM_SEGMENTS[seg]!;
            return <Comp />;
          })()
        ) : (
          <GenericMindMap segIdx={seg} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
