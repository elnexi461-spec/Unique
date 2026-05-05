import { useListLecturers } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

export default function LecturersList() {
  const { data: lecturers, isLoading } = useListLecturers();
  const [search, setSearch] = useState("");

  const filtered = lecturers?.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Lecturer Roster</h1>
        <p className="text-muted-foreground mt-1">Manage faculty allocations</p>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or department..." 
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Active Courses</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Loading data stream...</TableCell></TableRow>
            ) : filtered?.map((lecturer) => (
              <TableRow key={lecturer.id}>
                <TableCell className="font-medium text-primary">{lecturer.name}</TableCell>
                <TableCell className="text-muted-foreground">{lecturer.email}</TableCell>
                <TableCell>{lecturer.department}</TableCell>
                <TableCell>{lecturer.specialization}</TableCell>
                <TableCell className="font-mono text-center">{lecturer.courseCount}</TableCell>
              </TableRow>
            ))}
            {filtered?.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No faculty found matching query.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
