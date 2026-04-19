export default async function handler(req, res) {
  // Estos encabezados permiten que tu HTML hable con la API
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { message } = req.body;
    // Agregamos un log para ver qué está pasando (solo lo verás en Vercel)
    console.log("Mensaje recibido:", message);

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(200).json({ reply: "¡la llave no existe en vercel! revisa settings. 🔑" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vercel.com", 
        "X-Title": "Skittles Page"
      },
      body: JSON.stringify({
        "model": "google/gemini-flash-1.5-8b:free",
        "messages": [{ "role": "user", "content": message }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(200).json({ reply: "error de openrouter: " + data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content || "skittles está mudo... ^_^";
    return res.status(200).json({ reply });

  } catch (error) {
    // Si hay un error, lo enviamos como 200 para que NO salga el error 500 en consola y podamos leerlo
    return res.status(200).json({ reply: "error interno: " + error.message });
  }
}
