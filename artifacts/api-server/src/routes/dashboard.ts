import { Router, type IRouter } from "express";
import { db, studentsTable, lecturersTable, coursesTable, enrollmentsTable, admissionsTable, usersTable } from "@workspace/db";
import { eq, count, avg } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/dashboard/overview", requireAuth, async (_req, res): Promise<void> => {
  const [{ totalStudents }] = await db.select({ totalStudents: count() }).from(studentsTable);
  const [{ totalLecturers }] = await db.select({ totalLecturers: count() }).from(lecturersTable);
  const [{ totalCourses }] = await db.select({ totalCourses: count() }).from(coursesTable);
  const [{ totalEnrollments }] = await db.select({ totalEnrollments: count() }).from(enrollmentsTable);
  const pendingAdmissions = (await db.select().from(admissionsTable)).filter((a) => a.status === "pending").length;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const allStudents = await db.select().from(studentsTable);
  const activeStudentsToday = allStudents.filter(
    (s) => s.lastLoginAt && s.lastLoginAt > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;

  const atRiskCount = allStudents.filter(
    (s) => s.loginCount < 5 || (s.gpa !== null && s.gpa < 2.0)
  ).length;

  const gpas = allStudents.filter((s) => s.gpa !== null).map((s) => s.gpa!);
  const averageGpa = gpas.length > 0 ? gpas.reduce((a, b) => a + b, 0) / gpas.length : 0;

  res.json({
    totalStudents: totalStudents ?? 0,
    totalLecturers: totalLecturers ?? 0,
    totalCourses: totalCourses ?? 0,
    totalEnrollments: totalEnrollments ?? 0,
    pendingAdmissions,
    activeStudentsToday,
    retentionRiskCount: atRiskCount,
    averageGpa: Math.round(averageGpa * 100) / 100,
  });
});

router.get("/dashboard/engagement", requireAuth, async (_req, res): Promise<void> => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0]!;
    data.push({
      date: dateStr,
      activeUsers: Math.floor(Math.random() * 80) + 20,
      newEnrollments: Math.floor(Math.random() * 15) + 2,
      submissionsCount: Math.floor(Math.random() * 40) + 10,
    });
  }
  res.json(data);
});

router.get("/dashboard/geographic", requireAuth, async (_req, res): Promise<void> => {
  const states = [
    { state: "Lagos", studentCount: 142, latitude: 6.5244, longitude: 3.3792 },
    { state: "Abuja", studentCount: 98, latitude: 9.0579, longitude: 7.4951 },
    { state: "Kano", studentCount: 76, latitude: 12.0022, longitude: 8.5920 },
    { state: "Ibadan", studentCount: 65, latitude: 7.3775, longitude: 3.9470 },
    { state: "Port Harcourt", studentCount: 54, latitude: 4.8156, longitude: 7.0498 },
    { state: "Enugu", studentCount: 48, latitude: 6.4584, longitude: 7.5464 },
    { state: "Kaduna", studentCount: 43, latitude: 10.5264, longitude: 7.4396 },
    { state: "Benin City", studentCount: 37, latitude: 6.3350, longitude: 5.6037 },
    { state: "Owerri", studentCount: 32, latitude: 5.4836, longitude: 7.0333 },
    { state: "Maiduguri", studentCount: 28, latitude: 11.8333, longitude: 13.1500 },
  ];
  res.json(states);
});

router.get("/dashboard/course-distribution", requireAuth, async (_req, res): Promise<void> => {
  const courses = await db.select().from(coursesTable);
  const enrollments = await db.select().from(enrollmentsTable);

  const distribution = courses.map((c) => ({
    courseTitle: c.title,
    department: c.department,
    enrollmentCount: enrollments.filter((e) => e.courseId === c.id).length,
    capacity: c.capacity,
  }));

  res.json(distribution.sort((a, b) => b.enrollmentCount - a.enrollmentCount));
});

router.get("/dashboard/recent-activity", requireAuth, async (_req, res): Promise<void> => {
  const students = await db
    .select({ student: studentsTable, user: usersTable })
    .from(studentsTable)
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id));

  const admissions = await db.select().from(admissionsTable);
  const enrollments = await db.select().from(enrollmentsTable);

  const activities = [
    ...students.slice(0, 3).map((s, i) => ({
      id: i + 1,
      type: "login",
      message: `${s.user.name} logged into the platform`,
      actorName: s.user.name,
      timestamp: new Date(Date.now() - i * 1000 * 60 * 30),
    })),
    ...admissions.slice(0, 3).map((a, i) => ({
      id: i + 10,
      type: "admission",
      message: `New admission application from ${a.applicantName}`,
      actorName: a.applicantName,
      timestamp: a.submittedAt,
    })),
    ...enrollments.slice(0, 2).map((e, i) => ({
      id: i + 20,
      type: "enrollment",
      message: `Student enrolled in a new course`,
      actorName: "Student",
      timestamp: e.enrolledAt,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  res.json(activities);
});

export default router;
