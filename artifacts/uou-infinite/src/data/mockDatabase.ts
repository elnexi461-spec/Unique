/* ═══════════════════════════════════════════════════════
   UOU Infinite — Supernatural Mock Database
   Client-side demo data for offline/preview mode
   ═══════════════════════════════════════════════════════ */

export const DEMO_PERSONAS = [
  {
    name: "Amara Nwosu",
    email: "demo.student@uou.edu.ng",
    password: "Demo@1234",
    role: "student" as const,
    studentId: "UOU-ZR-DEMO-001",
    department: "Business & Entrepreneurship",
    campus: "Zaria Center",
    meritScore: 924,
    goldCards: 7,
    gpa: 3.85,
    avatar: "AN",
    tagline: "Top 5% Scholar · Zaria Campus",
  },
  {
    name: "Kwame Asante",
    email: "demo.coordinator@uou.edu.ng",
    password: "Demo@1234",
    role: "coordinator" as const,
    department: "Institutional Operations",
    campus: "Lagos Main Campus",
    avatar: "KA",
    tagline: "Institutional Coordinator · Lagos",
  },
  {
    name: "Professor Imumolen",
    email: "prof.imumolen@uou.edu.ng",
    password: "Demo@1234",
    role: "lecturer" as const,
    department: "Business & Entrepreneurship",
    campus: "All Campuses",
    avatar: "PI",
    tagline: "Senior Professor · Entrepreneurship",
  },
  {
    name: "Dr. Chukwuemeka Ibe",
    email: "admin.founder@uou.edu.ng",
    password: "Demo@1234",
    role: "founder" as const,
    department: "Executive",
    campus: "HQ",
    avatar: "CI",
    tagline: "Founder & Chancellor",
  },
];

