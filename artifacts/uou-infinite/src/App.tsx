import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { ErrorBoundary } from "@/components/error-boundary";
import { AppLayout } from "@/components/layout";
import { CommandMenu } from "@/components/command-menu";
import { SentinelChat } from "@/components/sentinel-chat";

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
import LecturerPortal from "@/pages/lecturer/portal";
import StudentPortal from "@/pages/student/portal";
import StudentCourses from "@/pages/student/courses";
import StudentCredential from "@/pages/student/credential";
import SystemHealth from "@/pages/admin/health";
import VerifyPage from "@/pages/verify";

const queryClient = new QueryClient();

// Placeholder for unbuilt pages
function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center p-12 border border-border rounded-2xl bg-card">
        <h1 className="text-3xl font-bold text-primary mb-4">{title}</h1>
        <p className="text-muted-foreground">This command center module is initializing...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        
        {/* Active Routes */}
        <Route path="/founder" component={FounderPage} />
        <Route path="/coordinator" component={CoordinatorHub} />
        <Route path="/coordinator/students" component={StudentsList} />
        <Route path="/coordinator/lecturers" component={LecturersList} />
        <Route path="/coordinator/courses" component={CourseCatalog} />
        <Route path="/coordinator/admissions" component={AdmissionsPage} />
        <Route path="/lecturer" component={LecturerPortal} />
        <Route path="/student" component={StudentPortal} />
        <Route path="/student/courses" component={StudentCourses} />
        <Route path="/student/credential" component={StudentCredential} />
        <Route path="/verify/:token" component={VerifyPage} />
        <Route path="/admin/health" component={SystemHealth} />
        
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <ErrorBoundary>
            <AuthProvider>
              <Router />
              <CommandMenu />
              <SentinelChat />
            </AuthProvider>
          </ErrorBoundary>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
