import { fetchNotesServer } from '@/lib/api/serverApi';
import { Metadata } from 'next';
import NotesClient from './Notes.client';

import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const filter = (await params).slug[0];
  const title = filter === "all" ? "All notes | NoteHub" : `Notes: ${filter} | NoteHub`;
  const description = filter === "all" ? "Browse all notes" : `Browse notes filtered: ${filter}`;

  return{
    title,
    description,
    openGraph: {
      title,
      description,
      url: `http://localhost:3000/notes/filter/${filter}`,
      images:[{
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Notes page"
      }]
    }
  }
}


export default async function Notes({ params }: Props) {
  const queryClient = new QueryClient();
  const { slug } = await params;
  const tag = slug[0] === 'all' ? undefined : slug[0];

  await queryClient.prefetchQuery({
    queryKey: ['notes', { search: '', page: 1, perPage: 12, tag }],
    queryFn: () => fetchNotesServer('', 1, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}