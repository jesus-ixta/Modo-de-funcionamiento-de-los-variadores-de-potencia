import React, { useState } from 'react';
import { THEORY_SUBTOPICS } from '../data/theoryContent';
import { MathView, RenderRichTextWithMath } from './MathView';
import {
  Compass,
  Zap,
  TrendingDown,
  Layers,
  ArrowRight,
  RotateCw,
  Cpu,
  Factory,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';

interface TheorySectionProps {
  onProceedToSimulator: () => void;
  isSimulatorUnlocked: boolean;
}

export const TheorySection: React.FC<TheorySectionProps> = ({
  onProceedToSimulator,
  isSimulatorUnlocked,
}) => {
  const [activeSubtopicId, setActiveSubtopicId] = useState<string>('3.2.1');
  const [activeQuadrantPreview, setActiveQuadrantPreview] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q1');
  const [interactiveTestFreq, setInteractiveTestFreq] = useState<number>(30);

  const currentSubtopic =
    THEORY_SUBTOPICS.find((s) => s.id === activeSubtopicId) || THEORY_SUBTOPICS[0];

  // Mathematical calculations for the interactive comparison tool
  const speedRatio = interactiveTestFreq / 60;
  const constTorqueT = 100;
  const constTorqueP = Number((speedRatio * 100).toFixed(1));
  const varTorqueT = Number((Math.pow(speedRatio, 2) * 100).toFixed(1));
  const varTorqueP = Number((Math.pow(speedRatio, 3) * 100).toFixed(1));
  const energySaved = Number((100 - varTorqueP).toFixed(1));

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      {/* Hero Module Overview */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-6 sm:p-8 rounded-2xl border border-slate-700/80 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5" /> Módulo 1: Marco Teórico Interactivo
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tema 3.2: Modos de Funcionamiento Electrónico y Electromecánico
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Comprende los regímenes de operación de accionamientos eléctricos de velocidad variable:
            clasificación por cuadrantes de potencia (unidireccionales y bidireccionales de 4 cuadrantes)
            y las tres zonas de carga electromecánica fundamentales: <strong className="text-blue-300">Par Constante</strong>,{' '}
            <strong className="text-emerald-300">Par Variable</strong> y{' '}
            <strong className="text-amber-300">Potencia Constante</strong>.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="bg-slate-800/80 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
              ⚡ Clave de Asignatura: MTJ-1012
            </span>
            <span className="bg-slate-800/80 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
              🎓 Ingeniería Mecatrónica - ITSC
            </span>
            <span className="bg-blue-900/60 text-blue-200 px-2.5 py-1 rounded-md border border-blue-700/50">
              ✓ 5 Subtemas Requeridos
            </span>
          </div>
        </div>
      </div>

      {/* Subtopics Tabs & Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
            Contenido Temático de la Unidad
          </h3>
          {THEORY_SUBTOPICS.map((sub) => {
            const isSelected = activeSubtopicId === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubtopicId(sub.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-blue-950/70 border-blue-500 text-white shadow-lg shadow-blue-950/50 ring-1 ring-blue-500/40'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {sub.code}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {sub.quadrants}
                    </span>
                  </div>
                  <div className="font-semibold text-sm mt-1 text-slate-100">
                    {sub.title}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {sub.subtitle}
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 mt-2 transition-transform ${
                    isSelected ? 'text-blue-400 translate-x-1' : 'text-slate-600'
                  }`}
                />
              </button>
            );
          })}

          {/* Quick summary button to jump to simulator */}
          <div className="pt-4">
            <button
              onClick={onProceedToSimulator}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-900/40 transition-all transform active:scale-95 cursor-pointer"
            >
              <span>{isSimulatorUnlocked ? 'Ir al Simulador y Laboratorio' : 'Completar y Abrir Simulador'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selected Subtopic Detail Content */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Subtema {currentSubtopic.code}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                {currentSubtopic.title}
              </h3>
              <p className="text-sm text-slate-400 mt-1">{currentSubtopic.subtitle}</p>
            </div>
            <div className="bg-slate-950 px-3.5 py-2 rounded-lg border border-slate-800 text-right overflow-x-auto max-w-full">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-0.5">
                Ecuación Característica
              </span>
              <div className="text-yellow-300 font-bold text-xs sm:text-sm">
                <MathView math={currentSubtopic.formula} block={false} />
              </div>
            </div>
          </div>

          <div className="text-slate-200 text-sm leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <RenderRichTextWithMath text={currentSubtopic.summary} />
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-400" />
              Fundamentos Técnicos y Topología de Potencia
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {currentSubtopic.details.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 text-xs sm:text-sm text-slate-300"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-900/40 border border-blue-700/60 text-blue-300 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="leading-relaxed flex-1">
                    <RenderRichTextWithMath text={detail} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-2">
                <Factory className="w-4 h-4 text-blue-400" />
                Aplicaciones en la Industria
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {currentSubtopic.industrialExamples.map((ex, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-950/40 to-indigo-950/40 p-4 rounded-xl border border-blue-900/50 flex flex-col justify-between">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Conclusión Clave para Examen
                </h5>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  "{currentSubtopic.keyTakeaway}"
                </p>
              </div>
              <div className="mt-3 text-[11px] text-blue-400 font-mono text-right">
                ITSC / EPA-MTJ1012
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Four-Quadrant Visualizer */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-400" />
              Diagrama Interactivo de Operación en 4 Cuadrantes
            </h3>
            <p className="text-xs text-slate-400">
              Haz clic en cada cuadrante para analizar la polaridad de Tensión, Corriente, Par y Velocidad.
            </p>
          </div>
          <span className="text-xs font-mono bg-blue-950 text-blue-300 px-3 py-1 rounded-md border border-blue-800">
            Plano Par (T) vs. Velocidad (ω)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Interactive Cartesian Grid */}
          <div className="lg:col-span-7 bg-slate-950 p-6 rounded-xl border border-slate-800 relative">
            <div className="grid grid-cols-2 gap-3 aspect-square max-w-md mx-auto relative">
              {/* Vertical & Horizontal Axis lines */}
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-slate-700 pointer-events-none -translate-x-1/2 z-10">
                <span className="absolute -top-3 left-1 text-[10px] font-bold text-slate-400 font-mono">+T (Par)</span>
                <span className="absolute -bottom-3 left-1 text-[10px] font-bold text-slate-400 font-mono">-T</span>
              </div>
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-slate-700 pointer-events-none -translate-y-1/2 z-10">
                <span className="absolute right-0 -top-3 text-[10px] font-bold text-slate-400 font-mono">+ω (Velocidad)</span>
                <span className="absolute left-0 -top-3 text-[10px] font-bold text-slate-400 font-mono">-ω</span>
              </div>

              {/* Quadrant II: Top Left (ω < 0, T > 0 or in standard V/I: Q2 = +V, -I) */}
              <button
                onClick={() => setActiveQuadrantPreview('Q2')}
                className={`p-4 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                  activeQuadrantPreview === 'Q2'
                    ? 'bg-amber-950/60 border-amber-500 shadow-lg shadow-amber-900/40 ring-2 ring-amber-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">Cuadrante II</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300">
                      P &lt; 0 (Gen)
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-1">Frenado Regenerativo</div>
                  <div className="text-[11px] text-slate-400">Desaceleración en Avance</div>
                </div>
                <div className="text-[10px] font-mono text-amber-300/90 pt-2 border-t border-slate-800 mt-2">
                  +V, -I | +ω, -T
                </div>
              </button>

              {/* Quadrant I: Top Right (ω > 0, T > 0) */}
              <button
                onClick={() => setActiveQuadrantPreview('Q1')}
                className={`p-4 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                  activeQuadrantPreview === 'Q1'
                    ? 'bg-blue-950/60 border-blue-500 shadow-lg shadow-blue-900/40 ring-2 ring-blue-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400">Cuadrante I</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                      P &gt; 0 (Mot)
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-1">Avance como Motor</div>
                  <div className="text-[11px] text-slate-400">Aceleración hacia adelante</div>
                </div>
                <div className="text-[10px] font-mono text-blue-300/90 pt-2 border-t border-slate-800 mt-2">
                  +V, +I | +ω, +T
                </div>
              </button>

              {/* Quadrant III: Bottom Left (ω < 0, T < 0) */}
              <button
                onClick={() => setActiveQuadrantPreview('Q3')}
                className={`p-4 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                  activeQuadrantPreview === 'Q3'
                    ? 'bg-purple-950/60 border-purple-500 shadow-lg shadow-purple-900/40 ring-2 ring-purple-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400">Cuadrante III</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300">
                      P &gt; 0 (Mot)
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-1">Reversa como Motor</div>
                  <div className="text-[11px] text-slate-400">Giro en sentido inverso</div>
                </div>
                <div className="text-[10px] font-mono text-purple-300/90 pt-2 border-t border-slate-800 mt-2">
                  -V, -I | -ω, -T
                </div>
              </button>

              {/* Quadrant IV: Bottom Right (ω > 0, T < 0 or in standard: -V, +I) */}
              <button
                onClick={() => setActiveQuadrantPreview('Q4')}
                className={`p-4 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                  activeQuadrantPreview === 'Q4'
                    ? 'bg-emerald-950/60 border-emerald-500 shadow-lg shadow-emerald-900/40 ring-2 ring-emerald-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Cuadrante IV</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
                      P &lt; 0 (Gen)
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-1">Frenado en Reversa</div>
                  <div className="text-[11px] text-slate-400">Regeneración al frenar reversa</div>
                </div>
                <div className="text-[10px] font-mono text-emerald-300/90 pt-2 border-t border-slate-800 mt-2">
                  -V, +I | -ω, +T
                </div>
              </button>
            </div>
          </div>

          {/* Quadrant Technical Analysis Box */}
          <div className="lg:col-span-5 bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Análisis de Cuadrante Seleccionado
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                {activeQuadrantPreview}
              </span>
            </div>

            {activeQuadrantPreview === 'Q1' && (
              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <p>
                  <strong>Modo:</strong> Avance como Motor (Cuadrante I).
                </p>
                <p>
                  <strong>Flujo de Potencia:</strong> Red Trifásica → Rectificador → Bus DC → Inversor IGBT → Motor → Carga.
                </p>
                <p>
                  <strong>Variador Requerido:</strong> Puede manejarse tanto con un variador <em>Unidireccional</em> (puente de diodos) como con uno <em>Bidireccional</em>.
                </p>
                <div className="p-3 bg-blue-950/40 rounded-lg border border-blue-900/60 text-blue-200 text-xs">
                  💡 En este cuadrante la velocidad es positiva (+ω) y el motor entrega par positivo (+T) para acelerar o mantener la marcha de la carga.
                </div>
              </div>
            )}

            {activeQuadrantPreview === 'Q2' && (
              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <p>
                  <strong>Modo:</strong> Frenado Regenerativo en Avance (Cuadrante II).
                </p>
                <p>
                  <strong>Flujo de Potencia:</strong> Carga Mecánica → Motor (opera como Generador) → Inversor → Red Eléctrica (o disipado en resistencia).
                </p>
                <p>
                  <strong>Variador Requerido:</strong> Se requiere un variador <em>Bidireccional con AFE (Active Front End)</em> para devolver la energía a la red eléctrica. Si el variador es unidireccional, se requiere chopper y resistencia térmica.
                </p>
                <div className="p-3 bg-amber-950/40 rounded-lg border border-amber-900/60 text-amber-200 text-xs">
                  ⚡ Vital en elevadores al descender carga o en centrífugas durante desaceleraciones de ciclo rápido.
                </div>
              </div>
            )}

            {activeQuadrantPreview === 'Q3' && (
              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <p>
                  <strong>Modo:</strong> Reversa como Motor (Cuadrante III).
                </p>
                <p>
                  <strong>Flujo de Potencia:</strong> Red Trifásica → Bus DC → Inversor modulando fases invertidas (U-W-V) → Motor girando al revés.
                </p>
                <p>
                  <strong>Variador Requerido:</strong> Variador Bidireccional o inversor electrónico con cambio de secuencia de fases por software sin contactores mecánicos.
                </p>
                <div className="p-3 bg-purple-950/40 rounded-lg border border-purple-900/60 text-purple-200 text-xs">
                  🔄 Permite invertir el sentido de rotación en bandas reversibles, tornos y transportadores industriales.
                </div>
              </div>
            )}

            {activeQuadrantPreview === 'Q4' && (
              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <p>
                  <strong>Modo:</strong> Frenado Regenerativo en Reversa (Cuadrante IV).
                </p>
                <p>
                  <strong>Flujo de Potencia:</strong> Carga en rotación reversa → Motor Generador → Bus DC → Red Eléctrica mediante AFE.
                </p>
                <p>
                  <strong>Variador Requerido:</strong> Variador regenerativo completo de 4 cuadrantes.
                </p>
                <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-900/60 text-emerald-200 text-xs">
                  🌱 Retorno de energía limpia y frenado con control total del par opuesto.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Afinidad & Ahorro Energético (Par Constante vs Par Variable) */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-400" />
              Comparativa Interactiva: Par Constante vs. Par Variable (Ahorro Energético)
            </h3>
            <p className="text-xs text-slate-400">
              Modifica la frecuencia y observa el impacto de la ley cuadrática de par (T ∝ n²) y cúbica de potencia (P ∝ n³).
            </p>
          </div>
          <span className="text-xs font-mono bg-emerald-950 text-emerald-300 px-3 py-1 rounded-md border border-emerald-800">
            Leyes de Afinidad Hidrodinámica
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="w-full sm:w-2/3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 font-semibold">Frecuencia de Trabajo (f):</span>
                <span className="text-blue-400 font-mono font-bold text-sm">{interactiveTestFreq} Hz</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={interactiveTestFreq}
                onChange={(e) => setInteractiveTestFreq(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>10 Hz (16.7%)</span>
                <span>30 Hz (50% Vel.)</span>
                <span>45 Hz (75% Vel.)</span>
                <span>60 Hz (100% Base)</span>
              </div>
            </div>

            <div className="w-full sm:w-1/3 flex items-center justify-center sm:justify-end gap-3 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Velocidad Relativa</span>
                <span className="text-lg font-mono font-bold text-white">{(speedRatio * 100).toFixed(0)}%</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-emerald-400 uppercase block font-semibold">Ahorro en Bomba</span>
                <span className="text-lg font-mono font-bold text-emerald-400">+{energySaved}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Par Constante Card */}
            <div className="bg-slate-950/70 p-5 rounded-xl border border-blue-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-blue-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  Cinta Transportadora / Elevador (Par Constante)
                </h4>
                <span className="text-xs text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                  <MathView math="T = \text{cte}" />
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>Par Demandado:</span>
                    <span className="font-mono text-white font-bold">{constTorqueT}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full w-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5 items-center">
                    <span className="flex items-center gap-1.5">
                      <span>Potencia Consumida</span>
                      <span className="text-blue-300 font-medium">(<MathView math="P = T \cdot \omega" />):</span>
                    </span>
                    <span className="font-mono text-white font-bold">{constTorqueP}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${constTorqueP}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                El par resistente de la masa y fricción no depende de la velocidad. A {interactiveTestFreq} Hz, la potencia demandada es exactamente proporcional ({constTorqueP}%).
              </p>
            </div>

            {/* Par Variable Card */}
            <div className="bg-slate-950/70 p-5 rounded-xl border border-emerald-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-emerald-400" />
                  Bomba Centrífuga / Ventilador (Par Variable)
                </h4>
                <span className="text-xs text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                  <MathView math="T \propto n^2, \; P \propto n^3" />
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5 items-center">
                    <span className="flex items-center gap-1.5">
                      <span>Par Demandado</span>
                      <span className="text-emerald-300 font-medium">(<MathView math="T \propto n^2" />):</span>
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">{varTorqueT}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${varTorqueT}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5 items-center">
                    <span className="flex items-center gap-1.5">
                      <span>Potencia Consumida</span>
                      <span className="text-emerald-300 font-medium">(<MathView math="P \propto n^3" />):</span>
                    </span>
                    <span className="font-mono text-emerald-300 font-bold">{varTorqueP}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${varTorqueP}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-emerald-300/90 leading-relaxed border-t border-slate-800/80 pt-2">
                ¡Impacto extraordinario! A 30 Hz (50% velocidad), el par requerido cae al <strong>25%</strong> y la potencia al <strong>12.5%</strong>. Se ahorra hasta un <strong>87.5%</strong> de energía frente a usar válvulas de estrangulamiento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
