import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const PROFILES = [
  { id: 1, title: "VP of Enterprise Sales", domain: "Revenue", experience: "12+ years", rate: "$$$", available: true },
  { id: 2, title: "Principal Systems Engineer", domain: "Technology", experience: "10+ years", rate: "$$$", available: false },
  { id: 3, title: "Director of RevOps", domain: "Operations", experience: "8+ years", rate: "$$", available: true },
  { id: 4, title: "Fractional CMO", domain: "Marketing", experience: "15+ years", rate: "$$$", available: true },
  { id: 5, title: "Head of Product Strategy", domain: "Product", experience: "10+ years", rate: "$$$", available: true },
  { id: 6, title: "Strategic Finance Lead", domain: "Finance", experience: "7+ years", rate: "$$", available: true },
];

const DOMAINS = ["All", "Revenue", "Technology", "Operations", "Marketing", "Product", "Finance"];

export default function Services() {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? PROFILES : PROFILES.filter(p => p.domain === filter);

  return (
    <Layout>
      <div className="pt-32 pb-20 border-b border-border/50">
        <div className="container mx-auto px-6 md:px-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6"
          >
            Our Network
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl font-light"
          >
            Browse archetypes of the caliber of professionals currently in our exclusive network. 
            All profiles represent real capabilities.
          </motion.p>
        </div>
      </div>

      <div className="py-12 container mx-auto px-6 md:px-12 min-h-[50vh]">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {DOMAINS.map((domain) => (
            <button
              key={domain}
              onClick={() => setFilter(domain)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === domain 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card border border-border text-muted-foreground hover:text-white hover:border-primary/50"
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((profile, i) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group p-6 border border-border bg-card/30 hover:bg-card hover:border-primary/50 transition-all flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold tracking-widest text-primary uppercase">{profile.domain}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-sm ${profile.available ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"}`}>
                  {profile.available ? "AVAILABLE" : "DEPLOYED"}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 leading-tight">{profile.title}</h3>
              
              <div className="mt-auto space-y-2 pt-6 border-t border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-medium text-white">{profile.experience}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rate Tier</span>
                  <span className="font-medium text-white">{profile.rate}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No profiles match the current filter.
          </div>
        )}

        <div className="mt-20 p-8 border border-primary/30 bg-primary/5 text-center rounded-sm">
          <h3 className="text-2xl font-bold text-white mb-4">Don't see what you need?</h3>
          <p className="text-muted-foreground mb-6">Our network extends beyond these public archetypes.</p>
          <Link href="/contact">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">INQUIRE ABOUT CUSTOM PROFILES</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}