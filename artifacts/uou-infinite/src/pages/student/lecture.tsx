import { useParams } from "wouter";
import { motion } from "framer-motion";
import { AntiCheatPlayer } from "@/components/AntiCheatPlayer";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "wouter";
import { useListCourses } from "@workspace/api-client-react";

export default function StudentLecture() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: courses } = useListCourses();
  const course = courses?.find(c => String(c.id) === courseId);

  // Demo video - Big Buck Bunny (open source)
  const DEMO_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/student/timetable">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Back to Timetable
          </button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {course?.title || `Course ${courseId} Lecture`}
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Shield size={14} className="text-primary" />
            Anti-cheat engine active — complete the lecture to generate your attendance key
          </p>
        </div>

        {/* Anti-cheat notice */}
        <div
          className="rounded-xl p-4 border text-sm flex items-start gap-3"
          style={{ background: "rgba(100,255,218,0.05)", borderColor: "rgba(100,255,218,0.2)" }}
        >
          <Shield size={16} className="text-primary mt-0.5 shrink-0" />
          <div className="space-y-1">
            <div className="font-semibold text-primary">Academic Integrity Notice</div>
            <p className="text-muted-foreground">
              This lecture is monitored. Rewind is permitted — forward-skipping is disabled.
              Watch 100% of the video to receive your attendance key. Paste the key in the claim box to record your attendance.
            </p>
          </div>
        </div>

        <AntiCheatPlayer
          src={DEMO_VIDEO}
          courseId={parseInt(courseId || "1")}
          title={course?.title || `Lecture — Course ${courseId}`}
          keyType="attendance"
        />
      </motion.div>
    </div>
  );
}
