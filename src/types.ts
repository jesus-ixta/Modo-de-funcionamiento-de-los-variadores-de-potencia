export type AppSection = 'theory' | 'simulator' | 'socratic' | 'evaluation';

export type LoadType = 'constant_torque' | 'variable_torque' | 'constant_power';

export type QuadrantMode = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface QuizQuestion {
  id: number;
  category: 'Cuadrantes y Variadores' | 'Par Constante' | 'Par Variable' | 'Potencia Constante' | 'Casos Prácticos';
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface StudentInfo {
  name: string;
  controlNumber: string;
  semesterGroup?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isEvaluation?: boolean;
}

export interface SimulatorState {
  loadType: LoadType;
  frequency: number; // 0 to 120 Hz
  quadrant: QuadrantMode;
  voltage: number; // 0 to 460 V
  rpm: number; // 0 to 3600 RPM
  torqueMotor: number; // Nm
  torqueLoad: number; // Nm
  powerKw: number; // kW
  fluxRatio: number; // % (100% nominal)
  energySavedPercent: number; // %
}
