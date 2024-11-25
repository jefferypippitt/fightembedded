import { Metadata } from "next";
import { notFound } from "next/navigation";

interface DivisionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Helper function to validate and format the division name
function formatDivisionName(slug: string | undefined): { isWomen: boolean; displayName: string } | null {
  if (!slug) return null;
  
  const isWomen = slug.startsWith("women-");
  const displayName = slug
    .replace("women-", "")
    .split(/(?=[A-Z])/)
    .join(" ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
    
  return { isWomen, displayName };
}

export async function generateMetadata({ params }: DivisionPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const result = formatDivisionName(resolvedParams?.slug);
  
  if (!result) {
    return {
      title: "Division Not Found | Fight Embedded",
      description: "This division does not exist",
    };
  }

  const { isWomen, displayName } = result;
  const title = `${isWomen ? "Women's" : "Men's"} ${displayName} Division`;

  return {
    title: `${title} | Fight Embedded`,
    description: `UFC ${title} rankings and information`,
  };
}

export default async function DivisionPage({ params }: DivisionPageProps) {
  const resolvedParams = await params;
  const result = formatDivisionName(resolvedParams?.slug);
  
  if (!result) {
    notFound();
  }

  const { isWomen, displayName } = result;
  const title = `${isWomen ? "Women's" : "Men's"} ${displayName} Division`;

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {/* Add your division content here */}
    </main>
  );
}