import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground dark">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50 py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-sm" />
            AURUM
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <Link href="/" className={`${location === "/" ? "text-primary" : "text-muted-foreground hover:text-white"} transition-colors`}>
              HOME
            </Link>
            <Link href="/services" className={`${location === "/services" ? "text-primary" : "text-muted-foreground hover:text-white"} transition-colors`}>
              SERVICES
            </Link>
            <Link href="/faq" className={`${location === "/faq" ? "text-primary" : "text-muted-foreground hover:text-white"} transition-colors`}>
              FAQ
            </Link>
            <Link href="/client" className={`${location === "/client" ? "text-primary" : "text-muted-foreground hover:text-white"} transition-colors`}>
              CLIENT PORTAL
            </Link>
            <Link href="/admin" className={`${location.startsWith("/admin") ? "text-primary" : "text-muted-foreground hover:text-white"} transition-colors`}>
              ADMIN
            </Link>
            <Link
              href="/contact"
              className="bg-primary text-primary-foreground px-5 py-2 rounded-sm hover:bg-primary/90 transition-colors"
            >
              BOOK A CALL
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background pt-24 px-6 pb-6 flex flex-col gap-6 md:hidden"
          >
            <Link href="/" className="text-2xl font-bold tracking-tighter">HOME</Link>
            <Link href="/services" className="text-2xl font-bold tracking-tighter">SERVICES</Link>
            <Link href="/faq" className="text-2xl font-bold tracking-tighter">FAQ</Link>
            <Link href="/client" className="text-2xl font-bold tracking-tighter">CLIENT PORTAL</Link>
            <Link href="/admin" className="text-2xl font-bold tracking-tighter">ADMIN</Link>
            <Link href="/contact" className="text-2xl font-bold tracking-tighter text-primary mt-4">BOOK A CALL</Link>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col">{children}</main>

      <footer className="border-t border-border/50 py-12 bg-background mt-auto">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="text-xl font-bold tracking-tighter text-white flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-primary rounded-sm" />
              AURUM
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              The premier global network for elite professional talent.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/legal" className="hover:text-white transition-colors">Legal & Privacy</Link>
          </div>
        </div>
        <div className="container mx-auto px-6 md:px-12 mt-12 text-xs text-muted-foreground/60 border-t border-border/30 pt-6">
          &copy; {new Date().getFullYear()} Aurum Global. All rights reserved.
        </div>
      </footer>
    </div>
  );
}