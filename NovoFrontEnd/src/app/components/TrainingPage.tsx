import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

type Exercise = {
  num1: number;
  num2: number;
  operation: '+' | '-' | '×' | '÷';
  correctAnswer: number;
};

export function TrainingPage() {
  const [isTraining, setIsTraining] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(1);
  const [totalExercises] = useState(10);
  const [timer, setTimer] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [finalTime, setFinalTime] = useState(0);

  useEffect(() => {
    if (isTraining && !exercise) {
      generateExercise();
    }
  }, [isTraining]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTraining]);

  const generateExercise = () => {
    const operations: Array<'+' | '-' | '×' | '÷'> = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1: number, num2: number, correctAnswer: number;
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 10;
        num2 = Math.floor(Math.random() * 50) + 10;
        correctAnswer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 30;
        num2 = Math.floor(Math.random() * 30) + 10;
        correctAnswer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 12) + 2;
        num2 = Math.floor(Math.random() * 12) + 2;
        correctAnswer = num1 * num2;
        break;
      default:
        num1 = 10;
        num2 = 5;
        correctAnswer = 2;
    }
    
    setExercise({ num1, num2, operation, correctAnswer });
  };

  const handleStartTraining = () => {
    setIsTraining(true);
    setCurrentExercise(1);
    setTimer(0);
    setUserAnswer('');
    setShowCompleted(false);
    generateExercise();
  };

  const handleRestart = () => {
    setShowCompleted(false);
    handleStartTraining();
  };

  const handleConfirm = () => {
    if (!userAnswer || !exercise) return;

    const isCorrect = parseInt(userAnswer) === exercise.correctAnswer;
    
    if (isCorrect) {
      if (currentExercise < totalExercises) {
        setCurrentExercise((prev) => prev + 1);
        setUserAnswer('');
        generateExercise();
      } else {
        // Treino completo
        setFinalTime(timer);
        setShowCompleted(true);
        setIsTraining(false);
        setExercise(null);
      }
    } else {
      // Resposta incorreta - feedback suave
      const input = document.querySelector('input');
      if (input) {
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
      }
    }
  };

  const handleEndTraining = () => {
    if (window.confirm('Deseja realmente encerrar o treino?')) {
      setIsTraining(false);
      setExercise(null);
      setUserAnswer('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${Math.floor((seconds % 1) * 10)}`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  if (showCompleted) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-card rounded-[20px] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-foreground mb-3">Treino Concluído!</h2>
          <p className="text-muted-foreground mb-2">
            Você completou todos os {totalExercises} exercícios
          </p>
          <div className="text-3xl text-primary mb-8" style={{ fontFamily: 'monospace', fontWeight: 'var(--font-weight-bold)' }}>
            {formatTime(finalTime)}
          </div>
          <button
            onClick={handleRestart}
            className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 min-h-[56px]"
            style={{ fontWeight: 'var(--font-weight-medium)' }}
          >
            Treinar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!isTraining) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-card rounded-[20px] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] max-w-md w-full">
          <h2 className="text-foreground mb-4">Treino Mental</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Você receberá 10 exercícios adaptados ao seu nível atual (6). 
            Responda o mais rápido e corretamente que puder.
          </p>
          <button
            onClick={handleStartTraining}
            className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 min-h-[56px]"
            style={{ fontWeight: 'var(--font-weight-medium)' }}
          >
            Iniciar treino
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-card rounded-[20px] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-foreground">Treino</h3>
          <div className="flex items-center gap-4">
            <div className="text-muted-foreground" style={{ fontFamily: 'monospace', fontSize: '1.125rem', fontWeight: 'var(--font-weight-medium)' }}>
              {formatTime(timer)}
            </div>
            <button
              onClick={handleEndTraining}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-lg"
              title="Encerrar treino"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="text-center mb-10">
          <div className="text-sm text-muted-foreground">
            {currentExercise} / {totalExercises}
          </div>
        </div>

        {/* Exercise */}
        {exercise && (
          <>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 text-4xl lg:text-5xl" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                <span className="text-foreground">{exercise.num1}</span>
                <span className="text-primary">{exercise.operation}</span>
                <span className="text-foreground">{exercise.num2}</span>
                <span className="text-muted-foreground">=</span>
                <span className="text-foreground">?</span>
              </div>
            </div>

            {/* Answer Input */}
            <div className="mb-6">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Sua resposta"
                autoFocus
                className="w-full px-6 py-4 bg-muted text-foreground rounded-xl border-2 border-primary/30 focus:border-primary focus:outline-none transition-colors text-lg text-center"
                style={{ fontWeight: 'var(--font-weight-medium)' }}
              />
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              disabled={!userAnswer}
              className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg transition-all duration-300 min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:shadow-md disabled:transform-none"
              style={{ fontWeight: 'var(--font-weight-medium)' }}
            >
              Confirmar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