/* 50 realistic Nigerian students */
export const MOCK_STUDENTS = [
  /* ZARIA CENTER — 18 students */
  { id: "UOU-ZR-1001", name: "Amara Nwosu",         dept: "Business & Entrepreneurship",  campus: "Zaria", level: "300", gpa: 3.85, merit: 924, goldCards: 7, status: "active" },
  { id: "UOU-ZR-1002", name: "Chidi Okafor",         dept: "Computer Science & AI",        campus: "Zaria", level: "200", gpa: 3.60, merit: 842, goldCards: 5, status: "active" },
  { id: "UOU-ZR-1003", name: "Ngozi Eze",            dept: "Law & Governance",             campus: "Zaria", level: "400", gpa: 3.90, merit: 967, goldCards: 9, status: "active" },
  { id: "UOU-ZR-1004", name: "Emeka Igwe",           dept: "Engineering & Technology",     campus: "Zaria", level: "100", gpa: 2.70, merit: 510, goldCards: 2, status: "active" },
  { id: "UOU-ZR-1005", name: "Chioma Obi",           dept: "Health Sciences",              campus: "Zaria", level: "300", gpa: 3.45, merit: 788, goldCards: 6, status: "active" },
  { id: "UOU-ZR-1006", name: "Obiageli Okeke",       dept: "Business & Entrepreneurship",  campus: "Zaria", level: "200", gpa: 3.20, merit: 711, goldCards: 4, status: "active" },
  { id: "UOU-ZR-1007", name: "Ugochukwu Nwachukwu", dept: "Computer Science & AI",        campus: "Zaria", level: "400", gpa: 3.75, merit: 888, goldCards: 8, status: "active" },
  { id: "UOU-ZR-1008", name: "Adaeze Mbah",          dept: "Law & Governance",             campus: "Zaria", level: "100", gpa: 2.90, merit: 590, goldCards: 2, status: "active" },
  { id: "UOU-ZR-1009", name: "Nneka Onwudiwe",       dept: "Health Sciences",              campus: "Zaria", level: "300", gpa: 3.55, merit: 815, goldCards: 6, status: "active" },
  { id: "UOU-ZR-1010", name: "Precious Nwobi",       dept: "Business & Entrepreneurship",  campus: "Zaria", level: "200", gpa: 3.10, merit: 680, goldCards: 3, status: "active" },
  { id: "UOU-ZR-1011", name: "Godwin Okolo",         dept: "Engineering & Technology",     campus: "Zaria", level: "400", gpa: 3.30, merit: 734, goldCards: 5, status: "active" },
  { id: "UOU-ZR-1012", name: "Blessing Onyema",      dept: "Health Sciences",              campus: "Zaria", level: "100", gpa: 2.60, merit: 480, goldCards: 1, status: "active" },
  { id: "UOU-ZR-1013", name: "Emmanuel Okereke",     dept: "Computer Science & AI",        campus: "Zaria", level: "300", gpa: 3.50, merit: 802, goldCards: 5, status: "active" },
  { id: "UOU-ZR-1014", name: "Grace Nwachukwu",      dept: "Law & Governance",             campus: "Zaria", level: "200", gpa: 3.00, merit: 650, goldCards: 3, status: "active" },
  { id: "UOU-ZR-1015", name: "Chukwuemeka Nze",      dept: "Business & Entrepreneurship",  campus: "Zaria", level: "400", gpa: 3.80, merit: 910, goldCards: 8, status: "active" },
  { id: "UOU-ZR-1016", name: "Olumide Adewale",      dept: "Engineering & Technology",     campus: "Zaria", level: "100", gpa: 2.40, merit: 420, goldCards: 1, status: "suspended" },
  { id: "UOU-ZR-1017", name: "Titilayo Ogundimu",    dept: "Health Sciences",              campus: "Zaria", level: "200", gpa: 3.25, merit: 725, goldCards: 4, status: "active" },
  { id: "UOU-ZR-1018", name: "Babatunde Salami",     dept: "Business & Entrepreneurship",  campus: "Zaria", level: "300", gpa: 3.40, merit: 780, goldCards: 5, status: "active" },

  /* LAGOS MAIN CAMPUS — 17 students */
  { id: "UOU-LA-2001", name: "Tunde Adeyemi",        dept: "Business & Entrepreneurship",  campus: "Lagos", level: "400", gpa: 3.95, merit: 980, goldCards: 10, status: "active" },
  { id: "UOU-LA-2002", name: "Bola Adesanya",        dept: "Computer Science & AI",        campus: "Lagos", level: "300", gpa: 3.70, merit: 871, goldCards: 7,  status: "active" },
  { id: "UOU-LA-2003", name: "Kemi Olawale",         dept: "Law & Governance",             campus: "Lagos", level: "200", gpa: 3.55, merit: 818, goldCards: 6,  status: "active" },
  { id: "UOU-LA-2004", name: "Segun Fadipe",         dept: "Engineering & Technology",     campus: "Lagos", level: "100", gpa: 2.80, merit: 545, goldCards: 2,  status: "active" },
  { id: "UOU-LA-2005", name: "Yetunde Akindele",     dept: "Health Sciences",              campus: "Lagos", level: "400", gpa: 3.85, merit: 930, goldCards: 9,  status: "active" },
  { id: "UOU-LA-2006", name: "Olamide Badmus",       dept: "Business & Entrepreneurship",  campus: "Lagos", level: "200", gpa: 3.15, merit: 695, goldCards: 4,  status: "active" },
  { id: "UOU-LA-2007", name: "Damilola Fasanya",     dept: "Computer Science & AI",        campus: "Lagos", level: "300", gpa: 3.60, merit: 844, goldCards: 6,  status: "active" },
  { id: "UOU-LA-2008", name: "Funmilayo Adebayo",    dept: "Law & Governance",             campus: "Lagos", level: "400", gpa: 3.75, merit: 892, goldCards: 8,  status: "active" },
  { id: "UOU-LA-2009", name: "Rotimi Afolabi",       dept: "Engineering & Technology",     campus: "Lagos", level: "100", gpa: 2.55, merit: 460, goldCards: 1,  status: "active" },
  { id: "UOU-LA-2010", name: "Lanre Bamidele",       dept: "Health Sciences",              campus: "Lagos", level: "200", gpa: 3.30, merit: 740, goldCards: 5,  status: "active" },
  { id: "UOU-LA-2011", name: "Folake Ojo",           dept: "Business & Entrepreneurship",  campus: "Lagos", level: "300", gpa: 3.45, merit: 792, goldCards: 6,  status: "active" },
  { id: "UOU-LA-2012", name: "Adewunmi Lawal",       dept: "Computer Science & AI",        campus: "Lagos", level: "400", gpa: 3.88, merit: 942, goldCards: 9,  status: "active" },
  { id: "UOU-LA-2013", name: "Wasiu Agboola",        dept: "Law & Governance",             campus: "Lagos", level: "100", gpa: 2.65, merit: 498, goldCards: 2,  status: "active" },
  { id: "UOU-LA-2014", name: "Rukayat Balogun",      dept: "Health Sciences",              campus: "Lagos", level: "200", gpa: 3.20, merit: 715, goldCards: 4,  status: "active" },
  { id: "UOU-LA-2015", name: "Lateef Olajide",       dept: "Engineering & Technology",     campus: "Lagos", level: "300", gpa: 3.35, merit: 760, goldCards: 5,  status: "active" },
  { id: "UOU-LA-2016", name: "Mariam Shuaibu",       dept: "Business & Entrepreneurship",  campus: "Lagos", level: "400", gpa: 3.70, merit: 870, goldCards: 7,  status: "active" },
  { id: "UOU-LA-2017", name: "Yusuf Danmole",        dept: "Computer Science & AI",        campus: "Lagos", level: "100", gpa: 2.75, merit: 528, goldCards: 2,  status: "active" },

  /* KANO HUB — 15 students */
  { id: "UOU-KA-3001", name: "Musa Aliyu",           dept: "Business & Entrepreneurship",  campus: "Kano", level: "300", gpa: 3.50, merit: 806, goldCards: 6, status: "active" },
  { id: "UOU-KA-3002", name: "Fatima Bello",         dept: "Health Sciences",              campus: "Kano", level: "200", gpa: 3.35, merit: 759, goldCards: 5, status: "active" },
  { id: "UOU-KA-3003", name: "Ibrahim Sule",         dept: "Law & Governance",             campus: "Kano", level: "400", gpa: 3.80, merit: 912, goldCards: 8, status: "active" },
  { id: "UOU-KA-3004", name: "Aisha Garba",          dept: "Computer Science & AI",        campus: "Kano", level: "100", gpa: 2.70, merit: 512, goldCards: 2, status: "active" },
  { id: "UOU-KA-3005", name: "Yakubu Dankwa",        dept: "Engineering & Technology",     campus: "Kano", level: "300", gpa: 3.25, merit: 726, goldCards: 4, status: "active" },
  { id: "UOU-KA-3006", name: "Hauwa Jibo",           dept: "Health Sciences",              campus: "Kano", level: "400", gpa: 3.65, merit: 856, goldCards: 7, status: "active" },
  { id: "UOU-KA-3007", name: "Abdullahi Musa",       dept: "Business & Entrepreneurship",  campus: "Kano", level: "200", gpa: 3.10, merit: 678, goldCards: 3, status: "active" },
  { id: "UOU-KA-3008", name: "Zainab Usman",         dept: "Law & Governance",             campus: "Kano", level: "100", gpa: 2.85, merit: 562, goldCards: 2, status: "active" },
  { id: "UOU-KA-3009", name: "Sani Danjuma",         dept: "Computer Science & AI",        campus: "Kano", level: "300", gpa: 3.55, merit: 820, goldCards: 6, status: "active" },
  { id: "UOU-KA-3010", name: "Rakiya Ahmed",         dept: "Engineering & Technology",     campus: "Kano", level: "400", gpa: 3.40, merit: 778, goldCards: 5, status: "active" },
  { id: "UOU-KA-3011", name: "Sadiq Lawal",          dept: "Business & Entrepreneurship",  campus: "Kano", level: "200", gpa: 3.00, merit: 648, goldCards: 3, status: "active" },
  { id: "UOU-KA-3012", name: "Halima Nuhu",          dept: "Health Sciences",              campus: "Kano", level: "100", gpa: 2.60, merit: 486, goldCards: 1, status: "active" },
  { id: "UOU-KA-3013", name: "Aminu Yusuf",          dept: "Law & Governance",             campus: "Kano", level: "300", gpa: 3.30, merit: 738, goldCards: 5, status: "active" },
  { id: "UOU-KA-3014", name: "Bintu Abubakar",       dept: "Computer Science & AI",        campus: "Kano", level: "400", gpa: 3.75, merit: 887, goldCards: 8, status: "active" },
  { id: "UOU-KA-3015", name: "Dauda Garba",          dept: "Engineering & Technology",     campus: "Kano", level: "200", gpa: 3.15, merit: 698, goldCards: 4, status: "active" },
];

