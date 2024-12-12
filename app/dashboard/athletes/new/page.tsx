import { AthleteForm } from "@/components/athlete-form";

export default function NewAthletePage() {
  return (
    <div className="py-4">
      <h1 className="text-xl font-bold mb-6">Add New Athlete</h1>
      <AthleteForm />
    </div>
  );
} 