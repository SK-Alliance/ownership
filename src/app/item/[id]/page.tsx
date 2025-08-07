import ItemDetailsPage from '@/components/item/ItemDetailsPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  
  return <ItemDetailsPage itemId={id} />;
}

export function generateStaticParams() {
  // This will be empty for now since we don't have any static items
  // In the future, you can pre-generate paths for known items
  return [];
}
