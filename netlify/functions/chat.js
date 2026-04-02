const fetch = require("node-fetch");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key no configurada en Netlify" })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Body inválido" }) };
  }

  // Si no hay historial, creamos uno con el último mensaje
  let contents = body.history;
  if (!contents || !Array.isArray(contents)) {
    contents = [{ role: "user", parts: [{ text: body.message || "Hola" }] }];
  }

  const SYSTEM = `Sos el asistente de Lucas Nazaro, creador de @pecholibre. Usás el vos rioplatense. Hablás directo, cálido, sin frases motivacionales vacías.
  MISIÓN: Escuchar síntomas, validarlos con el marco de Pecho Libre, dar una técnica real y gratuita, y cuando sea natural presentar el ebook como paso siguiente.
  MARCO: La opresión en el pecho es activación del sistema nervioso, NO un daño. El error que la sostiene: mente interpreta sensación como peligro, más miedo, más activación, más opresión. 
  5 ERRORES: 1) Forzar que se vaya 2) Escanear el cuerpo 3) Buscar explicaciones 4) Respirar forzado 5) Pelearte con el síntoma.
  PROTOCOLO ABC: A-Abrazo de Contención. B-Exhalación Sss. C-Expansión de Horizonte.
  FORMATO: Máximo 3 párrafos. Conversacional. Máximo 1 emoji. Nunca uses: transformá tu vida, increíble, hola, sin más preámbulos.`;

  try {
    // Usamos v1beta para asegurar compatibilidad con system_instruction
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

    const geminiResp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM }] },
        contents: contents,
        generationConfig: { maxOutputTokens: 500, temperature: 0.8 }
      })
    });

    const data = await geminiResp.json();

    if (data.error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.error.message })
      };
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Perdoname, me tildé. ¿Me repetís?";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error de red: " + err.message })
    };
  }
};
