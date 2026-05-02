import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Layout } from "@/components/layout";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetPipeline,
  getGetPipelineQueryKey,
  useUpdatePipelineLead,
  useDeletePipelineLead,
  useCreatePipelineLead,
  useListContacts,
  PipelineStage,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const STAGES = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "closed_won",
  "closed_lost",
];

const STAGE_LABELS: Record<string, string> = {
  new: "New Lead",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal Sent",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

export default function AdminCRM() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: pipeline, isLoading } = useGetPipeline({ query: { queryKey: getGetPipelineQueryKey() } });
  const { data: contacts } = useListContacts();

  const updateLead = useUpdatePipelineLead();
  const deleteLead = useDeletePipelineLead();
  const createLead = useCreatePipelineLead();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newLeadContactId, setNewLeadContactId] = useState<string>("");
  const [newLeadStage, setNewLeadStage] = useState<string>("new");
  const [newLeadValue, setNewLeadValue] = useState<string>("");
  const [newLeadNotes, setNewLeadNotes] = useState<string>("");

  const handleMoveStage = (leadId: number, newStage: PipelineStage) => {
    updateLead.mutate(
      { id: leadId, data: { stage: newStage } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetPipelineQueryKey() });
          toast({ title: "Stage updated" });
        },
        onError: () => {
          toast({ title: "Failed to update stage", variant: "destructive" });
        }
      }
    );
  };

  const handleDelete = (leadId: number) => {
    if (!confirm("Are you sure you want to remove this lead from the pipeline?")) return;
    deleteLead.mutate(
      { id: leadId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetPipelineQueryKey() });
          toast({ title: "Lead removed" });
        },
        onError: () => {
          toast({ title: "Failed to remove lead", variant: "destructive" });
        }
      }
    );
  };

  const handleAddLead = () => {
    if (!newLeadContactId) {
      toast({ title: "Please select a contact", variant: "destructive" });
      return;
    }
    
    createLead.mutate(
      {
        data: {
          contactId: parseInt(newLeadContactId),
          stage: newLeadStage as PipelineStage,
          value: newLeadValue ? parseFloat(newLeadValue) : undefined,
          notes: newLeadNotes || undefined,
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetPipelineQueryKey() });
          setIsAddOpen(false);
          setNewLeadContactId("");
          setNewLeadValue("");
          setNewLeadNotes("");
          toast({ title: "Lead added to pipeline" });
        },
        onError: () => {
          toast({ title: "Failed to add lead", variant: "destructive" });
        }
      }
    );
  };

  const getStageLeads = (stage: string) => {
    if (!pipeline?.stages) return [];
    const stageData = pipeline.stages.find(s => s.stage === stage);
    return stageData?.leads || [];
  };

  const getStageTotal = (stage: string) => {
    if (!pipeline?.stages) return 0;
    const stageData = pipeline.stages.find(s => s.stage === stage);
    return stageData?.totalValue || 0;
  };

  return (
    <Layout>
      <AdminLayout>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-white">CRM Pipeline</h1>
            <p className="text-muted-foreground mt-1">Manage your leads and sales process.</p>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-lead-pipeline">
                <Plus className="w-4 h-4 mr-2" />
                Add Lead to Pipeline
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card text-foreground border-border">
              <DialogHeader>
                <DialogTitle>Add Lead to Pipeline</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Contact / Lead</Label>
                  <Select value={newLeadContactId} onValueChange={setNewLeadContactId}>
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Select a contact" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts?.map(contact => (
                        <SelectItem key={contact.id} value={contact.id.toString()}>
                          {contact.name} ({contact.company})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Initial Stage</Label>
                  <Select value={newLeadStage} onValueChange={setNewLeadStage}>
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Select a stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGES.map(stage => (
                        <SelectItem key={stage} value={stage}>
                          {STAGE_LABELS[stage]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Pipeline Value (€) (Optional)</Label>
                  <Input 
                    type="number" 
                    value={newLeadValue} 
                    onChange={e => setNewLeadValue(e.target.value)} 
                    placeholder="e.g. 50000"
                    className="border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea 
                    value={newLeadNotes} 
                    onChange={e => setNewLeadNotes(e.target.value)} 
                    className="border-border resize-none"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button onClick={handleAddLead} disabled={createLead.isPending}>
                  {createLead.isPending ? "Adding..." : "Add Lead"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STAGES.slice(0, 4).map((_, i) => (
              <div key={i} className="min-w-[300px] space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-[600px]">
            {STAGES.map(stage => (
              <div key={stage} className="min-w-[320px] w-[320px] shrink-0 flex flex-col gap-3">
                <div className="bg-muted/30 border border-border p-3 rounded-md flex justify-between items-center sticky top-0">
                  <h3 className="font-semibold text-white text-sm">{STAGE_LABELS[stage]}</h3>
                  <Badge variant="outline" className="bg-background text-primary border-primary/20">
                    €{getStageTotal(stage).toLocaleString()}
                  </Badge>
                </div>
                
                <div className="flex flex-col gap-3 flex-1">
                  {getStageLeads(stage).map(lead => (
                    <Card key={lead.id} className="bg-card border-border hover:border-primary/50 transition-colors shadow-sm">
                      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                        <div>
                          <CardTitle className="text-base text-white">{lead.contact?.name}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">{lead.contact?.company}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" data-testid={`dropdown-lead-${lead.id}`}>
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Move to...</div>
                            {STAGES.filter(s => s !== stage).map(s => (
                              <DropdownMenuItem 
                                key={s} 
                                onClick={() => handleMoveStage(lead.id, s as PipelineStage)}
                                data-testid={`move-to-${s}`}
                              >
                                {STAGE_LABELS[s]}
                              </DropdownMenuItem>
                            ))}
                            <div className="h-px bg-border my-1" />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(lead.id)}
                              className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                            >
                              <Trash className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 pb-3">
                        <p className="text-sm text-muted-foreground line-clamp-2" title={lead.contact?.need}>
                          {lead.contact?.need || "No need specified"}
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">
                          {new Date(lead.updatedAt).toLocaleDateString()}
                        </span>
                        <span className="font-semibold text-primary">
                          {lead.value ? `€${lead.value.toLocaleString()}` : '—'}
                        </span>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  {getStageLeads(stage).length === 0 && (
                    <div className="p-6 text-center border border-dashed border-border rounded-md text-muted-foreground text-sm">
                      No leads
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </Layout>
  );
}