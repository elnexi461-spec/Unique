import { Router, type IRouter } from "express";
import { db, usersTable, studentsTable, lecturersTable, coursesTable, enrollmentsTable, lectureKeys } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "uou_salt").digest("hex");
}

function randHex(n: number): string {
  return crypto.randomBytes(Math.ceil(n / 2)).toString("hex").slice(0, n).toUpperCase();
}

const NIGERIAN_NAMES = [
  "Amara Nwosu", "Chidi Okafor", "Ngozi Eze", "Emeka Igwe", "Chioma Obi",
  "Tunde Adeyemi", "Bola Adesanya", "Kemi Olawale", "Segun Fadipe", "Yetunde Akindele",
  "Musa Aliyu", "Fatima Bello", "Ibrahim Sule", "Aisha Garba", "Yakubu Dankwa",
  "Hauwa Jibo", "Abdullahi Musa", "Zainab Usman", "Sani Danjuma", "Rakiya Ahmed",
  "Sadiq Lawal", "Halima Nuhu", "Aminu Yusuf", "Bintu Abubakar", "Dauda Garba",
  "Obiageli Okeke", "Nneka Onwudiwe", "Ugochukwu Nwachukwu", "Adaeze Mbah", "Chukwuemeka Nze",
  "Olumide Adewale", "Titilayo Ogundimu", "Babatunde Salami", "Folake Ojo", "Adewunmi Lawal",
  "Yusuf Danmole", "Mariam Shuaibu", "Lateef Olajide", "Rukayat Balogun", "Wasiu Agboola",
  "Precious Nwobi", "Godwin Okolo", "Blessing Onyema", "Emmanuel Okereke", "Grace Nwachukwu",
  "Olamide Badmus", "Damilola Fasanya", "Funmilayo Adebayo", "Rotimi Afolabi", "Lanre Bamidele",
];

const CITIES = ["Zaria", "Lagos", "Kano"];
const DEPARTMENTS = [
  "Business & Entrepreneurship",
  "Computer Science & AI",
  "Health Sciences",
  "Law & Governance",
  "Engineering & Technology",
];
const LEVELS = ["100", "200", "300", "400"];
const SKILLS_POOL = [
  "Critical Thinking", "Entrepreneurship", "AI Safety", "Data Analysis",
  "Leadership", "Research Methods", "Innovation", "Communication",
  "Project Management", "Digital Literacy",
];

const COURSES_DATA = [
  {
    title: "Principles of Entrepreneurship",
    code: "ENT-101",
    department: "Business & Entrepreneurship",
    description: "A rigorous exploration of entrepreneurial thinking, venture creation, and value proposition design.",
    credits: 3,
    capacity: 120,
    requiredSubjects: "None",
  },
  {
    title: "AI Safety & Ethics",
    code: "AI-201",
    department: "Computer Science & AI",
    description: "Critical examination of alignment, safety constraints, and ethical deployment of artificial intelligence.",
    credits: 3,
    capacity: 100,
    requiredSubjects: "Introduction to Computing",
  },
  {
    title: "Digital Innovation Lab",
    code: "DIG-301",
    department: "Engineering & Technology",
    description: "Hands-on prototyping and systems thinking applied to real-world infrastructure challenges.",
    credits: 4,
    capacity: 80,
    requiredSubjects: "Engineering Fundamentals",
  },
  {
    title: "Constitutional Law & Governance",
    code: "LAW-201",
    department: "Law & Governance",
    description: "Advanced study of constitutional frameworks, institutional power, and African state legal architecture.",
    credits: 3,
    capacity: 90,
    requiredSubjects: "Introduction to Law",
  },
  {
    title: "Health Systems Management",
    code: "HSM-301",
    department: "Health Sciences",
    description: "Operational leadership, policy design, and resource allocation in complex healthcare systems.",
    credits: 3,
    capacity: 75,
    requiredSubjects: "Public Health Fundamentals",
  },
];

