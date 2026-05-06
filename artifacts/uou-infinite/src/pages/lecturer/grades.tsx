import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Save, Users, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useListCourses, useListStudents } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function LecturerGrades() {
  const { token } = useAuth();
  const { data: courses } = useListCourses();
  const { data: students } = useListStudents();
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    testScore: "",
    examScore: "",
    assignmentScore: "",
    attendancePct: "",
    punctualityPct: "",
  });

  const handleSave = async () => {
    if (!selectedCourse || !selectedStudent) {
      toast({ title: "Select course and student", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const r = await fetch(`${BASE}/api/grades`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          courseId: parseInt(selectedCourse),
          studentId: parseInt(selectedStudent),
          ...form,
        }),
      });
      const data = await r.json();
      if (r.ok) {
        setSaved(true);
        toast({ title: "Grade saved!", description: `Final score: ${data.finalScore} — ${data.letterGrade}` });
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast({ title: "Failed to save", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    }
    setSaving(false);
  };

  const computePreview = () => {
    const t = parseFloat(form.testScore || "0") * 0.20;
    const e = parseFloat(form.examScore || "0") * 0.60;
    const a = parseFloat(form.assignmentScore || "0") * 0.10;
    const at = parseFloat(form.attendancePct || "0") * 0.10;
    const final = t + e + a + at;
    let letter = "F";
    if (final >= 70) letter = "A";
    else if (final >= 60) letter = "B";
    else if (final >= 50) letter = "C";
    else if (final >= 45) letter = "D";
    else if (final >= 40) letter = "E";
    return { final: final.toFixed(1), letter };
  };

  const preview = computePreview();
  const GRADE_COLORS: Record<string, string> = { A: "#60A5FA", B: "#34D399", C: "#F59E0B", D: "#F97316", E: "#EF4444", F: "#DC2626" };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Grade Entry</h1>
        <p className="text-muted-foreground mt-1">Record test scores, exam results, and attendance for your students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entry Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="text-primary w-5 h-5" /> Score Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Course</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course..." />
                  </SelectTrigger>
                  <SelectContent>
                    {courses?.map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.code} — {c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Student</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {students?.map(s => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name} ({s.studentId})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Test Score <span className="text-muted-foreground text-xs">(out of 100)</span></Label>
                <Input
                  type="number" min="0" max="100" placeholder="e.g. 72"
                  value={form.testScore}
                  onChange={e => setForm(f => ({ ...f, testScore: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Exam Score <span className="text-muted-foreground text-xs">(out of 100)</span></Label>
                <Input
                  type="number" min="0" max="100" placeholder="e.g. 65"
                  value={form.examScore}
                  onChange={e => setForm(f => ({ ...f, examScore: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Assignment Score</Label>
                <Input
                  type="number" min="0" max="100" placeholder="e.g. 80"
                  value={form.assignmentScore}
                  onChange={e => setForm(f => ({ ...f, assignmentScore: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Attendance %</Label>
                <Input
                  type="number" min="0" max="100" placeholder="e.g. 90"
                  value={form.attendancePct}
                  onChange={e => setForm(f => ({ ...f, attendancePct: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Punctuality %</Label>
                <Input
                  type="number" min="0" max="100" placeholder="e.g. 85"
                  value={form.punctualityPct}
                  onChange={e => setForm(f => ({ ...f, punctualityPct: e.target.value }))}
                />
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-11 bg-primary text-background hover:bg-primary/90 font-semibold"
            >
              {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : saved ? <CheckCircle size={16} className="mr-2" /> : <Save size={16} className="mr-2" />}
              {saving ? "Saving..." : saved ? "Saved!" : "Save Grade Record"}
            </Button>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Grade Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div
                  className="text-8xl font-black mb-2"
                  style={{
                    color: GRADE_COLORS[preview.letter],
                    textShadow: `0 0 40px ${GRADE_COLORS[preview.letter]}60`,
                  }}
                >
                  {preview.letter}
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{preview.final}<span className="text-lg text-muted-foreground">/100</span></div>
                <div className="text-sm text-muted-foreground">Weighted Final Score</div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {[
                { label: "Test (×0.20)", val: form.testScore, weight: 0.20 },
                { label: "Exam (×0.60)", val: form.examScore, weight: 0.60 },
                { label: "Assignment (×0.10)", val: form.assignmentScore, weight: 0.10 },
                { label: "Attendance (×0.10)", val: form.attendancePct, weight: 0.10 },
              ].map(row => {
                const contrib = (parseFloat(row.val || "0") * row.weight).toFixed(1);
                const pct = parseFloat(row.val || "0");
                return (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className="text-muted-foreground w-36 shrink-0">{row.label}</span>
                    <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="font-mono text-foreground w-10 text-right">{contrib}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-center text-muted-foreground">
              Grading: A≥70 · B≥60 · C≥50 · D≥45 · E≥40 · F&lt;40
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
