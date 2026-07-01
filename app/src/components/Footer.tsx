export default function Footer() {
  return (
    <footer className="py-6 px-8 border-t border-warm-gray bg-warm-cream">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2">
          <img src="/logo-icon.svg" alt="FinTrack" className="w-5 h-5" />
          <span className="font-serif text-sm font-semibold text-neutral-200">
            FinTrack<span className="text-accent-gold">.</span>
          </span>
        </div>
        <p className="font-caption text-neutral-300">
          &copy; {new Date().getFullYear()} FinTrack. Tous droits reserves.
        </p>
        <a
          href="https://www.beonweb.cm/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-caption text-neutral-400 hover:text-accent-gold transition-colors"
        >
          Conçu par Beonweb
        </a>
        <p className="font-caption text-neutral-400">
          Version 1.0.0
        </p>
      </div>
    </footer>
  )
}
