import React, { useState, useEffect } from 'react';
import { LoadType, QuadrantMode } from '../types';
import { MathView, RenderRichTextWithMath } from './MathView';
import {
  Gauge,
  Sliders,
  Play,
  RotateCcw,
  Zap,
  Activity,
  ArrowRight,
  Sparkles,
  HelpCircle,
  RefreshCw,
  Box,
  Wind,
  Wrench,
  Check,
} from 'lucide-react';

interface SimulatorSectionProps {
  onProceedToSocratic: () => void;
  isSocraticUnlocked: boolean;
}

export const SimulatorSection: React.FC<SimulatorSectionProps> = ({
  onProceedToSocratic,
  isSocraticUnlocked,
}) => {
  // Input Controls
  const [loadType, setLoadType] = useState<LoadType>('constant_torque');
  const [frequency, setFrequency] = useState<number>(60);
  const [quadrant, setQuadrant] = useState<QuadrantMode>('Q1');
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Electrical & Mechanical physical calculations
  const BASE_FREQ = 60;
  const POLES = 4;
  const V_NOMINAL = 460;
  const P_NOMINAL_KW = 7.5; // 10 HP motor
  const T_NOMINAL_NM = 41.0;

  // Speeds
  const syncSpeedRpm = Number(((120 * frequency) / POLES).toFixed(0));
  const rotorSpeedRpm = Number((syncSpeedRpm * 0.97).toFixed(0)); // 3% slip

  // Direction modifier from quadrant
  const isReverse = quadrant === 'Q3' || quadrant === 'Q4';
  const isRegenerative = quadrant === 'Q2' || quadrant === 'Q4';
  const effectiveRpm = isReverse ? -rotorSpeedRpm : rotorSpeedRpm;

  // Voltage and Flux
  const voltage =
    frequency <= BASE_FREQ
      ? Number((frequency === 0 ? 0 : Math.max(15, (V_NOMINAL * frequency) / BASE_FREQ)).toFixed(1))
      : V_NOMINAL;

  const fluxPercent =
    frequency <= BASE_FREQ
      ? (frequency === 0 ? 0 : 100)
      : Number(((BASE_FREQ / frequency) * 100).toFixed(1));

  const vfRatio = frequency === 0 ? 0 : Number((voltage / frequency).toFixed(2));

  // Motor Max Torque capacity
  const motorMaxTorque =
    frequency <= BASE_FREQ
      ? T_NOMINAL_NM
      : Number((T_NOMINAL_NM * (BASE_FREQ / frequency)).toFixed(1));

  // Load Torque demand
  let loadTorque = 0;
  let powerKw = 0;
  let energySavingPercent = 0;

  if (loadType === 'constant_torque') {
    // Conveyor / Elevator
    loadTorque = frequency === 0 ? 0 : Number((T_NOMINAL_NM * 0.85).toFixed(1));
    const speedFraction = frequency / BASE_FREQ;
    powerKw = Number((P_NOMINAL_KW * speedFraction * 0.85).toFixed(2));
    energySavingPercent = Number((Math.max(0, (1 - speedFraction) * 40)).toFixed(1));
  } else if (loadType === 'variable_torque') {
    // Centrifugal Pump / Fan (T ∝ f², P ∝ f³)
    const speedFraction = frequency / BASE_FREQ;
    loadTorque = Number((T_NOMINAL_NM * 0.85 * Math.pow(speedFraction, 2)).toFixed(1));
    powerKw = Number((P_NOMINAL_KW * 0.85 * Math.pow(speedFraction, 3)).toFixed(2));
    // Compared to traditional throttling valve that consumes ~95%
    const throttledPower = P_NOMINAL_KW * 0.85 * 0.95;
    energySavingPercent =
      frequency === 0
        ? 100
        : Number((Math.max(0, ((throttledPower - powerKw) / throttledPower) * 100)).toFixed(1));
  } else {
    // Constant Power (CNC Spindle)
    if (frequency <= BASE_FREQ) {
      loadTorque = frequency === 0 ? 0 : Number((T_NOMINAL_NM * 0.85).toFixed(1));
      powerKw = Number((P_NOMINAL_KW * 0.85 * (frequency / BASE_FREQ)).toFixed(2));
    } else {
      loadTorque = Number((T_NOMINAL_NM * 0.85 * (BASE_FREQ / frequency)).toFixed(1));
      powerKw = Number((P_NOMINAL_KW * 0.85).toFixed(2)); // Stays constant
    }
    energySavingPercent = 0;
  }

  // Animation frame loop for spinning rotor
  useEffect(() => {
    let animId: number;
    if (!isRunning || frequency === 0) return;

    const speedFactor = (effectiveRpm / 1800) * 12; // visual rotation speed
    const updateRotation = () => {
      setRotationAngle((prev) => (prev + speedFactor) % 360);
      animId = requestAnimationFrame(updateRotation);
    };

    animId = requestAnimationFrame(updateRotation);
    return () => cancelAnimationFrame(animId);
  }, [isRunning, effectiveRpm, frequency]);

  // Guided Experiments Handlers
  const applyExperiment = (expNum: 1 | 2 | 3) => {
    if (expNum === 1) {
      // Pump at 30 Hz (Question 1)
      setLoadType('variable_torque');
      setFrequency(30);
      setQuadrant('Q1');
    } else if (expNum === 2) {
      // Spindle at 90 Hz in Field Weakening (Question 2)
      setLoadType('constant_power');
      setFrequency(90);
      setQuadrant('Q1');
    } else if (expNum === 3) {
      // Regenerative Braking Elevator (Question 3)
      setLoadType('constant_torque');
      setFrequency(45);
      setQuadrant('Q2');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      {/* Top Banner */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" /> Módulo 2: Simulador Visual y Laboratorio Virtual
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Banco de Ensayos Electromecánicos y Variador V/f
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-3xl">
            Experimenta con cargas de <strong className="text-blue-300">Par Constante</strong>,{' '}
            <strong className="text-emerald-300">Par Variable (Centrífugo)</strong> y{' '}
            <strong className="text-amber-300">Potencia Constante</strong>. Observa el debilitamiento de campo,
            los 4 cuadrantes y el retorno de energía regenerativa en tiempo real.
          </p>
        </div>

        {/* Action Button to Proceed to Socratic Tutor */}
        <div className="shrink-0">
          <button
            onClick={onProceedToSocratic}
            className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/60 transition-all cursor-pointer transform active:scale-95"
          >
            <span>{isSocraticUnlocked ? 'Ir al Tutor Socrático IA' : 'Completar Lab y Abrir Tutor IA'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Guided Experiments Presets Bar */}
      <div className="bg-slate-950 p-4 rounded-xl border border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>Casos de Estudio Recomendados para el Tutor Socrático:</span>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => applyExperiment(1)}
            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-700/60 text-emerald-200 hover:bg-emerald-900 transition-colors font-medium cursor-pointer flex items-center gap-1.5"
          >
            <span>🧪 Exp 1: Bomba a 30 Hz (Ahorro</span>
            <MathView math="P \propto n^3" />
            <span>)</span>
          </button>
          <button
            onClick={() => applyExperiment(2)}
            className="text-xs px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-700/60 text-amber-200 hover:bg-amber-900 transition-colors font-medium cursor-pointer"
          >
            🧪 Exp 2: Husillo a 90 Hz (Debilitamiento)
          </button>
          <button
            onClick={() => applyExperiment(3)}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-950/70 border border-blue-700/60 text-blue-200 hover:bg-blue-900 transition-colors font-medium cursor-pointer"
          >
            🧪 Exp 3: Regeneración Q2 (Elevador)
          </button>
        </div>
      </div>

      {/* Main Simulator Layout: Controls + Mechanical Visualizer + Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Input Controls Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                Panel de Control de Entrada
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                Drive VFD
              </span>
            </div>

            {/* 1. Selector de Carga */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                1. Tipo de Carga Mecánica Conectada
              </label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => setLoadType('constant_torque')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    loadType === 'constant_torque'
                      ? 'bg-blue-950/70 border-blue-500 text-white shadow-md shadow-blue-950/50 ring-1 ring-blue-500/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-900/40 border border-blue-700/50 flex items-center justify-center text-blue-400">
                      <Box className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs">Cinta Transportadora / Elevador</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <span>Régimen a Par Constante (</span>
                        <MathView math="T = \text{cte}" />
                        <span>)</span>
                      </div>
                    </div>
                  </div>
                  {loadType === 'constant_torque' && <Check className="w-4 h-4 text-blue-400" />}
                </button>

                <button
                  onClick={() => setLoadType('variable_torque')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    loadType === 'variable_torque'
                      ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-md shadow-emerald-950/50 ring-1 ring-emerald-500/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
                      <Wind className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs">Bomba Centrífuga / Ventilador</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <span>Par Variable cuadrático (</span>
                        <MathView math="T \propto n^2" />
                        <span>)</span>
                      </div>
                    </div>
                  </div>
                  {loadType === 'variable_torque' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  onClick={() => setLoadType('constant_power')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    loadType === 'constant_power'
                      ? 'bg-amber-950/70 border-amber-500 text-white shadow-md shadow-amber-950/50 ring-1 ring-amber-500/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-900/40 border border-amber-700/50 flex items-center justify-center text-amber-400">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs">Husillo de Torno / Mandril CNC</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <span>Potencia Constante (</span>
                        <MathView math="P = \text{cte}" />
                        <span>, &gt;60 Hz)</span>
                      </div>
                    </div>
                  </div>
                  {loadType === 'constant_power' && <Check className="w-4 h-4 text-amber-400" />}
                </button>
              </div>
            </div>

            {/* 2. Slider de Frecuencia / Velocidad */}
            <div className="space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  2. Frecuencia del Inversor (f)
                </label>
                <div className="font-mono text-sm font-extrabold text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded border border-blue-800">
                  {frequency} Hz
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="120"
                step="1"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-2.5 bg-slate-800 rounded-lg"
              />

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 Hz</span>
                <span className="text-emerald-400 font-bold">30 Hz (½)</span>
                <span className="text-yellow-400 font-bold">60 Hz (Base)</span>
                <span>90 Hz</span>
                <span className="text-rose-400 font-bold">120 Hz (2x)</span>
              </div>

              {/* Quick preset buttons */}
              <div className="grid grid-cols-5 gap-1 pt-1">
                {[0, 30, 60, 90, 120].map((fVal) => (
                  <button
                    key={fVal}
                    onClick={() => setFrequency(fVal)}
                    className={`text-[10px] py-1 rounded font-mono font-semibold transition-all ${
                      frequency === fVal
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {fVal} Hz
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Conmutador de Cuadrantes (Modo de Operación) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                3. Modo de Operación y Cuadrante de Potencia
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setQuadrant('Q1')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    quadrant === 'Q1'
                      ? 'bg-blue-950/80 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400">Q1: Avance</span>
                    <span className="text-[9px] font-mono text-slate-400">+V, +I</span>
                  </div>
                  <div className="text-[11px] text-slate-200 font-medium mt-0.5">Modo Motor Directo</div>
                </button>

                <button
                  onClick={() => setQuadrant('Q2')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    quadrant === 'Q2'
                      ? 'bg-amber-950/80 border-amber-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">Q2: Frenado</span>
                    <span className="text-[9px] font-mono text-slate-400">+V, -I</span>
                  </div>
                  <div className="text-[11px] text-slate-200 font-medium mt-0.5">Regenerativo en Avance</div>
                </button>

                <button
                  onClick={() => setQuadrant('Q3')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    quadrant === 'Q3'
                      ? 'bg-purple-950/80 border-purple-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400">Q3: Reversa</span>
                    <span className="text-[9px] font-mono text-slate-400">-V, -I</span>
                  </div>
                  <div className="text-[11px] text-slate-200 font-medium mt-0.5">Modo Motor Reversa</div>
                </button>

                <button
                  onClick={() => setQuadrant('Q4')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    quadrant === 'Q4'
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Q4: Frenado Rev</span>
                    <span className="text-[9px] font-mono text-slate-400">-V, +I</span>
                  </div>
                  <div className="text-[11px] text-slate-200 font-medium mt-0.5">Regenerativo en Reversa</div>
                </button>
              </div>
            </div>

            {/* Run/Pause Motor Switch */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Estado del Inversor:</span>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isRunning
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                }`}
              >
                {isRunning ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>RUN (Activo)</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    <span>STOP (Detenido)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Real-time Instrumentation Metrics Grid */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-400" />
              Instrumentación Digital en Tiempo Real
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Velocidad Mecánica</span>
                <span className="font-mono text-base font-bold text-white">
                  {effectiveRpm} <span className="text-xs font-normal text-slate-400">RPM</span>
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Tensión de Salida V_RMS</span>
                <span className="font-mono text-base font-bold text-yellow-300">
                  {voltage} <span className="text-xs font-normal text-slate-400">V</span>
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                  <span>Relación</span> <MathView math="V/f" />
                </span>
                <span className="font-mono text-base font-bold text-blue-300">
                  {vfRatio} <span className="text-xs font-normal text-slate-400">V/Hz</span>
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                  <span>Flujo Magnético</span> <MathView math="\Phi/\Phi_{nom}" />
                </span>
                <span className={`font-mono text-base font-bold ${fluxPercent < 100 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {fluxPercent}%
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                  <span>Par de Carga</span> <MathView math="T_{carga}" />
                </span>
                <span className="font-mono text-base font-bold text-white">
                  {loadTorque} <span className="text-xs font-normal text-slate-400">Nm</span>
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                  <span>Potencia en Eje</span> <MathView math="P" />
                </span>
                <span className="font-mono text-base font-bold text-blue-400">
                  {powerKw} <span className="text-xs font-normal text-slate-400">kW</span>
                </span>
              </div>
            </div>

            {loadType === 'variable_torque' && (
              <div className="p-3 bg-emerald-950/50 rounded-xl border border-emerald-800/60 text-xs">
                <div className="flex justify-between items-center text-emerald-300 font-bold mb-1">
                  <span>Ahorro Energético vs Estrangulamiento:</span>
                  <span className="text-sm font-mono">{energySavingPercent}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${energySavingPercent}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Mechanical 2D Visualizer + Dynamic Graphs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Mechanical Visualizer Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-blue-400" />
                  Visualizador Electromecánico y Flujo de Potencia
                </h3>
                <p className="text-xs text-slate-400">
                  Giro dinámico en tiempo real y vector de potencia (Modo Motor vs. Modo Generador Regenerativo)
                </p>
              </div>

              {/* Power Mode Pill */}
              <div
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-2 ${
                  isRegenerative
                    ? 'bg-amber-950/80 border-amber-500/60 text-amber-300'
                    : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${isRegenerative ? 'animate-bounce text-amber-400' : 'text-emerald-400'}`} />
                <span>{isRegenerative ? 'MODO GENERADOR (REGENERACIÓN)' : 'MODO MOTOR (CONSUMO)'}</span>
              </div>
            </div>

            {/* Power Flow Diagram */}
            <div className="grid grid-cols-4 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Red CFE (3φ)</span>
                <span className="font-bold text-slate-200">460 V 60Hz</span>
              </div>

              {/* Arrow 1 */}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <span className={`text-[10px] font-bold block ${isRegenerative ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isRegenerative ? '← Retorno AFE' : 'P →'}
                  </span>
                  <div
                    className={`h-1.5 w-12 rounded-full mx-auto ${
                      isRegenerative ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'
                    }`}
                  ></div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Variador VFD</span>
                <span className="font-bold text-blue-300">{voltage}V @ {frequency}Hz</span>
              </div>

              {/* Arrow 2 */}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <span className={`text-[10px] font-bold block ${isRegenerative ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isRegenerative ? '← FEM Gen' : 'T, ω →'}
                  </span>
                  <div
                    className={`h-1.5 w-12 rounded-full mx-auto ${
                      isRegenerative ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            {/* SVG Animated Motor & Selected Industrial Machine Assembly */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col md:flex-row items-center justify-center gap-8 relative overflow-hidden min-h-[220px]">
              {/* Background grid lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

              {/* 1. Induction Motor Rendering */}
              <div className="flex flex-col items-center relative z-10">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  {/* Stator Casing */}
                  <div className="absolute inset-0 rounded-full border-4 border-slate-700 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 shadow-2xl flex items-center justify-center">
                    {/* Cooling Fins around stator */}
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                      <div
                        key={deg}
                        className="absolute w-1 h-3 bg-slate-600 rounded"
                        style={{
                          transform: `rotate(${deg}deg) translateY(-82px)`,
                        }}
                      ></div>
                    ))}
                    {/* Stator field poles */}
                    <div className="w-28 h-28 rounded-full border-2 border-dashed border-blue-500/40 flex items-center justify-center bg-slate-950/70">
                      {/* Rotating Rotor */}
                      <div
                        className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 border-2 border-yellow-300 shadow-inner flex items-center justify-center relative transition-transform"
                        style={{
                          transform: `rotate(${rotationAngle}deg)`,
                        }}
                      >
                        {/* Squirrel cage rotor bars */}
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                          <div
                            key={angle}
                            className="absolute w-1.5 h-6 bg-slate-900 rounded"
                            style={{
                              transform: `rotate(${angle}deg) translateY(-24px)`,
                            }}
                          ></div>
                        ))}
                        {/* Center shaft */}
                        <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-400 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className="text-xs font-bold text-slate-200">Motor Trifásico de Inducción</span>
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400 mt-0.5">
                    <span>{isReverse ? '↺ Reversa' : '↻ Avance'}</span>
                    <span>•</span>
                    <span className="text-blue-400 font-bold">{Math.abs(effectiveRpm)} RPM</span>
                  </div>
                </div>
              </div>

              {/* Coupling Shaft */}
              <div className="hidden md:flex flex-col items-center justify-center z-10">
                <div className="w-12 h-3 bg-gradient-to-r from-slate-400 to-slate-600 rounded border border-slate-300 shadow-inner"></div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono mt-1">Acople</span>
              </div>

              {/* 2. Connected Load Machine Representation */}
              <div className="flex flex-col items-center relative z-10 max-w-[200px]">
                {loadType === 'constant_torque' && (
                  <div className="flex flex-col items-center">
                    {/* Conveyor Belt Animation */}
                    <div className="relative w-44 h-24 bg-slate-900 border-2 border-slate-700 rounded-xl p-2 flex flex-col justify-between overflow-hidden">
                      {/* Pulleys */}
                      <div className="flex justify-between items-center px-2 pt-2">
                        <div
                          className="w-10 h-10 rounded-full border-2 border-slate-500 bg-slate-800 flex items-center justify-center"
                          style={{ transform: `rotate(${rotationAngle}deg)` }}
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        </div>
                        <div
                          className="w-10 h-10 rounded-full border-2 border-slate-500 bg-slate-800 flex items-center justify-center"
                          style={{ transform: `rotate(${rotationAngle}deg)` }}
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        </div>
                      </div>
                      {/* Boxes on belt moving */}
                      <div className="flex justify-around items-center pb-1">
                        <div className="w-6 h-6 bg-amber-600/80 border border-amber-400 rounded text-[9px] text-white flex items-center justify-center font-bold">
                          📦
                        </div>
                        <div className="w-6 h-6 bg-amber-600/80 border border-amber-400 rounded text-[9px] text-white flex items-center justify-center font-bold">
                          📦
                        </div>
                      </div>
                      {/* Rubber belt loop */}
                      <div className="absolute inset-x-2 bottom-1 h-1.5 bg-slate-600 rounded"></div>
                    </div>
                    <span className="text-xs font-bold text-blue-300 mt-2">Banda / Elevador</span>
                    <span className="text-[10px] text-slate-400 font-mono">T = {loadTorque} Nm (Constante)</span>
                  </div>
                )}

                {loadType === 'variable_torque' && (
                  <div className="flex flex-col items-center">
                    {/* Centrifugal Pump Animation */}
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      {/* Volute spiral casing */}
                      <div className="w-32 h-32 rounded-full border-4 border-emerald-600 bg-emerald-950/40 flex items-center justify-center relative">
                        {/* Impeller blades rotating */}
                        <div
                          className="w-20 h-20 rounded-full border-2 border-emerald-400 flex items-center justify-center"
                          style={{ transform: `rotate(${rotationAngle}deg)` }}
                        >
                          {[0, 60, 120, 180, 240, 300].map((b) => (
                            <div
                              key={b}
                              className="absolute w-1 h-8 bg-emerald-300 rounded"
                              style={{ transform: `rotate(${b}deg)` }}
                            ></div>
                          ))}
                        </div>
                        {/* Discharge pipe */}
                        <div className="absolute -top-3 right-0 w-8 h-8 bg-emerald-700 rounded-t border-t-2 border-emerald-400"></div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-300 mt-1">Bomba Centrífuga</span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      T = {loadTorque} Nm (T ∝ n²)
                    </span>
                  </div>
                )}

                {loadType === 'constant_power' && (
                  <div className="flex flex-col items-center">
                    {/* CNC Spindle Lathe Chuck */}
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <div
                        className="w-28 h-28 rounded-full border-4 border-amber-500 bg-slate-800 flex items-center justify-center relative shadow-lg"
                        style={{ transform: `rotate(${rotationAngle}deg)` }}
                      >
                        {/* Chuck 3-Jaws */}
                        {[0, 120, 240].map((jaw) => (
                          <div
                            key={jaw}
                            className="absolute w-4 h-9 bg-slate-400 border border-slate-200 rounded"
                            style={{ transform: `rotate(${jaw}deg) translateY(-22px)` }}
                          ></div>
                        ))}
                        {/* Machined workpiece metal cylinder */}
                        <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-300 mt-1">Husillo CNC Torno</span>
                    <span className="text-[10px] text-amber-400 font-mono">
                      P = {powerKw} kW (Potencia Cte)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DYNAMIC GRAPHS: 1. Torque vs Frequency, 2. Power vs Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gráfica 1: Par (T) vs Frecuencia (f) */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  Gráfica 1: Par (T) vs. Frecuencia (f)
                </h4>
                <span className="text-[10px] font-mono text-slate-400">0 - 120 Hz</span>
              </div>

              {/* SVG Graphic with curves */}
              <div className="relative aspect-[4/3] bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-hidden">
                <svg viewBox="0 0 400 250" className="w-full h-full">
                  {/* Grid lines */}
                  <line x1="50" y1="20" x2="50" y2="210" stroke="#334155" strokeWidth="1" />
                  <line x1="50" y1="210" x2="380" y2="210" stroke="#334155" strokeWidth="1" />

                  {/* Nominal 60 Hz vertical reference */}
                  <line x1="215" y1="20" x2="215" y2="210" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />
                  <text x="215" y="225" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                    60 Hz
                  </text>
                  <text x="50" y="225" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                    0
                  </text>
                  <text x="380" y="225" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                    120 Hz
                  </text>

                  {/* Y Axis labels */}
                  <text x="40" y="55" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">
                    Tnom
                  </text>
                  <text x="40" y="130" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">
                    50%
                  </text>
                  <text x="40" y="210" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">
                    0
                  </text>

                  {/* Motor Torque Capacity Curve (Constant until 60 Hz, then 1/f fall) */}
                  {/* (50, 50) -> (215, 50) -> curve to (380, 130) */}
                  <path
                    d="M 50 50 L 215 50 Q 280 85 380 130"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                  />

                  {/* Load Torque Curve based on selection */}
                  {loadType === 'constant_torque' && (
                    <line x1="50" y1="75" x2="380" y2="75" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 3" />
                  )}
                  {loadType === 'variable_torque' && (
                    <path
                      d="M 50 210 Q 180 200 215 75 Q 260 30 300 20"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                    />
                  )}
                  {loadType === 'constant_power' && (
                    <path
                      d="M 50 75 L 215 75 Q 280 105 380 145"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                    />
                  )}

                  {/* Active Operating Point Dot */}
                  {(() => {
                    const activeX = 50 + (frequency / 120) * (380 - 50);
                    let activeY = 75;
                    if (loadType === 'constant_torque') {
                      activeY = 75;
                    } else if (loadType === 'variable_torque') {
                      const fNorm = frequency / 60;
                      activeY = 210 - Math.pow(fNorm, 2) * (210 - 75);
                    } else {
                      activeY = frequency <= 60 ? 75 : 75 + ((frequency - 60) / 60) * 70;
                    }

                    return (
                      <g>
                        <circle cx={activeX} cy={activeY} r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                        <line x1={activeX} y1="20" x2={activeX} y2="210" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
                      </g>
                    );
                  })()}
                </svg>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 px-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-blue-500"></span> Capacidad Motor (T_max)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-emerald-400"></span> Demanda de Carga
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> Pto. Trabajo
                  </span>
                </div>
              </div>
            </div>

            {/* Gráfica 2: Potencia (P) vs Frecuencia (f) */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  Gráfica 2: Potencia (P) vs. Frecuencia (f)
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Zona Par Cte vs Potencia Cte</span>
              </div>

              {/* SVG Graphic with Power curves */}
              <div className="relative aspect-[4/3] bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-hidden">
                <svg viewBox="0 0 400 250" className="w-full h-full">
                  {/* Background Zone Shading */}
                  {/* Zone 1: Constant Torque (0 - 60 Hz) */}
                  <rect x="50" y="20" width="165" height="190" fill="#1e3a8a" fillOpacity="0.15" />
                  {/* Zone 2: Constant Power (60 - 120 Hz) */}
                  <rect x="215" y="20" width="165" height="190" fill="#b45309" fillOpacity="0.15" />

                  {/* Grid lines */}
                  <line x1="50" y1="20" x2="50" y2="210" stroke="#334155" strokeWidth="1" />
                  <line x1="50" y1="210" x2="380" y2="210" stroke="#334155" strokeWidth="1" />

                  {/* 60 Hz line */}
                  <line x1="215" y1="20" x2="215" y2="210" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />
                  <text x="215" y="225" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                    60 Hz (Base)
                  </text>
                  <text x="130" y="35" fill="#60a5fa" fontSize="9" textAnchor="middle" fontWeight="bold">
                    ZONA PAR CTE
                  </text>
                  <text x="300" y="35" fill="#f59e0b" fontSize="9" textAnchor="middle" fontWeight="bold">
                    ZONA POTENCIA CTE
                  </text>

                  {/* Y Axis labels */}
                  <text x="40" y="55" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">
                    Pnom
                  </text>
                  <text x="40" y="130" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">
                    50%
                  </text>
                  <text x="40" y="210" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">
                    0
                  </text>

                  {/* Motor Rated Available Power Curve (Linear until 60 Hz, flat after 60 Hz) */}
                  <path
                    d="M 50 210 L 215 55 L 380 55"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                  />

                  {/* Load demand Power curves */}
                  {loadType === 'constant_torque' && (
                    <line x1="50" y1="210" x2="215" y2="80" stroke="#f59e0b" strokeWidth="2.5" />
                  )}
                  {loadType === 'variable_torque' && (
                    <path
                      d="M 50 210 Q 185 205 215 80 Q 250 20 280 20"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                    />
                  )}
                  {loadType === 'constant_power' && (
                    <path
                      d="M 50 210 L 215 80 L 380 80"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                    />
                  )}

                  {/* Active Operating Point Dot */}
                  {(() => {
                    const activeX = 50 + (frequency / 120) * (380 - 50);
                    let activeY = 80;
                    if (frequency <= 60) {
                      activeY = 210 - (frequency / 60) * (210 - 80);
                    } else {
                      activeY = 80;
                    }

                    return (
                      <g>
                        <circle cx={activeX} cy={activeY} r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                        <line x1={activeX} y1="20" x2={activeX} y2="210" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
                      </g>
                    );
                  })()}
                </svg>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 px-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-blue-500"></span> Capacidad Motor (P_max)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-amber-400 font-bold">V = 460V cte (&gt;60Hz)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> Punto Actual
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
