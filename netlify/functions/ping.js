export default async () => {
  const res = await fetch('https://bylkeapkyephshxjhpst.supabase.co/rest/v1/?select=1', {
    method: 'GET',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bGtlYXBreWVwaHNoeGpocHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNjY1MzYsImV4cCI6MjA2NDk0MjUzNn0.wwQGKkPvkFho6fH2zNSCX4Hn5CbAXRDp_SMyDB6AgF4',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bGtlYXBreWVwaHNoeGpocHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNjY1MzYsImV4cCI6MjA2NDk0MjUzNn0.wwQGKkPvkFho6fH2zNSCX4Hn5CbAXRDp_SMyDB6AgF4'
    }
  });

  return new Response('Supabase stealth ping: ' + res.status, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
};
