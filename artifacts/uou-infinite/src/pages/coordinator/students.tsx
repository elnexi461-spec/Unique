import { useListStudents } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Search } from "lucide-react";

export default function StudentsList() {
  const { data: students, isLoading } = useListStudents();
  const [search, setSearch] = useState("");

  const filtered = students?.filter((s: any) => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.studentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Student Roster</h1>
        <p className="text-muted-foreground mt-1">Manage and monitor student statuses</p>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or ID..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-background border-border"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-sidebar">
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>GPA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Loading data stream...</TableCell></TableRow>
            ) : filtered?.map((student: any, i: number) => (
              <TableRow key={student.id}>
                <TableCell className="font-mono text-xs">{student.studentId}</TableCell>
                <TableCell className="font-medium text-primary">{student.name}</TableCell>
                <TableCell>{student.department}</TableCell>
                <TableCell>{student.level}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={student.status === 'active' ? 'text-primary border-primary/30' : 'text-muted-foreground'}>
                    {student.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono">{student.gpa?.toFixed(2) || 'N/A'}</TableCell>
              </TableRow>
            ))}
            {filtered?.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No students found matching query.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
