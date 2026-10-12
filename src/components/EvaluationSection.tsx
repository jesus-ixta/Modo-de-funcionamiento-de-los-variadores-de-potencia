import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { StudentInfo } from '../types';
import { RenderRichTextWithMath } from './MathView';
import {
  Award,
  CheckCircle,
  XCircle,
  FileText,
  Printer,
  RotateCcw,
  Clock,
  ShieldCheck,
  User,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface EvaluationSectionProps {
  studentInfo: StudentInfo;
  onUpdateStudentInfo: (info: StudentInfo) => void;
  onExamCompleted: (score: number) => void;
}

export const EvaluationSection: React.FC<EvaluationSectionProps> = ({
  studentInfo,
  onUpdateStudentInfo,
  onExamCompleted,
}) => {
  // Step state: 'form' | 'exam' | 'results'
  const [step, setStep] = useState<'form' | 'exam' | 'results'>(
    studentInfo.name ? 'exam' : 'form'
  );

  // Form state
  const [formName, setFormName] = useState<string>(studentInfo.name || '');
  const [formControl, setFormControl] = useState<string>(studentInfo.controlNumber || '');
  const [formGroup, setFormGroup] = useState<string>(studentInfo.semesterGroup || '7mo Semestre - Mecatrónica');

  // Exam answers state: mapping of questionId -> 'A' | 'B' | 'C' | 'D'
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [scorePercentage, setScorePercentage] = useState<number>(0);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [emissionDate, setEmissionDate] = useState<string>('');

  // Handle Form Submission
  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    onUpdateStudentInfo({
      name: formName.trim(),
      controlNumber: formControl.trim() || '21E50001',
      semesterGroup: formGroup.trim(),
    });

    setStep('exam');
  };

  // Handle Answer Selection
  const handleSelectOption = (questionId: number, optionKey: 'A' | 'B' | 'C' | 'D') => {
    if (examSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  // Submit Exam
  const handleSubmitExam = () => {
    const totalQuestions = QUIZ_QUESTIONS.length;
    let correctCount = 0;

    QUIZ_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
    setScorePercentage(calculatedScore);

    // Generate random 8-character verification ID
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    setVerificationCode(randomHex);

    const now = new Date();
    const formattedDate = `${now.getDate()} de ${now.toLocaleString('es-MX', { month: 'long' })} de ${now.getFullYear()}`;
    setEmissionDate(formattedDate);

    setExamSubmitted(true);
    setStep('results');
    onExamCompleted(calculatedScore);
  };

  // Retake Exam
  const handleRetakeExam = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setExamSubmitted(false);
    setScorePercentage(0);
    setStep('exam');
  };

  // Print Certificate trigger
  const handlePrintCertificate = () => {
    window.print();
  };

  const answeredCount = Object.keys(userAnswers).length;
  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUIZ_QUESTIONS.length - 1;

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 py-6">
      {/* STEP 1: Identification Form */}
      {step === 'form' && (
        <div className="max-w-xl mx-auto bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto text-2xl shadow-inner">
              🎓
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Registro para Examen Oficial de Acreditación
            </h2>
            <p className="text-xs text-slate-400">
              Ingresa tus datos institucionales tal como deben figurar en la Constancia Oficial de Acreditación emitida por el ITSC.
            </p>
          </div>

          <form onSubmit={handleStartExam} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Nombre Completo del Alumno *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Ing. Juan Manuel Pérez Hernández"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Número de Control / Matrícula
              </label>
              <input
                type="text"
                placeholder="Ej. 21E50145"
                value={formControl}
                onChange={(e) => setFormControl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Semestre y Grupo
              </label>
              <input
                type="text"
                placeholder="Ej. 7mo Semestre - Grupo A"
                value={formGroup}
                onChange={(e) => setFormGroup(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="p-3.5 bg-blue-950/40 rounded-xl border border-blue-900/60 text-xs text-blue-200 space-y-1">
              <span className="font-bold block text-blue-100">📋 Parámetros de la Evaluación:</span>
              <p>• 20 preguntas de opción múltiple estructuradas por competencias mecatrónicas.</p>
              <p>• Calificación mínima aprobatoria: <strong>80% (16 de 20 aciertos)</strong>.</p>
              <p>• Emisión inmediata de Constancia con Código de Verificación Digital.</p>
            </div>

            <button
              type="submit"
              disabled={!formName.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-blue-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Comenzar Examen Oficial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: Exam Questions UI */}
      {step === 'exam' && (
        <div className="space-y-6">
          {/* Header with Progress & Timer */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold mb-1">
                <span>Alumno: {studentInfo.name || formName}</span>
                <span>•</span>
                <span className="font-mono">{studentInfo.controlNumber || formControl}</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                Examen Oficial: Tema 3.2 Modos de Funcionamiento
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Progreso</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {answeredCount} / {QUIZ_QUESTIONS.length} respondidas
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-24 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(answeredCount / QUIZ_QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Question Navigation Numbers Bar */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-wrap gap-1.5 justify-center sm:justify-start">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isCurrent = currentQuestionIndex === idx;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-md'
                      : isAnswered
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {q.id}
                </button>
              );
            })}
          </div>

          {/* Active Question Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-bold font-mono border border-blue-500/30">
                  Pregunta {currentQ.id} de 20
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                  {currentQ.category}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {userAnswers[currentQ.id] ? 'Respondida' : 'Sin responder'}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              <RenderRichTextWithMath text={currentQ.question} />
            </h3>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((opt) => {
                const isSelected = userAnswers[currentQ.id] === opt.key;

                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectOption(currentQ.id, opt.key)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-950/80 border-blue-500 text-white shadow-lg ring-1 ring-blue-500/50'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {opt.key}
                    </div>
                    <div className="text-xs sm:text-sm mt-0.5 leading-relaxed flex-1">
                      <RenderRichTextWithMath text={opt.text} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons between questions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold transition-colors cursor-pointer"
              >
                ← Anterior
              </button>

              <div className="flex items-center gap-3">
                {!isLastQuestion ? (
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) => Math.min(QUIZ_QUESTIONS.length - 1, prev + 1))
                    }
                    className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Siguiente</span>
                    <span>→</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitExam}
                    className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950 flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Finalizar y Calificar Examen</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Results & Official Certificate */}
      {step === 'results' && (
        <div className="space-y-8">
          {/* Results Score Banner */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 print:hidden">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider">
                {scorePercentage >= 80 ? '🎉 Acreditación Exitosa' : '⚠️ Evaluación no Acreditada'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Resultado de la Evaluación Oficial
              </h2>
              <p className="text-slate-300 text-sm max-w-xl">
                Alumno: <strong className="text-white">{studentInfo.name || formName}</strong> | Clave: MTJ-1012 ITSC
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <div className="bg-slate-950 px-6 py-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Calificación</span>
                <span
                  className={`text-3xl sm:text-4xl font-extrabold font-mono ${
                    scorePercentage >= 80 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {scorePercentage}%
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {Math.round((scorePercentage / 100) * 20)} de 20 aciertos (Mínimo: 80%)
                </span>
              </div>

              {scorePercentage >= 80 ? (
                <button
                  onClick={handlePrintCertificate}
                  className="px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-950 flex items-center gap-2.5 transition-all cursor-pointer transform active:scale-95"
                >
                  <Printer className="w-5 h-5" />
                  <span>Descargar Constancia en PDF / Imprimir</span>
                </button>
              ) : (
                <button
                  onClick={handleRetakeExam}
                  className="px-6 py-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-xl shadow-amber-950 flex items-center gap-2.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Reintentar Examen</span>
                </button>
              )}
            </div>
          </div>

          {/* OFFICIAL ACCREDITATION CERTIFICATE (RENDERED ACCORDING TO SYSTEM SPECIFICATION) */}
          {scorePercentage >= 80 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-2 print:hidden">
                <span className="font-semibold text-slate-300">Vista Previa de la Constancia Oficial TecNM / ITSC:</span>
                <span>Usa el botón de impresión para guardar como PDF en orientación horizontal o vertical</span>
              </div>

              {/* Exact HTML template requested by user */}
              <div
                id="official-certificate-container"
                className="overflow-hidden rounded-xl shadow-2xl transition-all"
                style={{
                  border: '8px solid #1B396A',
                  padding: '40px',
                  backgroundColor: '#ffffff',
                  fontFamily: "'Arial', sans-serif",
                  textAlign: 'center',
                  color: '#1a1a1a',
                }}
              >
                <div style={{ border: '2px solid #1B396A', padding: '30px' }}>
                  <h3 style={{ color: '#1B396A', margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                    TECNOLÓGICO NACIONAL DE MÉXICO
                  </h3>
                  <h2 style={{ color: '#1B396A', margin: '5px 0 20px 0', fontSize: '22px', fontWeight: 'bold' }}>
                    INSTITUTO TECNOLÓGICO SUPERIOR DE COMALCALCO
                  </h2>
                  <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>
                    División de Ingeniería Mecatrónica
                  </p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>
                    Asignatura: Electrónica de Potencia Aplicada (MTJ-1012)
                  </p>

                  <hr style={{ border: 0, height: '2px', background: '#1B396A', margin: '25px 0' }} />

                  <p style={{ fontSize: '16px', color: '#333' }}>Otorga la presente</p>
                  <h1 style={{ color: '#1B396A', fontSize: '30px', margin: '10px 0', letterSpacing: '2px', fontWeight: 'bold' }}>
                    CONSTANCIA DE ACREDITACIÓN
                  </h1>
                  <p style={{ fontSize: '16px', color: '#333' }}>A:</p>

                  <h2
                    style={{
                      color: '#000',
                      fontSize: '26px',
                      borderBottom: '2px solid #333',
                      display: 'inline-block',
                      paddingBottom: '5px',
                      margin: '10px 0',
                      fontWeight: 'bold',
                    }}
                  >
                    {studentInfo.name || formName}
                  </h2>

                  <p style={{ fontSize: '15px', color: '#444', maxWidth: '650px', margin: '25px auto', lineHeight: '1.6' }}>
                    Por haber demostrado las competencias teóricas, experimentales y metacognitivas en el tema:<br />
                    <strong>"3.2 Modos de funcionamiento electrónico y electromecánico"</strong><br />
                    mediante el entorno interactivo de aprendizaje y simulación de la materia.
                  </p>

                  <div
                    style={{
                      backgroundColor: '#f0f4f8',
                      border: '1px solid #1B396A',
                      display: 'inline-block',
                      padding: '10px 30px',
                      borderRadius: '8px',
                      margin: '15px 0',
                    }}
                  >
                    <span style={{ fontSize: '16px', color: '#1B396A', fontWeight: 'bold' }}>
                      Calificación Obtenida:{' '}
                    </span>
                    <span style={{ fontSize: '22px', color: '#d9534f', fontWeight: 'bold' }}>
                      {scorePercentage}/100
                    </span>
                  </div>

                  <br /><br />
                  <p style={{ fontSize: '12px', color: '#777', marginTop: '20px', lineHeight: '1.5' }}>
                    Comalcalco, Tabasco, México | Fecha de Emisión: {emissionDate || '12 de Octubre de 2026'}<br />
                    Código de Verificación Digital: ITSC-EPA-32-{verificationCode || 'A89F3C'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Question Review & Explanations */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4 print:hidden">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Revisión Técnica y Retroalimentación de los 20 Reactivos
            </h3>

            <div className="space-y-3">
              {QUIZ_QUESTIONS.map((q) => {
                const userChoice = userAnswers[q.id];
                const isCorrect = userChoice === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
                      isCorrect
                        ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                        : 'bg-rose-950/20 border-rose-900/40 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className="font-bold text-slate-200">
                          Reactivo {q.id}: {q.category}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">
                        Tu respuesta: <strong>{userChoice || 'Sin contestar'}</strong> | Correcta: <strong>{q.correctAnswer}</strong>
                      </span>
                    </div>

                    <div className="font-medium text-slate-300 pl-6 leading-relaxed">
                      <RenderRichTextWithMath text={q.question} />
                    </div>

                    <div className="pl-6 pt-1 text-[11px] text-slate-400 border-t border-slate-800/80 leading-relaxed">
                      <strong className="text-blue-300">Explicación:</strong>{' '}
                      <RenderRichTextWithMath text={q.explanation} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
