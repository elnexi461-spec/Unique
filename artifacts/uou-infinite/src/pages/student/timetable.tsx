import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Video, Wifi, WifiOff, ExternalLink, Radio } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface TimetableSlot {
  id: number;
  courseId: number;
  courseName: string;
  courseCode: string;
  dayName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  hallLocation: string | null;
  meetLink: string | null;
  zoomLink: string | null;
  isOnline: boolean;
  isLive: boolean;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function StudentTimetable() {
  const { token } = useAuth();
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/api/timetable`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => Array.isArray(d) && setSlots(d))
      .finally(() => setLoading(false));
  }, [token]);

  // Update clock every minute for live status
  useEffect(() => {
    const t = setInterval(() => {
      setNow(new Date());
      // Refresh timetable data to update isLive
      if (!token) return;
      fetch(`${BASE}/api/timetable`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => Array.isArray(d) && setSlots(d));
    }, 60000);
    return () => clearInterval(t);
  }, [token]);

  const today = now.getDay();
  const todaySlots = slots.filter(s => s.dayOfWeek === today);
  const upcomingSlots = slots.filter(s => s.dayOfWeek !== today);
  const liveSlots = slots.filter(s => s.isLive);

  const SlotCard = ({ slot }: { slot: TimetableSlot }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 transition-all ${slot.isLive ? "border-primary/60 bg-primary/5" : "border-border bg-card"}`}
      style={slot.isLive ? { boxShadow: "0 0 20px rgba(0,112,255,0.18)" } : {}}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="outline" className="font-mono text-primary border-primary/30 bg-primary/5 text-xs">
              {slot.courseCode}
            </Badge>
            {slot.isLive && (
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-400/10 border border-red-400/30 px-2 py-0.5 rounded-full"
              >
                <Radio size={10} /> LIVE NOW
              </motion.div>
            )}
          </div>
          <h4 className="font-semibold text-foreground mb-2">{slot.courseName}</h4>
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="text-primary" />
              {slot.startTime} – {slot.endTime}
            </span>
            {slot.isOnline ? (
              <span className="flex items-center gap-1.5 text-primary">
                <Wifi size={12} /> Online
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <MapPin size={12} /> {slot.hallLocation || "TBD"}
              </span>
            )}
          </div>
        </div>

        {/* Show Zoom/Meet links only when live */}
        <div className="shrink-0">
          {slot.isLive && slot.isOnline && (slot.meetLink || slot.zoomLink) ? (
            <div className="flex flex-col gap-2">
              {slot.meetLink && (
                <a href={slot.meetLink} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white">
                    <Video size={12} className="mr-1" /> Meet
                  </Button>
                </a>
              )}
              {slot.zoomLink && (
                <a href={slot.zoomLink} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="h-8 text-xs bg-[#2D8CFF] hover:bg-[#2D8CFF]/90 text-white">
                    <ExternalLink size={12} className="mr-1" /> Zoom
                  </Button>
                </a>
              )}
            </div>
          ) : slot.isLive && !slot.isOnline ? (
            <div className="text-xs font-medium text-primary bg-primary/10 border border-primary/30 rounded-lg px-3 py-2 text-center">
              <MapPin size={12} className="inline mb-0.5 mr-1" />
              {slot.hallLocation || "Report to campus"}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <WifiOff size={12} />
              {slot.isOnline ? "Link active when live" : "Physical lecture"}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Timetable</h1>
          <p className="text-muted-foreground mt-1">Sentinel Scheduler — live links auto-activate during your sessions</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-mono text-primary">{now.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "short" })}</div>
          <div className="text-xs font-mono text-muted-foreground">{now.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
      </div>

      {/* Live Now Banner */}
      <AnimatePresence>
        {liveSlots.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl p-4 border"
            style={{ background: "rgba(59,130,246,0.08)", borderColor: "rgba(59,130,246,0.4)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2.5 h-2.5 rounded-full bg-red-400"
              />
              <span className="text-sm font-bold text-primary">{liveSlots.length} lecture{liveSlots.length > 1 ? "s" : ""} in progress now</span>
            </div>
            <div className="space-y-2">
              {liveSlots.map(slot => <SlotCard key={slot.id} slot={slot} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Today's Schedule */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock size={18} className="text-primary" /> Today — {DAYS[today]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-muted-foreground text-sm text-center py-4">Loading timetable...</div>
          ) : todaySlots.length > 0 ? (
            <div className="space-y-3">
              {todaySlots.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(slot => (
                <SlotCard key={slot.id} slot={slot} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No lectures scheduled for today. Enjoy your day!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full Weekly View */}
      {[1, 2, 3, 4, 5].filter(d => d !== today).map(dayNum => {
        const daySlots = slots.filter(s => s.dayOfWeek === dayNum);
        if (!daySlots.length) return null;
        return (
          <Card key={dayNum} className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-muted-foreground">{DAYS[dayNum]}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {daySlots.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(slot => (
                  <SlotCard key={slot.id} slot={slot} />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
