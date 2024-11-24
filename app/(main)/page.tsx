export default function Home() {
  return (
    <main className="px-4 py-4 space-y-8">
      {/* Hero Section */}
      <section className="space-y-2">
        <h1 className="text-2xl font-bold text-center">UFC Champions</h1>
      </section>

      {/* Champions and Rankings Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Champions Section */}
        <div className="flex-1 space-y-8">
          {/* Male Champions */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              Men&apos;s Division Champions
            </h2>
          </section>

          {/* Female Champions */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              Women&apos;s Division Champions
            </h2>
          </section>
        </div>

        {/* Sidebar Rankings */}
        <aside className="hidden lg:block w-80 space-y-6">
          <div className="border rounded-lg p-4">
            <h2 className=" mb-4">
              Men&apos;s P4P Rankings
            </h2>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className=" mb-4">
              Women&apos;s P4P Rankings
            </h2>
          </div>
        </aside>
      </div>

      {/* Other */}
    </main>
  );
}
