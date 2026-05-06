import { useGetDashboardOverview, useGetDashboardRecentActivity, useGetDashboardEngagement, useGetDashboardCourseDistribution, useGetDashboardGeographic } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, BookOpen, GraduationCap, AlertTriangle, Activity, Zap, RefreshCw, Upload, Megaphone, Loader2, CheckCircle, Radio, Shield } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface LiveEvent {
  type: string;
  message?: string;
  studentName?: string;
  courseId?: number;
  keyType?: string;
  claimedAt?: string;
  prunedKeys?: number;
  timestamp: string;
}

export default function FounderPage() {
  const { data: overview } = useGetDashboardOverview();
  const { data: recentActivity } = useGetDashboardRecentActivity();
  const { data: engagement } = useGetDashboardEngagement();
  const { data: courseDistribution } = useGetDashboardCourseDistribution();
  const { data: geographic } = useGetDashboardGeographic();
  const { token } = useAuth();
  const { toast } = useToast();

  // Red Switch state
  const [redSwitchActive, setRedSwitchActive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshResult, setRefreshResult] = useState<{ prunedKeys: number; timestamp: string } | null>(null);

  // Live Feed SSE
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);

  // Announcement form
  const [announcement, setAnnouncement] = useState({ title: "", body: "", priority: "normal" });
  const [posting, setPosting] = useState(false);

  // Data Bridge / Import
  const [importMode, setImportMode] = useState<"csv" | "json" | "url">("csv");
  const [importJson, setImportJson] = useState("");
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; errors: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) return;
    const es = new EventSource(`${BASE}/api/system/live-feed`);
    es.onmessage = (e) => {
      try {
        const payload: LiveEvent = JSON.parse(e.data);
        setLiveEvents(prev => [payload, ...prev].slice(0, 50));
        if (feedRef.current) feedRef.current.scrollTop = 0;
      } catch {}
    };
    return () => es.close();
  }, [token]);

  const handleRedSwitch = async () => {
    setRefreshing(true);
    setRedSwitchActive(true);
    try {
      const r = await fetch(`${BASE}/api/system/red-switch`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json();
      if (r.ok) {
        setRefreshResult({ prunedKeys: data.prunedKeys, timestamp: data.timestamp });
        toast({ title: "Hard System Refresh Complete", description: `${data.prunedKeys} expired keys pruned. System re-initialized.` });
      } else {
        toast({ title: "Refresh failed", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    }
    setRefreshing(false);
    setTimeout(() => setRedSwitchActive(false), 2000);
  };

  const handleAnnouncement = async () => {
    setPosting(true);
    try {
      const r = await fetch(`${BASE}/api/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(announcement),
      });
      if (r.ok) {
        toast({ title: "Announcement broadcast!", description: "All active dashboards will receive this in real time." });
        setAnnouncement({ title: "", body: "", priority: "normal" });
      }
    } catch {}
    setPosting(false);
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      let r: Response;
      if (importMode === "file" || importMode === "csv") {
        const fd = new FormData();
        if (fileRef.current?.files?.[0]) fd.append("file", fileRef.current.files[0]);
        r = await fetch(`${BASE}/api/import/students`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
      } else if (importMode === "json") {
        const fd = new FormData();
        fd.append("json", importJson);
        r = await fetch(`${BASE}/api/import/students`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
      } else {
        const fd = new FormData();
        fd.append("url", importUrl);
        r = await fetch(`${BASE}/api/import/students`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
      }
      const data = await r.json();
      setImportResult({ imported: data.imported, errors: data.errors });
      toast({ title: `Imported ${data.imported} students`, description: `${data.errors} rows skipped.` });
    } catch {
      toast({ title: "Import failed", variant: "destructive" });
    }
    setImporting(false);
  };

  const kpis = overview ? [
    { title: "Total Students", value: overview.totalStudents, icon: Users },
    { title: "Active Lecturers", value: overview.totalLecturers, icon: GraduationCap },
    { title: "Active Courses", value: overview.totalCourses, icon: BookOpen },
    { title: "At-Risk Students", value: overview.retentionRiskCount, icon: AlertTriangle, color: "text-destructive" },
  ] : [];

  const COLORS = ["#64FFDA", "#48b89f", "#2d7a6a", "#143d35", "#0a1e1a"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Founder's War Room</h1>
        <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
          <Activity size={16} className="animate-pulse" /> Live Telemetry
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                <kpi.icon className={`h-4 w-4 ${kpi.color || "text-primary"}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{kpi.value.toLocaleString()}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Red Switch + Live Feed row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Red Switch */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap size={18} className="text-red-400" /> Manual Overdrive
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 py-4">
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                Trigger a Hard System Refresh — clears expired keys, re-initializes server state, and logs the event.
              </p>

              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={handleRedSwitch}
                disabled={refreshing}
                className="relative w-24 h-24 rounded-full flex flex-col items-center justify-center font-bold text-sm transition-all border-4 focus:outline-none"
                style={{
                  background: redSwitchActive
                    ? "radial-gradient(circle, #dc2626, #7f1d1d)"
                    : "radial-gradient(circle, #1a0505, #0a0202)",
                  borderColor: redSwitchActive ? "#ef4444" : "#7f1d1d",
                  boxShadow: redSwitchActive
                    ? "0 0 40px rgba(239,68,68,0.8), 0 0 80px rgba(239,68,68,0.4)"
                    : "0 0 15px rgba(127,29,29,0.4)",
                  color: "#fca5a5",
                }}
                animate={redSwitchActive ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {refreshing ? <Loader2 size={24} className="animate-spin" /> : <RefreshCw size={24} />}
                <span className="text-xs mt-1 font-mono">{refreshing ? "RUNNING" : "OVERRIDE"}</span>
              </motion.button>

              {refreshResult && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-center text-muted-foreground bg-background/50 rounded-lg p-2 border border-border"
                >
                  <CheckCircle size={12} className="inline mr-1 text-primary" />
                  Pruned {refreshResult.prunedKeys} keys · {new Date(refreshResult.timestamp).toLocaleTimeString()}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Feed SSE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="bg-card border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Radio size={16} className="text-red-400 animate-pulse" /> Live Activity Feed
              </CardTitle>
              <div className="text-xs font-mono text-muted-foreground">{liveEvents.length} events</div>
            </CardHeader>
            <CardContent>
              <div
                ref={feedRef}
                className="h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin"
                style={{ scrollbarColor: "rgba(100,255,218,0.2) transparent" }}
              >
                {liveEvents.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    <Radio size={16} className="mr-2 animate-pulse" /> Listening for events...
                  </div>
                ) : (
                  liveEvents.map((ev, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-2 p-2 rounded-lg bg-background border border-border/50 text-xs"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{
                          background:
                            ev.type === "key_claimed" ? "#64FFDA" :
                            ev.type === "system_refresh" ? "#ef4444" :
                            ev.type === "midnight_scan" ? "#f59e0b" : "#888",
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-foreground">
                          {ev.type === "key_claimed" ? `${ev.studentName} claimed ${ev.keyType} key` :
                           ev.type === "system_refresh" ? ev.message :
                           ev.type === "midnight_scan" ? ev.message : ev.message || ev.type}
                        </span>
                      </div>
                      <span className="font-mono text-muted-foreground shrink-0">
                        {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : ""}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-lg">Engagement Timeseries</CardTitle></CardHeader>
            <CardContent className="h-[260px]">
              {engagement && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagement}>
                    <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: "#0A192F", borderColor: "#64FFDA" }} />
                    <Line type="monotone" dataKey="activeUsers" stroke="#64FFDA" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="newEnrollments" stroke="#888888" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-lg">Course Distribution</CardTitle></CardHeader>
            <CardContent className="h-[260px]">
              {courseDistribution && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={courseDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="enrollmentCount">
                      {courseDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: "#0A192F", borderColor: "#64FFDA" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-lg">Geographic Distribution</CardTitle></CardHeader>
            <CardContent className="h-[260px]">
              {geographic && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={geographic}>
                    <XAxis dataKey="state" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: "#0A192F", borderColor: "#64FFDA" }} />
                    <Bar dataKey="studentCount" fill="#64FFDA" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Announcement Hub + Data Bridge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Announcement Hub */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Megaphone size={18} className="text-primary" /> Announcement Hub
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  placeholder="e.g. Semester exams postponed by one week"
                  value={announcement.title}
                  onChange={e => setAnnouncement(a => ({ ...a, title: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Message</Label>
                <Textarea
                  placeholder="Write your announcement here..."
                  className="resize-none h-20"
                  value={announcement.body}
                  onChange={e => setAnnouncement(a => ({ ...a, body: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                {["normal", "urgent", "breaking"].map(p => (
                  <button
                    key={p}
                    onClick={() => setAnnouncement(a => ({ ...a, priority: p }))}
                    className="text-xs px-3 py-1.5 rounded-lg border font-medium capitalize transition-all"
                    style={{
                      background: announcement.priority === p ? "rgba(100,255,218,0.15)" : "transparent",
                      borderColor: announcement.priority === p ? "rgba(100,255,218,0.5)" : "rgba(100,255,218,0.15)",
                      color: announcement.priority === p ? "#64FFDA" : "#888",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <Button
                onClick={handleAnnouncement}
                disabled={posting || !announcement.title || !announcement.body}
                className="w-full bg-primary text-background hover:bg-primary/90"
              >
                {posting ? <Loader2 size={14} className="animate-spin mr-2" /> : <Megaphone size={14} className="mr-2" />}
                Broadcast to All Dashboards
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Bridge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload size={18} className="text-primary" /> Data Bridge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Pull student records from CSV files, JSON, or external URLs into UOU Infinite.</p>
              <div className="flex gap-2">
                {(["csv", "json", "url"] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setImportMode(m)}
                    className="text-xs px-3 py-1.5 rounded-lg border font-medium uppercase tracking-wider transition-all"
                    style={{
                      background: importMode === m ? "rgba(100,255,218,0.15)" : "transparent",
                      borderColor: importMode === m ? "rgba(100,255,218,0.5)" : "rgba(100,255,218,0.15)",
                      color: importMode === m ? "#64FFDA" : "#888",
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
              {importMode === "csv" && (
                <div className="space-y-2">
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".csv"
                    className="w-full text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                  <a
                    href={`${BASE}/api/import/template`}
                    className="text-xs text-primary underline hover:text-primary/80"
                  >
                    Download CSV template
                  </a>
                </div>
              )}
              {importMode === "json" && (
                <Textarea
                  placeholder={'[{"name":"John Doe","email":"john@example.com","department":"CS","level":"100"}]'}
                  className="resize-none h-24 font-mono text-xs"
                  value={importJson}
                  onChange={e => setImportJson(e.target.value)}
                />
              )}
              {importMode === "url" && (
                <Input
                  placeholder="https://example.com/students.csv"
                  value={importUrl}
                  onChange={e => setImportUrl(e.target.value)}
                />
              )}
              <Button
                onClick={handleImport}
                disabled={importing}
                className="w-full border border-primary/40 text-primary hover:bg-primary/10"
                variant="outline"
              >
                {importing ? <Loader2 size={14} className="animate-spin mr-2" /> : <Upload size={14} className="mr-2" />}
                {importing ? "Importing..." : "Import Records"}
              </Button>
              {importResult && (
                <div className="text-xs text-center text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg p-2">
                  <CheckCircle size={12} className="inline mr-1 text-primary" />
                  {importResult.imported} imported · {importResult.errors} skipped
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-lg">System Telemetry Log</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity?.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-background border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.actorName} &bull; {activity.type}</p>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground shrink-0">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
