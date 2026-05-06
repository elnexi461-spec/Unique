import { useGetSystemHealth, useGetSystemLogs } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Server, ShieldAlert, Cpu, HardDrive, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SystemHealth() {
  const { data: health, refetch: refetchHealth } = useGetSystemHealth();
  const { data: logs } = useGetSystemLogs({ level: "error", limit: 10 });
  const { toast } = useToast();

  const handleFix = (suggestion: string) => {
    toast({
      title: "Initiating Auto-Repair",
      description: `Executing protocol: ${suggestion}`,
    });
    setTimeout(() => refetchHealth(), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">System Health</h1>
          <p className="text-muted-foreground mt-1">Infrastructure Telemetry & Diagnostics</p>
        </div>
        <Button onClick={() => refetchHealth()} variant="outline" className="border-primary/50 text-primary">
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh Telemetry
        </Button>
      </div>

      {health && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
                <Server className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold uppercase tracking-wider text-primary">{health.status}</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Uptime</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{(health.uptime / 3600).toFixed(2)}h</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Memory Usage</CardTitle>
                <Cpu className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{health.memoryUsage.toFixed(1)}%</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Anomalies</CardTitle>
                <ShieldAlert className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{health.errorCount}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-card border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.08)]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" /> AI Diagnosis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{health.aiDiagnosis}</p>
                
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Recommended Actions</h4>
                  {health.suggestions.map((suggestion, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded bg-background border border-border">
                      <span className="text-sm text-foreground">{suggestion}</span>
                      <Button size="sm" onClick={() => handleFix(suggestion)} className="bg-primary/20 text-primary hover:bg-primary/30">
                        Execute
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-destructive" /> Recent Errors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {logs?.map((log) => (
                    <div key={log.id} className="p-3 rounded bg-background border border-destructive/30 border-l-2 border-l-destructive">
                      <div className="flex justify-between items-start mb-1">
                        <Badge variant="outline" className="text-destructive border-destructive/50 rounded uppercase text-[10px] px-1">{log.level}</Badge>
                        <span className="text-xs font-mono text-muted-foreground">{new Date(log.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm text-foreground font-mono mt-2">{log.message}</p>
                    </div>
                  ))}
                  {logs?.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">No recent anomalies detected.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