/* 5 Core lectures with full content */
export const CORE_LECTURES = [
  {
    id: "ENT-101",
    code: "ENT-101",
    title: "Principles of Entrepreneurship",
    department: "Business & Entrepreneurship",
    professor: "Professor Imumolen",
    duration: "20 min",
    slides: [
      {
        title: "The Entrepreneur's Mindset",
        content: "Entrepreneurship is not about having an idea — it is about relentlessly closing the gap between what exists and what should exist. The practitioner who cannot tolerate ambiguity will fail where others thrive. Your primary function is value creation under uncertainty.",
        keyPoints: ["Opportunity recognition vs. idea generation", "Ambiguity tolerance as competitive advantage", "Value creation before value capture"],
        visual: "mindset",
      },
      {
        title: "Market Validation Frameworks",
        content: "A venture without validated demand is an expensive hobby. Before committing resources, every entrepreneur must interrogate three questions: Who is in pain? How severe is that pain? And are they currently paying to dull it? If the answer to the third question is no, your total addressable market is hypothetical.",
        keyPoints: ["Problem-solution fit precedes product-market fit", "Customer discovery interviews: the 5-question protocol", "Willingness to pay as the ultimate validation signal"],
        visual: "framework",
      },
      {
        title: "The Business Model Canvas",
        content: "Osterwalder's Business Model Canvas is not a planning document — it is a hypothesis board. Every block represents an assumption that the market will either confirm or destroy. Your job is to run structured experiments that falsify each assumption as cheaply and quickly as possible.",
        keyPoints: ["Nine pillars of business model design", "Assumption mapping and experiment design", "Pivot triggers vs. perseverance signals"],
        visual: "canvas",
      },
      {
        title: "Venture Capital & Funding Strategy",
        content: "Capital is a multiplier — it amplifies whatever you already do well or poorly. Founders who raise before achieving product-market fit are accelerating toward failure at a higher cost. The optimal time to raise is when growth is constrained by capital, not by learning.",
        keyPoints: ["Bootstrapping vs. external capital decision tree", "Term sheets: dilution, valuation, control provisions", "The investor alignment test"],
        visual: "capital",
      },
      {
        title: "Scaling & Institutional Resilience",
        content: "A company that cannot survive the departure of its founder has no institutional value. Scaling requires the deliberate abstraction of your own judgment into systems, processes, and culture. The measure of a great entrepreneur is the organisation they build — not the problems they personally solve.",
        keyPoints: ["Systems thinking vs. hero culture", "Organisational design for scale", "Cultural transmission and institutional memory"],
        visual: "scale",
      },
    ],
    scriptSummary: `Session 1 establishes the entrepreneurial mindset — the psychological architecture required to operate effectively in conditions of radical uncertainty. We then move to market validation: distinguishing pain points from preferences, and willingness-to-pay as the only credible signal of commercial viability. The Business Model Canvas is introduced not as a template, but as a living hypothesis board. In the penultimate segment, we interrogate capital strategy — the conditions under which external funding accelerates versus destroys a venture. The session closes with institutional resilience: how great founders build organisations that outlast their own presence.`,
    quizQuestions: [
      {
        scenario: "A UOU student launches a food delivery app targeting Zaria students but discovers that students prefer to cook due to cost sensitivity. The most strategically sound response is:",
        options: [
          "Continue with the original plan — persistence is an entrepreneurial virtue",
          "Pivot to serving university lecturers and staff who have disposable income",
          "Shut down immediately — the market has rejected the idea",
          "Reduce the price to zero and build market share first",
        ],
        correctIndex: 1,
      },
      {
        scenario: "Your startup has achieved strong product-market fit with 500 paying customers but lacks the infrastructure to onboard 5,000. An investor offers ₦50M but demands 40% equity. According to today's lecture, what is the primary risk of accepting?",
        options: [
          "The investor will interfere with product decisions",
          "Dilution at this stage undervalues future leverage when growth data is stronger",
          "₦50M is insufficient for scale",
          "No risk — capital always accelerates growth",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "AI-201",
    code: "AI-201",
    title: "AI Safety & Ethics",
    department: "Computer Science & AI",
    professor: "Professor Imumolen",
    duration: "20 min",
    slides: [
      {
        title: "The Alignment Problem",
        content: "An AI system that perfectly optimises for the wrong objective will cause catastrophic harm with perfect efficiency. The alignment problem is not a technical glitch — it is the central challenge of deploying intelligence that lacks human values by default.",
        keyPoints: ["Goodhart's Law in AI systems", "Specification gaming and reward hacking", "The instrumental convergence thesis"],
        visual: "alignment",
      },
      {
        title: "Safety Constraints & RLHF",
        content: "Reinforcement Learning from Human Feedback (RLHF) is currently the dominant paradigm for aligning language models. Its core assumption — that human feedback is a reliable signal of human values — is also its most significant vulnerability.",
        keyPoints: ["Constitutional AI and iterative refinement", "The preference elicitation problem", "Scalable oversight: debate and amplification"],
        visual: "rlhf",
      },
      {
        title: "Governance & Regulation Frameworks",
        content: "Technical safety without institutional governance is insufficient. The EU AI Act, NIST AI RMF, and emerging African AI governance frameworks represent different philosophical approaches to risk classification and accountability attribution.",
        keyPoints: ["Risk-tiered regulatory architecture", "Accountability chains in AI deployment", "Africa-specific considerations: data colonialism and sovereignty"],
        visual: "governance",
      },
      {
        title: "Bias, Fairness & Distributive Justice",
        content: "A model trained on historical data will replicate historical injustice with unprecedented scale and speed. Fairness in AI is not a single property — it is a set of mathematically incompatible constraints that require explicit ethical trade-offs.",
        keyPoints: ["Demographic parity vs. equalised odds", "Protected attributes and proxy discrimination", "Participatory design as mitigation strategy"],
        visual: "fairness",
      },
      {
        title: "Existential Risk & Long-term Trajectories",
        content: "The question of what happens when AI systems exceed human-level performance across all cognitive domains is not science fiction — it is the boundary condition for every safety decision made today. Decisions made in the next decade will constrain the solution space for the next century.",
        keyPoints: ["Capabilities vs. alignment timelines", "The treacherous turn scenario", "Strategic implications for African AI development"],
        visual: "existential",
      },
    ],
    scriptSummary: "This session opens with the alignment problem — the foundational challenge of building systems that pursue human values rather than proxies of human values. We examine RLHF as the current state-of-the-art alignment technique and interrogate its limitations. Governance frameworks are then surveyed across jurisdictions, with particular attention to African regulatory sovereignty. The bias and fairness segment explores the mathematical incompatibilities between competing fairness definitions. The session concludes with long-term risk trajectories and their strategic implications.",
    quizQuestions: [
      {
        scenario: "A hospital in Lagos deploys an AI triage system trained on European medical data. Three months later, it consistently undertriages patients with dark skin tones. The root cause is most likely:",
        options: [
          "The algorithm contains deliberate racial bias",
          "Training data underrepresented dark-skinned patients, creating distributional shift",
          "The hardware is incompatible with Nigerian infrastructure",
          "The AI is technically correct but being misused by staff",
        ],
        correctIndex: 1,
      },
      {
        scenario: "A government wants to deploy a predictive policing AI that achieves demographic parity across all ethnic groups. A researcher points out this violates equalised odds. This tension exists because:",
        options: [
          "One metric is always superior to the other",
          "Demographic parity and equalised odds are mathematically incompatible when base rates differ across groups",
          "The government should not use AI for policing at all",
          "The researcher is mathematically incorrect",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "DIG-301",
    code: "DIG-301",
    title: "Digital Innovation Lab",
    department: "Engineering & Technology",
    professor: "Professor Imumolen",
    duration: "20 min",
    slides: [
      {
        title: "Systems Thinking for Innovators",
        content: "Every complex problem is a system problem. The engineer who intervenes at the symptom level will produce interventions that feel effective in the short term and generate new problems in the medium term. True innovation requires mapping causal loops, identifying leverage points, and intervening at the root.",
        keyPoints: ["Feedback loops: reinforcing vs. balancing", "Leverage points in system architecture", "Unintended consequences as design signals"],
        visual: "systems",
      },
      {
        title: "Human-Centred Design for Africa",
        content: "Design thinking as practiced in Silicon Valley assumes stable infrastructure, high literacy, and abundant data. In African contexts, the designer must contend with intermittent power, multilingual users, low-bandwidth networks, and trust deficits toward digital systems.",
        keyPoints: ["Contextual inquiry in low-resource environments", "Designing for trust in high-uncertainty contexts", "The last-mile delivery problem"],
        visual: "hcd",
      },
      {
        title: "Rapid Prototyping & Iteration",
        content: "The purpose of a prototype is not to showcase a solution — it is to generate the highest possible volume of learning at the lowest possible cost. A prototype that perfectly represents the final product has failed at its primary function.",
        keyPoints: ["Fidelity spectrum: paper to functional prototype", "Assumption-based prototyping methodology", "Feedback collection protocols"],
        visual: "prototype",
      },
      {
        title: "Technology Readiness Levels",
        content: "NASA's Technology Readiness Level (TRL) framework provides a rigorous vocabulary for communicating the maturity of a technology from concept (TRL 1) to deployment (TRL 9). Most African startups pitch TRL 4 solutions as TRL 8 — this is the innovation credibility gap.",
        keyPoints: ["TRL 1-9: definitions and evidence requirements", "The valley of death between TRL 4 and TRL 6", "Grant funding and TRL alignment"],
        visual: "trl",
      },
      {
        title: "Intellectual Property & Open Innovation",
        content: "Patents protect; trade secrets isolate; open source accelerates. The IP strategy that maximises long-term value depends on whether your competitive advantage lies in the technology itself, the application of the technology, or the network built around the technology.",
        keyPoints: ["Patent vs. trade secret vs. open source decision framework", "African IP treaty landscape", "Platform strategies and ecosystem moats"],
        visual: "ip",
      },
    ],
    scriptSummary: "The Digital Innovation Lab opens with systems thinking — the analytical lens that allows engineers to see problems as structural rather than symptomatic. Human-centred design is then adapted to African infrastructure realities, emphasising contextual design methods. Rapid prototyping principles follow, focused on learning velocity over output fidelity. The TRL framework provides rigour to the innovation maturity conversation. The session concludes with IP strategy — helping innovators decide when to protect, when to share, and when to build.",
    quizQuestions: [],
  },
  {
    id: "LAW-201",
    code: "LAW-201",
    title: "Constitutional Law & Governance",
    department: "Law & Governance",
    professor: "Professor Imumolen",
    duration: "20 min",
    slides: [
      {
        title: "Constitutional Architecture",
        content: "A constitution is the foundational grammar of political power. It does not merely describe how government works — it prescribes the limits beyond which legitimate authority cannot extend. Understanding constitutional design requires distinguishing between the letter of the law and the institutional culture required to give it force.",
        keyPoints: ["Separation of powers: executive, legislative, judicial", "Supremacy clauses and constitutional hierarchies", "Amendment procedures as institutional entrenchment"],
        visual: "constitution",
      },
      {
        title: "Federalism & Devolution",
        content: "Nigeria's federal structure creates a three-tier government that allocates functions between federal, state, and local authorities. The tension between centralisation and devolution is not merely administrative — it reflects competing theories of representation, accountability, and resource control.",
        keyPoints: ["Exclusive, concurrent, and residual legislative lists", "Fiscal federalism and revenue allocation formula", "Devolution vs. decentralisation: definitional clarity"],
        visual: "federalism",
      },
      {
        title: "Fundamental Rights Framework",
        content: "Chapter IV of the 1999 Constitution enumerates fundamental rights — but rights on paper are not rights in practice. The gap between constitutional guarantees and lived experience is the practitioner's working environment. Enforcement mechanisms, locus standi rules, and remedial jurisprudence determine whether rights are actionable.",
        keyPoints: ["Justiciable vs. non-justiciable rights", "Derogation clauses and national security exceptions", "Strategic litigation as rights enforcement tool"],
        visual: "rights",
      },
      {
        title: "Administrative Law & Accountability",
        content: "Every exercise of public power must be traceable to legal authority. Administrative law provides the toolkit for challenging unlawful government action — through judicial review, statutory appeals, and ombudsman mechanisms. The rule of law is only as strong as its enforcement infrastructure.",
        keyPoints: ["Ultra vires doctrine and legitimate expectation", "Judicial review grounds: illegality, irrationality, procedural impropriety", "Freedom of Information Act: access and limits"],
        visual: "admin",
      },
      {
        title: "Constitutional Reform & Democratic Consolidation",
        content: "Constitutional reform is not a technical exercise — it is a political negotiation about power distribution. Successful reform requires not only textual amendment but the construction of social coalitions that will defend the new settlement against its beneficiaries' successors.",
        keyPoints: ["Reform modalities: constituent assembly, national conference, referendum", "Elite bargaining and inclusion imperatives", "Consolidation indicators and democratic backsliding"],
        visual: "reform",
      },
    ],
    scriptSummary: "This session lays the structural foundation of constitutional law — examining constitutions as power-limiting instruments rather than mere governance descriptions. Nigerian federalism is then analysed through the lens of fiscal allocation and representational theory. Fundamental rights jurisprudence is interrogated for the gap between textual guarantee and practical enforcement. Administrative law provides the accountability toolkit. The session closes with constitutional reform theory — the political economy of institutional change.",
    quizQuestions: [],
  },
  {
    id: "HSM-301",
    code: "HSM-301",
    title: "Health Systems Management",
    department: "Health Sciences",
    professor: "Professor Imumolen",
    duration: "20 min",
    slides: [
      {
        title: "Health Systems Architecture",
        content: "A health system is not a hospital — it is the totality of organisations, institutions, and resources whose primary purpose is to improve health. The WHO building blocks framework (service delivery, health workforce, information, medical products, financing, leadership) provides a diagnostic lens for system analysis.",
        keyPoints: ["WHO health system building blocks", "Primary, secondary, tertiary care hierarchies", "Universal Health Coverage: coverage cube"],
        visual: "architecture",
      },
      {
        title: "Health Financing & Resource Allocation",
        content: "Who pays for healthcare, how, and when determines access more than the quality of clinical care. Prepayment mechanisms — taxation, social health insurance, community-based schemes — redistribute risk from the sick to the healthy. Out-of-pocket payments are the most regressive financing mechanism and the primary driver of catastrophic health expenditure.",
        keyPoints: ["Revenue mobilisation sources comparison", "Risk pooling: depth vs. breadth", "Catastrophic health expenditure thresholds"],
        visual: "financing",
      },
      {
        title: "Human Resources for Health",
        content: "Nigeria has a doctor-to-patient ratio of 1:5,000 against a WHO standard of 1:1,000. The production, deployment, and retention of health workers is the central operational challenge of African health systems. Task-shifting to community health workers is not a compromise — it is a system design decision with strong evidence.",
        keyPoints: ["Workforce planning methodologies", "Brain drain: systemic causes and retention strategies", "Task-shifting: scope of practice and quality assurance"],
        visual: "workforce",
      },
      {
        title: "Quality Improvement Frameworks",
        content: "Quality in health care is not defined by the intention of providers — it is defined by outcomes for patients. The Donabedian model (structure, process, outcome) provides a systematic approach to quality measurement. Continuous quality improvement cycles — Plan-Do-Study-Act — operationalise this framework into institutional practice.",
        keyPoints: ["Donabedian framework: structure, process, outcome", "Patient safety: error classification and reporting culture", "Accreditation as quality signal vs. quality driver"],
        visual: "quality",
      },
      {
        title: "Digital Health & Data Governance",
        content: "Electronic health records, telemedicine, and AI-assisted diagnostics are not solutions to health system problems — they are amplifiers of existing system capabilities. A weak health system with digital tools is a faster weak health system. Data governance in health requires balancing interoperability, privacy, and sovereignty.",
        keyPoints: ["EMR implementation: adoption barriers in LMIC settings", "Telemedicine regulation and liability", "Health data sovereignty and the global data economy"],
        visual: "digital",
      },
    ],
    scriptSummary: "The Health Systems Management session opens with the WHO building blocks framework as a diagnostic instrument. Health financing mechanisms are then analysed for equity and efficiency — establishing out-of-pocket payment as the system's greatest equity threat. Human resources challenges are examined with specific attention to Nigeria's workforce crisis and task-shifting evidence. Quality improvement frameworks operationalise performance measurement. The session closes with digital health — interrogating the assumption that technology solves system problems.",
    quizQuestions: [],
  },
];

/* Week 18 Friday Brief — pre-generated for Founder */
export const FRIDAY_BRIEF_WEEK18 = {
  week: 18,
  period: "29 April – 3 May 2026",
  generatedAt: "Friday, 3 May 2026 — 17:00 WAT",
  headline: "Zaria Center achieves 15% punctuality surge; AI Sentinel flags 3 at-risk learners",
  kpis: [
    { label: "Active Students",       value: 50,   prev: 47,  delta: "+6.4%",  up: true },
    { label: "Lectures Completed",    value: 127,  prev: 108, delta: "+17.6%", up: true },
    { label: "Gold Cards Minted",     value: 38,   prev: 31,  delta: "+22.6%", up: true },
    { label: "At-Risk Students",      value: 3,    prev: 7,   delta: "-57.1%", up: false },
    { label: "Average Merit Score",   value: 756,  prev: 724, delta: "+4.4%",  up: true },
    { label: "Assessment Pass Rate",  value: "84%",prev: "79%",delta: "+5pp",  up: true },
  ],
  campusBreakdown: [
    { campus: "Zaria",  punctuality: "91%", prevPunctuality: "76%", change: "+15%", students: 18, goldCards: 52, highlight: true },
    { campus: "Lagos",  punctuality: "87%", prevPunctuality: "84%", change: "+3%",  students: 17, goldCards: 61, highlight: false },
    { campus: "Kano",   punctuality: "83%", prevPunctuality: "81%", change: "+2%",  students: 15, goldCards: 43, highlight: false },
  ],
  sentinelInsights: [
    { type: "risk",    message: "Musa Aliyu (UOU-KA-3001) has not logged in for 11 days. Sentinel recommends immediate outreach." },
    { type: "risk",    message: "Emeka Igwe (UOU-ZR-1004) has missed 3 consecutive timetable sessions. Remedial Bridge recommended." },
    { type: "risk",    message: "Blessing Onyema (UOU-ZR-1012) GPA dropped below 2.5 threshold. AI tutoring session triggered." },
    { type: "success", message: "Ngozi Eze (UOU-ZR-1003) achieved a perfect score on the Constitutional Law Gateway — Gold Card minted." },
    { type: "success", message: "Tunde Adeyemi (UOU-LA-2001) completed all 5 core courses with GPA 3.95 — Graduation track confirmed." },
    { type: "info",    message: "Zaria Center punctuality increased by 15% following Tuesday's AI-personalised timetable adjustment." },
  ],
  topStudents: [
    { name: "Tunde Adeyemi",   id: "UOU-LA-2001", merit: 980, goldCards: 10, campus: "Lagos" },
    { name: "Ngozi Eze",       id: "UOU-ZR-1003", merit: 967, goldCards: 9,  campus: "Zaria" },
    { name: "Yetunde Akindele",id: "UOU-LA-2005", merit: 930, goldCards: 9,  campus: "Lagos" },
    { name: "Amara Nwosu",     id: "UOU-ZR-DEMO-001", merit: 924, goldCards: 7, campus: "Zaria" },
    { name: "Chukwuemeka Nze", id: "UOU-ZR-1015", merit: 910, goldCards: 8,  campus: "Zaria" },
  ],
  coursePerformance: [
    { course: "Principles of Entrepreneurship", passRate: "89%", avgScore: 82, enrolled: 38 },
    { course: "AI Safety & Ethics",             passRate: "81%", avgScore: 78, enrolled: 29 },
    { course: "Digital Innovation Lab",         passRate: "84%", avgScore: 80, enrolled: 22 },
    { course: "Constitutional Law & Governance",passRate: "87%", avgScore: 83, enrolled: 18 },
    { course: "Health Systems Management",      passRate: "79%", avgScore: 76, enrolled: 15 },
  ],
  founderMessage: "The data from Week 18 validates our hypothesis: when the Sentinel personalises the academic experience, outcomes improve without increasing staff load. Zaria's 15% punctuality surge came from one algorithmic timetable adjustment — no additional human intervention. This is what institutional intelligence looks like at scale. Continue.",
};

/* ═══════════════════════════════════════════════════════
   Founder Audit Log — quiz submission records
   ═══════════════════════════════════════════════════════ */

export interface AuditEntry {
  studentId: string;
  studentName: string;
  courseTitle: string;
  timestamp: string;
  timeTaken: number;
  result: "pass" | "fail";
  score: number;
  attempt: number;
}

export const AUDIT_LOG: AuditEntry[] = [];

export function pushAuditEntry(entry: AuditEntry): void {
  AUDIT_LOG.unshift(entry);
  if (AUDIT_LOG.length > 500) AUDIT_LOG.pop();
  try {
    const stored: AuditEntry[] = JSON.parse(localStorage.getItem("uou_audit_log") ?? "[]");
    stored.unshift(entry);
    localStorage.setItem("uou_audit_log", JSON.stringify(stored.slice(0, 500)));
  } catch {
    /* silently ignore storage errors */
  }
}

export function getAuditLog(): AuditEntry[] {
  try {
    const stored: AuditEntry[] = JSON.parse(localStorage.getItem("uou_audit_log") ?? "[]");
    for (const e of AUDIT_LOG) {
      if (!stored.find(s => s.timestamp === e.timestamp && s.studentId === e.studentId)) {
        stored.unshift(e);
      }
    }
    return stored.slice(0, 500);
  } catch {
    return [...AUDIT_LOG];
  }
}

/* 200+ minted Gold Cards history for Identity Vault */
export const GOLD_CARD_HISTORY = Array.from({ length: 217 }, (_, i) => {
  const student = MOCK_STUDENTS[i % MOCK_STUDENTS.length]!;
  const courses = ["ENT-101", "AI-201", "DIG-301", "LAW-201", "HSM-301"];
  const course = courses[i % 5]!;
  const types = ["attendance", "exam", "test", "assignment"];
  const scores = [72, 78, 82, 85, 88, 91, 94, 97, 100];
  const score = scores[i % scores.length]!;
  const daysAgo = Math.floor(i * 0.8) + 1;
  return {
    id: i + 1,
    keyHash: `UOU-${(i + 1).toString().padStart(6, "0")}-GOLD`,
    studentName: student.name,
    studentId: student.id,
    campus: student.campus,
    courseCode: course,
    keyType: types[i % 4]!,
    score,
    mintedAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
  };
});
