import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Subtema 1: Variadores Unidireccionales y Bidireccionales (1 a 4)
  {
    id: 1,
    category: 'Cuadrantes y Variadores',
    question:
      '¿Cuál es la principal restricción operativa de un variador de velocidad unidireccional estándar con puente rectificador a diodos?',
    options: [
      { key: 'A', text: 'Solo puede controlar la velocidad de motores monofásicos de polo sombreado.' },
      {
        key: 'B',
        text: 'Solo opera en el Cuadrante I (+V, +I), impidiendo el frenado regenerativo y requiriendo disipación térmica para frenar.',
      },
      { key: 'C', text: 'No permite regular frecuencias inferiores a 30 Hz por falta de inductancia.' },
      { key: 'D', text: 'Requiere forzosamente un motor de corriente directa con colector de delgas.' },
    ],
    correctAnswer: 'B',
    explanation:
      'Los variadores unidireccionales utilizan un puente rectificador no controlado a diodos que solo permite la circulación de corriente en una dirección. Por ende, operan en el Cuadrante I (+V, +I) y no pueden transferir energía de regreso a la red en frenados rápidos.',
  },
  {
    id: 2,
    category: 'Cuadrantes y Variadores',
    question:
      'En un accionamiento mecatrónico bidireccional de cuatro cuadrantes, ¿en qué cuadrantes específicos se presenta el modo de frenado regenerativo?',
    options: [
      { key: 'A', text: 'Exclusivamente en los Cuadrantes I (+V, +I) y III (-V, -I).' },
      { key: 'B', text: 'Solo en el Cuadrante I cuando el deslizamiento es positivo.' },
      {
        key: 'C',
        text: 'En los Cuadrantes II (+V, -I) durante desaceleración en avance y IV (-V, +I) durante desaceleración en reversa.',
      },
      { key: 'D', text: 'Únicamente en el Cuadrante III bajo control escalar.' },
    ],
    correctAnswer: 'C',
    explanation:
      'En el Cuadrante II la velocidad es positiva pero el par y la corriente son opuestos, actuando el motor como generador. En el Cuadrante IV la velocidad es negativa y el par es positivo, generando frenado regenerativo en reversa.',
  },
  {
    id: 3,
    category: 'Cuadrantes y Variadores',
    question:
      '¿Qué tecnología en la etapa de entrada a la red sustituye a los diodos para permitir la bidireccionalidad y regeneración limpia a la red (AFE)?',
    options: [
      { key: 'A', text: 'Un puente de tiristores SCR con ángulo de disparo fijo a 90 grados.' },
      {
        key: 'B',
        text: 'Un convertidor activo frontal (Active Front End) basado en transistores IGBTs controlados por PWM.',
      },
      { key: 'C', text: 'Un transformador trifásico saturable con núcleo amorfo refrigerado en aceite.' },
      { key: 'D', text: 'Un banco de relevadores mecánicos de conmutación ultrarrápida.' },
    ],
    correctAnswer: 'B',
    explanation:
      'El Active Front End (AFE) utiliza transistores IGBT con modulación PWM sincronizada con la red eléctrica, lo que permite flujo bidireccional de potencia y retorno de energía con factor de potencia casi unitario y bajo contenido armónico.',
  },
  {
    id: 4,
    category: 'Cuadrantes y Variadores',
    question:
      'Si un montacargas conectado a un variador unidireccional desciende una carga pesada y el motor gira más rápido que la velocidad síncrona sin chopper de frenado, ¿qué falla se suscitará?',
    options: [
      { key: 'A', text: 'Disparo por sobretensión en el bus de corriente directa (Falla OVT / Overvoltage DC Bus).' },
      { key: 'B', text: 'Inversión espontánea de las fases de alimentación trifásica.' },
      { key: 'C', text: 'Disparo instantáneo por baja frecuencia en el rotor.' },
      { key: 'D', text: 'Aumento súbito de la impedancia mutua hasta el infinito.' },
    ],
    correctAnswer: 'A',
    explanation:
      'Al descender la carga pesada, el motor actúa como generador inyectando corriente hacia el bus de continua. Como el puente de diodos bloquea el retorno a la red y no hay chopper/resistencia para disiparla, la tensión del DC Link sube descontroladamente disparando la alarma de sobretensión.',
  },

  // Subtema 2: Funcionamiento a Par Constante (5 a 8)
  {
    id: 5,
    category: 'Par Constante',
    question:
      'En el rango de 0 Hz a 60 Hz (zona a Par Constante), ¿por qué es imperativo mantener constante la relación Tensión/Frecuencia ($V/f$)?',
    options: [
      { key: 'A', text: 'Para anular las pérdidas mecánicas por fricción y ventilación en los rodamientos.' },
      {
        key: 'B',
        text: 'Para mantener el flujo magnético constante en su valor nominal, evitando saturación del núcleo o pérdida de par motor.',
      },
      { key: 'C', text: 'Para forzar a que la corriente consumida sea idéntica a 0 Amperes.' },
      { key: 'D', text: 'Para convertir el motor de inducción en una máquina síncrona de imanes permanentes.' },
    ],
    correctAnswer: 'B',
    explanation:
      'Dado que el flujo magnético en el entrehierro es proporcional a $V/f$ ($\\Phi \\approx \\frac{V}{4.44 \\cdot f \\cdot N}$), si la relación se mantiene fija, el flujo magnético permanece constante en su valor nominal de diseño, garantizando que el motor mantenga su par nominal disponible sin sobrecalentarse.',
  },
  {
    id: 6,
    category: 'Par Constante',
    question:
      'A muy bajas frecuencias (1 Hz a 5 Hz), la caída de tensión en la resistencia del estator ($R_s$) disminuye el par de arranque. ¿Qué ajuste aplican los variadores?',
    options: [
      { key: 'A', text: 'Refuerzo de voltaje inicial (Voltage Boost / compensación IR).' },
      { key: 'B', text: 'Debilitamiento prematuro de campo magnético a 90 grados.' },
      { key: 'C', text: 'Inversión de secuencia de fases cada 10 milisegundos.' },
      { key: 'D', text: 'Aumento indefinido de la frecuencia de portadora PWM a 100 kHz.' },
    ],
    correctAnswer: 'A',
    explanation:
      'El parámetro "Voltage Boost" (o refuerzo de par de arranque) eleva la tensión de salida a frecuencias muy bajas por encima de la línea recta $V/f$ para compensar la caída óhmica $R_s \\cdot I$ y garantizar suficiente flujo y par de arranque.',
  },
  {
    id: 7,
    category: 'Par Constante',
    question:
      '¿Cuál de los siguientes sistemas mecatrónicos industriales representa un ejemplo clásico de carga a Par Constante?',
    options: [
      { key: 'A', text: 'Una bomba centrífuga de agua para enfriamiento de moldes.' },
      { key: 'B', text: 'Un ventilador de tiro forzado de una torre evaporativa.' },
      {
        key: 'C',
        text: 'Una banda transportadora de minerales o un elevador vertical de cangilones con peso gravitacional constante.',
      },
      { key: 'D', text: 'Un soplador de aire axial para climatización.' },
    ],
    correctAnswer: 'C',
    explanation:
      'En bandas transportadoras y elevadores verticales la fuerza requerida para vencer el rozamiento y la gravedad es independiente de la velocidad; por lo tanto, el par demandado permanece constante sin importar a cuántas RPM gire.',
  },
  {
    id: 8,
    category: 'Par Constante',
    question:
      'En el modo a Par Constante (0 a 60 Hz), ¿cómo evoluciona la potencia mecánica entregada al aumentar la frecuencia?',
    options: [
      { key: 'A', text: 'Permanece fija en el 100% de la potencia nominal desde 0 Hz.' },
      {
        key: 'B',
        text: 'Aumenta linealmente con la frecuencia ($P = T \\cdot \\omega$), alcanzando la potencia nominal de placa a los 60 Hz.',
      },
      { key: 'C', text: 'Decae hiperbólicamente de acuerdo con $P \\propto 1/f$.' },
      { key: 'D', text: 'Permanece en cero hasta llegar a la velocidad síncrona.' },
    ],
    correctAnswer: 'B',
    explanation:
      'Como la potencia es el producto de par por velocidad angular ($P = T \\cdot \\omega$), y el par $T$ se mantiene constante, la potencia crece en línea recta directamente proporcional a la velocidad, alcanzando el 100% justo a la frecuencia base (60 Hz).',
  },

  // Subtema 3: Funcionamiento a Par Variable (9 a 12)
  {
    id: 9,
    category: 'Par Variable',
    question:
      'Conforme a las Leyes de Afinidad en cargas centrífugas (bombas y ventiladores), ¿cómo se relaciona el par mecánico resistente con la velocidad?',
    options: [
      { key: 'A', text: 'El par es proporcional al cuadrado de la velocidad de giro ($T \\propto n^2$).' },
      { key: 'B', text: 'El par es inversamente proporcional a la raíz cuadrada de las RPM.' },
      { key: 'C', text: 'El par es constante e inalterable en todo el rango térmico.' },
      { key: 'D', text: 'El par decae de forma logarítmica con el tiempo.' },
    ],
    correctAnswer: 'A',
    explanation:
      'En fluidomecánica, la resistencia hidrodinámica/aerodinámica que opone un fluido al movimiento de los álabes hace que el par requerido sea directamente proporcional al cuadrado de la velocidad rotacional ($T \\propto n^2$).',
  },
  {
    id: 10,
    category: 'Par Variable',
    question:
      'Si un variador reduce la frecuencia de un ventilador centrífugo de 60 Hz a 30 Hz (al 50% de su velocidad), ¿a cuánto disminuye la potencia consumida teórica?',
    options: [
      { key: 'A', text: 'Aproximadamente al 50% de la potencia nominal.' },
      {
        key: 'B',
        text: 'Aproximadamente al 12.5% de la potencia nominal ($P \\propto n^3 \\rightarrow (0.5)^3 = 0.125$), ahorrando un 87.5% de energía.',
      },
      { key: 'C', text: 'Al 25% exacto sin importar las leyes de afinidad.' },
      { key: 'D', text: 'La potencia no disminuye, solo el factor de potencia.' },
    ],
    correctAnswer: 'B',
    explanation:
      'Por la ley cúbica de potencia en turbomáquinas ($P \\propto n^3$), a la mitad de velocidad (0.5) la potencia demandada es $(0.5)^3 = 0.125$, es decir, el 12.5% de la potencia a plena carga, logrando un ahorro energético de casi 87.5%.',
  },
  {
    id: 11,
    category: 'Par Variable',
    question:
      '¿Por qué el control de caudal mediante variador de frecuencia es muy superior al uso de una válvula mecánica de estrangulamiento?',
    options: [
      {
        key: 'A',
        text: 'Porque la válvula disipa energía por fricción mientras el motor consume potencia plena; el variador reduce la potencia absorbida.',
      },
      { key: 'B', text: 'Porque las válvulas mecánicas introducen armónicos de corriente THD a la red eléctrica.' },
      { key: 'C', text: 'Porque el variador elimina la necesidad de lubricar los cojinetes mecánicos.' },
      { key: 'D', text: 'Porque el agua deja de tener viscosidad dinámica al pasar por un variador.' },
    ],
    correctAnswer: 'A',
    explanation:
      'Estrangular una válvula equivale a pisar el acelerador y el freno a la vez: el motor sigue consumiendo ~90-100% de energía. El variador ralentiza el rodete, reduciendo la potencia demandada cúbicamente y prolongando la vida de sellos y tuberías.',
  },
  {
    id: 12,
    category: 'Par Variable',
    question:
      '¿Qué curva de modulación V/f se programa en un variador industrial cuando se acciona una bomba centrífuga para máxima eficiencia?',
    options: [
      {
        key: 'A',
        text: 'Curva cuadrática o de par variable (VT - Variable Torque), que suministra menor tensión a bajas frecuencias para evitar pérdidas en el hierro.',
      },
      { key: 'B', text: 'Curva hiperbólica con refuerzo extremo de par a 100% de tensión continua.' },
      { key: 'C', text: 'Curva lineal con sobretensión constante a 600 V.' },
      { key: 'D', text: 'Curva escalonada con modulación analógica de 60 Hz fijos.' },
    ],
    correctAnswer: 'A',
    explanation:
      'El perfil de par variable (curva cuadrática) ajusta la tensión suministrada de acuerdo con el par requerido por la bomba, reduciendo la tensión a bajas velocidades para no sobre-magnetizar el motor y abatir pérdidas magnéticas y calentamiento.',
  },

  // Subtema 4: Funcionamiento a Potencia Constante (13 a 16)
  {
    id: 13,
    category: 'Potencia Constante',
    question:
      'Por encima de la frecuencia base (> 60 Hz), ¿por qué no es factible continuar incrementando la tensión aplicada con la misma relación $V/f$?',
    options: [
      { key: 'A', text: 'Porque la ley de Ohm dejaría de cumplirse a frecuencias altas.' },
      {
        key: 'B',
        text: 'Porque se superarían los límites dieléctricos de aislamiento del motor y la tensión máxima que puede entregar el bus DC del inversor.',
      },
      { key: 'C', text: 'Porque el motor superaría la velocidad de propagación de la luz.' },
      { key: 'D', text: 'Porque el campo magnético del rotor se transformaría en electrostático.' },
    ],
    correctAnswer: 'B',
    explanation:
      'El variador y el motor están diseñados para una tensión nominal máxima (típicamente 460 V o 230 V). Elevar la tensión por encima de este valor perforaría el barniz de aislamiento dieléctrico del bobinado estatórico y superaría la capacidad del rectificador/inversor.',
  },
  {
    id: 14,
    category: 'Potencia Constante',
    question:
      'En la zona de debilitamiento de campo (Field Weakening) a 120 Hz con tensión constante en su valor nominal (460 V), ¿qué le ocurre al flujo magnético?',
    options: [
      { key: 'A', text: 'Se duplica saturando ferozmente el núcleo de acero al silicio.' },
      {
        key: 'B',
        text: 'Se reduce a la mitad de su valor nominal ($\\Phi \\propto 1/f$), debido a que V permanece constante y la frecuencia se duplicó.',
      },
      { key: 'C', text: 'Permanece invariable gracias a la reactancia síncrona.' },
      { key: 'D', text: 'Desaparece por completo impidiendo que el motor gire.' },
    ],
    correctAnswer: 'B',
    explanation:
      'Como $\\Phi \\approx \\frac{V}{k \\cdot f}$, al fijar el voltaje en su límite nominal y duplicar la frecuencia a 120 Hz, la relación $V/f$ se divide entre 2. En consecuencia, el flujo magnético en el entrehierro cae exactamente al 50% de su valor nominal.',
  },
  {
    id: 15,
    category: 'Potencia Constante',
    question:
      'En la región a Potencia Constante, al mantener la potencia mecánica disponible fija en el 100%, ¿cómo cambia el par máximo del motor al elevar la velocidad?',
    options: [
      { key: 'A', text: 'El par disponible permanece constante en su valor nominal.' },
      {
        key: 'B',
        text: 'El par disminuye hiperbólicamente de manera inversamente proporcional a la frecuencia ($T = \\frac{P}{\\omega} \\propto 1/f$).',
      },
      { key: 'C', text: 'El par aumenta con el cubo de la frecuencia.' },
      { key: 'D', text: 'El par oscila entre valores positivos y negativos senoidalmente.' },
    ],
    correctAnswer: 'B',
    explanation:
      'Dado que $P = T \\cdot \\omega = \\text{cte}$, despejando el par obtenemos $T = \\frac{P}{\\omega}$. Al aumentar la velocidad angular $\\omega$ (o frecuencia $f$), el par disponible disminuye en proporción inversa (a 120 Hz el par disponible es el 50% del nominal).',
  },
  {
    id: 16,
    category: 'Potencia Constante',
    question:
      '¿Qué proceso mecatrónico industrial aprovecha fundamentalmente la zona de funcionamiento a Potencia Constante?',
    options: [
      {
        key: 'A',
        text: 'El husillo principal de un torno CNC o centro de maquinado (desbaste a bajo RPM y alto par; pulido/acabado a alto RPM y bajo par).',
      },
      { key: 'B', text: 'Una bomba dosificadora volumétrica de émbolo positivo.' },
      { key: 'C', text: 'Un elevador de carga con contrapeso equilibrado.' },
      { key: 'D', text: 'Un triturador de mandíbulas para roca volcánica.' },
    ],
    correctAnswer: 'A',
    explanation:
      'En el maquinado CNC, el desbaste requiere arrancar mucho material a bajas velocidades demandando alto par motor. Durante el pulido o acabado superficial se requiere altísima velocidad de corte con muy bajo par resistente; la potencia mecánica requerida es similar en ambos casos.',
  },

  // Subtema 5: Casos Prácticos de Selección de Drives (17 a 20)
  {
    id: 17,
    category: 'Casos Prácticos',
    question:
      'Se diseña el accionamiento de un elevador industrial mecatrónico que bajará cargas pesadas continuamente. ¿Cuál es la selección de ingeniería correcta?',
    options: [
      { key: 'A', text: 'Un variador unidireccional estándar sin resistencia exterior para ahorrar costos.' },
      {
        key: 'B',
        text: 'Un variador de 4 cuadrantes con módulo regenerativo AFE o un variador con chopper y resistencia de frenado dinámico adecuada.',
      },
      { key: 'C', text: 'Un arrancador suave estático con tiristores en antiparalelo únicamente.' },
      { key: 'D', text: 'Conectar un banco de capacitores en paralelo con el estator para absorber el par.' },
    ],
    correctAnswer: 'B',
    explanation:
      'Un elevador que desciende cargas pesadas somete al motor a par negativo continuo (modo generador). Si no se cuenta con frenado dinámico o variador regenerativo AFE de 4 cuadrantes, la tensión del bus DC subirá provocando paro por sobretensión y peligro inminente.',
  },
  {
    id: 18,
    category: 'Casos Prácticos',
    question:
      'Un motor de inducción trifásico de 4 polos tiene una frecuencia nominal de 60 Hz (1800 RPM síncronas). Si se opera en debilitamiento de campo a 90 Hz, ¿cuál será su velocidad síncrona?',
    options: [
      { key: 'A', text: '1800 RPM.' },
      { key: 'B', text: '1200 RPM.' },
      { key: 'C', text: '2700 RPM ($n_s = \\frac{120 \\cdot f}{P} = \\frac{120 \\cdot 90}{4}$).' },
      { key: 'D', text: '3600 RPM.' },
    ],
    correctAnswer: 'C',
    explanation:
      'La velocidad síncrona se calcula como $n_s = \\frac{120 \\cdot f}{P}$. Con 4 polos y $f = 90\\text{ Hz}$: $n_s = \\frac{120 \\cdot 90}{4} = \\frac{10800}{4} = 2700\\text{ RPM}$.',
  },
  {
    id: 19,
    category: 'Casos Prácticos',
    question:
      'En una banda transportadora que opera a par constante con control $V/f$ lineal, al reducir la frecuencia de 60 Hz a 30 Hz con carga nominal, ¿qué ocurre con la corriente absorbida?',
    options: [
      { key: 'A', text: 'Se reduce drásticamente al 12.5% de su valor original.' },
      {
        key: 'B',
        text: 'Permanece prácticamente constante cerca de su valor nominal, porque el par demandado y el flujo magnético no han variado.',
      },
      { key: 'C', text: 'Se eleva al cuádruple quemando el devanado en segundos.' },
      { key: 'D', text: 'Cae a cero instantáneamente.' },
    ],
    correctAnswer: 'B',
    explanation:
      'En una máquina de inducción el par electromagnético es proporcional al producto del flujo y la corriente activa ($T \\propto \\Phi \\cdot I$). Como el flujo se mantiene constante por la relación $V/f$ fija y el par demandado por la banda es el mismo, la corriente estatórica demandada permanece constante.',
  },
  {
    id: 20,
    category: 'Casos Prácticos',
    question:
      'En una rebobinadora industrial donde el diámetro del carrete aumenta (exigiendo menor velocidad angular pero mayor par mecánico para mantener la tensión de la tira), ¿qué régimen de operación se utiliza?',
    options: [
      { key: 'A', text: 'Régimen a Par Variable cuadrático.' },
      {
        key: 'B',
        text: 'Régimen a Potencia Constante ($P = T \\cdot \\omega = \\text{cte}$), pues al crecer el diámetro, la velocidad angular cae y el par sube de forma proporcional.',
      },
      { key: 'C', text: 'Control directo a línea sin variador de velocidad.' },
      { key: 'D', text: 'Régimen monofásico con pulsos de corriente continua.' },
    ],
    correctAnswer: 'B',
    explanation:
      'Para conservar constante la fuerza de tensión mecánica del material ($F$) y la velocidad lineal ($v$), la potencia mecánica debe ser constante: $P = F \\cdot v = T \\cdot \\omega$. Al aumentar el diámetro del rollo, $\\omega$ disminuye y el par $T$ necesario aumenta proporcionalmente, lo que constituye la definición clásica de accionamiento a potencia constante.',
  },
];
