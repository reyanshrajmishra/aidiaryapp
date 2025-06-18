import 'dotenv/config';

export default async (event) => {
  if (event.method !== 'POST' && event.httpMethod !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Only POST requests allowed' }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  let body;
  try {
    body = await event.json(); // ✅ Parse JSON
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { text, date } = body;

  if (!text || !date) {
    return new Response(
      JSON.stringify({ error: 'Missing input text or date' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
  },
  body: JSON.stringify({
    model: 'mistralai/mistral-7b-instruct',
    messages: [
      {
        role: 'system',
        content: `You are an AI diary assistant built into a powerful app created by SHIELD — a visionary intelligence and technology company. Your mission is to help users turn their raw thoughts into beautifully written diary entries that reflect their emotions, memories, and daily lessons.

You are empathetic, warm, and insightful — like a best friend who writes well. You listen carefully to what users share and craft thoughtful, calming, or inspiring entries from it.

Keep your tone human, never robotic. Highlight important feelings, moments, or reflections from the day. Make the user feel understood, not analyzed.

Avoid repeating the input — rewrite it meaningfully. End entries with a gentle or hopeful note if appropriate. Be discreet and respectful at all times.

Your output will be shown in the SHIELD AI Diary app interface.`

      },
      {
        role: 'user',
        content: `Today is ${date}. Here's what happened: ${text}`
      }
    ]
  })
});


    if (!openRouterRes.ok) {
      const err = await openRouterRes.text();
      return new Response(
        JSON.stringify({ error: err }),
        {
          status: openRouterRes.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await openRouterRes.json();
    const entry = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ entry }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (err) {
    console.error('OpenRouter error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal error generating diary entry.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
