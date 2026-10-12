import React from 'react';
import { AppSection } from '../types';
import { BookOpen, Gauge, MessageSquareCode, Award, CheckCircle2, Lock } from 'lucide-react';

interface HeaderProps {
  currentSection: AppSection;
  onSelectSection: (section: AppSection) => void;
  unlockedSections: {
    theory: boolean;
    simulator: boolean;
    socratic: boolean;
    evaluation: boolean;
  };
  socraticPassed: boolean;
  examPassed: boolean;
  studentName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  onSelectSection,
  unlockedSections,
  socraticPassed,
  examPassed,
  studentName,
}) => {
  const navItems = [
    {
      id: 'theory' as AppSection,
      number: '1',
      title: 'Marco Teórico',
      subtitle: 'Subtemas 3.2.1 - 3.2.5',
      icon: BookOpen,
      unlocked: unlockedSections.theory,
      completed: unlockedSections.simulator,
    },
    {
      id: 'simulator' as AppSection,
      number: '2',
      title: 'Simulador & Lab Virtual',
      subtitle: '4 Cuadrantes & Cargas',
      icon: Gauge,
      unlocked: unlockedSections.simulator,
      completed: unlockedSections.socratic,
    },
    {
      id: 'socratic' as AppSection,
      number: '3',
      title: 'Tutor Socrático IA',
      subtitle: 'Validación Obligatoria (3/3)',
      icon: MessageSquareCode,
      unlocked: unlockedSections.socratic,
      completed: socraticPassed,
    },
    {
      id: 'evaluation' as AppSection,
      number: '4',
      title: 'Examen & Constancia',
      subtitle: '20 Reactivos Oficiales',
      icon: Award,
      unlocked: unlockedSections.evaluation,
      completed: examPassed,
    },
  ];

  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 shadow-xl print:hidden">
      {/* Top Banner Institutional Header */}
      <div className="bg-gradient-to-r from-[#1B396A] via-[#152e55] to-[#0f2240] text-white px-4 py-3 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-black text-xl text-yellow-400 shadow-inner">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest bg-yellow-400/20 text-yellow-300 font-semibold px-2 py-0.5 rounded border border-yellow-400/30">
                  TecNM / ITSC
                </span>
                <span className="text-xs text-slate-200 font-medium">
                  División de Ingeniería Mecatrónica
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Instituto Tecnológico Superior de Comalcalco
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div className="hidden sm:block">
              <p className="text-xs text-blue-200">Asignatura: Electrónica de Potencia Aplicada (MTJ-1012)</p>
              <p className="text-xs font-semibold text-white">Tema 3.2 Modos de funcionamiento electrónico y electromecánico</p>
            </div>
            {studentName && (
              <div className="bg-white/10 px-3 py-1 rounded-md border border-white/15 text-xs text-blue-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Alumno: <strong className="text-white">{studentName}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Modules Stepper */}
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <nav className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            const isUnlocked = item.unlocked;
            const isCompleted = item.completed;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => isUnlocked && onSelectSection(item.id)}
                disabled={!isUnlocked}
                className={`relative group flex items-center gap-3 p-2.5 rounded-lg border transition-all text-left ${
                  isActive
                    ? 'bg-blue-950/80 border-blue-500 text-white shadow-md shadow-blue-900/30 ring-1 ring-blue-500/50'
                    : isUnlocked
                    ? 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700 cursor-pointer'
                    : 'bg-slate-900/30 border-slate-800/50 text-slate-500 opacity-60 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 font-bold text-xs transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                      : isUnlocked
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-slate-800/40 text-slate-600'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Icon className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Módulo {item.number}
                    </span>
                    {!isUnlocked && <Lock className="w-3 h-3 text-amber-500/70" />}
                    {isCompleted && (
                      <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-800/50">
                        Listo
                      </span>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold truncate text-slate-100">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate hidden lg:block">
                    {item.subtitle}
                  </div>
                </div>

                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
