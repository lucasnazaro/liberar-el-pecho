const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { message } = JSON.parse(event.body);
    // Cambiamos OPENAI_API_KEY por GEMINI_API_KEY para que coincida con tu captura
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "No se encontró la GEMINI_API_KEY en Netlify" }) 
      };
    }

    // URL para conectar con Google Gemini
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Eres un asistente experto en el método Pecho Libre de Lucas Nazaro. Responde de forma empática y breve a lo siguiente: ${message}` }]
        }]
      })
    });

    const data = await response.json();
    
    // Extraemos la respuesta de la estructura de Gemini
    const reply = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: reply })
    };

  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Error de conexión con Gemini: " + error.message }) 
    };
  }
};
