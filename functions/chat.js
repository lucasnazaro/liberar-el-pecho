export async function onRequestPost(context) {
  const GEMINI_KEY = context.env.GEMINI_API_KEY;

  // 1. Verificación de clave
  if (!GEMINI_KEY) {
    return new Response(JSON.stringify({ error: "Cloudflare NO encuentra la variable GEMINI_API_KEY" }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }

  // 2. Lectura del historial enviado desde el HTML
  let body;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "No se recibió un JSON válido" }), { status: 400 });
  }

  const history = body.history || [];
  
  // 3. Instrucción de sistema (la personalidad de Lucas)
  const systemPrompt = "Sos el asistente de Lucas Nazaro de @pecholibre. Hablás en vos rioplatense. Tu misión es validar el síntoma de opresión en el pecho como una activación nerviosa (no peligro) y ofrecer calma. Si la charla avanza, mencioná que el protocolo completo de 7 minutos está en el ebook.";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: `INSTRUCCIÓN DE SISTEMA: ${systemPrompt}` }] },
            { role: "model", parts: [{ text: "Entendido, actuaré como el asistente de Pecho Libre." }] },
            ...history
          ],
          generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
        })
      }
    );

    const data = await response.json();

    // 4. Manejo de errores de la API de Google
    if (data.error) {
      return new Response(JSON.stringify({ 
        error: "Google API Error", 
        detalles: data.error.message 
      }), { status: 502 });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No pude generar una respuesta. ¿Me repetís?";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Error de conexión", detalles: err.message }), { status: 500 });
  }
}
