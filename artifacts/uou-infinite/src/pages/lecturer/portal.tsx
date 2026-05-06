import { useListCourses, useListStudents } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, TrendingUp, Calendar } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Link } from "wouter";

export default function LecturerPortal() {
  const { user } = useAuth();
  const { data: courses } = useListCourses();
  const { data: students } = useListStudents();
  const myCourses = courses?.filter(c => c.lecturerId === user?.id) || courses?.slice(0, 3);

  const quickLinks = [
    { href: "/lecturer/grades", icon: TrendingUp, label: "Grade Entry", desc: "Record test, exam, and assignment scores" },
    { href: "/lecturer", icon: Calendar, label: "My Portal", desc: "Courses and student overview" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Lecturer Portal</h1>
        <p className="text-muted-foreground mt-1">Manage your courses and student grades</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((item, i) => (
          <motion.div key={item.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link href={item.href}>
              <div className="group cursor-pointer rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:bg-primary/5 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <item.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.label}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Active Courses
          </h2>
          {myCourses?.map((course, i) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3 flex flex-row justify-between items-start">
                  <div>
                    <Badge variant="outline" className="mb-2 text-primary border-primary/20 bg-primary/5 font-mono">{course.code}</Badge>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono">{course.credits} Credits</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Users className="w-3 h-3" /> {course.capacity} Max</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.description || "No description provided."}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {myCourses?.length === 0 && (
            <div className="text-center py-12 border border-dashed border-border rounded-xl text-muted-foreground">No assigned courses found.</div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Recent Students
          </h2>
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {students?.slice(0, 6).map((student) => (
                  <div key={student.id} className="p-4 flex items-center justify-between hover:bg-sidebar/50 transition-colors">
                    <div>
                      <div className="font-medium text-sm text-foreground">{student.name}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">{student.studentId}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase">{student.level}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
