export default async () => {
  try {
    const url = 'https://bylkeapkyephshxjhpst.supabase.co/rest/v1/?select=1';
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bGtlYXBreWVwaHNoeGpocHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNjY1MzYsImV4cCI6MjA2NDk0MjUzNn0.wwQGKkPvkFho6fH2zNSCX4Hn5CbAXRDp_SMyDB6AgF4';

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`
      }
    });

    const text = await res.text();

    return new Response(`✅ Ping Success\nStatus: ${res.status}\n\nBody:\n${text}`, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });

  } catch (err) {
    return new Response(`❌ CRASH\n${err.stack || err.message || err.toString()}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
