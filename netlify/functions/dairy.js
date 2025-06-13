export default async (req, res) => {
  const { text, date } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Missing input text' });
  }

  try {
    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI diary assistant that writes thoughtful, emotional diary entries based on what the user did today.'
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
      return res.status(openRouterRes.status).json({ error: err });
    }

    const data = await openRouterRes.json();
    const entry = data.choices[0].message.content;
    return res.status(200).json({ entry });
  } catch (err) {
    console.error('AI Error:', err);
    return res.status(500).json({ error: 'Internal error generating diary entry.' });
  }
};
