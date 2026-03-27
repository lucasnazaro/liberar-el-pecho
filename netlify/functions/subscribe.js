const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "No permitido" };
  const { email, nombre } = JSON.parse(event.body);

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY, 
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        attributes: { NOMBRE: nombre },
        listIds: [3] 
      })
    });

    return response.ok ? { statusCode: 200, body: "OK" } : { statusCode: 400, body: "Error" };
  } catch (error) {
    return { statusCode: 500, body: "Error" };
  }
};
