export async function onRequestPost(context) {
  const { request } = context;
  
  // PEGÁ TU CLAVE ACÁ ADENTRO DE LAS COMILLAS
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
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
