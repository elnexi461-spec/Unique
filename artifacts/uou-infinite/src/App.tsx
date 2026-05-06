import { Switch, Route, Router as WouterRouter } from "wouter";
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
import { useState } from "react";

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

import LecturerPortal from "@/pages/lecturer/portal";
import LecturerGrades from "@/pages/lecturer/grades";

import StudentPortal from "@/pages/student/portal";
import StudentCourses from "@/pages/student/courses";
import StudentCredential from "@/pages/student/credential";
import StudentGrades from "@/pages/student/grades";
import StudentTimetable from "@/pages/student/timetable";
import StudentLecture from "@/pages/student/lecture";

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

        <Route path="/lecturer" component={LecturerPortal} />
        <Route path="/lecturer/grades" component={LecturerGrades} />

        <Route path="/student" component={StudentPortal} />
        <Route path="/student/courses" component={StudentCourses} />
        <Route path="/student/credential" component={StudentCredential} />
        <Route path="/student/grades" component={StudentGrades} />
        <Route path="/student/timetable" component={StudentTimetable} />
        <Route path="/student/lecture/:courseId" component={StudentLecture} />

        <Route path="/verify/:token" component={VerifyPage} />
        <Route path="/admin/health" component={SystemHealth} />

        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  const [sentinelActive, setSentinelActive] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <ErrorBoundary>
            <AuthProvider>
              <AnnouncementTicker />
              <Router />
              <CommandMenu />
              <SentinelChat onActiveChange={setSentinelActive} />
              <SentinelPulse active={sentinelActive} label="UOU Sentinel Processing" />
            </AuthProvider>
          </ErrorBoundary>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
