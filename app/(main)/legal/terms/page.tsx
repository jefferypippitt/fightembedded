import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service and usage guidelines for Fight Embedded.",
};

export default function TermsPage() {
  return (
    <article className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Acceptance of Terms</h2>
        <p className="text-sm text-muted-foreground">
          By accessing and using this website, you accept and agree to be bound by the
          terms and provision of this agreement. This website is for informational
          purposes only.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Content Usage</h2>
        <p className="text-sm text-muted-foreground">
          All content on this website is for personal, non-commercial use only.
          The content may not be reproduced, distributed, transmitted, or used
          for commercial purposes without prior written consent.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Intellectual Property</h2>
        <p className="text-sm text-muted-foreground">
          UFC® and all related fighter images, event names, and promotional
          materials are trademarks owned by UFC®. This website is an independent
          fan site and is not affiliated with or endorsed by UFC®.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Limitation of Liability</h2>
        <p className="text-sm text-muted-foreground">
          The information provided on this website is for general informational
          purposes only. We make no representations or warranties about the
          accuracy or completeness of the information provided. Any reliance you
          place on such information is strictly at your own risk.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Modifications</h2>
        <p className="text-sm text-muted-foreground">
          We reserve the right to modify these terms at any time without prior
          notice. Your continued use of the website following any changes
          indicates your acceptance of these changes.
        </p>
      </section>
    </article>
  );
} 