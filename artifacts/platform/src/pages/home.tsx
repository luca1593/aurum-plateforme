import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Shield, Globe, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative min-h-[90dvh] flex items-center pt-24 pb-12 overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 -left-1/4 w-1/3 h-1/3 bg-white/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 rounded-full text-primary text-xs font-semibold tracking-widest uppercase mb-6 bg-primary/5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Exclusive Talent Access
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.05] text-white mb-6">
              The new standard for <br />
              <span className="text-primary italic font-serif font-light">elite</span> professional talent.
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed font-light">
              We connect ambitious organizations with vetted top-tier experts globally. 
              No job boards. No noise. Just the top 1% of talent, ready to deploy.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base font-semibold tracking-wide w-full sm:w-auto">
                  BOOK A CONSULTATION <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="border-border hover:bg-white/5 h-14 px-8 text-base font-semibold tracking-wide w-full sm:w-auto">
                  EXPLORE PROFILES
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PROOF NUMBERS */}
      <section className="py-20 border-y border-border/50 bg-black/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: "500+", label: "Successful Placements" },
              { value: "98%", label: "Client Retention Rate" },
              { value: "24h", label: "Initial Response Time" },
              { value: "Top 1%", label: "Vetted Network" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col"
              >
                <span className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tighter">{stat.value}</span>
                <span className="text-sm font-medium text-primary tracking-wide uppercase">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROFILES */}
      <section className="py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-4">Domains of Expertise</h2>
              <p className="text-muted-foreground text-lg font-light">
                We maintain an exclusive roster of proven leaders across critical business functions.
              </p>
            </div>
            <Link href="/services" className="text-primary font-medium flex items-center gap-2 hover:gap-3 transition-all">
              View full catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Revenue & Growth", desc: "Enterprise Sales Directors, RevOps Leaders, and Growth Marketers with proven track records.", icon: Target },
              { title: "Technology & Product", desc: "CTOs, Principal Engineers, and Product Leaders who build scalable systems.", icon: Globe },
              { title: "Operations & Strategy", desc: "COOs, Chiefs of Staff, and Strategy Consultants from top-tier firms.", icon: Shield }
            ].map((profile, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative p-8 border border-border bg-card/50 hover:bg-card transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                  <profile.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{profile.title}</h3>
                <p className="text-muted-foreground font-light leading-relaxed">{profile.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-32 bg-black/40 border-y border-border/50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-6">How It Works</h2>
            <p className="text-muted-foreground text-lg font-light">A streamlined, concierge-level experience designed for speed and precision.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Discovery", desc: "Deep dive into your exact requirements and organizational culture." },
              { num: "02", title: "Curation", desc: "We hand-select 2-3 perfect candidates from our private network." },
              { num: "03", title: "Alignment", desc: "Facilitated introductions and alignment sessions." },
              { num: "04", title: "Integration", desc: "Seamless onboarding and continuous performance tracking." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-primary/20 tracking-tighter mb-4 font-serif italic">{step.num}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-muted-foreground font-light">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-8">Why the best choose Aurum.</h2>
              <div className="space-y-8">
                {[
                  { title: "Zero Noise", desc: "We don't send stacks of resumes. We present the answer." },
                  { title: "Vetted Excellence", desc: "Every professional in our network has passed our rigorous screening protocol." },
                  { title: "Guaranteed Impact", desc: "If a placement isn't a perfect fit within 60 days, we replace them at zero cost." }
                ].map((diff, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{diff.title}</h3>
                      <p className="text-muted-foreground font-light">{diff.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square md:aspect-[4/3] bg-card border border-border p-8 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
              <div className="relative z-10 w-full max-w-sm">
                <div className="space-y-4">
                  {[85, 100, 60].map((width, i) => (
                    <motion.div 
                      key={i}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${width}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className="h-2 bg-primary/20 rounded-full overflow-hidden"
                    >
                      <div className="h-full bg-primary" />
                    </motion.div>
                  ))}
                </div>
                <p className="mt-8 text-center text-sm font-medium tracking-widest text-white/50 uppercase">PRECISION MATCHING</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 bg-black/40 border-y border-border/50">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-16 text-center">Trusted by Industry Leaders</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { quote: "Aurum provided us with a VP of Sales who redefined our entire GTM strategy. The quality of their network is simply unmatched in the market.", author: "Sarah Jenkins", role: "CEO, Nexa Enterprise", company: "NEXA" },
              { quote: "We needed a CTO to lead a critical digital transformation. Aurum presented three candidates in 48 hours. All three could have done the job.", author: "Marcus Thorne", role: "Managing Partner", company: "THORNE CAPITAL" }
            ].map((test, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-10 border border-border bg-card/50 relative"
              >
                <div className="text-6xl font-serif text-primary/20 absolute top-6 left-6 leading-none">"</div>
                <p className="text-lg font-light text-white mb-8 relative z-10 italic">
                  {test.quote}
                </p>
                <div className="flex justify-between items-end border-t border-border/50 pt-6">
                  <div>
                    <div className="font-bold text-white">{test.author}</div>
                    <div className="text-sm text-muted-foreground">{test.role}</div>
                  </div>
                  <div className="text-sm font-bold tracking-widest text-primary/60">{test.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent mix-blend-overlay" />
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-primary-foreground mb-6">Ready to elevate your team?</h2>
          <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto mb-10 font-light">
            Schedule a confidential consultation to discuss your specific requirements.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-black h-16 px-10 text-lg font-bold tracking-wide">
              BOOK YOUR CALL
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}