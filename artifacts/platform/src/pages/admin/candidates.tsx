import { useState, useMemo } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Layout } from "@/components/layout";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListCandidates,
  getListCandidatesQueryKey,
  useCreateCandidate,
  useUpdateCandidate,
  useDeleteCandidate,
  Candidate,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Pencil, Trash, Filter } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

const candidateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  skills: z.string().min(1, "At least one skill is required"),
  language: z.string().min(1, "Language is required"),
  experienceYears: z.coerce.number().min(0),
  hourlyRate: z.coerce.number().min(0),
  availability: z.string().min(1, "Availability is required"),
  status: z.string().min(1, "Status is required"),
  bio: z.string().optional(),
  location: z.string().optional(),
});

type CandidateFormValues = z.infer<typeof candidateSchema>;

export default function AdminCandidates() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Filters state
  const [roleFilter, setRoleFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);

  // Queries
  const { data: candidates, isLoading } = useListCandidates(
    { 
      role: roleFilter || undefined,
      language: languageFilter !== "all" ? languageFilter : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    },
    { query: { queryKey: getListCandidatesQueryKey({ role: roleFilter, language: languageFilter !== "all" ? languageFilter : undefined, status: statusFilter !== "all" ? statusFilter : undefined }) } }
  );

  // Mutations
  const createCandidate = useCreateCandidate();
  const updateCandidate = useUpdateCandidate();
  const deleteCandidate = useDeleteCandidate();

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: "",
      role: "",
      skills: "",
      language: "English",
      experienceYears: 0,
      hourlyRate: 0,
      availability: "Full-time",
      status: "active",
      bio: "",
      location: "",
    },
  });

  const onSubmit = (data: CandidateFormValues) => {
    const formattedData = {
      ...data,
      skills: data.skills.split(",").map(s => s.trim()).filter(s => s),
    };

    if (editingCandidate) {
      updateCandidate.mutate(
        { id: editingCandidate.id, data: formattedData },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListCandidatesQueryKey() });
            setIsAddOpen(false);
            setEditingCandidate(null);
            form.reset();
            toast({ title: "Candidate updated" });
          },
          onError: () => toast({ title: "Failed to update candidate", variant: "destructive" }),
        }
      );
    } else {
      createCandidate.mutate(
        { data: formattedData },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListCandidatesQueryKey() });
            setIsAddOpen(false);
            form.reset();
            toast({ title: "Candidate added" });
          },
          onError: () => toast({ title: "Failed to add candidate", variant: "destructive" }),
        }
      );
    }
  };

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    form.reset({
      name: candidate.name,
      role: candidate.role,
      skills: candidate.skills.join(", "),
      language: candidate.language,
      experienceYears: candidate.experienceYears,
      hourlyRate: candidate.hourlyRate,
      availability: candidate.availability,
      status: candidate.status,
      bio: candidate.bio || "",
      location: candidate.location || "",
    });
    setIsAddOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this candidate?")) return;
    deleteCandidate.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCandidatesQueryKey() });
          toast({ title: "Candidate deleted" });
        },
        onError: () => toast({ title: "Failed to delete candidate", variant: "destructive" }),
      }
    );
  };

  return (
    <Layout>
      <AdminLayout>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-white">Candidate Database</h1>
            <p className="text-muted-foreground mt-1">Manage and filter your elite talent pool.</p>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open);
            if (!open) {
              setEditingCandidate(null);
              form.reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-candidate">
                <Plus className="w-4 h-4 mr-2" />
                Add Candidate
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card text-foreground border-border max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCandidate ? "Edit Candidate" : "Add New Candidate"}</DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input {...field} className="border-border" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="role" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role / Title</FormLabel>
                        <FormControl><Input {...field} className="border-border" placeholder="e.g. Senior Frontend Engineer" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="language" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Language</FormLabel>
                        <FormControl><Input {...field} className="border-border" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="location" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl><Input {...field} className="border-border" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="experienceYears" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience (Years)</FormLabel>
                        <FormControl><Input type="number" {...field} className="border-border" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="hourlyRate" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hourly Rate (€)</FormLabel>
                        <FormControl><Input type="number" {...field} className="border-border" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="availability" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="border-border"><SelectValue placeholder="Select availability" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="status" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="border-border"><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active (Available)</SelectItem>
                            <SelectItem value="on_assignment">On Assignment</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  
                  <FormField control={form.control} name="skills" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills (Comma separated)</FormLabel>
                      <FormControl><Input {...field} className="border-border" placeholder="React, TypeScript, Node.js" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form.control} name="bio" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio / Notes</FormLabel>
                      <FormControl><Textarea {...field} className="border-border resize-none" rows={3} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={createCandidate.isPending || updateCandidate.isPending}>
                      {editingCandidate ? "Update" : "Save"} Candidate
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-card border border-border p-4 rounded-md">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by role..." 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-9 border-border"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger className="border-border">
                <SelectValue placeholder="Filter by Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-border">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_assignment">On Assignment</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border border-border rounded-md overflow-hidden bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-white">Candidate</TableHead>
                <TableHead className="text-white">Role & Skills</TableHead>
                <TableHead className="text-white">Experience</TableHead>
                <TableHead className="text-white">Rate</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-right text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell><Skeleton className="h-10 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-[60px] ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : candidates?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No candidates found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                candidates?.map((candidate) => (
                  <TableRow key={candidate.id} className="border-border hover:bg-muted/30">
                    <TableCell>
                      <div className="font-medium text-white">{candidate.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{candidate.location} • {candidate.language}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium mb-2 text-primary">{candidate.role}</div>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 3).map(skill => (
                          <Badge key={skill} variant="secondary" className="text-[10px] py-0 px-1.5 bg-muted text-muted-foreground font-normal">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 3 && (
                          <Badge variant="secondary" className="text-[10px] py-0 px-1.5 bg-muted text-muted-foreground font-normal">
                            +{candidate.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {candidate.experienceYears} yrs
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      €{candidate.hourlyRate}/hr
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={candidate.status === 'active' ? 'default' : candidate.status === 'on_assignment' ? 'secondary' : 'outline'}
                        className={candidate.status === 'active' ? 'bg-primary/20 text-primary hover:bg-primary/30 border-primary/20' : ''}
                      >
                        {candidate.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-white"
                          onClick={() => handleEdit(candidate)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(candidate.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </AdminLayout>
    </Layout>
  );
}