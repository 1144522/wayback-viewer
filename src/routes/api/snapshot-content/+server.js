export async function GET({ url }) {
    const targetUrl = url.searchParams.get('url');
    const timestamp = url.searchParams.get('timestamp');
  
    if (!targetUrl || !timestamp) {
      return new Response('URL and timestamp are required', { status: 400 });
    }
  
    const waybackUrl = `http://web.archive.org/web/${timestamp}/${targetUrl}`;
  
    try {
      const response = await fetch(waybackUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch snapshot content');
      }
      const content = await response.text();
      return new Response(content, {
        headers: {
          'Content-Type': 'text/html'
        }
      });
    } catch (error) {
      console.error('Error fetching snapshot content:', error);
      return new Response('Failed to fetch snapshot content', { status: 500 });
    }
  }