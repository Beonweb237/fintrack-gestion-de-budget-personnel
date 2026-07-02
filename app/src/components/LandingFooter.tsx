import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Security', 'API'],
  Resources: ['Blog', 'Help Center', 'Community', 'Tutorials'],
  Company: ['About', 'Careers', 'Contact', 'Press'],
  Legal: ['Privacy', 'Terms', 'Cookies', 'GDPR'],
};

export default function LandingFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0B1121] border-t border-[#1A2332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-1 mb-4">
              <span
                className="text-2xl font-bold text-white"
                style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
              >
                FinTrack
              </span>
              <span className="text-[#F59E0B] text-3xl leading-none">.</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              The intelligent budget tracker that helps you save more, spend
              wisely, and achieve your financial goals.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Github, label: 'GitHub' },
                { Icon: Linkedin, label: 'LinkedIn' },
                { Icon: Instagram, label: 'Instagram' },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-[#1A2332] flex items-center justify-center text-slate-400 hover:text-[#F59E0B] hover:bg-[#1A2332]/80 transition-colors cursor-pointer border-0"
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.Product.map((item) => (
                <li key={item}>
                  <button className="text-slate-400 text-sm hover:text-[#F59E0B] transition-colors cursor-pointer bg-transparent border-0 p-0">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.Resources.map((item) => (
                <li key={item}>
                  <button className="text-slate-400 text-sm hover:text-[#F59E0B] transition-colors cursor-pointer bg-transparent border-0 p-0">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.Company.map((item) => (
                <li key={item}>
                  <button className="text-slate-400 text-sm hover:text-[#F59E0B] transition-colors cursor-pointer bg-transparent border-0 p-0">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.Legal.map((item) => (
                <li key={item}>
                  <button className="text-slate-400 text-sm hover:text-[#F59E0B] transition-colors cursor-pointer bg-transparent border-0 p-0">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 p-6 rounded-2xl bg-[#1A2332]/60 border border-[#1A2332]"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-white font-semibold mb-1">
                Subscribe to our newsletter
              </h4>
              <p className="text-slate-400 text-sm">
                Get the latest updates on features and releases.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0B1121] border-[#1A2332] text-white placeholder:text-slate-500 focus-visible:ring-[#F59E0B]/30 w-full sm:w-64"
              />
              <Button
                type="submit"
                className="bg-[#F59E0B] text-[#0B1121] font-semibold hover:bg-[#FBBF24] shrink-0"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1A2332]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm flex items-center gap-2">
              <span>&copy; 2025 FinTrack. All rights reserved.</span>
            </p>
            <div className="flex items-center gap-4">
              {['EN', 'FR', 'ES'].map((lang) => (
                <button
                  key={lang}
                  className={cn(
                    'text-sm font-medium transition-colors cursor-pointer bg-transparent border-0 p-0',
                    lang === 'EN'
                      ? 'text-[#F59E0B]'
                      : 'text-slate-500 hover:text-slate-300'
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
