export default function Home() {
  return (
    <div className="px-4 py-6 space-y-10">
      {/* Hero Section */}
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">Latest UFC Analysis & Insights</h1>
        <p className="text-base text-muted-foreground">
          Deep dive into UFC fighter statistics, match predictions, and
          performance analytics
        </p>
      </section>

      {/* Featured Analysis */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-5 space-y-3">
          <h2 className="text-xl font-semibold">UFC 300 Main Event Analysis</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Breaking down the striking patterns and grappling statistics of the
            upcoming championship bout between Alex Pereira and Jamahal Hill.
          </p>
          <div className="flex gap-2">
            <span className="text-xs bg-secondary px-2 py-1 rounded">
              Statistics
            </span>
            <span className="text-xs bg-secondary px-2 py-1 rounded">
              Main Event
            </span>
          </div>
        </div>

        <div className="border rounded-lg p-5 space-y-3">
          <h2 className="text-xl font-semibold">
            Fighter Spotlight: Islam Makhachev
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Analyzing the dominant lightweight champion&apos;s technical
            approach and success rate in takedowns across his last five fights.
          </p>
          <div className="flex gap-2">
            <span className="text-xs bg-secondary px-2 py-1 rounded">
              Fighter Analysis
            </span>
            <span className="text-xs bg-secondary px-2 py-1 rounded">
              Champion
            </span>
          </div>
        </div>
      </section>

      {/* Recent Updates */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Updates</h2>
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-medium text-base">UFC Fight Night Results</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Complete breakdown of last night&apos;s main card performances and
              statistical highlights
            </p>
          </div>
          <div className="border-b pb-3">
            <h3 className="font-medium text-base">
              Top Bantamweight Prospects 2024
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Analysis of emerging talent in the bantamweight division with win
              predictions
            </p>
          </div>
          <div className="border-b pb-3">
            <h3 className="font-medium text-base">
              Submission Success Rates Study
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Statistical analysis of submission success rates across weight
              classes
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-3 text-center">
          <p className="text-xl font-bold">2,481</p>
          <p className="text-xs text-muted-foreground mt-1">Fights Analyzed</p>
        </div>
        <div className="border rounded-lg p-3 text-center">
          <p className="text-xl font-bold">94%</p>
          <p className="text-xs text-muted-foreground mt-1">
            Prediction Accuracy
          </p>
        </div>
        <div className="border rounded-lg p-3 text-center">
          <p className="text-xl font-bold">312</p>
          <p className="text-xs text-muted-foreground mt-1">Fighter Profiles</p>
        </div>
        <div className="border rounded-lg p-3 text-center">
          <p className="text-xl font-bold">15+</p>
          <p className="text-xs text-muted-foreground mt-1">Years of Data</p>
        </div>
      </section>
    </div>
  );
}
