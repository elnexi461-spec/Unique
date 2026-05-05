import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { 
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, 
  CommandItem, CommandList, CommandSeparator 
} from "@/components/ui/command";
import { 
  LayoutDashboard, Users, BookOpen, FileText, 
  Award, Activity, LogOut, Shield, Search,
  TerminalSquare
} from "lucide-react";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!user) return null;

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {user.role === "founder" && (
          <CommandGroup heading="Founder">
            <CommandItem onSelect={() => runCommand(() => setLocation("/founder"))}>
              <Shield className="mr-2 h-4 w-4 text-primary" />
              <span>War Room Dashboard</span>
            </CommandItem>
          </CommandGroup>
        )}

        {user.role === "coordinator" && (
          <CommandGroup heading="Coordinator">
            <CommandItem onSelect={() => runCommand(() => setLocation("/coordinator"))}>
              <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
              <span>Coordinator Hub</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setLocation("/coordinator/students"))}>
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span>Manage Students</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setLocation("/coordinator/lecturers"))}>
              <BookOpen className="mr-2 h-4 w-4 text-primary" />
              <span>Manage Lecturers</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setLocation("/coordinator/courses"))}>
              <BookOpen className="mr-2 h-4 w-4 text-primary" />
              <span>Course Catalog</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setLocation("/coordinator/admissions"))}>
              <FileText className="mr-2 h-4 w-4 text-primary" />
              <span>Admissions</span>
            </CommandItem>
          </CommandGroup>
        )}

        {user.role === "lecturer" && (
          <CommandGroup heading="Lecturer">
            <CommandItem onSelect={() => runCommand(() => setLocation("/lecturer"))}>
              <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
              <span>Lecturer Portal</span>
            </CommandItem>
          </CommandGroup>
        )}

        {user.role === "student" && (
          <CommandGroup heading="Student">
            <CommandItem onSelect={() => runCommand(() => setLocation("/student"))}>
              <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
              <span>Student Portal</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setLocation("/student/courses"))}>
              <BookOpen className="mr-2 h-4 w-4 text-primary" />
              <span>Browse Courses</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setLocation("/student/credential"))}>
              <Award className="mr-2 h-4 w-4 text-primary" />
              <span>View Credential</span>
            </CommandItem>
          </CommandGroup>
        )}

        <CommandSeparator />
        
        <CommandGroup heading="System">
          <CommandItem onSelect={() => runCommand(() => setLocation("/admin/health"))}>
            <Activity className="mr-2 h-4 w-4 text-primary" />
            <span>System Health</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setLocation("/"))}>
            <TerminalSquare className="mr-2 h-4 w-4 text-primary" />
            <span>Terminal Start</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => logout())}>
            <LogOut className="mr-2 h-4 w-4 text-destructive" />
            <span className="text-destructive">End Session</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
