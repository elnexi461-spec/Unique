import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Users, BookOpen, GraduationCap } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LandingPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (user) {
    // Redirect based on role if already logged in
    switch (user.role) {
      case "founder": setLocation("/founder"); break;
      case "coordinator": setLocation("/coordinator"); break;
      case "lecturer": setLocation("/lecturer"); break;
      case "student": setLocation("/student"); break;
      default: break;
    }
    return null;
  }

  const roles = [
    { title: "Founder", icon: Shield, desc: "Command center for institutional KPIs", role: "founder" },
    { title: "Coordinator", icon: Users, desc: "Manage students, lecturers, and courses", role: "coordinator" },
    { title: "Lecturer", icon: BookOpen, desc: "Manage courses and grades", role: "lecturer" },
    { title: "Student", icon: GraduationCap, desc: "Access courses, grades, and credentials", role: "student" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />
      
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mb-12"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/50 mb-6 shadow-[0_0_40px_rgba(100,255,218,0.3)]">
            <span className="text-primary font-bold text-3xl">UOU</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
            Institutional <span className="text-primary">Operating System</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            A premium, high-density command center for Unique Open University. Precise, fluid, and powerful.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mb-12"
        >
          {roles.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="bg-card border border-border p-6 rounded-xl hover:border-primary/50 transition-colors group cursor-pointer"
              onClick={() => setLocation(`/register?role=${r.role}`)}
            >
              <r.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold mb-2">{r.title}</h3>
              <p className="text-sm text-muted-foreground">{r.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-4"
        >
          <Link href="/login">
            <Button size="lg" className="w-40 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(100,255,218,0.2)]">
              Begin Session
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" className="w-40 border-primary/50 text-primary hover:bg-primary/10">
              Initialize
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
