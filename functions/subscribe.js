export async function onRequestPost(context) {
  const BREVO_KEY = context.env.BREVO_API_KEY;
  if (!BREVO_KEY) return json({ error: "Sin API key" }, 500);

  let body;
  try { body = await context.request.json(); }
  catch (e) { return json({ error: "Body invalido" }, 400); }

  const nombre = (body.nombre || "").trim();
  const email  = (body.email  || "").trim();
  if (!email) return json({ error: "Email requerido" }, 400);

  try {
    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_KEY
      },
      body: JSON.stringify({
        email,
        attributes: { NOMBRE: nombre },
        listIds: [2],
        updateEnabled: true
      })
    });
    return json({ ok: true });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: Object.assign({ "Content-Type": "application/json" }, corsHeaders())
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
