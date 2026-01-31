import { useState } from 'react';
import { TrendingUp, Flame, Target, BarChart3, BookOpen, User } from 'lucide-react';
import { StatsCard } from '@/app/components/StatsCard';
import { InteractiveSection } from '@/app/components/InteractiveSection';
import { EvolutionChart } from '@/app/components/EvolutionChart';
import { WeakPointsSection } from '@/app/components/WeakPointsSection';
import { LessonsPage } from '@/app/components/LessonsPage';
import { TrainingPage } from '@/app/components/TrainingPage';
import { BillingPage } from '@/app/components/BillingPage';
import { MobileNav } from '@/app/components/MobileNav';

type PageType = 'dashboard' | 'lessons' | 'training' | 'billing';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-primary cursor-pointer" style={{ fontFamily: 'var(--font-family-display)' }}>
                MindCalc
              </h1>
              <nav className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => setCurrentPage('dashboard')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === 'dashboard' 
                      ? 'text-foreground bg-muted' 
                      : 'text-muted-foreground hover:text-primary hover:bg-muted'
                  }`}
                >
                  <BarChart3 size={18} />
                  <span>Dashboard</span>
                </button>
                <button 
                  onClick={() => setCurrentPage('lessons')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === 'lessons' 
                      ? 'text-foreground bg-muted' 
                      : 'text-muted-foreground hover:text-primary hover:bg-muted'
                  }`}
                >
                  <BookOpen size={18} />
                  <span>Aulas</span>
                </button>
                <button 
                  onClick={() => setCurrentPage('training')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === 'training' 
                      ? 'text-foreground bg-muted' 
                      : 'text-muted-foreground hover:text-primary hover:bg-muted'
                  }`}
                >
                  <Target size={18} />
                  <span>Treinar</span>
                </button>
              </nav>
              <button 
                onClick={() => setCurrentPage('billing')}
                className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentPage === 'billing' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
                style={{ fontWeight: 'var(--font-weight-medium)' }}
              >
                <span>✨</span>
                <span>Assinar Pro</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <User size={20} />
                <span className="text-sm">federicoalcarez@gmail...</span>
              </button>
              <MobileNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
        {currentPage === 'dashboard' && <DashboardContent setCurrentPage={setCurrentPage} />}
        {currentPage === 'lessons' && <LessonsPage />}
        {currentPage === 'training' && <TrainingPage />}
        {currentPage === 'billing' && <BillingPage />}
      </main>
    </div>
  );
}

function DashboardContent({ setCurrentPage }: { setCurrentPage: (page: PageType) => void }) {
  return (
    <>
      {/* Title and CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-foreground">Dashboard</h1>
        <button 
          onClick={() => setCurrentPage('training')}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 min-h-[56px]"
        >
          <span style={{ fontWeight: 'var(--font-weight-medium)' }}>Iniciar Treino</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <StatsCard
          icon={<TrendingUp className="text-primary" size={24} />}
          value="6"
          label="Nível"
          iconBg="bg-primary/10"
        />
        <StatsCard
          icon={<Flame className="text-secondary" size={24} />}
          value="1 dias"
          label="Sequência"
          iconBg="bg-secondary/10"
        />
        <StatsCard
          icon={<Target className="text-primary" size={24} />}
          value="49%"
          label="Precisão Média"
          iconBg="bg-primary/10"
        />
        <StatsCard
          icon={<BarChart3 className="text-primary" size={24} />}
          value="4"
          label="Sessões"
          iconBg="bg-primary/10"
        />
      </div>

      {/* Interactive Lessons Section */}
      <div className="mb-8">
        <InteractiveSection onNavigateToLessons={() => setCurrentPage('lessons')} />
      </div>

      {/* Evolution Chart */}
      <EvolutionChart />

      {/* Weak Points */}
      <WeakPointsSection />
    </>
  );
}


