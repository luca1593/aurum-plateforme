import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Layout } from "@/components/layout";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListContacts,
  useListCandidates,
  useGetMatches,
  getGetMatchesQueryKey,
  useCreateMatch,
  ContactItem,
  Candidate,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, CheckCircle2, ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function AdminMatching() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [matchScores, setMatchScores] = useState<Record<number, string>>({});

  // Queries
  const { data: contacts, isLoading: isLoadingContacts } = useListContacts();
  const { data: candidates, isLoading: isLoadingCandidates } = useListCandidates();
  
  const { data: matches, isLoading: isLoadingMatches } = useGetMatches(
    { contactId: selectedContact?.id || 0 },
    { 
      query: { 
        queryKey: getGetMatchesQueryKey({ contactId: selectedContact?.id || 0 }),
        enabled: !!selectedContact?.id 
      } 
    }
  );

  const createMatch = useCreateMatch();

  const handleScoreChange = (candidateId: number, value: string) => {
    setMatchScores(prev => ({ ...prev, [candidateId]: value }));
  };

  const handleAssign = (candidateId: number) => {
    if (!selectedContact) return;
    
    const scoreStr = matchScores[candidateId];
    const score = scoreStr ? parseInt(scoreStr, 10) : 85; // Default score if none entered
    
    if (isNaN(score) || score < 0 || score > 100) {
      toast({ title: "Invalid score", description: "Score must be between 0 and 100", variant: "destructive" });
      return;
    }

    createMatch.mutate(
      {
        data: {
          contactId: selectedContact.id,
          candidateId,
          score,
          status: "proposed"
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMatchesQueryKey({ contactId: selectedContact.id }) });
          toast({ title: "Candidate matched successfully" });
        },
        onError: () => {
          toast({ title: "Failed to match candidate", variant: "destructive" });
        }
      }
    );
  };

  const filteredCandidates = candidates?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isMatched = (candidateId: number) => {
    return matches?.some(m => m.candidateId === candidateId);
  };

  const getMatchForCandidate = (candidateId: number) => {
    return matches?.find(m => m.candidateId === candidateId);
  };

  return (
    <Layout>
      <AdminLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tighter text-white">Talent Matching</h1>
          <p className="text-muted-foreground mt-1">Assign candidates to client needs.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
          {/* Left Panel: Contacts */}
          <Card className="lg:col-span-4 flex flex-col bg-card border-border overflow-hidden">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-lg text-white">Client Needs</CardTitle>
              <CardDescription>Select a contact to find matches</CardDescription>
            </CardHeader>
            <div className="flex-1 overflow-y-auto p-0">
              {isLoadingContacts ? (
                <div className="p-4 space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : contacts?.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No contacts found</div>
              ) : (
                <div className="divide-y divide-border">
                  {contacts?.map(contact => (
                    <button
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={`w-full text-left p-4 hover:bg-muted/50 transition-colors flex justify-between items-center ${
                        selectedContact?.id === contact.id ? "bg-primary/10 border-l-2 border-primary" : "border-l-2 border-transparent"
                      }`}
                    >
                      <div className="overflow-hidden pr-4">
                        <div className="font-semibold text-white truncate">{contact.company}</div>
                        <div className="text-sm text-muted-foreground truncate">{contact.name}</div>
                        <div className="text-xs text-muted-foreground mt-1 truncate max-w-full">
                          {contact.need}
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 ${selectedContact?.id === contact.id ? "text-primary" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Right Panel: Candidates & Matching */}
          <Card className="lg:col-span-8 flex flex-col bg-card border-border overflow-hidden">
            {selectedContact ? (
              <>
                <div className="p-6 border-b border-border bg-muted/20">
                  <h2 className="text-xl font-bold text-white mb-2">{selectedContact.company}</h2>
                  <div className="bg-background p-4 rounded-md border border-border/50">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">The Need</span>
                    <p className="text-sm text-foreground/90">{selectedContact.need}</p>
                  </div>
                </div>

                <div className="p-4 border-b border-border flex gap-4 items-center bg-card">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search candidates by name, role, or skill..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 border-border"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <h3 className="font-semibold text-white px-2">Available Candidates</h3>
                  
                  {isLoadingCandidates ? (
                    <div className="space-y-4">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : filteredCandidates?.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-md">
                      No candidates found matching your search.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {filteredCandidates?.map(candidate => {
                        const matched = isMatched(candidate.id);
                        const matchData = getMatchForCandidate(candidate.id);
                        
                        return (
                          <div 
                            key={candidate.id} 
                            className={`border p-4 rounded-md flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center transition-colors ${
                              matched ? "border-primary/50 bg-primary/5" : "border-border bg-background hover:border-muted-foreground/30"
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-white truncate">{candidate.name}</h4>
                                <Badge variant="outline" className="text-[10px] font-normal border-primary/20 text-primary">€{candidate.hourlyRate}/hr</Badge>
                                {matched && (
                                  <Badge className="bg-primary text-primary-foreground border-none text-[10px] font-bold">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    {matchData?.status}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{candidate.role} • {candidate.experienceYears} yrs exp</p>
                              <div className="flex flex-wrap gap-1">
                                {candidate.skills.map(skill => (
                                  <span key={skill} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                              {!matched ? (
                                <>
                                  <div className="flex flex-col gap-1 w-20">
                                    <Label className="text-[10px] text-muted-foreground">Score (0-100)</Label>
                                    <Input 
                                      type="number" 
                                      placeholder="85"
                                      value={matchScores[candidate.id] || ""}
                                      onChange={(e) => handleScoreChange(candidate.id, e.target.value)}
                                      className="h-8 border-border"
                                    />
                                  </div>
                                  <Button 
                                    onClick={() => handleAssign(candidate.id)}
                                    disabled={createMatch.isPending}
                                    className="mt-4"
                                  >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Assign
                                  </Button>
                                </>
                              ) : (
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-primary">{matchData?.score}%</div>
                                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Match Score</div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Contact Selected</h3>
                <p>Select a contact from the left panel to view their needs and assign matching candidates.</p>
              </div>
            )}
          </Card>
        </div>
      </AdminLayout>
    </Layout>
  );
}