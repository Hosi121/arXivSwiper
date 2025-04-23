// api/papers.ts (Supabase Edge Function)

export type Paper = {
  id: string
  title: string
  authors: string[]
  abstract: string
  url: string
  category: string
  published: string
  liked?: boolean
  summary: string
}

interface GetPapersParams {
  search_query: string;
  sortBy: string;
}

type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

import { default as axios } from 'axios';
import { XMLParser } from '../_shared/deps';

const getPapers = async (params: GetPapersParams): Promise<Result<Paper[], Error>> => {
  try {
    const { search_query, sortBy } = params;

    let sortParam = 'relevance';
    if (sortBy === 'date') {
      sortParam = 'submittedDate';
    }

    const response = await axios.get(`http://export.arxiv.org/api/query?search_query=${search_query}&start=0&max_results=10&sortBy=${sortParam}&sortOrder=descending`);
    const parser = new XMLParser();
    const jObj = parser.parse(response.data);
    const entries = jObj.feed.entry;
    const paperData = entries.map((entry: any) => ({
      id: entry.id,
      title: entry.title,
      authors: entry.author.map((author: any) => author.name),
      abstract: entry.summary,
      url: entry.link[0].href,
      category: entry.category.term,
      published: entry.published,
      summary: entry.summary,
    }));
    return { ok: true, value: paperData };
  } catch (error) {
    console.error('Error fetching papers:', error);
    return { ok: false, error: new Error('Failed to fetch papers') };
  }
};

export default async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const search_query = url.searchParams.get('search_query');
  const sortBy = url.searchParams.get('sortBy');

  if (!search_query || !sortBy) {
    return new Response('search_query and sortBy are required', { status: 400 });
  }

  const params: GetPapersParams = {
    search_query: search_query,
    sortBy: sortBy,
  };

  const result = await getPapers(params);

  if (result.ok) {
    return new Response(JSON.stringify(result.value), {
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    console.error(result.error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
