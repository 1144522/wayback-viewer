import { error } from '@sveltejs/kit';
import { subDays, format } from 'date-fns';

export async function GET({ url }) {
  const targetUrl = url.searchParams.get('url');
  let fromDate = url.searchParams.get('date');

  if (!targetUrl) {
    throw error(400, 'Missing URL parameter');
  }

  if (!fromDate) {
    fromDate = format(subDays(new Date(), 30), 'yyyyMMdd');
  } else {
    fromDate = fromDate.replace(/-/g, '');
  }

  const toDate = format(new Date(), 'yyyyMMdd');

  const cdxApiUrl = `http://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(targetUrl)}&from=${fromDate}&to=${toDate}&output=json`;

  console.log(cdxApiUrl)


  try {
    const cdxResponse = await fetch(cdxApiUrl);
    if (!cdxResponse.ok) {
      throw error(500, 'Failed to fetch CDX data');
    }

    const snapshots = await cdxResponse.json();
    if (snapshots.length <= 1) {
      return new Response('未找到该网站的存档快照', { status: 404 });
    }

    const latestSnapshot = snapshots[snapshots.length - 2];
    const [, timestamp, originalUrl] = latestSnapshot;

    const waybackUrl = `http://web.archive.org/web/${timestamp}/${originalUrl}`;
    const archivedPageResponse = await fetch(waybackUrl);

    if (!archivedPageResponse.ok) {
      throw error(500, 'Failed to fetch archived page');
    }

    const archivedPageText = await archivedPageResponse.text();
    return new Response(archivedPageText);
  } catch (err) {
    console.error(err);
    throw error(500, 'Internal server error');
  }
}