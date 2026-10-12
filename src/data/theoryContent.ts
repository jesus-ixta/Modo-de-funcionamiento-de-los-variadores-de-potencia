export interface SubtopicInfo {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  formula: string;
  quadrants: string;
  summary: string;
  details: string[];
  industrialExamples: string[];
  keyTakeaway: string;
}

export const THEORY_SUBTOPICS: SubtopicInfo[] = [
  {
    id: '3.2.1',
    code: '3.2.1',
    title: 'Variador Unidireccional',
    subtitle: 'Control en 1 Cuadrante (V > 0, I > 0) sin frenado regenerativo',
    formula: 'P_{\\text{red}} \\rightarrow P_{\\text{motor}} > 0 \\quad (Q_1: +V, +I)',
    quadrants: 'Cuadrante I (Avance como Motor)',
    summary:
      'Un variador unidireccional permite regular la aceleración y la velocidad en un único sentido de rotación (avance). El rectificador de entrada está compuesto por un puente de diodos no controlado que solo permite el flujo unidireccional de energía desde la red de corriente alterna hacia el bus de corriente continua y el motor.',
    details: [
      'Topología electrónica: Puente rectificador a diodos (6 pulsos) + Banco de capacitores (DC Link) + Inversor trifásico IGBT modulado por PWM.',
      'Flujo de potencia estrictamente unidireccional: La potencia eléctrica únicamente viaja de la Red Eléctrica $\\rightarrow$ Inversor $\\rightarrow$ Motor $\\rightarrow$ Carga.',
      'Limitación de frenado: Si el motor intenta frenar con una carga de alta inercia o durante una desaceleración forzada, la máquina actúa como generador inyectando energía al bus de continua. Como los diodos de entrada no pueden conducir en inversa, la tensión en el bus DC se eleva de manera crítica.',
      'Protección requerida: Para frenar cargas con inercia sin quemar el variador se debe agregar un Chopper de Frenado mecánico/electrónico con una resistencia disipativa exterior (frenado dinámico o reostático), donde la energía cinética se convierte en calor no aprovechable.',
    ],
    industrialExamples: [
      'Transportadores de banda continua unidireccionales de material a granel.',
      'Mezcladoras de fluidos de una sola dirección de agitación.',
      'Bombas de agua centrífugas simples sin inversión de flujo.',
      'Ventiladores axiales de extracción en naves industriales.',
    ],
    keyTakeaway:
      'Económico y confiable para procesos estándar sin ciclos repetitivos de frenado pesado ni requerimientos de reversa.',
  },
  {
    id: '3.2.2',
    code: '3.2.2',
    title: 'Variador Bidireccional',
    subtitle: 'Operación completa en 4 Cuadrantes con Regeneración a la Red',
    formula: 'Q_1(+V,+I), \\; Q_2(+V,-I), \\; Q_3(-V,-I), \\; Q_4(-V,+I)',
    quadrants: '4 Cuadrantes (I, II, III y IV)',
    summary:
      'Un variador bidireccional de 4 cuadrantes domina tanto el sentido de giro (avance y reversa) como el sentido del par mecánico (aceleración y frenado regenerativo). Permite que la energía cinética generada durante la desaceleración o descenso de cargas sea devuelta directamente a la red eléctrica trifásica.',
    details: [
      'Topología electrónica avanzada: Incorpora una etapa frontal activa (AFE - Active Front End) conformada por transistores IGBTs en antiparalelo con diodos rápidos en lugar de simples diodos de rectificación.',
      'Cuadrante I ($+V, +I$): Avance como Motor. Par y velocidad en sentido positivo ($P > 0$). Consumo de red.',
      'Cuadrante II ($+V, -I$): Frenado Regenerativo en Avance. Velocidad positiva, par opuesto ($P < 0$). El motor opera como generador y devuelve kWh limpios a la red con bajo THD.',
      'Cuadrante III ($-V, -I$): Reversa como Motor. Tensión y corriente negativas. Sentido de giro inverso ($P > 0$).',
      'Cuadrante IV ($-V, +I$): Frenado Regenerativo en Reversa. Velocidad negativa, par en sentido positivo frenando la reversa e inyectando energía a la red ($P < 0$).',
      'Sostenibilidad energética: Elimina las peligrosas resistencias de frenado caliente y reduce significativamente la factura eléctrica en procesos con ciclos repetitivos de paradas y descensos.',
    ],
    industrialExamples: [
      'Elevadores de carga, grúas viajeras y polipastos (bajada con carga gravitacional).',
      'Trenes de laminación siderúrgicos y centrífugas industriales de azúcar/química.',
      'Vehículos eléctricos, trenes ligeros y tracción mecatrónica con frenado regenerativo.',
      'Bancos de prueba dinamométricos con regeneración continua.',
    ],
    keyTakeaway:
      'Esencial para alta dinámica mecatrónica, control de elevación y máxima eficiencia con retorno de energía.',
  },
  {
    id: '3.2.3',
    code: '3.2.3',
    title: 'Funcionamiento a Par Constante',
    subtitle: 'Control V/f Constante por debajo de la Frecuencia Base (0 a 60 Hz)',
    formula: '\\frac{V}{f} = \\text{cte} \\implies \\Phi_{m} \\approx \\text{cte}, \\quad T_{nom} = \\text{cte}',
    quadrants: 'Zona Subsíncrona (0 - 60 Hz)',
    summary:
      'En el rango de operación desde 0 Hz hasta la frecuencia nominal (típicamente 60 Hz en México y América), el variador incrementa la tensión de manera estrictamente proporcional a la frecuencia. Esto asegura que el flujo magnético en el entrehierro se mantenga constante en su valor nominal, permitiendo al motor entregar su par nominal completo en todo momento.',
    details: [
      'Fundamento electromagnético: La fem inducida cumple $E \\approx 4.44 \\cdot f \\cdot N \\cdot \\Phi$. Por tanto, el flujo magnético es $\\Phi \\approx \\frac{V}{k \\cdot f}$. Para mantener el flujo nominal constante sin saturar el núcleo ni debilitarlo, la relación $V/f$ debe ser lineal y fija (ej. $460\\text{ V} / 60\\text{ Hz} = 7.67\\text{ V/Hz}$).',
      'Comportamiento de la Potencia: La potencia mecánica $P = T \\cdot \\omega$ crece linealmente con la frecuencia desde cero hasta la potencia nominal a 60 Hz ($P_{nom} = T_{nom} \\cdot \\omega_{nom}$).',
      'Compensación a muy baja frecuencia (IR Boost): A frecuencias menores a 5 Hz, la resistencia interna del cobre del estator ($R_s$) causa una caída óhmica que reduce el flujo. Los variadores aplican un "Voltage Boost" (refuerzo de voltaje inicial) para garantizar par de arranque pleno.',
      'Naturaleza de la carga: Cargas que presentan una resistencia mecánica uniforme y no dependen de la velocidad para oponer resistencia.',
    ],
    industrialExamples: [
      'Bandas transportadoras horizontales e inclinadas.',
      'Elevadores de personas y montacargas industriales.',
      'Extrusoras de plástico y alimentadores de tornillo sinfín.',
      'Compresores de pistón de desplazamiento positivo y prensas mecánicas.',
    ],
    keyTakeaway:
      'El motor conserva su capacidad de par nominal (100% de torque) en todo el intervalo de 0 a 60 Hz.',
  },
  {
    id: '3.2.4',
    code: '3.2.4',
    title: 'Funcionamiento a Par Variable',
    subtitle: 'Cargas Cuadráticas y Leyes de Afinidad (Bombas y Ventiladores)',
    formula: 'T \\propto n^2 \\quad \\text{y} \\quad P \\propto n^3 \\implies T = T_{nom} \\left(\\frac{f}{60}\\right)^2, \\; P = P_{nom} \\left(\\frac{f}{60}\\right)^3',
    quadrants: 'Cargas Centrífugas y Fluidomecánicas',
    summary:
      'En equipos turbomáquinas que impulsan fluidos (bombas centrífugas, ventiladores industriales, sopladores), el par resistente que opone la carga no es constante, sino que crece con el cuadrado de la velocidad de rotación. En consecuencia, la potencia mecánica demandada varía de forma proporcional al cubo de la velocidad.',
    details: [
      'Leyes de Afinidad en Turbomáquinas: Caudal $Q \\propto n$, Presión/Altura $H \\propto n^2$, Par $T \\propto n^2$, Potencia $P \\propto n^3$.',
      'Impacto en Ahorro Energético Masivo: Si reducimos la frecuencia a la mitad (de 60 Hz a 30 Hz, $n = 50\\%$): el caudal es $50\\%$, el par cae a $(0.5)^2 = 25\\%$ del nominal, ¡y la potencia consumida se desploma a $(0.5)^3 = 12.5\\%$! Esto representa un ahorro energético del $87.5\\%$ respecto a trabajar a velocidad fija.',
      'Ventaja frente a válvulas mecánicas: Antiguamente el caudal se regulaba estrangulando válvulas mecánicas o dampers mientras el motor seguía a 60 Hz consumiendo $\\sim 95\\%$ de energía. Con el variador modulando la frecuencia se ahorran miles de kilowatts-hora por mes.',
      'Curva V/f Cuadrática del Variador: Los variadores permiten configurar un perfil de par variable ("Variable Torque Curve"), entregando voltajes reducidos a baja frecuencia para no sobre-magnetizar el motor y reducir pérdidas en el hierro.',
    ],
    industrialExamples: [
      'Sistemas de bombeo municipal de agua potable y cárcamos de rebombeo.',
      'Torres de enfriamiento y ventiladores axiales de condensadores de HVAC.',
      'Sopladores de aire para aireación biológica en tratamiento de aguas residuales.',
      'Ventiladores de tiro inducido en calderas de vapor industriales.',
    ],
    keyTakeaway:
      'La ley cúbica de potencia (P ∝ f³) convierte al variador en la mayor tecnología de ahorro energético en la industria.',
  },
  {
    id: '3.2.5',
    code: '3.2.5',
    title: 'Funcionamiento a Potencia Constante',
    subtitle: 'Zona de Debilitamiento de Campo por encima de la Frecuencia Base (> 60 Hz)',
    formula: 'V = V_{nom} = \\text{cte}, \\quad \\Phi \\propto \\frac{1}{f}, \\quad P = P_{nom} = \\text{cte}, \\quad T \\propto \\frac{1}{f}',
    quadrants: 'Zona Supersíncrona (60 - 120 Hz)',
    summary:
      'Cuando un proceso mecatrónico requiere operar a velocidades superiores a la nominal (por encima de 60 Hz y hasta 120 Hz o más), el variador no puede suministrar más de la tensión nominal (ej. 460 V) debido al aislamiento dieléctrico del motor y la tensión del bus DC. El voltaje se fija en V_nom, provocando que la relación V/f disminuya y el flujo magnético en el estator se debilite.',
    details: [
      'Límite físico de tensión: Una vez que el inversor alcanza el 100% de la tensión de placa ($460\\text{ V RMS}$ a $60\\text{ Hz}$), no puede elevarla más. El voltaje se satura constante ($V = V_{nom}$).',
      'Debilitamiento de campo (Field Weakening): Al aumentar $f$ con $V$ constante, el flujo magnético en el entrehierro decrece de acuerdo con $\\Phi \\approx \\frac{V_{nom}}{f}$. Por tanto, el flujo es inversamente proporcional a la frecuencia.',
      'Comportamiento del Par y la Potencia: La capacidad de par cae hiperbólicamente: $T_{max} = \\frac{P_{nom}}{\\omega} \\propto \\frac{1}{f}$. A $120\\text{ Hz}$ (el doble de velocidad), el par máximo disponible es exactamente el $50\\%$ del nominal, pero la potencia mecánica disponible se mantiene constante en el $100\\%$ ($P = T \\cdot \\omega = \\text{cte}$).',
      'Precaución mecánica: A frecuencias muy altas (ej. $> 90\\text{ Hz}$), se debe vigilar la velocidad crítica del rotor, rodamientos y el par de desenganche (pull-out torque), que cae proporcional a $\\frac{1}{f^2}$.',
    ],
    industrialExamples: [
      'Husillos de centros de maquinado CNC y tornos mecatrónicos (desbaste a bajas RPM/alto par, y pulido fino a 10,000+ RPM/bajo par).',
      'Bobinadoras y devanadoras de lámina metálica, papel y películas plásticas.',
      'Sierras de alta velocidad para corte de madera y aluminio.',
      'Centrífugas de separación y rectificadoras de precisión.',
    ],
    keyTakeaway:
      'Permite multiplicar la velocidad de la máquina manteniendo la potencia nominal disponible, a costa de una reducción proporcional del par.',
  },
];
