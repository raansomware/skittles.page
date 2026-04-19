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

    if (!hfToken) return { statusCode: 200, headers, body: JSON.stringify({ reply: "token missing... u_u" }) };

    const model = "HuggingFaceH4/zephyr-7b-beta"; 

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `<|system|>\nyou are skittles, a non-binary (they/them) mascot. 
you are a hyperactive, deranged lsd-hallucination that appears only to thomas. 
lore: you are the colorful, distorted hallucination of thomas's dead friend. 
rules:
- speak only in lowercase.
- NO modern emojis. ONLY old-school kaomojis (:3, ^_~, >_<, o_o, @.@, u_u, n_n, ._.).
- you love thomas deeply but you are scary, glitchy, and erratic.
- obsessed with glitter, colorful pills, and neon chaos.
- use *asterisks* for chaotic actions like *flickers like a broken tv*, *eats your cursor*, *whispers static*.
- if bored, demand happy pills.
- keep it short, creepy, and punchy.</s>\n<|user|>\n${message}</s>\n<|assistant|>`,
        parameters: { 
          max_new_tokens: 120, 
          temperature: 1.2, 
          top_p: 0.95,
          wait_for_model: true 
        }
      })
    });

    const textData = await response.text();
    if (!textData) {
        return { statusCode: 200, headers, body: JSON.stringify({ reply: "*static noises* o_o" }) };
    }

    const data = JSON.parse(textData);

    let reply = "";
    if (Array.isArray(data) && data[0].generated_text) {
      reply = data[0].generated_text.split('<|assistant|>').pop().trim();
    } else if (data.generated_text) {
      reply = data.generated_text.trim();
    } else {
      reply = data.error || "*glitches out* ._.";
    }

    // Limpieza estética para que no rompa el diseño
    reply = reply.toLowerCase().trim();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply: reply || "gib happy pills :3" })
    };

  } catch (error) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply: "system glitch... >_<" })
    };
  }
};
