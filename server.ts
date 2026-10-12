import express from "express";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const QUESTIONS = [
  {
    index: 1,
    title: "Pregunta 1: Carga Centrífuga y Ahorro a Par Variable",
    prompt:
      "En el simulador, al seleccionar la Bomba Centrífuga y reducir la frecuencia a 30 Hz, ¿qué ocurre con el par requerido por la carga en comparación con una cinta transportadora y por qué genera ahorro energético?",
    expectedConcepts: [
      "cuadrado",
      "proporcional",
      "t proporcional a f^2",
      "par cuadratico",
      "potencia al cubo",
      "25%",
      "constante",
      "cinta transportadora mantiene el par",
      "ahorro",
      "afinidad",
    ],
  },
  {
    index: 2,
    title: "Pregunta 2: Potencia Constante y Debilitamiento de Campo",
    prompt:
      "Cuando llevas la frecuencia por encima de los 60 Hz en el modo de Potencia Constante, ¿por qué empieza a caer el par del motor? ¿Qué parámetro eléctrico se mantiene fijo?",
    expectedConcepts: [
      "voltaje",
      "tension",
      "fijo",
      "nominal",
      "debilitamiento de campo",
      "flujo",
      "flujo magnetico",
      "v/f",
      "cae",
      "aislamiento",
    ],
  },
  {
    index: 3,
    title: "Pregunta 3: Frenado Regenerativo y Cuadrantes de Operación",
    prompt:
      "Si necesitas detener rápidamente un motor y aprovechar la energía de frenado para regresarla a la red, ¿qué tipo de variador requerimos utilizar (unidireccional o bidireccional) y en qué cuadrantes trabaja?",
    expectedConcepts: [
      "bidireccional",
      "cuadrante 2",
      "cuadrante 4",
      "regenerativo",
      "4 cuadrantes",
      "afe",
      "retorno a la red",
    ],
  },
];

