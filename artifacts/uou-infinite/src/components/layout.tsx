import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Users, BookOpen, FileText,
  Award, Activity, LogOut, Shield,
  Menu, X, Calendar, TrendingUp, GraduationCap,
  Newspaper, Zap, Upload, Bell, CreditCard,
  IdCard, MessageSquare, Brain, Gem, User2,
  Cpu, ClipboardCheck, BarChart2, Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [location]);

  if (!user) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  // Hide sidebar entirely during lecture for integrity
  const isLecturePage = location.startsWith("/student/lecture");
  if (isLecturePage) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="pointer-events-none fixed inset-0 opacity-[0.025] z-0"
          style={{ backgroundImage: "radial-gradient(circle at center, #0070FF 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="p-4 md:p-8 z-10 relative">
          {children}
        </div>
      </div>
    );
  }

  const navItems = [
    ...(user.role === "founder" ? [
      { label: "War Room",         href: "/founder",                   icon: Shield },
      { label: "System Health",    href: "/admin/health",              icon: Activity },
    ] : []),
    ...(user.role === "coordinator" ? [
      { label: "Hub",              href: "/coordinator",               icon: LayoutDashboard },
      { label: "Students",         href: "/coordinator/students",      icon: Users },
      { label: "Lecturers",        href: "/coordinator/lecturers",     icon: GraduationCap },
      { label: "Courses",          href: "/coordinator/courses",       icon: BookOpen },
      { label: "Admissions",       href: "/coordinator/admissions",    icon: FileText },
      { label: "Timetable",        href: "/coordinator/timetable",     icon: Calendar },
    ] : []),
    ...(user.role === "lecturer" ? [
      { label: "Portal",           href: "/lecturer",                  icon: LayoutDashboard },
      { label: "Grades",           href: "/lecturer/grades",           icon: TrendingUp },
      { label: "AI Synthesis",     href: "/lecturer/upload",           icon: Cpu },
      { label: "Attendance",       href: "/lecturer/attendance",       icon: ClipboardCheck },
      { label: "Analytics",        href: "/lecturer/analytics",        icon: BarChart2 },
      { label: "Announcements",    href: "/lecturer/announcements",    icon: Megaphone },
    ] : []),
    ...(user.role === "student" ? [
      { label: "Portal",           href: "/student",                   icon: LayoutDashboard },
      { label: "My Courses",       href: "/student/courses",           icon: BookOpen },
      { label: "Grades & GPA",     href: "/student/grades",            icon: TrendingUp },
      { label: "Live Timetable",   href: "/student/timetable",         icon: Calendar },
      { label: "Identity Vault",   href: "/student/credential",        icon: Award },
      { label: "Academic Calendar",href: "/student/calendar",          icon: Newspaper },
      { label: "Notifications",    href: "/student/notifications",     icon: Bell },
      { label: "Fee Status",       href: "/student/fees",              icon: CreditCard },
      { label: "Library",          href: "/student/library",           icon: BookOpen },
      { label: "Student ID",       href: "/student/idcard",            icon: IdCard },
      { label: "Appeals",          href: "/student/appeals",           icon: MessageSquare },
      { label: "Vanguard Guardian",href: "/student/guardian",          icon: Brain },
      { label: "Gold Card Vault",  href: "/student/vault",             icon: Gem },
      { label: "My Profile",       href: "/student/profile",           icon: User2 },
    ] : []),
  ];

  const roleLabel: Record<string, string> = {
    founder: "Chancellor",
    coordinator: "Coordinator",
    lecturer: "Lecturer",
    student: "Scholar",
  };

  const roleColor: Record<string, string> = {
    founder: "#F59E0B",
    coordinator: "#34D399",
    lecturer: "#A78BFA",
    student: "#0070FF",
  };

  const color = roleColor[user.role] ?? "#0070FF";

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md border"
        style={{ background: "rgba(4,11,26,0.9)", borderColor: "rgba(0,112,255,0.3)", color: "#0070FF" }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 flex flex-col z-40 transition-transform duration-300 border-r ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{ background: "hsl(222 75% 5%)", borderColor: "rgba(0,112,255,0.12)" }}>

        {/* Brand */}
        <div className="p-5 border-b flex items-center gap-3" style={{ borderColor: "rgba(0,112,255,0.1)" }}>
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <motion.img src={import.meta.env.BASE_URL + "uou-logo.png"} alt="UOU"
                className="w-9 h-9 object-contain"
                style={{ filter: "drop-shadow(0 0 8px rgba(0,112,255,0.5))" }}
                whileHover={{ scale: 1.08 }}
              />
              <div>
                <div className="font-black text-white text-base leading-tight tracking-tight">UOU Infinite</div>
                <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "rgba(0,112,255,0.7)" }}>
                  Institutional OS
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Live indicator */}
        <div className="mx-4 mt-3 px-3 py-2 rounded-lg flex items-center gap-2 border"
          style={{ background: "rgba(0,112,255,0.06)", borderColor: "rgba(0,112,255,0.15)" }}>
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#0070FF" }} />
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Sentinel Active
          </span>
          <Zap size={10} className="text-primary ml-auto" />
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-0.5">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 px-2">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = location === item.href || (location.startsWith(item.href + "/") && item.href !== "/");
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 3 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer relative group`}
                  style={{
                    background: isActive ? `rgba(0,112,255,0.12)` : "transparent",
                    borderLeft: isActive ? `2px solid ${color}` : "2px solid transparent",
                  }}
                >
                  <Icon size={16} style={{ color: isActive ? color : "rgba(148,163,184,0.7)" }} />
                  <span className="text-sm font-medium" style={{ color: isActive ? "#F0F9FF" : "rgba(148,163,184,0.8)" }}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div layoutId="nav-active"
                      className="absolute right-2 w-1 h-1 rounded-full"
                      style={{ background: color }} />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* User card */}
        <div className="p-4 border-t" style={{ borderColor: "rgba(0,112,255,0.1)" }}>
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black border shrink-0"
              style={{ background: `${color}15`, borderColor: `${color}30`, color }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user.name}</div>
              <div className="text-[10px] font-mono truncate" style={{ color: "rgba(148,163,184,0.6)" }}>
                {(user as any).email || ""}
              </div>
              <div className="text-[9px] font-mono uppercase tracking-wider mt-0.5" style={{ color }}>
                {roleLabel[user.role] ?? user.role}
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={logout}
            className="w-full justify-start text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-all"
            style={{ borderColor: "rgba(0,112,255,0.15)", height: 34 }}>
            <LogOut size={13} className="mr-2" /> End Session
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="pointer-events-none fixed inset-0 opacity-[0.025] z-0"
          style={{ backgroundImage: "radial-gradient(circle at center, #0070FF 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
