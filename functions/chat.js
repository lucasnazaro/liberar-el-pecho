export async function onRequestPost(context) {
  const GEMINI_KEY = context.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) {
    return new Response(JSON.stringify({ error: "API Key no encontrada" }), { status: 500 });
  }

  let body;
  try {
    body = await context.request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Error en el body" }), { status: 400 });
  }

  const history = body.history || [];
  const userMessage = body.message || "";

  const systemText = "Sos el asistente de Lucas Nazaro de @pecholibre. Hablás en vos rioplatense. Validás síntomas de opresión en el pecho como activación nerviosa y ofrecés calma. Si es oportuno, mencioná el protocolo de 7 minutos.";

  // Construir contents: historial previo + mensaje actual
  const contents = [
    ...history, // [{role:"user", parts:[{text:"..."}]}, {role:"model", parts:[{text:"..."}]}, ...]
    {
      role: "user",
      parts: [{ text: userMessage }]
    }
  ];

  const payload = {
    system_instruction: {
      parts: [{ text: systemText }]
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 400
    }
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error.message }), { status: 500 });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No pude procesar eso, ¿me repetís?";

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
