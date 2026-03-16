"use client"

import Link from "next/link"
import { Twitter } from "lucide-react"

const legalLinks = [
  { href: "/legal/about", label: "About" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background/95">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        <div className="grid items-center gap-4 text-center sm:grid-cols-2 sm:text-left">
          <p className=" sm:justify-self-start">
            © {currentYear} Fight Embedded
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-self-end">
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="https://x.com/fightembedded"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-foreground transition-colors hover:opacity-80"
            >
              <Twitter className="size-4" />
              <span className="sr-only">Follow Fight Embedded on X</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
