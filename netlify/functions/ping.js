exports.handler = async function (event, context) {
  try {
    const url = 'https://bylkeapkyephshxjhpst.supabase.co/rest/v1/?select=1';
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bGtlYXBreWVwaHNoeGpocHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNjY1MzYsImV4cCI6MjA2NDk0MjUzNn0.wwQGKkPvkFho6fH2zNSCX4Hn5CbAXRDp_SMyDB6AgF4';

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`
      }
    });

    const data = await response.text();

    return {
      statusCode: 200,
      body: `✅ Supabase Ping Success\nStatus: ${response.status}\n\n${data}`
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `❌ CRASH\n${error.stack || error.message || 'Unknown error'}`
    };
  }
};