// Socratic Chat endpoint
app.post("/api/socratic-chat", async (req, res) => {
  try {
    const {
      message,
      currentQuestionIndex = 1,
      history = [],
      studentName = "Estudiante",
    } = req.body;

    const currentQ = QUESTIONS.find((q) => q.index === currentQuestionIndex) || QUESTIONS[0];

    // If Gemini is available, try gemini-3.8-flash first
    if (ai) {
      try {
        const systemInstruction = `
Eres un distinguido y cordial Profesor de la asignatura "Electrónica de Potencia Aplicada (Clave: MTJ-1012)", de la División de Ingeniería Mecatrónica en el Instituto Tecnológico Superior de Comalcalco (ITSC), TecNM.
Estás evaluando a tu estudiante (${studentName}) en el "Tema 3.2: Modos de funcionamiento electrónico y electromecánico".

ESTRICTA METODOLOGÍA SOCRÁTICA:
1. NUNCA des la respuesta directa ni resuelvas la pregunta por el estudiante.
2. Si el estudiante responde de manera incompleta, imprecisa o errónea, haz una pregunta guía corta y estimulante señalando qué concepto físico debe reconsiderar (ejemplo: relación entre par y velocidad en cargas centrífugas, o qué ocurre con la relación V/f cuando el voltaje ya no puede aumentar).
3. Evalúa con criterio ingenieril riguroso pero motivador.
4. Las 3 preguntas secuenciales son:
   - Pregunta 1: "${QUESTIONS[0].prompt}"
     (Criterio de aprobación: Debe entender que en bombas/ventiladores el par es proporcional al cuadrado de la velocidad (T ∝ f²), por lo que a 30 Hz el par cae al ~25% y la potencia al ~12.5% (P ∝ f³), mientras que en la cinta transportadora el par es constante. Esto genera un ahorro energético masivo).
   - Pregunta 2: "${QUESTIONS[1].prompt}"
     (Criterio de aprobación: Debe identificar que el parámetro eléctrico que se mantiene fijo es la TENSIÓN/VOLTAJE nominal V_nom (límite de aislamiento/inversor). Al subir la frecuencia con tensión fija, el flujo magnético decae Φ ∝ V/f (zona de debilitamiento de campo), reduciendo el par motor T ∝ 1/f mientras la potencia se mantiene constante).
   - Pregunta 3: "${QUESTIONS[2].prompt}"
     (Criterio de aprobación: Debe responder que se requiere un variador BIDIRECCIONAL (de 4 cuadrantes con puente rectificador activo/regenerativo) y que trabaja en los cuadrantes de regeneración: Cuadrante II (avance generador) y Cuadrante IV (reversa generador)).

FORMATO OBLIGATORIO DE RESPUESTA:
Debes responder en formato JSON EXACTO con las siguientes claves:
{
  "evaluation": "approved" | "needs_improvement",
  "reply": "Tu mensaje pedagógico para el alumno",
  "nextQuestionIndex": number, // Si aprobó la pregunta 1 -> pasa a 2. Si aprobó la 2 -> pasa a 3. Si aprobó la 3 -> pasa a 4 (completado). Si no aprobó, conserva el número actual.
  "socraticPassed": boolean // true SOLAMENTE si aprobó la pregunta 3 y concluyó exitosamente las 3 preguntas
}

Ejemplo cuando aprueba la Pregunta 1:
{
  "evaluation": "approved",
  "reply": "¡Excelente deducción, colega mecatrónico! Has identificado con precisión la ley cuadrática de par y la cúbica de potencia en cargas centrífugas frente al par constante de la banda. Pasemos a la siguiente etapa:\n\nPregunta 2: ${QUESTIONS[1].prompt}",
  "nextQuestionIndex": 2,
  "socraticPassed": false
}

Ejemplo cuando aprueba la Pregunta 3 (final):
{
  "evaluation": "approved",
  "reply": "¡Sobresaliente! Has demostrado un dominio cabal de los 4 cuadrantes y la regeneración bidireccional hacia la red eléctrica. Con esto has acreditado el Tutor Socrático con éxito. Ya puedes acceder al Examen Final de 20 Reactivos.",
  "nextQuestionIndex": 4,
  "socraticPassed": true
}
`;

        const promptContext = `
Pregunta actual a evaluar: Pregunta ${currentQuestionIndex}: "${currentQ.prompt}"
Historial previo de la sesión:
${history.map((h: { role: string; text: string }) => `${h.role === "user" ? "Alumno" : "Profesor"}: ${h.text}`).join("\n")}

Nueva respuesta del alumno:
"${message}"

Evalúa si la respuesta del alumno para la Pregunta ${currentQuestionIndex} demuestra comprensión suficiente. Devuelve estrictamente el JSON especificado.
`;

        const geminiResponse = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: promptContext,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        });

        const responseText = geminiResponse.text?.trim() || "";
        let parsed;
        try {
          parsed = JSON.parse(responseText);
        } catch {
          const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
          parsed = JSON.parse(cleaned);
        }

        return res.json({
          reply: parsed.reply,
          evaluation: parsed.evaluation,
          currentQuestionIndex: parsed.nextQuestionIndex || currentQuestionIndex,
          socraticPassed: Boolean(parsed.socraticPassed),
        });
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to pedagogical engine:", geminiError);
        // Fall through to heuristic evaluation below
      }
    }

    // Heuristic Fallback when GEMINI_API_KEY is not configured
    const lower = message.toLowerCase();
    let approved = false;
    let reply = "";
    let nextIndex = currentQuestionIndex;
    let socraticPassed = false;

    if (currentQuestionIndex === 1) {
      const mentionsQuad =
        lower.includes("cuadra") ||
        lower.includes("potencia al cubo") ||
        lower.includes("25") ||
        lower.includes("proporcional al cuadrado") ||
        lower.includes("disminuye") ||
        lower.includes("cae") ||
        lower.includes("menos par") ||
        lower.includes("menor par");
      const mentionsConst =
        lower.includes("constante") ||
        lower.includes("cinta") ||
        lower.includes("transportadora") ||
        lower.includes("permanece");
      const mentionsEnergy =
        lower.includes("ahorro") ||
        lower.includes("energ") ||
        lower.includes("potencia") ||
        lower.includes("consumo");

      if ((mentionsQuad || (mentionsEnergy && lower.includes("par"))) && (mentionsConst || lower.includes("bomba"))) {
        approved = true;
        nextIndex = 2;
        reply = `¡Excelente análisis, ${studentName}! Has fundamentado correctamente que en las bombas centrífugas el par depende del cuadrado de la velocidad (T ∝ n²) y la potencia del cubo (P ∝ n³), provocando que a 30 Hz la demanda de par se reduzca al 25% y la potencia al 12.5%, a diferencia de la cinta transportadora cuyo par resistivo es constante. Esto genera un ahorro de energía extraordinario.\n\nAvancemos a la siguiente incógnita de control:\n\n**Pregunta 2:** ${QUESTIONS[1].prompt}`;
      } else {
        reply = `Observa con atención el simulador, ${studentName}. Cuando colocas la Bomba Centrífuga a 30 Hz, revisa la curva de Par vs Frecuencia. ¿El par requerido se mantiene constante como en la cinta, o cae de forma no lineal? ¿Qué ley de afinidad rige a los fluidos centrífugos y cómo influye eso en los kW consumidos?`;
      }
    } else if (currentQuestionIndex === 2) {
      const mentionsVoltage =
        lower.includes("voltaje") ||
        lower.includes("tensión") ||
        lower.includes("tension") ||
        lower.includes("v_nom") ||
        lower.includes("nominal") ||
        lower.includes("constante");
      const mentionsFluxOrField =
        lower.includes("flujo") ||
        lower.includes("campo") ||
        lower.includes("debilitamiento") ||
        lower.includes("v/f") ||
        lower.includes("satur") ||
        lower.includes("aislamiento");

      if (mentionsVoltage && mentionsFluxOrField) {
        approved = true;
        nextIndex = 3;
        reply = `¡Muy bien razonado, futuro Ingeniero! Al superar los 60 Hz, la tensión (voltaje) se mantiene fija en el valor nominal por restricciones físicas y de aislamiento del motor. Dado que el flujo magnético es proporcional a V/f, al subir f con V constante el flujo decae (zona de debilitamiento de campo), reduciendo el par de forma inversamente proporcional (T ∝ 1/f) para mantener la potencia P = T·ω constante.\n\nÚltima pregunta para validar tu acreditación socrática:\n\n**Pregunta 3:** ${QUESTIONS[2].prompt}`;
      } else {
        reply = `Vas por buen camino, pero profundicemos en la física del accionamiento. Piensa en el inversor: ¿puede entregar voltajes infinitos por encima de los 460 V nominales? ¿Qué parámetro eléctrico de la red/inversor llega a su límite máximo y qué le ocurre entonces a la relación V/f y al flujo magnético en el entrehierro?`;
      }
    } else if (currentQuestionIndex === 3) {
      const mentionsBidir =
        lower.includes("bidireccional") ||
        lower.includes("cuatro cuadrantes") ||
        lower.includes("4 cuadrantes") ||
        lower.includes("afe") ||
        lower.includes("regenerativo");
      const mentionsQuadrants =
        lower.includes("cuadrante 2") ||
        lower.includes("cuadrante ii") ||
        lower.includes("cuadrante 4") ||
        lower.includes("cuadrante iv") ||
        lower.includes("2 y 4") ||
        lower.includes("ii y iv") ||
        lower.includes("regenera");

      if (mentionsBidir && mentionsQuadrants) {
        approved = true;
        nextIndex = 4;
        socraticPassed = true;
        reply = `¡Extraordinario trabajo, ${studentName}! Has respondido con total precisión mecatrónica. Para inyectar energía regenerada de vuelta a la red trifásica se requiere forzosamente un Variador Bidireccional (de 4 cuadrantes, típicamente con etapa frontal activa AFE). El frenado regenerativo se efectúa en el Cuadrante II (frenado en avance: +V, -I) y en el Cuadrante IV (frenado en reversa: -V, +I).\n\n🎉 **¡HAS ACREDITADO EL TUTOR SOCRÁTICO SATISFACTORIAMENTE!** La variable de validación se ha activado. Puedes proceder de inmediato a la Sección 4 para realizar tu Examen Final y obtener tu Constancia Oficial del ITSC.`;
      } else {
        reply = `Casi lo tienes, ${studentName}. Analiza la dirección del flujo de energía: si la energía cinética del rotor debe convertirse en eléctrica y devolverse a las líneas de la CFE en vez de disiparse en calor en una resistencia de frenado, ¿puede un variador unidireccional con puente de diodos tradicional regresar corriente a la red? ¿Y en cuáles de los 4 cuadrantes (I, II, III o IV) la potencia mecánica y eléctrica es negativa (modo generador)?`;
      }
    }

    return res.json({
      reply,
      evaluation: approved ? "approved" : "needs_improvement",
      currentQuestionIndex: nextIndex,
      socraticPassed,
    });
  } catch (error) {
    console.error("Error in /api/socratic-chat:", error);
    return res.status(500).json({
      error: "Error procesando la consulta del tutor socrático.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Configure Vite or Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
