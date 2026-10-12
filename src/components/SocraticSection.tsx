import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { RenderRichTextWithMath } from './MathView';
import {
  MessageSquareCode,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  GraduationCap,
  AlertCircle,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

interface SocraticSectionProps {
  onSocraticPassed: () => void;
  socraticPassed: boolean;
  onProceedToEvaluation: () => void;
  studentName: string;
}

const QUESTIONS_METADATA = [
  {
    step: 1,
    title: 'Pregunta 1: Par Variable y Cargas Centrífugas',
    text:
      'En el simulador, al seleccionar la Bomba Centrífuga y reducir la frecuencia a 30 Hz, ¿qué ocurre con el par requerido por la carga en comparación con una cinta transportadora y por qué genera ahorro energético?',
    hint: 'Recuerda las leyes de afinidad: en fluidos centrífugos, ¿cómo varía el par con la velocidad (T ∝ n²)? ¿Y la potencia con qué exponente varía (P ∝ n³)?',
  },
  {
    step: 2,
    title: 'Pregunta 2: Potencia Constante y Debilitamiento de Campo',
    text:
      'Cuando llevas la frecuencia por encima de los 60 Hz en el modo de Potencia Constante, ¿por qué empieza a caer el par del motor? ¿Qué parámetro eléctrico se mantiene fijo?',
    hint: 'Piensa en los límites físicos del variador y el aislamiento del motor: ¿puede la tensión RMS seguir subiendo más allá de 460 V? ¿Qué le pasa a la relación V/f y al flujo magnético Φ?',
  },
  {
    step: 3,
    title: 'Pregunta 3: Frenado Regenerativo y Cuadrantes',
    text:
      'Si necesitas detener rápidamente un motor y aprovechar la energía de frenado para regresarla a la red, ¿qué tipo de variador requerimos utilizar (unidireccional o bidireccional) y en qué cuadrantes trabaja?',
    hint: 'Distingue entre un puente de diodos simple y un puente activo con IGBTs (AFE). ¿Cuáles son los dos cuadrantes donde la potencia mecánica es negativa (desaceleración en avance y desaceleración en reversa)?',
  },
];

export const SocraticSection: React.FC<SocraticSectionProps> = ({
  onSocraticPassed,
  socraticPassed,
  onProceedToEvaluation,
  studentName,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(1);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Chat conversation state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `¡Bienvenido al Módulo de Tutoría Socrática, ${studentName || 'estimado alumno de Mecatrónica'}! Soy tu Profesor de Electrónica de Potencia Aplicada en el Instituto Tecnológico Superior de Comalcalco (ITSC).\n\nMi función aquí no es darte respuestas directas, sino guiarte mediante el diálogo técnico para comprobar tu dominio experimental del Tema 3.2.\n\nPara desbloquear tu examen oficial, analizaremos tres planteamientos fundamentales de accionamientos eléctricos.\n\nComencemos con el primer reactivo:\n\n📌 **Pregunta 1:** ${QUESTIONS_METADATA[0].text}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessageText = inputText.trim();
    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: userMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setShowHint(false);

    try {
      // Call server backend endpoint /api/socratic-chat
      const response = await fetch('/api/socratic-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessageText,
          currentQuestionIndex: currentQuestionIndex,
          studentName: studentName || 'Estudiante',
          history: messages.slice(-6).map((m) => ({ role: m.role, text: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEvaluation: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.currentQuestionIndex) {
        setCurrentQuestionIndex(data.currentQuestionIndex);
      }

      if (data.socraticPassed || data.currentQuestionIndex >= 4) {
        onSocraticPassed();
      }
    } catch (error) {
      console.error('Chat error:', error);
      // Fallback message
      const fallbackMsg: ChatMessage = {
        id: `asst-err-${Date.now()}`,
        role: 'assistant',
        content:
          'Hubo una interrupción en la conexión con el servidor. Revisa tu argumento y vuelve a enviar tu respuesta técnica para que pueda evaluarla.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentQMeta =
    QUESTIONS_METADATA.find((q) => q.step === currentQuestionIndex) || QUESTIONS_METADATA[2];

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 py-6">
      {/* Socratic Banner */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" /> Módulo 3: Tutor Socrático Obligatorio
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Validación de Competencias Mecatrónicas con IA
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Para acceder al examen final, debes dialogar con el Tutor Socrático del ITSC y argumentar con rigor
            físico los fenómenos observados en el simulador.
          </p>
        </div>

        {/* Status Badge */}
        <div className="shrink-0 flex items-center gap-3">
          {socraticPassed ? (
            <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold shadow-lg shadow-emerald-950/40">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Acreditado (3 de 3 Aprobadas)</span>
            </div>
          ) : (
            <div className="bg-amber-950/80 border border-amber-500 text-amber-300 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Paso {Math.min(currentQuestionIndex, 3)} de 3 en Evaluación</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Stepper for the 3 Questions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {QUESTIONS_METADATA.map((q) => {
          const isDone = currentQuestionIndex > q.step || socraticPassed;
          const isCurrent = currentQuestionIndex === q.step && !socraticPassed;

          return (
            <div
              key={q.step}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isDone
                  ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
                  : isCurrent
                  ? 'bg-blue-950/70 border-blue-500 text-white shadow-lg ring-1 ring-blue-500/40'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="uppercase tracking-wider">Reactivo {q.step}</span>
                {isDone ? (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" /> Aprobado
                  </span>
                ) : isCurrent ? (
                  <span className="flex items-center gap-1 text-[10px] text-blue-300 font-semibold bg-blue-950 px-2 py-0.5 rounded border border-blue-800 animate-pulse">
                    En Evaluación
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Pendiente</span>
                )}
              </div>
              <div className="text-xs font-semibold line-clamp-2 text-slate-200">{q.title}</div>
            </div>
          );
        })}
      </div>

      {/* Congratulatory Unlocked Banner if Socratic Passed */}
      {socraticPassed && (
        <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950/90 border-2 border-emerald-500 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 text-2xl shrink-0">
              🎉
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                ¡Validación Socrática Completada con Éxito!
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Has fundamentado los principios de par variable, debilitamiento de campo y 4 cuadrantes.
                El Examen Final de 20 Reactivos y la emisión de Constancia Oficial están desbloqueados.
              </p>
            </div>
          </div>
          <button
            onClick={onProceedToEvaluation}
            className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/80 transition-all cursor-pointer transform active:scale-95"
          >
            <span>Ir al Examen de Evaluación</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Chat Container */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl flex flex-col h-[560px] overflow-hidden">
        {/* Chat Header */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-300 font-bold text-base shadow-inner">
              👨‍🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Profesor de Electrónica de Potencia</span>
                <span className="text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.2 rounded font-mono">
                  ITSC - TecNM
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Tutor Socrático Activo • Método de Diálogo Guiado
              </span>
            </div>
          </div>

          {!socraticPassed && currentQMeta && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-blue-300 hover:text-blue-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950 border border-blue-800 cursor-pointer transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>{showHint ? 'Ocultar Pista' : 'Pista Socrática'}</span>
            </button>
          )}
        </div>

        {/* Collapsible Socratic Hint Box */}
        {showHint && !socraticPassed && currentQMeta && (
          <div className="bg-blue-950/80 border-b border-blue-800/80 p-3.5 px-5 text-xs text-blue-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Orientación Conceptual para Pregunta {currentQuestionIndex}:</strong>
              <span><RenderRichTextWithMath text={currentQMeta.hint} /></span>
            </div>
          </div>
        )}

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-950/50">
          {messages.map((msg) => {
            const isAsst = msg.role === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${isAsst ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm shadow-md ${
                    isAsst
                      ? 'bg-[#1B396A] text-white border border-blue-400/50'
                      : 'bg-emerald-700 text-white border border-emerald-400/50'
                  }`}
                >
                  {isAsst ? '🎓' : '👤'}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-md ${
                    isAsst
                      ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-blue-950/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isAsst ? 'text-blue-400' : 'text-blue-100'
                      }`}
                    >
                      {isAsst ? 'Profesor ITSC' : studentName || 'Tú (Alumno)'}
                    </span>
                    <span className="text-[10px] text-slate-400 opacity-70">{msg.timestamp}</span>
                  </div>
                  <div className="leading-relaxed">
                    <RenderRichTextWithMath text={msg.content} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center">
              <div className="w-8 h-8 rounded-full bg-[#1B396A] text-white flex items-center justify-center text-sm border border-blue-400/50">
                🎓
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl rounded-tl-sm flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] ml-1 text-slate-300">El profesor está evaluando tus argumentos...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                socraticPassed
                  ? '¡Has completado las 3 preguntas! Puedes continuar charlando o ir al Examen.'
                  : `Escribe tu razonamiento técnico para la Pregunta ${Math.min(currentQuestionIndex, 3)}...`
              }
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:cursor-not-allowed"
            >
              <span>Enviar</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
            <span>
              <RenderRichTextWithMath text="💡 Recuerda sustentar con leyes físicas: relación $V/f$, $T \propto n^2$, $P \propto n^3$ o los 4 cuadrantes." />
            </span>
            <span className="text-slate-400 font-mono">MTJ-1012 ITSC</span>
          </div>
        </div>
      </div>
    </div>
  );
};
