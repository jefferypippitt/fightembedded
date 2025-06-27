import { getTop5Athletes } from "@/server/actions/get-top-5-athletes";
import { DivisionChart } from "./division-chart";
import { Metadata } from "next";
import { weightClasses } from "@/data/weight-class";

// Use static rendering with weekly revalidation
export const dynamic = 'force-static'
export const revalidate = 604800 // Cache for 1 week

export const metadata: Metadata = {
  title: "Rankings",
  description: "Top 5 Ranked Athletes By Division",
};

export default async function DivisionRankingsPage() {
  const divisionRankings = await getTop5Athletes();
  
  // Create a map of all valid divisions and their weights
  const divisionWeights = new Map<string, number>();
  
  // Add men's divisions
  weightClasses.men.forEach(div => {
    divisionWeights.set(`Men's ${div.name}`, div.weight || 0);
  });
  
  // Add women's divisions
  weightClasses.women.forEach(div => {
    divisionWeights.set(`Women's ${div.name}`, div.weight || 0);
  });

  // Sort divisions by gender (male to female) and then by weight (heavy to light)
  const sortedDivisionRankings = divisionRankings.sort((a, b) => {
    const isMaleA = a.division.startsWith("Men's");
    const isMaleB = b.division.startsWith("Men's");
    
    // First sort by gender (male to female)
    if (isMaleA && !isMaleB) return -1; // Men's comes before Women's
    if (!isMaleA && isMaleB) return 1;  // Women's comes after Men's
    
    // If same gender, sort by weight (heavy to light)
    const weightA = divisionWeights.get(a.division) || 0;
    const weightB = divisionWeights.get(b.division) || 0;
    
    return weightB - weightA; // Descending order (heavy to light)
  });

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Top 5 Ranked Athletes by Follower Count
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {sortedDivisionRankings.map((division) => (
          <DivisionChart key={division.division} division={division} />
        ))}
      </div>
    </div>
  );
}
