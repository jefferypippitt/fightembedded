import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and data handling practices for Fight Embedded.",
};

export default function PrivacyPage() {
  return (
    <article className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Personal Use Only</h2>
        <p className="text-sm text-muted-foreground">
          This is a personal application designed and maintained for single-user access. 
          Registration and access are restricted to the application owner only.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Data Usage</h2>
        <p className="text-sm text-muted-foreground">
          All data displayed is sourced from public UFC statistics and is used for personal 
          analysis and tracking purposes only. This application does not collect or store 
          user data from visitors.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Disclaimer</h2>
        <p className="text-sm text-muted-foreground">
          This is a personal project for analyzing UFC statistics and events. All information 
          is for reference only and should not be used for betting or commercial purposes. 
          UFC and related trademarks are property of their respective owners.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Contact Us</h2>
        <p className="text-sm">
          Have questions or suggestions? We&apos;d love to hear from you. Reach out to us at{" "}
          <span className="text-red-600 dark:text-red-400">
            fightembedded@gmail.com
          </span>
        </p>
      </section>
    </article>
  );
} 