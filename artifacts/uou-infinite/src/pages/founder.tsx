import { useGetDashboardOverview, useGetDashboardRecentActivity, useGetDashboardEngagement, useGetDashboardCourseDistribution, useGetDashboardGeographic } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, AlertTriangle, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

export default function FounderPage() {
  const { data: overview } = useGetDashboardOverview();
  const { data: recentActivity } = useGetDashboardRecentActivity();
  const { data: engagement } = useGetDashboardEngagement();
  const { data: courseDistribution } = useGetDashboardCourseDistribution();
  const { data: geographic } = useGetDashboardGeographic();

  const kpis = overview ? [
    { title: "Total Students", value: overview.totalStudents, icon: Users },
    { title: "Active Lecturers", value: overview.totalLecturers, icon: GraduationCap },
    { title: "Active Courses", value: overview.totalCourses, icon: BookOpen },
    { title: "At-Risk Students", value: overview.retentionRiskCount, icon: AlertTriangle, color: "text-destructive" },
  ] : [];

  const COLORS = ['#64FFDA', '#48b89f', '#2d7a6a', '#143d35', '#0a1e1a'];

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
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Engagement Timeseries</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {engagement && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagement}>
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#0A192F', borderColor: '#64FFDA' }} />
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
            <CardHeader>
              <CardTitle className="text-lg">Course Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {courseDistribution && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={courseDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="enrollmentCount">
                      {courseDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: '#0A192F', borderColor: '#64FFDA' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {geographic && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={geographic}>
                    <XAxis dataKey="state" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#0A192F', borderColor: '#64FFDA' }} />
                    <Bar dataKey="studentCount" fill="#64FFDA" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">System Telemetry Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity?.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-background border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.actorName} &bull; {activity.type}</p>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
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
