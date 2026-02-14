import { useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Lessons } from './pages/Lessons';
import { LessonView } from './pages/LessonView';
import { Tabuada } from './pages/Tabuada';
import { Treinar } from './pages/Treinar';
import { Planos } from './pages/Planos';

type PageType = 'painel' | 'aulas' | 'lesson-view' | 'tabuada' | 'treinar' | 'planos';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('painel');

  const handleNavigate = (page: 'painel' | 'aulas' | 'tabuada' | 'treinar' | 'planos') => {
    setCurrentPage(page);
  };

  const handleStartLesson = () => {
    setCurrentPage('lesson-view');
  };

  const handleBackToLessons = () => {
    setCurrentPage('aulas');
  };

  const handleBackToHome = () => {
    setCurrentPage('painel');
  };

  if (currentPage === 'lesson-view') {
    return <LessonView onBack={handleBackToLessons} onHome={handleBackToHome} />;
  }

  if (currentPage === 'aulas') {
    return <Lessons onNavigate={handleNavigate} onStartLesson={handleStartLesson} />;
  }

  if (currentPage === 'tabuada') {
    return <Tabuada onNavigate={handleNavigate} />;
  }

  if (currentPage === 'treinar') {
    return <Treinar onNavigate={handleNavigate} />;
  }

  if (currentPage === 'planos') {
    return <Planos onNavigate={handleNavigate} />;
  }

  return <Dashboard onNavigate={handleNavigate} />;
}