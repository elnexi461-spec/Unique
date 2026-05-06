import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Trash2, Clock, MapPin, Video, Radio, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useListCourses } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

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

export default function CoordinatorTimetable() {
  const { token } = useAuth();
  const { data: courses } = useListCourses();
  const { toast } = useToast();
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    courseId: "",
    dayOfWeek: "1",
    startTime: "09:00",
    endTime: "11:00",
    hallLocation: "",
    meetLink: "",
    zoomLink: "",
    isOnline: false,
  });

  const fetchSlots = () => {
    if (!token) return;
    fetch(`${BASE}/api/timetable`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => Array.isArray(d) && setSlots(d))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSlots(); }, [token]);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const r = await fetch(`${BASE}/api/timetable`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, courseId: parseInt(form.courseId), dayOfWeek: parseInt(form.dayOfWeek) }),
      });
      if (r.ok) {
        toast({ title: "Timetable slot added" });
        setShowForm(false);
        fetchSlots();
        setForm({ courseId: "", dayOfWeek: "1", startTime: "09:00", endTime: "11:00", hallLocation: "", meetLink: "", zoomLink: "", isOnline: false });
      } else {
        const d = await r.json();
        toast({ title: "Failed", description: d.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    await fetch(`${BASE}/api/timetable/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setSlots(slots.filter(s => s.id !== id));
    toast({ title: "Slot removed" });
  };

  const byDay = DAYS.map((day, i) => ({
    day, idx: i,
    slots: slots.filter(s => s.dayOfWeek === i).sort((a, b) => a.startTime.localeCompare(b.startTime)),
  })).filter(d => d.slots.length > 0 || [1, 2, 3, 4, 5].includes(d.idx));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Sentinel Scheduler</h1>
          <p className="text-muted-foreground mt-1">Manage timetable — Zoom/Meet links auto-activate when sessions go live</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-background hover:bg-primary/90"
        >
          <Plus size={16} className="mr-2" /> Add Slot
        </Button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="bg-card border-primary/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="text-primary" size={18} /> New Timetable Slot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 col-span-2 md:col-span-1">
                    <Label>Course</Label>
                    <Select value={form.courseId} onValueChange={v => setForm(f => ({ ...f, courseId: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select course..." /></SelectTrigger>
                      <SelectContent>
                        {courses?.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.code} — {c.title}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Day</Label>
                    <Select value={form.dayOfWeek} onValueChange={v => setForm(f => ({ ...f, dayOfWeek: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DAYS.map((d, i) => <SelectItem key={i} value={String(i)}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Start Time</Label>
                    <Input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>End Time</Label>
                    <Input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Switch
                        checked={form.isOnline}
                        onCheckedChange={v => setForm(f => ({ ...f, isOnline: v }))}
                        id="is-online"
                      />
                      <Label htmlFor="is-online">Online Lecture</Label>
                    </div>
                    {form.isOnline ? (
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Google Meet URL" value={form.meetLink} onChange={e => setForm(f => ({ ...f, meetLink: e.target.value }))} />
                        <Input placeholder="Zoom URL" value={form.zoomLink} onChange={e => setForm(f => ({ ...f, zoomLink: e.target.value }))} />
                      </div>
                    ) : (
                      <Input placeholder="Hall / Location (e.g. LT-4, Block C)" value={form.hallLocation} onChange={e => setForm(f => ({ ...f, hallLocation: e.target.value }))} />
                    )}
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button onClick={handleCreate} disabled={saving || !form.courseId} className="bg-primary text-background hover:bg-primary/90">
                    {saving ? <Loader2 size={14} className="animate-spin mr-2" /> : null} Save Slot
                  </Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weekly Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading timetable...</div>
        ) : (
          [1, 2, 3, 4, 5].map(dayNum => {
            const daySlots = slots.filter(s => s.dayOfWeek === dayNum);
            return (
              <Card key={dayNum} className="bg-card border-border">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base text-foreground">{DAYS[dayNum]}</CardTitle>
                  <Badge variant="outline" className="font-mono text-xs">{daySlots.length} session{daySlots.length !== 1 ? "s" : ""}</Badge>
                </CardHeader>
                <CardContent>
                  {daySlots.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-2">No sessions scheduled</p>
                  ) : (
                    <div className="space-y-2">
                      {daySlots.map(slot => (
                        <motion.div
                          key={slot.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${slot.isLive ? "border-primary/50 bg-primary/5" : "border-border bg-background"}`}
                        >
                          {slot.isLive && (
                            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                              <Radio size={14} className="text-red-400" />
                            </motion.div>
                          )}
                          <div className="flex-1 flex items-center gap-4 flex-wrap">
                            <Badge variant="outline" className="font-mono text-primary border-primary/30 bg-primary/5 text-xs shrink-0">{slot.courseCode}</Badge>
                            <span className="text-sm font-medium text-foreground">{slot.courseName}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock size={11} /> {slot.startTime}–{slot.endTime}
                            </span>
                            {slot.isOnline ? (
                              <span className="text-xs text-primary flex items-center gap-1"><Video size={11} /> Online</span>
                            ) : (
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={11} /> {slot.hallLocation || "TBD"}</span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(slot.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
