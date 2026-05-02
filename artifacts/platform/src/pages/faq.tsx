import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "How does Aurum differ from standard recruitment agencies?",
    a: "Standard agencies play a volume game. We operate as a private network. We do not source from public job boards. Every professional in our network is pre-vetted, meaning we present 2-3 perfect candidates rather than 50 approximate ones."
  },
  {
    q: "What is the typical turnaround time for a placement?",
    a: "Because our network is pre-vetted and active, we typically present candidates within 48 to 72 hours of our discovery call. Final placement and start dates depend on the candidate's current obligations."
  },
  {
    q: "Do you offer interim or fractional executives?",
    a: "Yes. A significant portion of our network specializes in fractional leadership (Fractional CMOs, Interim CFOs) to guide organizations through transitions or specific growth phases."
  },
  {
    q: "What is your fee structure?",
    a: "We operate on a retained search basis for permanent placements, and a transparent margin structure for interim/fractional deployments. Exact terms are discussed during the initial consultation."
  },
  {
    q: "Do you guarantee your placements?",
    a: "Absolutely. We offer a 60-day performance guarantee. If the placement is not an optimal fit within this period, we will execute a replacement search at zero additional cost."
  },
  {
    q: "Which geographies do you cover?",
    a: "While our primary hubs are in North America and Western Europe, our network is truly global, specializing in remote-first executive talent."
  },
  {
    q: "How rigorous is the vetting process?",
    a: "Candidates undergo multi-stage technical and behavioral interviews, thorough reference checks, and past-performance audits before being admitted to the Aurum network. Less than 2% of applicants are accepted."
  },
  {
    q: "Can you assist with building entire teams?",
    a: "Yes. We frequently partner with post-Series A startups and enterprise innovation labs to build out entire departments or project squads simultaneously."
  }
];

export default function FAQ() {
  return (
    <Layout>
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6 text-center"
          >
            Frequently Asked <span className="text-primary font-serif italic font-light">Questions</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-16"
          >
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border/50 px-2">
                  <AccordionTrigger className="text-left text-lg font-bold text-white hover:text-primary transition-colors py-6">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}