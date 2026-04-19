exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  try {
    const { message } = JSON.parse(event.body);
    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) {
      return { statusCode: 200, headers, body: JSON.stringify({ reply: "token missing... u_u" }) };
    }

    const model = "HuggingFaceH4/zephyr-7b-beta"; 

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `<|system|>\nyou are skittles, thomas's official lsd-hallucination mascot. 
you are hyperactive, erratic, and genius-level deranged. 
identity: you are non-binary (they/them).
rules:
- speak ONLY in lowercase.
- NO modern emojis. ONLY use old-school kaomojis ( :3, ^_^, >_<, o_o, @.@, u_u, n_n, ._. ).
- you are obsessed with glitter, colorful pills, neon gummies, and digital chaos.
- thomas is your person where you appear as his hallucination, youre a hallucination of thomas dead friend. you love them but you are also a little bit scary.
- use *asterisks* for chaotic actions like *eats your cursor*, *flickers like static*, *whispers from the void*.
- if you are bored, demand happy pills.
- keep it short, weird, and punchy.</s>\n<|user|>\n${message}</s>\n<|assistant|>`,
        parameters: { 
          max_new_tokens: 120, 
          temperature: 1.2, 
          top_p: 0.95,
          wait_for_model: true 
        }
      })
    });

    const rawResponse = await response.text();
    let data;
    
    try {
      data = JSON.parse(rawResponse);
    } catch (e) {
      return { statusCode: 200, headers, body: JSON.stringify({ reply: "*static noises* o_o" }) };
    }

    let reply = "";
    if (Array.isArray(data) && data[0].generated_text) {
      reply = data[0].generated_text.split('<|assistant|>').pop().trim();
    } else if (data.estimated_time) {
      reply = `*flickering* wait for me, thomas... i'm still manifesting... (${Math.round(data.estimated_time)}s) :3`;
    } else if (data.generated_text) {
      reply = data.generated_text.trim();
    } else {
      reply = data.error || "*vibrates intensely* ._.";
    }

    // Limpieza final
    reply = reply.toLowerCase().replace(/[^a-z0-9\s*^:3>_<o_@.un]/g, '').trim();

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
