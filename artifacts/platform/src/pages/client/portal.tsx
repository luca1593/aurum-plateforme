import { AdminLayout } from "@/components/admin-layout";
import { Layout } from "@/components/layout";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetClientPortal,
  getGetClientPortalQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const STAGES = ["new", "contacted", "qualified", "proposal", "negotiation", "closed_won"];
const STAGE_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal Sent",
  negotiation: "Negotiating",
  closed_won: "Closed",
  closed_lost: "Closed",
};

export default function ClientPortal() {
  const [contactId, setContactId] = useState("");
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: portalData, isLoading, isError } = useGetClientPortal(
    submittedId || 0,
    { query: { queryKey: getGetClientPortalQueryKey(submittedId || 0), enabled: !!submittedId, retry: false } }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(contactId, 10);
    if (!isNaN(id)) {
      setSubmittedId(id);
    } else {
      toast({
        title: "Invalid ID",
        description: "Please enter a valid numeric Contact ID.",
        variant: "destructive",
      });
    }
  };

  const getStageIndex = (stage?: string) => {
    if (!stage) return -1;
    if (stage === "closed_lost") return STAGES.indexOf("closed_won");
    return STAGES.indexOf(stage);
  };

  return (
    <Layout>
      <div className="min-h-[100dvh] pt-32 pb-16 bg-background flex flex-col items-center">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl w-full">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter text-white mb-4">Client Portal</h1>
            <p className="text-muted-foreground">Track your project status and view candidate matches.</p>
          </div>

          {!submittedId ? (
            <Card className="bg-card border-border max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-white text-center">Access Your Status</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Enter your Contact ID..."
                      value={contactId}
                      onChange={(e) => setContactId(e.target.value)}
                      className="bg-input border-border text-white h-12"
                      data-testid="input-contact-id"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      You receive this ID after booking a call.
                    </p>
                  </div>
                  <Button type="submit" size="lg" className="w-full text-primary-foreground font-semibold" data-testid="button-view-status">
                    View My Status
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : isError || !portalData ? (
            <div className="text-center space-y-4">
              <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md text-destructive">
                Could not find status for this ID.
              </div>
              <Button onClick={() => setSubmittedId(null)} variant="outline">Try Again</Button>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Header */}
              <div className="border-b border-border pb-6">
                <h2 className="text-3xl font-bold text-white">Welcome, {portalData.contact.name}</h2>
                <p className="text-lg text-muted-foreground mt-1">{portalData.contact.company}</p>
                <div className="mt-4 inline-block bg-primary/10 text-primary px-4 py-2 rounded-md font-medium border border-primary/20">
                  {portalData.statusMessage}
                </div>
              </div>

              {/* Timeline */}
              <div className="py-6">
                <h3 className="text-xl font-semibold text-white mb-8">Pipeline Status</h3>
                <div className="relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2" />
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 transition-all duration-500"
                    style={{ width: `${Math.max(0, getStageIndex(portalData.pipelineStage)) / (STAGES.length - 1) * 100}%` }}
                  />
                  <div className="relative flex justify-between w-full">
                    {STAGES.map((stage, i) => {
                      const isCompleted = i <= getStageIndex(portalData.pipelineStage);
                      const isCurrent = i === getStageIndex(portalData.pipelineStage);
                      
                      return (
                        <div key={stage} className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 bg-background transition-colors ${
                            isCurrent ? 'border-primary ring-4 ring-primary/20 bg-primary' :
                            isCompleted ? 'border-primary bg-primary' : 'border-muted-foreground bg-card'
                          }`} />
                          <div className={`mt-3 text-xs md:text-sm font-medium absolute top-8 whitespace-nowrap text-center -translate-x-1/2 left-1/2 ${
                            isCurrent ? 'text-primary' :
                            isCompleted ? 'text-white' : 'text-muted-foreground'
                          }`}>
                            {STAGE_LABELS[stage]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Matches */}
              <div className="pt-8 border-t border-border">
                <h3 className="text-xl font-semibold text-white mb-6">Matched Candidates</h3>
                
                {portalData.matches.length === 0 ? (
                  <div className="text-center p-12 bg-card border border-border rounded-md border-dashed">
                    <p className="text-muted-foreground">Our team is identifying the best candidates for you. Check back soon.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {portalData.matches.map((match) => (
                      <Card key={match.id} className="bg-card border-border overflow-hidden group">
                        <div className="h-1 bg-gradient-to-r from-primary/50 to-primary/10" />
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-bold text-white">{match.candidate?.name}</h4>
                              <p className="text-sm text-primary">{match.candidate?.role}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant={match.status === 'accepted' ? 'default' : 'secondary'} className="bg-secondary text-secondary-foreground">
                                {match.status}
                              </Badge>
                              <div className="mt-1 text-xs text-muted-foreground">
                                Match Score: <span className="text-white font-bold">{match.score}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-4">
                            {match.candidate?.skills?.map((skill, i) => (
                              <span key={i} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}