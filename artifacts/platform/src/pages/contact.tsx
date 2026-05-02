import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitContact, useGetContactStats, getGetContactStatsQueryKey } from "@workspace/api-client-react";
import { useState } from "react";
import { CheckCircle2, Loader2, Calendar, ArrowRight } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/luca-adam23/30min";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().min(1, "Company is required"),
  email: z.string().email("Invalid email address"),
  need: z.string().min(10, "Please provide more details (min 10 characters)"),
});

function CalendlyWidget() {
  return (
    <div className="w-full h-[650px] rounded-sm overflow-hidden border border-border/50">
      <iframe
        src={`${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0d0d0d&text_color=ffffff&primary_color=c9a84c`}
        width="100%"
        height="100%"
        frameBorder="0"
        title="Book a call with Aurum"
        data-testid="iframe-calendly"
      />
    </div>
  );
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "calendly">("calendly");
  const submitContact = useSubmitContact();
  const { data: stats } = useGetContactStats({
    query: { queryKey: getGetContactStatsQueryKey() }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", company: "", email: "", need: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    submitContact.mutate({ data: values }, {
      onSuccess: () => setSubmitted(true),
    });
  }

  return (
    <Layout>
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 md:px-12">

          {/* Header */}
          <div className="max-w-2xl mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-none"
            >
              Book a <span className="text-primary font-serif italic font-light">call.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground font-light leading-relaxed"
            >
              Choose a time that works for you, or send us your requirements and we'll reach out within 24 hours.
            </motion.p>
            {stats && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-8 flex gap-8"
              >
                <div>
                  <div className="text-3xl font-bold text-white">{stats.thisMonth}</div>
                  <div className="text-xs font-medium tracking-widest text-primary uppercase mt-1">Consultations this month</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{stats.totalLeads}</div>
                  <div className="text-xs font-medium tracking-widest text-primary uppercase mt-1">Total clients served</div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Tab selector */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex gap-2 mb-8 border-b border-border/50"
          >
            <button
              onClick={() => setActiveTab("calendly")}
              data-testid="button-tab-calendly"
              className={`px-6 py-3 text-sm font-semibold tracking-wider transition-all border-b-2 -mb-px flex items-center gap-2 ${
                activeTab === "calendly"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-white"
              }`}
            >
              <Calendar className="w-4 h-4" />
              BOOK A TIME SLOT
            </button>
            <button
              onClick={() => setActiveTab("form")}
              data-testid="button-tab-form"
              className={`px-6 py-3 text-sm font-semibold tracking-wider transition-all border-b-2 -mb-px flex items-center gap-2 ${
                activeTab === "form"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-white"
              }`}
            >
              <ArrowRight className="w-4 h-4" />
              SEND A REQUEST
            </button>
          </motion.div>

          {/* Tab content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "calendly" ? (
              <div className="max-w-3xl">
                <p className="text-muted-foreground text-sm mb-6">
                  Select an available time slot below to schedule a 30-minute consultation with our team.
                </p>
                <CalendlyWidget />
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-16 max-w-5xl">
                {/* Info side */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Prefer we reach out?</h2>
                  <p className="text-muted-foreground font-light leading-relaxed mb-8">
                    Describe your organization's needs and a senior partner will contact you within 24 hours to coordinate a confidential discussion.
                  </p>
                  <div className="space-y-4">
                    {[
                      "Response within 24 hours",
                      "Confidential & GDPR compliant",
                      "No commitment required",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form side */}
                <div className="bg-card border border-border p-8 md:p-10">
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center text-center h-full min-h-[360px]">
                      <CheckCircle2 className="h-14 w-14 text-primary mb-6" />
                      <h3 className="text-2xl font-bold text-white mb-3">Request Received</h3>
                      <p className="text-muted-foreground text-sm">
                        A partner will contact you shortly at the provided email address.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-8"
                        onClick={() => { form.reset(); setSubmitted(false); }}
                      >
                        Submit another request
                      </Button>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" className="bg-background/50 border-border h-12 rounded-sm" data-testid="input-name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Company</FormLabel>
                                <FormControl>
                                  <Input placeholder="Acme Corp" className="bg-background/50 border-border h-12 rounded-sm" data-testid="input-company" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Work Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="john@company.com" type="email" className="bg-background/50 border-border h-12 rounded-sm" data-testid="input-email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="need"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Your Requirements</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe the role, timeline, and required expertise..."
                                  className="min-h-[110px] bg-background/50 border-border rounded-sm resize-none"
                                  data-testid="textarea-need"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          disabled={submitContact.isPending}
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-13 text-sm font-bold tracking-widest rounded-sm mt-2"
                          data-testid="button-submit-contact"
                        >
                          {submitContact.isPending ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> SUBMITTING</>
                          ) : (
                            "SEND REQUEST"
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
