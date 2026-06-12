import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '#about' },
];

export default function PublicNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  const isActive = (href: string) => {
    if (href.startsWith('#')) return location.hash === href;
    return location.pathname === href;
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#111827]/90 backdrop-blur-md border-b border-white/5 shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 cursor-pointer bg-transparent border-0"
          >
            <span
              className="text-xl lg:text-2xl font-bold text-white"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              FinTrack
            </span>
            <span className="text-[#F59E0B] text-2xl lg:text-3xl leading-none">
              .
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={cn(
                  'text-sm font-medium transition-colors cursor-pointer bg-transparent border-0',
                  isActive(link.href)
                    ? 'text-[#F59E0B]'
                    : 'text-slate-300 hover:text-white'
                )}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-white/5"
              onClick={() => navigate('/auth')}
            >
              Log In
            </Button>
            <Button
              className="bg-[#F59E0B] text-[#0B1121] font-semibold hover:bg-[#FBBF24]"
              onClick={() => navigate('/auth')}
            >
              Start Free
            </Button>
          </div>

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] bg-[#111827] border-l border-white/10 p-0"
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-8">
                  <span
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                  >
                    FinTrack<span className="text-[#F59E0B]">.</span>
                  </span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-white">
                      <X className="size-5" />
                    </Button>
                  </SheetClose>
                </div>

                <nav className="flex flex-col gap-2 flex-1">
                  {navLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => handleNavClick(link.href)}
                      className={cn(
                        'text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-transparent border-0',
                        isActive(link.href)
                          ? 'text-[#F59E0B] bg-[#F59E0B]/10'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      )}
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>

                <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/5 w-full"
                    onClick={() => {
                      setOpen(false);
                      navigate('/auth');
                    }}
                  >
                    Log In
                  </Button>
                  <Button
                    className="bg-[#F59E0B] text-[#0B1121] font-semibold hover:bg-[#FBBF24] w-full"
                    onClick={() => {
                      setOpen(false);
                      navigate('/auth');
                    }}
                  >
                    Start Free
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
