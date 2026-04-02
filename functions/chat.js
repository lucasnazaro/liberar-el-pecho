export async function onRequestPost(context) {
  const { request } = context;
  
  // Reemplazá solo lo que está entre comillas por tu clave de Google
  const apiKey = "AIzaSyCFKBrDZcO-aGgcpEeLjgJUOLVcXBaiCyM"; 

  try {
    const userInput = await request.json();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userInput.prompt }] }]
      })
    });

    const data = await response.json();
    
    // Si Google devuelve un error, lo vemos directo en el chat para saber qué pasa
    if (data.error) {
      return new Response(JSON.stringify({ error: "Google dice: " + data.error.message }), { status: 200 });
    }

    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Error de red: " + e.message }), { status: 500 });
  }
}
