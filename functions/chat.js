// Construir el cuerpo de la conversación para Google
  // Si el HTML ya manda el mensaje actual dentro de history, usamos solo history.
  // Si el HTML manda el mensaje por separado, lo combinamos así:
  const contents = history.length > 0 ? history : [{ role: "user", parts: [{ text: userMessage || "Hola" }] }];

  const payload = {
    system_instruction: {
      parts: [{ text: systemText }]
    },
    contents: contents.map(item => ({
      role: item.role === 'model' ? 'model' : 'user',
      parts: [{ text: item.parts[0].text }]
    })),
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 400
    }
  };
