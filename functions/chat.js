export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const { history } = await request.json();
    const apiKey = env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Falta GEMINI_API_KEY" }), { status: 500 });
    }

    const SYSTEM = `Sos el asistente de Lucas Nazaro, creador de @pecholibre. Usás el vos rioplatense. Hablás directo, cálido, sin frases motivacionales vacías.
    MISIÓN: Escuchar síntomas, validarlos con el marco de Pecho Libre, dar una técnica real y gratuita, y cuando sea natural presentar el ebook como paso siguiente.
    MARCO: La opresión en el pecho es activación del sistema nervioso, NO un daño.
    PROTOCOLO ABC: A-Abrazo de Contención. B-Exhalación Sss. C-Expansión de Horizonte.
    FORMATO: Máximo 3 párrafos. Conversacional. Máximo 1 emoji.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents: history
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Perdón, hubo un error.";

    return new Response(JSON.stringify({ reply }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
