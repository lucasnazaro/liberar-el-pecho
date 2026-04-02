export async function onRequestPost(context) {
  const { env, request } = context;
  const API_KEY = env.GEMINI_API_KEY;

  try {
    const userInput = await request.json();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: userInput.prompt }] // Enviamos el texto limpio
        }]
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error en la función" }), { status: 500 });
  }
}
