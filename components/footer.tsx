import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-6">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Fight Embedded
        </p>

        <div className="flex gap-4">
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
