import { useListAdmissions, useAnalyzeAdmission, useUpdateAdmission } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function AdmissionsPage() {
  const { data: admissions, refetch } = useListAdmissions();
  const analyzeMutation = useAnalyzeAdmission();
  const updateMutation = useUpdateAdmission();
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState<number | null>(null);

  const handleAnalyze = async (admission: { id: number; waecResults?: string | null; jambScore?: number | null }) => {
    setAnalyzing(admission.id);
    try {
      const result = await analyzeMutation.mutateAsync({
        id: admission.id,
        data: {
          waecResults: admission.waecResults ?? "",
          jambScore: admission.jambScore ?? 0,
        },
      });

      await updateMutation.mutateAsync({
        id: admission.id,
        data: {
          matchPercentage: result.matchPercentage,
          analysisResult: JSON.stringify(result),
        },
      });

      toast({ title: "Analysis Complete", description: `Match probability: ${result.matchPercentage}%` });
      refetch();
    } catch {
      toast({ title: "Analysis Failed", variant: "destructive" });
    } finally {
      setAnalyzing(null);
    }
  };

  const handleStatus = async (id: number, status: string) => {
    try {
      await updateMutation.mutateAsync({ id, data: { status } });
      toast({ title: "Status Updated" });
      refetch();
    } catch {
      toast({ title: "Update Failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admissions Pipeline</h1>
        <p className="text-muted-foreground mt-1">AI-assisted application review and processing</p>
      </div>

      <div className="grid gap-4">
        {admissions?.map((admission: any, i: number) => {
          let analysis: { recommendation?: string } | null = null;
          if (admission.analysisResult) {
            try {
              analysis = JSON.parse(admission.analysisResult);
            } catch {
              // ignore
            }
          }

          return (
            <motion.div
              key={admission.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-foreground">{admission.applicantName}</h3>
                        <Badge
                          variant="outline"
                          className={
                            admission.status === "pending"
                              ? "bg-primary/10 text-primary border-primary/30"
                              : admission.status === "approved"
                              ? "bg-green-500/10 text-green-400 border-green-500/30"
                              : "bg-destructive/10 text-destructive border-destructive/30"
                          }
                        >
                          {admission.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Applying for:{" "}
                        <span className="text-foreground">{(admission as { courseTitle?: string }).courseTitle ?? "—"}</span>
                      </p>

                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">JAMB Score:</span>{" "}
                          <span className="font-mono text-primary">{admission.jambScore ?? "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">WAEC:</span>{" "}
                          <span className="font-mono">{admission.waecResults ? "Submitted" : "Missing"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-64 bg-sidebar rounded-lg border border-border p-4 flex flex-col items-center justify-center">
                      {admission.matchPercentage !== null && admission.matchPercentage !== undefined ? (
                        <>
                          <div className="text-3xl font-bold text-primary mb-1">{Math.round(admission.matchPercentage)}%</div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Match Probability</div>
                          {analysis?.recommendation && (
                            <div className="text-xs text-center text-foreground">{analysis.recommendation}</div>
                          )}
                        </>
                      ) : (
                        <Button
                          onClick={() => handleAnalyze(admission)}
                          disabled={analyzing === admission.id}
                          className="w-full bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/50"
                        >
                          {analyzing === admission.id ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Brain className="w-4 h-4 mr-2" />
                          )}
                          Run AI Analysis
                        </Button>
                      )}
                    </div>

                    <div className="flex flex-col justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleStatus(admission.id, "approved")}
                        disabled={admission.status === "approved"}
                        className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStatus(admission.id, "rejected")}
                        disabled={admission.status === "rejected"}
                        variant="outline"
                        className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                      </Button>
                    </div>
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
