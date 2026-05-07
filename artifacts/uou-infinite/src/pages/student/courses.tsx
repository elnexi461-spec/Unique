import { useListCourses, useCreateEnrollment } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function StudentCourses() {
  const { data: courses } = useListCourses();
  const enrollMutation = useCreateEnrollment();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [enrolling, setEnrolling] = useState<number | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<number>>(new Set());

  const handleEnroll = async (courseId: number) => {
    if (!user) return;
    setEnrolling(courseId);
    try {
      await enrollMutation.mutateAsync({
        data: { courseId, studentId: user.id }
      });
      setEnrolledCourses(prev => new Set(prev).add(courseId));
      toast({ title: "Enrollment Successful", description: "You are now registered for this course." });
    } catch (e) {
      toast({ title: "Enrollment Failed", description: "Could not complete registration.", variant: "destructive" });
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Browse Courses</h1>
        <p className="text-muted-foreground mt-1">Available academic modules for the current semester</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course: any, i: number) => {
          const isEnrolled = enrolledCourses.has(course.id);
          
          return (
            <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`bg-card border-border h-full flex flex-col transition-all ${isEnrolled ? 'border-primary/50 bg-primary/5' : 'hover:border-primary/30'}`}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 font-mono">{course.code}</Badge>
                    <span className="text-xs font-medium bg-secondary px-2 py-1 rounded text-foreground">{course.credits} Credits</span>
                  </div>
                  <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {course.description || "In-depth exploration of advanced concepts in " + course.department + "."}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {course.department}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> Max {course.capacity}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border/50 mt-auto">
                  {isEnrolled ? (
                    <Button variant="outline" className="w-full bg-primary/10 text-primary border-primary/20 cursor-default hover:bg-primary/10 hover:text-primary">
                      <CheckCircle className="w-4 h-4 mr-2" /> Registered
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrolling === course.id}
                    >
                      {enrolling === course.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Enroll Now"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
