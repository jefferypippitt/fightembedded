import { getTop5Athletes } from "@/server/actions/get-top-5-athletes";
import { DivisionChart } from "./division-chart";
import { Metadata } from "next";
import { weightClasses } from "@/data/weight-class";

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

  // Sort divisions by weight class order
  const sortedRankings = [...divisionRankings].sort((a, b) => {
    const weightA = divisionWeights.get(a.division) ?? 999;
    const weightB = divisionWeights.get(b.division) ?? 999;
    
    // If both divisions are unknown, sort alphabetically
    if (weightA === 999 && weightB === 999) {
      return a.division.localeCompare(b.division);
    }
    
    return weightB - weightA; // Sort heaviest to lightest
  });

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          Top 5 Athletes by Division
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRankings.map((division) => (
          <div key={division.division} className="min-w-0">
            <DivisionChart division={division} />
          </div>
        ))}
      </div>
    </div>
  );
}
