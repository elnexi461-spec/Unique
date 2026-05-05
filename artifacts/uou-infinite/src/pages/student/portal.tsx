import { useAuth } from "@/lib/auth-context";
import { useListEnrollments, useGetStudentCredential } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function StudentPortal() {
  const { user } = useAuth();
  
  // Simplified for prototype: we don't have the exact student ID mapping locally, 
  // relying on user context or fetching enrollments without explicit studentId filter
  const { data: enrollments } = useListEnrollments();

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="text-primary w-5 h-5" /> Current Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {enrollments?.length ? enrollments.map((enr) => (
                <div key={enr.id} className="flex justify-between items-center p-3 rounded-lg bg-background border border-border">
                  <span className="font-medium text-foreground">{enr.courseName}</span>
                  <span className="text-primary font-mono">{enr.grade || 'Ongoing'}</span>
                </div>
              )) : (
                <div className="text-center py-6 text-muted-foreground">No active courses.</div>
              )}
              <Link href="/student/courses">
                <Button className="w-full mt-4" variant="outline">Browse Course Catalog</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border bg-gradient-to-br from-card to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="text-primary w-5 h-5" /> Cryptographic Credential
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary mb-4 shadow-[0_0_20px_rgba(100,255,218,0.2)]">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <p className="text-center text-muted-foreground text-sm mb-6 max-w-[250px]">
              Access your verifiable Proof of Skill blockchain credential.
            </p>
            <Link href="/student/credential">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                View Credential Passport
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
