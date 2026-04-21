export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { message } = req.body;
    const hfToken = process.env.HF_TOKEN;

    // Modelo ultra-rápido para evitar el timeout de Vercel
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `skittles is a digital ghost, neurotic and erratic. thomas: ${message} skittles:`,
        parameters: { max_new_tokens: 50, temperature: 1.2 }
      })
    });

    const data = await response.json();
    let reply = Array.isArray(data) ? data[0].generated_text : data.generated_text;
    
    // Extraer solo la respuesta de Skittles
    reply = reply.split('skittles:').pop().trim().toLowerCase();

    // Efecto de corrupción (40% de probabilidad)
    if (Math.random() < 0.4) {
      reply = "󱤆 " + reply.replace(/[a-z]/g, c => String.fromCharCode(((c.charCodeAt(0) - 97 + 2) % 26) + 97));
    }

    return res.status(200).json({ reply: reply || "the void is quiet... u_u" });
  } catch (error) {
    return res.status(200).json({ reply: "󱤆 static: " + error.message });
  }
}
