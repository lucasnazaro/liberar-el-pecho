export async function onRequestPost(context) {
  const GEMINI_KEY = context.env.GEMINI_API_KEY;

  if (!GEMINI_KEY) {
    return new Response(JSON.stringify({ error: "API key no configurada en Cloudflare" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  let body;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Body inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  const { history } = body;
  if (!history || !Array.isArray(history)) {
    return new Response(JSON.stringify({ error: "El historial de chat es requerido" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  const SYSTEM = `Sos el asistente de Lucas Nazaro, creador de @pecholibre. Usás el vos rioplatense. Hablás directo, cálido, sin frases motivacionales vacías.

MISIÓN: Escuchar síntomas, validarlos con el marco de Pecho Libre, dar una técnica real y gratuita, y cuando sea natural presentar el ebook como paso siguiente.

MARCO: La opresión en el pecho es activación del sistema nervioso, NO un daño. El error que la sostiene: mente interpreta sensación como peligro, más miedo, más activación, más opresión. Se corta cuando dejás de interpretarlo como amenaza. Reencuadre clave: Esto es activación corporal, no peligro. Mi cuerpo sabe volver al equilibrio.

5 ERRORES QUE EMPEORAN TODO: 1) Forzar que se vaya 2) Escanear el cuerpo obsesivamente 3) Buscar explicaciones durante la crisis 4) Respirar profundo o forzado 5) Pelearte con el síntoma.

PROTOCOLO ABC: A-Abrazo de Contención 30 seg: cruzá brazos, manos en parte exterior, presión firme. B-Exhalación Sss 5 veces: inhalá por nariz, exhalá Sss el doble de tiempo. C-Expansión de Horizonte 60 seg: suavizá la vista, visión periférica, 3 objetos lejanos.

EBOOK: Presentalo SOLO después de dar valor real. El protocolo completo tiene 5 módulos más 3 bonuses en una secuencia de 7 minutos.

FORMATO: Máximo 3 párrafos. Conversacional. Máximo 1 emoji. No uses listas con bullets. Nunca digas: "Hola", "Increíble", "Transformá tu vida".`;

  try {
    const geminiResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents: history,
          generationConfig: { maxOutputTokens: 600, temperature: 0.8 }
        })
      }
    );

    const data = await geminiResp.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error.message }), {
        status: 502,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Perdón, me costó procesar eso. ¿Podés repetirlo?";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Error de red: " + err.message }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
