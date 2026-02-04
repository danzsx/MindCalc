import { BarChart3, BookOpen, Target, Menu, X } from 'lucide-react';
import { useState } from 'react';

type PageType = 'dashboard' | 'lessons' | 'training' | 'billing';

interface MobileNavProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
}

export function MobileNav({ currentPage, setCurrentPage }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as PageType, label: 'Dashboard', icon: BarChart3 },
    { id: 'lessons' as PageType, label: 'Aulas', icon: BookOpen },
    { id: 'training' as PageType, label: 'Treinar', icon: Target },
  ];

  const billingItem = { id: 'billing' as PageType, label: 'Assinar Pro', emoji: '✨' };

  const handleNavClick = (page: PageType) => {
    setCurrentPage(page);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden animate-in fade-in" onClick={() => setIsOpen(false)}>
          <div 
            className="bg-card w-64 h-full shadow-2xl animate-in duration-300" 
            style={{ animation: 'slide-in-left 300ms ease-in-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-primary" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem' }}>
                  MindCalc
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <X size={24} />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        currentPage === item.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon size={20} />
                      <span style={{ fontWeight: currentPage === item.id ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)' }}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
                
                <div className="pt-4 border-t border-border">
                  <button
                    onClick={() => handleNavClick(billingItem.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      currentPage === billingItem.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                    style={{ fontWeight: 'var(--font-weight-medium)' }}
                  >
                    <span>{billingItem.emoji}</span>
                    <span>{billingItem.label}</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
