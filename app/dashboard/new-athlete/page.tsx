import { AthleteForm } from "@/components/athlete-form";

export default function NewAthletePage() {
  return (
    <div className="container max-w-7xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Add New Athlete</h1>
      <AthleteForm />
    </div>
  );
} 