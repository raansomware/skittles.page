export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { message } = req.body;
    const token = process.env.HF_TOKEN?.trim();

    if (!token) return res.status(500).json({ reply: "token missing! 🔑" });

    // MODELO GEMMA: Es el que menos errores da en la capa gratuita
    const response = await fetch("https://api-inference.huggingface.co/models/google/gemma-2-2b-it", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `you are skittles. genius lsd hallucination. actions in asterisks. lowercase. treat user as thomas. obsessed with meds. ^_^ :3 ✨💊 user: ${message}`,
        parameters: { max_new_tokens: 150, temperature: 1.0 }
      })
    });

    const responseText = await response.text();

    if (!response.ok) {
      // ESTO ES CLAVE: Si sale 404 aquí, revisa que no haya espacios en el nombre de la variable en Vercel
      return res.status(response.status).json({ reply: `glitch ${response.status}: ${responseText.slice(0, 40)}` });
    }

    const data = JSON.parse(responseText);
    let reply = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
    
    // Limpiamos la respuesta de residuos del prompt
    if (reply.includes("user:")) {
        reply = reply.split("user:").pop().split("\n")[0];
    }

    return res.status(200).json({ reply: (reply || "i'm dizzy...").trim() });

  } catch (error) {
    return res.status(500).json({ reply: "mega brain error: " + error.message });
  }
}
