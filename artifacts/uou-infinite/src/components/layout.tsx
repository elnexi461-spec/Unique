import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, Users, BookOpen, FileText, 
  Award, Activity, LogOut, Shield,
  Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on navigation on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  if (!user) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const navItems = [
    ...(user.role === "founder" ? [
      { label: "War Room", href: "/founder", icon: Shield }
    ] : []),
    ...(user.role === "coordinator" ? [
      { label: "Hub", href: "/coordinator", icon: LayoutDashboard },
      { label: "Students", href: "/coordinator/students", icon: Users },
      { label: "Lecturers", href: "/coordinator/lecturers", icon: BookOpen },
      { label: "Courses", href: "/coordinator/courses", icon: BookOpen },
      { label: "Admissions", href: "/coordinator/admissions", icon: FileText }
    ] : []),
    ...(user.role === "lecturer" ? [
      { label: "Portal", href: "/lecturer", icon: LayoutDashboard }
    ] : []),
    ...(user.role === "student" ? [
      { label: "Portal", href: "/student", icon: LayoutDashboard },
      { label: "Courses", href: "/student/courses", icon: BookOpen },
      { label: "Credential", href: "/student/credential", icon: Award }
    ] : []),
    { label: "System Health", href: "/admin/health", icon: Activity }
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile sidebar toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-md border border-border text-primary"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : 0 }}
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/">
            <div className="font-bold text-xl tracking-tight text-primary flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/50">
                <span className="text-primary text-sm">UOU</span>
              </div>
              Infinite
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Navigation</div>
          {navItems.map((item) => {
            const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/");
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-sidebar-accent text-primary font-medium' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-primary'
                }`}>
                  <Icon size={18} className={isActive ? "text-primary" : "text-muted-foreground"} />
                  {item.label}
                </div>
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-medium border border-primary/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-primary/70 capitalize">{user.role}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start text-muted-foreground border-border hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30" onClick={logout}>
            <LogOut size={16} className="mr-2" />
            End Session
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Subtle noise/grid overlay for vibe */}
        <div className="pointer-events-none fixed inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(circle at center, var(--primary) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
