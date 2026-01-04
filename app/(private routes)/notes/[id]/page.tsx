import { QueryClient, dehydrate } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import { fetchNoteByIdServer } from '@/lib/api/serverApi';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({params}:Props): Promise<Metadata> {
  const {id} = await params;
  const note = await fetchNoteByIdServer(id);

  return{
    title: note.title,
    description: note.content,
    openGraph:{
      title: note.title,
      description: note.content,
      url: `http://localhost:3000/notes/${id}`,
      images:[{
        url:"https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: note.title,
      }]
    }
  }

}

export default async function NoteDetails({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteByIdServer(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}