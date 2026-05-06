import { useAuth } from "@/lib/auth-context";
import { useListEnrollments } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, Activity, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function StudentPortal() {
  const { user } = useAuth();
  const { data: enrollments } = useListEnrollments();

  const quickLinks = [
    { href: "/student/grades", icon: TrendingUp, label: "View Grades & GPA", desc: "AI-powered academic report" },
    { href: "/student/timetable", icon: Calendar, label: "My Timetable", desc: "Live lecture schedule & links" },
    { href: "/student/courses", icon: BookOpen, label: "Course Browser", desc: "Browse & enroll in courses" },
    { href: "/student/credential", icon: Award, label: "Credential Passport", desc: "Cryptographic proof of skill" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground mt-1">Student Academic Portal</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
          <Activity size={16} className="animate-pulse" /> Status: Active
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((item, i) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={item.href}>
              <div className="group cursor-pointer rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:bg-primary/5 transition-all h-full">
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

      {/* Current Enrollments */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="text-primary w-5 h-5" /> Current Enrollments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {enrollments?.length ? enrollments.map((enr) => (
              <div key={enr.id} className="flex justify-between items-center p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors">
                <span className="font-medium text-foreground">{enr.courseName}</span>
                <span className="text-primary font-mono text-sm">{enr.grade || "Ongoing"}</span>
              </div>
            )) : (
              <div className="text-center py-6 text-muted-foreground">
                <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">No active courses yet.</p>
              </div>
            )}
            <Link href="/student/courses">
              <Button className="w-full mt-2" variant="outline">Browse Course Catalog</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
