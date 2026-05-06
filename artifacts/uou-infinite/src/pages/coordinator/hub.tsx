import { useGetDashboardOverview } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, FileText, ArrowRight, UserPlus, BookPlus, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CoordinatorHub() {
  const { data: overview } = useGetDashboardOverview();

  const sections = [
    { title: "Manage Students", desc: "View and filter student roster", href: "/coordinator/students", icon: Users, count: overview?.totalStudents || 0 },
    { title: "Manage Lecturers", desc: "Department allocations and assignments", href: "/coordinator/lecturers", icon: UserPlus, count: overview?.totalLecturers || 0 },
    { title: "Course Catalog", desc: "Create and edit course offerings", href: "/coordinator/courses", icon: BookPlus, count: overview?.totalCourses || 0 },
    { title: "Admissions Pipeline", desc: "AI-assisted application review", href: "/coordinator/admissions", icon: FileText, count: overview?.pendingAdmissions || 0, badge: "Pending" },
    { title: "Sentinel Scheduler", desc: "Timetable with auto-activating live links", href: "/coordinator/timetable", icon: Calendar, count: 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Coordinator Hub</h1>
        <p className="text-muted-foreground mt-1">Manage institutional resources and academic flow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((sec, i) => (
          <motion.div
            key={sec.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-card border-border hover:border-primary/50 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <sec.icon className="w-32 h-32 text-primary" />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded bg-primary/10 text-primary">
                      <sec.icon size={20} />
                    </div>
                    {sec.title}
                  </div>
                  {sec.badge && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {sec.count} {sec.badge}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground mb-6">{sec.desc}</p>
                <div className="flex items-center justify-between">
                  {sec.count > 0 || sec.badge ? (
                    <div className="text-2xl font-bold text-foreground">{sec.count} <span className="text-sm font-normal text-muted-foreground">total</span></div>
                  ) : <div />}
                  <Link href={sec.href}>
                    <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                      Access <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
