export default async function handler(req, res) {
  // Obligatorio para que el navegador no vea el "<"
  res.setHeader('Content-Type', 'application/json');

  try {
    const { message } = req.body;
    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) {
      return res.status(200).json({ reply: "󱤆 soren: missing token in vercel settings!! u_u" });
    }

    const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `<|system|>you are skittles, a ghost of soren. speak lowercase.</s><|user|>${message}</s><|assistant|>`,
      })
    });

    const data = await response.json();
    // Si Hugging Face está saturado, nos dará un error aquí
    if (data.error) return res.status(200).json({ reply: "󱤆 hf busy: " + data.error });

    let reply = data[0]?.generated_text?.split('<|assistant|>').pop().trim() || "static...";
    return res.status(200).json({ reply: reply.toLowerCase() });

  } catch (error) {
    return res.status(200).json({ reply: "󱤆 api_crash: " + error.message });
  }
}
