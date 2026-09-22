import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen, User } from 'lucide-react';
import { VisitorInfo } from '../types';
import { COHORT_INFO } from '../data/dummyData';

interface NavbarProps {
  visitor: VisitorInfo | null;
  onOpenLogin: () => void;
}

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Moments', href: '#moments' },
  { label: 'Biodata', href: '#biodata' },
  { label: 'Graduation', href: '#graduation' },
  { label: 'Before-After', href: '#before-after' },
  { label: 'Video Moments', href: '#video-moments' },
];

export const Navbar: React.FC<NavbarProps> = ({ visitor, onOpenLogin }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const sectionIds = ['home', 'moments', 'biodata', 'graduation', 'before-after', 'video-moments'];
      const scrollPosition = window.scrollY + 120;
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const navOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setActiveSection(targetId);
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-[#202940]/55 backdrop-blur-xl border-b border-[#CAAA98]/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]' : 'bg-transparent border-b border-transparent'}`}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'bg-white/[0.03] backdrop-blur-md rounded-b-2xl border-x border-b border-white/[0.08] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]' : 'bg-transparent'}`}>
        <div className="flex items-center justify-between h-18">
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} id="brand-logo-btn" className="flex items-center gap-3 group text-left cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-[#4B4038] border border-[#CAAA98]/40 flex items-center justify-center text-[#CAAA98] shadow-sm group-hover:border-[#CAAA98] transition-colors shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="block text-xs uppercase tracking-widest font-semibold text-[#9A8678]">Buku Kenangan</span>
              <span className="block text-base font-bold text-[#CAAA98] group-hover:text-white transition-colors">{COHORT_INFO.name}</span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1.5 bg-[#4B4038]/40 border border-[#4B4038] p-1.5 rounded-full">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a key={item.href} id={`nav-link-${item.href.replace('#', '')}`} href={item.href} onClick={(e) => handleNavClick(e, item.href)} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${isActive ? 'bg-[#CAAA98] text-[#202940] shadow-sm font-bold' : 'text-[#9A8678] hover:text-[#CAAA98] hover:bg-[#4B4038]/50'}`}>
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {visitor ? (
              <button type="button" onClick={onOpenLogin} id="btn-visitor-badge" title={`Profil tamu: ${visitor.name} (klik untuk ubah)`} className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:px-3 sm:py-1.5 bg-[#4B4038]/50 hover:bg-[#4B4038] border border-[#9A8678]/40 rounded-full text-xs text-[#CAAA98] transition-colors cursor-pointer">
                <div className="w-7 h-7 sm:w-5 sm:h-5 rounded-full bg-[#CAAA98] text-[#202940] flex items-center justify-center text-xs sm:text-[10px] font-bold shrink-0 shadow-sm">{visitor.name.charAt(0).toUpperCase()}</div>
                <span className="hidden sm:inline max-w-[130px] truncate font-medium">{visitor.name}</span>
              </button>
            ) : (
              <button type="button" onClick={onOpenLogin} id="btn-nav-login" title="Isi Buku Tamu" className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 bg-[#CAAA98] text-[#202940] hover:bg-[#CAAA98]/90 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap">
                <User className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="hidden sm:inline">Isi Buku Tamu</span>
              </button>
            )}

            <button type="button" id="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-xl bg-[#4B4038] text-[#CAAA98] hover:text-white focus:outline-none cursor-pointer shrink-0" aria-label="Toggle navigation menu">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#202940] border-b border-[#4B4038] px-4 pt-2 pb-6 space-y-2 shadow-2xl">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a key={item.href} id={`mobile-nav-${item.href.replace('#', '')}`} href={item.href} onClick={(e) => handleNavClick(e, item.href)} className={`block px-3 py-2 rounded-xl text-center text-xs font-semibold tracking-wide transition-colors ${isActive ? 'bg-[#CAAA98] text-[#202940] font-bold' : 'bg-[#4B4038]/50 text-[#9A8678] hover:text-[#CAAA98]'}`}>
                  {item.label}
                </a>
              );
            })}
          </div>
          <div className="pt-3 border-t border-[#4B4038] flex items-center justify-between gap-2">
            {visitor ? (
              <div className="flex items-center gap-2 text-xs text-[#CAAA98]">
                <div className="w-6 h-6 rounded-full bg-[#CAAA98] text-[#202940] flex items-center justify-center font-bold">{visitor.name.charAt(0)}</div>
                <span>Tamu: <strong>{visitor.name}</strong></span>
              </div>
            ) : (
              <button type="button" onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }} className="text-xs text-[#CAAA98] underline">Isi Buku Tamu</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
