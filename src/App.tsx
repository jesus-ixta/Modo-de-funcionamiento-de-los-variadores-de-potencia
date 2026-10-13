/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppSection, StudentInfo } from './types';
import { Header } from './components/Header';
import { TheorySection } from './components/TheorySection';
import { SimulatorSection } from './components/SimulatorSection';
import { SocraticSection } from './components/SocraticSection';
import { EvaluationSection } from './components/EvaluationSection';

export default function App() {
  const [currentSection, setCurrentSection] = useState<AppSection>('theory');
  const [unlockedSections, setUnlockedSections] = useState<{
    theory: boolean;
    simulator: boolean;
    socratic: boolean;
    evaluation: boolean;
  }>({
    theory: true,
    simulator: true,
    socratic: true,
    evaluation: true,
  });

  const [socraticPassed, setSocraticPassed] = useState<boolean>(false);
  const [examPassed, setExamPassed] = useState<boolean>(false);
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    name: '',
    controlNumber: '',
    semesterGroup: '7mo Semestre - Mecatrónica',
  });

  const handleProceedToSimulator = () => {
    setUnlockedSections((prev) => ({ ...prev, simulator: true }));
    setCurrentSection('simulator');
  };

  const handleProceedToSocratic = () => {
    setUnlockedSections((prev) => ({ ...prev, socratic: true }));
    setCurrentSection('socratic');
  };

  const handleSocraticPassed = () => {
    setSocraticPassed(true);
    setUnlockedSections((prev) => ({ ...prev, evaluation: true }));
  };

  const handleProceedToEvaluation = () => {
    setCurrentSection('evaluation');
  };

  const handleExamCompleted = (score: number) => {
    if (score >= 80) {
      setExamPassed(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Institutional Navigation Header */}
      <Header
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        unlockedSections={unlockedSections}
        socraticPassed={socraticPassed}
        examPassed={examPassed}
        studentName={studentInfo.name}
      />

      {/* Main Module Content */}
      <main className="flex-1 pb-12">
        {currentSection === 'theory' && (
          <TheorySection
            onProceedToSimulator={handleProceedToSimulator}
            isSimulatorUnlocked={unlockedSections.simulator}
          />
        )}

        {currentSection === 'simulator' && (
          <SimulatorSection
            onProceedToSocratic={handleProceedToSocratic}
            isSocraticUnlocked={unlockedSections.socratic}
          />
        )}

        {currentSection === 'socratic' && (
          <SocraticSection
            onSocraticPassed={handleSocraticPassed}
            socraticPassed={socraticPassed}
            onProceedToEvaluation={handleProceedToEvaluation}
            studentName={studentInfo.name}
          />
        )}

        {currentSection === 'evaluation' && (
          <EvaluationSection
            studentInfo={studentInfo}
            onUpdateStudentInfo={setStudentInfo}
            onExamCompleted={handleExamCompleted}
          />
        )}
      </main>

      {/* Institutional Academic Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">TecNM</span>
            <span>•</span>
            <span>Instituto Tecnológico Superior de Comalcalco</span>
          </div>
          <div>
            División de Ingeniería Mecatrónica | Electrónica de Potencia Aplicada (MTJ-1012)
          </div>
          <div className="text-[11px] text-slate-600">
            Comalcalco, Tabasco, México
          </div>
        </div>
      </footer>
    </div>
  );
}
