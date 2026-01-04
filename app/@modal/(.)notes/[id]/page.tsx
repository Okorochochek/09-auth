import { fetchNoteByIdServer } from '@/lib/api/serverApi';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import NotePreviewClient from './NotePreview.client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NoteDetails({ params }: Props) {
  const queryClient = new QueryClient();
  const { id } = await params;

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteByIdServer(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient />
    </HydrationBoundary>
  );
}