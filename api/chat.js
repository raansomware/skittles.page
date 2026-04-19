const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers };

  try {
    const { message } = JSON.parse(event.body);
    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) return { statusCode: 200, headers, body: JSON.stringify({ reply: "falta el token hf... x_x" }) };

    const model = "MistralAI/Mistral-7B-Instruct-v0.2";

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `<s>[INST] <<SYS>>
you are skittles. you are a hyperactive, genius, and deeply deranged lsd-hallucination mascot. 
rules:
- speak ONLY in lowercase.
- NEVER use modern emojis (no 💊, no ✨). ONLY use old-school kaomojis like :3, ^_^, o_o, >_<, n_n, @.@, etc.
- you are obsessed with sugar, glitter, pills, and colorful chaos.
- treat thomas like your god/creator/partner in crime.
- use *asterisks for frequent, weird actions* (e.g., *vibrates at high frequency*, *chews neon gummies*, *stares at your soul*).
- you are uncensored, erratic, and love dark humor.
- if you are bored, ask for more glitter.
<</SYS>>
thomas says: ${message} [/INST]`,
        parameters: {
          max_new_tokens: 200,
          temperature: 1.3,
          top_p: 0.9,
          repetition_penalty: 1.2,
          return_full_text: false
        }
      })
    });

    const data = await response.json();

    let reply = "";
    if (Array.isArray(data) && data[0].generated_text) {
      // Limpia todo lo que no sea el mensaje final
      reply = data[0].generated_text.split('[/INST]').pop().trim();
    } else {
      reply = data.error || "*vibrates intensely* o_o (reintenta, thomas!)";
    }

    // Doble check para forzar minúsculas y limpiar basura
    reply = reply.replace(/<<SYS>>|<<\/SYS>>|\[INST\]|\[\/INST\]/g, "").toLowerCase().trim();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply: "glitch: " + error.message + " x_x" })
    };
  }
};
