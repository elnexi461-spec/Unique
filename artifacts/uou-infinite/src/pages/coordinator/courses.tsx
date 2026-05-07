import { useListCourses } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, PlusCircle } from "lucide-react";

export default function CourseCatalog() {
  const { data: courses } = useListCourses();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Course Catalog</h1>
          <p className="text-muted-foreground mt-1">Manage institutional course offerings</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <PlusCircle className="w-4 h-4 mr-2" /> Initialize Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses?.map((course: any, i: number) => {
          const enrolled = Math.floor(Math.random() * course.capacity);
          const percent = Math.round((enrolled / course.capacity) * 100);
          const isFull = percent > 90;

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="bg-card border-border hover:border-primary/40 transition-colors h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                      {course.code}
                    </div>
                    <div className="text-xs text-muted-foreground bg-sidebar px-2 py-1 rounded border border-border">
                      {course.credits} Credits
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{course.department}</p>
                </CardHeader>
                <CardContent className="mt-auto pt-4 border-t border-border/50">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" /> Capacity
                    </span>
                    <span className="font-mono">
                      {enrolled} / {course.capacity}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-sidebar overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isFull ? "bg-destructive" : "bg-primary"}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
