export default function Privacy() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: November 24, 2024</p>
      </section>

      <div className="space-y-8">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Personal Use Only</h2>
          <p className="text-muted-foreground">
            This is a personal application designed and maintained for
            single-user access. Registration and access are restricted to the
            application owner only.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Data Usage</h2>
          <p className="text-muted-foreground">
            All data displayed is sourced from public UFC statistics and is used
            for personal analysis and tracking purposes only. This application
            does not collect or store user data from visitors.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Disclaimer</h2>
          <p className="text-muted-foreground">
            This is a personal project for analyzing UFC statistics and events.
            All information is for reference only and should not be used for
            betting or commercial purposes. UFC and related trademarks are
            property of their respective owners.
          </p>
        </section>
      </div>
    </main>
  );
}
