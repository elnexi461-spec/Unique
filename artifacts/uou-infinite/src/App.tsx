import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { ErrorBoundary } from "@/components/error-boundary";
import { AppLayout } from "@/components/layout";
import { CommandMenu } from "@/components/command-menu";
import { SentinelChat } from "@/components/sentinel-chat";
import { AnnouncementTicker } from "@/components/AnnouncementTicker";
import { SentinelPulse } from "@/components/SentinelPulse";
import { SocialProofTicker } from "@/components/SocialProofTicker";
import { NewsTicker } from "@/components/NewsTicker";
import { CinematicIntro } from "@/components/CinematicIntro";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";

import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";

import FounderPage from "@/pages/founder";
import CoordinatorHub from "@/pages/coordinator/hub";
import StudentsList from "@/pages/coordinator/students";
import LecturersList from "@/pages/coordinator/lecturers";
import CourseCatalog from "@/pages/coordinator/courses";
import AdmissionsPage from "@/pages/coordinator/admissions";
import CoordinatorTimetable from "@/pages/coordinator/timetable";
import CoordinatorUpload from "@/pages/coordinator/upload";

import LecturerPortal from "@/pages/lecturer/portal";
import LecturerGrades from "@/pages/lecturer/grades";
import LecturerUpload from "@/pages/lecturer/upload";
import LecturerAttendance from "@/pages/lecturer/attendance";
import LecturerAnalytics from "@/pages/lecturer/analytics";
import LecturerAnnouncements from "@/pages/lecturer/announcements";

import StudentPortal from "@/pages/student/portal";
import StudentCourses from "@/pages/student/courses";
import StudentCredential from "@/pages/student/credential";
import StudentGrades from "@/pages/student/grades";
import StudentTimetable from "@/pages/student/timetable";
import StudentLecture from "@/pages/student/lecture";
import AcademicCalendar from "@/pages/student/calendar";
import Notifications from "@/pages/student/notifications";
import FeeStatus from "@/pages/student/fees";
import Library from "@/pages/student/library";
import StudentIDCard from "@/pages/student/idcard";
import Appeals from "@/pages/student/appeals";
import VanguardGuardian from "@/pages/student/guardian";
import OnboardingPage from "@/pages/onboarding";
import GoldCardVault from "@/pages/student/vault";
import ScholarProfile from "@/pages/student/profile";
import { AmbientParticles } from "@/components/AmbientParticles";

import SystemHealth from "@/pages/admin/health";
import VerifyPage from "@/pages/verify";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />

        <Route path="/founder" component={FounderPage} />

        <Route path="/coordinator" component={CoordinatorHub} />
        <Route path="/coordinator/students" component={StudentsList} />
        <Route path="/coordinator/lecturers" component={LecturersList} />
        <Route path="/coordinator/courses" component={CourseCatalog} />
        <Route path="/coordinator/admissions" component={AdmissionsPage} />
        <Route path="/coordinator/timetable" component={CoordinatorTimetable} />
        <Route path="/coordinator/upload" component={CoordinatorUpload} />

        <Route path="/lecturer" component={LecturerPortal} />
        <Route path="/lecturer/grades" component={LecturerGrades} />
        <Route path="/lecturer/upload" component={LecturerUpload} />
        <Route path="/lecturer/attendance" component={LecturerAttendance} />
        <Route path="/lecturer/analytics" component={LecturerAnalytics} />
        <Route path="/lecturer/announcements" component={LecturerAnnouncements} />

        <Route path="/student" component={StudentPortal} />
        <Route path="/student/courses" component={StudentCourses} />
        <Route path="/student/credential" component={StudentCredential} />
        <Route path="/student/grades" component={StudentGrades} />
        <Route path="/student/timetable" component={StudentTimetable} />
        <Route path="/student/lecture/:courseId" component={StudentLecture} />
        <Route path="/student/calendar" component={AcademicCalendar} />
        <Route path="/student/notifications" component={Notifications} />
        <Route path="/student/fees" component={FeeStatus} />
        <Route path="/student/library" component={Library} />
        <Route path="/student/idcard" component={StudentIDCard} />
        <Route path="/student/appeals" component={Appeals} />
        <Route path="/student/guardian" component={VanguardGuardian} />
        <Route path="/student/vault" component={GoldCardVault} />
        <Route path="/student/profile" component={ScholarProfile} />

        <Route path="/onboarding" component={OnboardingPage} />
        <Route path="/verify/:token" component={VerifyPage} />
        <Route path="/admin/health" component={SystemHealth} />

        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

/* Track the current route in localStorage so the splash can restore it */
function RouteTracker() {
  const [location] = useLocation();
  useEffect(() => {
    if (
      location &&
      location !== "/" &&
      !location.startsWith("/login") &&
      !location.startsWith("/register")
    ) {
      localStorage.setItem("uou_last_path", location);
    }
  }, [location]);
  return null;
}

/* Global splash gate — shows on every hard refresh, restores saved path */
function GlobalSplash({ children }: { children: ReactNode }) {
  const [splashDone, setSplashDone] = useState(false);
  const [, setLocation] = useLocation();
  const savedPathRef = useRef<string | null>(localStorage.getItem("uou_last_path"));

  const handleComplete = useCallback(() => {
    setSplashDone(true);
    const p = savedPathRef.current;
    if (p && p !== "/" && !p.startsWith("/login") && !p.startsWith("/register")) {
      setTimeout(() => setLocation(p), 50);
    }
  }, [setLocation]);

  return (
    <>
      {children}
      <AnimatePresence>
        {!splashDone && (
          <CinematicIntro key="global-splash" onComplete={handleComplete} />
        )}
      </AnimatePresence>
    </>
  );
}

function AppShell() {
  const [sentinelActive, setSentinelActive] = useState(false);

  return (
    <GlobalSplash>
      <AuthProvider>
        <RouteTracker />
        <AmbientParticles />
        <AnnouncementTicker />
        <Router />
        <CommandMenu />
        <SentinelChat onActiveChange={setSentinelActive} />
        <SentinelPulse active={sentinelActive} label="UOU Sentinel Processing" />
        <SocialProofTicker />
        <NewsTicker />
      </AuthProvider>
    </GlobalSplash>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <ErrorBoundary>
            <AppShell />
          </ErrorBoundary>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