const DEMO_USERS = [
  { name: "Amara Nwosu",        email: "demo.student@uou.edu.ng",      role: "student",     password: "Demo@1234" },
  { name: "Kwame Asante",       email: "demo.coordinator@uou.edu.ng",  role: "coordinator", password: "Demo@1234" },
  { name: "Professor Imumolen", email: "prof.imumolen@uou.edu.ng",     role: "lecturer",    password: "Demo@1234" },
  { name: "Dr. Chukwuemeka Ibe",email: "admin.founder@uou.edu.ng",     role: "founder",     password: "Demo@1234" },
];

router.post("/seed", async (_req, res): Promise<void> => {
  try {
    const report: Record<string, number> = {
      demoUsers: 0, students: 0, courses: 0, enrollments: 0, goldCards: 0, lecturers: 0,
    };

    /* ── 1. Demo users ── */
    const demoUserIds: Record<string, number> = {};
    for (const du of DEMO_USERS) {
      const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, du.email));
      if (existing) {
        demoUserIds[du.email] = existing.id;
      } else {
        const [created] = await db.insert(usersTable).values({
          name: du.name, email: du.email,
          passwordHash: hashPassword(du.password), role: du.role,
        }).returning();
        demoUserIds[du.email] = created!.id;
        report.demoUsers++;
      }
    }

    /* ── 2. Lecturer record for Professor Imumolen ── */
    const profUid = demoUserIds["prof.imumolen@uou.edu.ng"]!;
    const [existingLec] = await db.select().from(lecturersTable).where(eq(lecturersTable.userId, profUid));
    let lecturerId: number;
    if (existingLec) {
      lecturerId = existingLec.id;
    } else {
      const [lec] = await db.insert(lecturersTable).values({
        userId: profUid,
        staffId: "UOU-PROF-001",
        department: "Business & Entrepreneurship",
        specialization: "Entrepreneurship, Innovation Strategy",
        status: "active",
      }).returning();
      lecturerId = lec!.id;
      report.lecturers++;
    }

    /* ── 3. Courses ── */
    const courseIds: number[] = [];
    for (const c of COURSES_DATA) {
      const [existing] = await db.select().from(coursesTable).where(eq(coursesTable.code, c.code));
      if (existing) {
        courseIds.push(existing.id);
      } else {
        const [created] = await db.insert(coursesTable).values({ ...c, lecturerId }).returning();
        courseIds.push(created!.id);
        report.courses++;
      }
    }

    /* ── 4. Demo student (Amara) ── */
    const studentUid = demoUserIds["demo.student@uou.edu.ng"]!;
    const [existingDemoStu] = await db.select().from(studentsTable).where(eq(studentsTable.userId, studentUid));
    let demoStudentId: number;
    if (existingDemoStu) {
      demoStudentId = existingDemoStu.id;
    } else {
      const token = `UOU-${randHex(6)}-${randHex(6)}-${randHex(6)}`;
      const [s] = await db.insert(studentsTable).values({
        userId: studentUid,
        studentId: "UOU-ZR-DEMO-001",
        department: "Business & Entrepreneurship",
        level: "300",
        status: "active",
        gpa: 3.85,
        loginCount: 42,
        credentialToken: token,
        skills: "Entrepreneurship, Critical Thinking, Leadership, Innovation",
        lastLoginAt: new Date(),
      }).returning();
      demoStudentId = s!.id;
    }
    /* Enroll demo student in first two courses */
    const existingEnrollments = await db.select().from(enrollmentsTable)
      .where(eq(enrollmentsTable.studentId, demoStudentId));
    for (const cid of courseIds.slice(0, 2)) {
      if (!existingEnrollments.find(e => e.courseId === cid)) {
        await db.insert(enrollmentsTable).values({ studentId: demoStudentId, courseId: cid, grade: "A" });
        report.enrollments++;
      }
    }

    /* ── 5. 50 bulk students ── */
    const [{ count: existingCount }] = await db.select({ count: count() }).from(studentsTable);
    if (Number(existingCount) < 5) {
      for (let i = 0; i < 50; i++) {
        const name = NIGERIAN_NAMES[i % NIGERIAN_NAMES.length]!;
        const city = CITIES[i % 3]!;
        const dept = DEPARTMENTS[i % DEPARTMENTS.length]!;
        const level = LEVELS[i % LEVELS.length]!;
        const email = `student${i + 100}@uou.edu.ng`;

        const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.email, email));
        let uid: number;
        if (existingUser) {
          uid = existingUser.id;
        } else {
          const [u] = await db.insert(usersTable).values({
            name, email, passwordHash: hashPassword("Student@1234"), role: "student",
          }).returning();
          uid = u!.id;
        }

        const stuId = `UOU-${city.slice(0, 2).toUpperCase()}-${String(1000 + i).padStart(4, "0")}`;
        const [existingStu] = await db.select().from(studentsTable).where(eq(studentsTable.studentId, stuId));
        let studentDbId: number;
        if (existingStu) {
          studentDbId = existingStu.id;
        } else {
          const gpa = Math.round((2.4 + Math.random() * 1.6) * 100) / 100;
          const loginCount = Math.floor(5 + Math.random() * 80);
          const skillIdx = i % SKILLS_POOL.length;
          const skills = [
            SKILLS_POOL[skillIdx]!,
            SKILLS_POOL[(skillIdx + 1) % SKILLS_POOL.length]!,
            SKILLS_POOL[(skillIdx + 2) % SKILLS_POOL.length]!,
          ].join(", ");
          const token = `UOU-${randHex(6)}-${randHex(6)}-${randHex(6)}`;
          const [s] = await db.insert(studentsTable).values({
            userId: uid,
            studentId: stuId,
            department: dept,
            level,
            status: i % 20 === 0 ? "suspended" : "active",
            gpa,
            loginCount,
            credentialToken: token,
            skills,
            lastLoginAt: new Date(Date.now() - Math.random() * 30 * 86400000),
          }).returning();
          studentDbId = s!.id;
          report.students++;
        }

        /* Enroll in 1-3 courses */
        const courseCount = 1 + (i % 3);
        const stuEnrollments = await db.select().from(enrollmentsTable)
          .where(eq(enrollmentsTable.studentId, studentDbId));
        for (let ci = 0; ci < courseCount && ci < courseIds.length; ci++) {
          const cid = courseIds[(i + ci) % courseIds.length]!;
          if (!stuEnrollments.find(e => e.courseId === cid)) {
            const grades = ["A", "A", "B", "B", "C", "Ongoing"];
            await db.insert(enrollmentsTable).values({
              studentId: studentDbId,
              courseId: cid,
              grade: grades[Math.floor(Math.random() * grades.length)],
            });
            report.enrollments++;
          }
        }

        /* Gold Cards — 4-6 per student */
        const cardCount = 4 + (i % 3);
        for (let k = 0; k < cardCount; k++) {
          const keyHash = randHex(32);
          const courseId = courseIds[k % courseIds.length]!;
          const types = ["attendance", "exam", "test", "assignment"];
          try {
            await db.insert(lectureKeys).values({
              studentId: studentDbId,
              courseId,
              keyHash,
              keyType: types[k % 4]!,
              isClaimed: true,
              claimedAt: new Date(Date.now() - Math.random() * 60 * 86400000),
              expiresAt: new Date(Date.now() + 365 * 86400000),
            });
            report.goldCards++;
          } catch {
            /* skip duplicate */
          }
        }
      }
    }

    res.json({
      success: true,
      seeded: report,
      demoCredentials: [
        { role: "student",     email: "demo.student@uou.edu.ng",     password: "Demo@1234", redirectTo: "/student" },
        { role: "coordinator", email: "demo.coordinator@uou.edu.ng", password: "Demo@1234", redirectTo: "/coordinator" },
        { role: "lecturer",    email: "prof.imumolen@uou.edu.ng",    password: "Demo@1234", redirectTo: "/lecturer" },
        { role: "founder",     email: "admin.founder@uou.edu.ng",    password: "Demo@1234", redirectTo: "/founder" },
      ],
    });
  } catch (err) {
    console.error("Seed error:", err);
    res.status(500).json({ error: "Seeding failed", detail: String(err) });
  }
});

router.get("/seed/status", async (_req, res): Promise<void> => {
  const [{ count: students }] = await db.select({ count: count() }).from(studentsTable);
  const [{ count: courses }]  = await db.select({ count: count() }).from(coursesTable);
  const [{ count: cards }]    = await db.select({ count: count() }).from(lectureKeys);
  res.json({ students: Number(students), courses: Number(courses), goldCards: Number(cards) });
});

export default router;
