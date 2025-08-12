// supabase/functions/ai-reply-proxy/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// The URL for the DeepSeek API
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

serve(async (req) => {
  // Check if the request method is POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Retrieve the API key from the secure environment variables
  const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");

  if (!DEEPSEEK_API_KEY) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Parse the request body to get the user's comment
    const { commentText } = await req.json();

    // Make the secure call to the DeepSeek API
    const deepseekResponse = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that suggests short, witty, and positive replies to social media comments. Provide only one reply.",
          },
          { role: "user", content: commentText },
        ],
      }),
    });

    const data = await deepseekResponse.json();

    // Return the response from DeepSeek back to the client
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Function Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
