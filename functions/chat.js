export async function onRequestPost(context) {
  const { env } = context;
  const apiKey = env.GEMINI_API_KEY;

  // Esto nos dirá si la función está viendo la clave o no
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Cloudflare NO encuentra ninguna variable llamada GEMINI_API_KEY" }), { status: 200 });
  }

  if (apiKey.length < 10) {
    return new Response(JSON.stringify({ error: "La clave parece estar incompleta o mal pegada" }), { status: 200 });
  }

  return new Response(JSON.stringify({ mensaje: "La clave está configurada correctamente, intentando conectar con Google..." }), { status: 200 });
}
