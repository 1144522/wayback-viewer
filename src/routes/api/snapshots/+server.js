import { json } from '@sveltejs/kit';

export async function GET({ url }) {
  const targetUrl = url.searchParams.get('url');
  if (!targetUrl) {
    return json({ error: 'URL is required' }, { status: 400 });
  }

  const cdxApiUrl = `http://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(targetUrl)}&output=json`;

  console.log(cdxApiUrl);
  
  try {
    const response = await fetch(cdxApiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch snapshots');
    }
    const data = await response.json();
    
    const snapshots = data.slice(1).map(snapshot => ({
      urlkey: snapshot[0],
      timestamp: snapshot[1],
      original: snapshot[2],
      mimetype: snapshot[3],
      statuscode: snapshot[4],
      digest: snapshot[5],
      length: snapshot[6]
    }));

    return json(snapshots);
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    return json({ error: 'Failed to fetch snapshots' }, { status: 500 });
  }
}