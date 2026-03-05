"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Introduction", href: "#introduction" },
  { label: "Methods", href: "#methods" },
  { label: "Results", href: "#results" },
  { label: "Discussion", href: "#discussion" },
  { label: "Conclusion", href: "#conclusion" },
  { label: "Learn More", href: "#links" },
  { label: "Dashboard", href: "/dashboard" },
];

function handleNavClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  closeMenu?: () => void,
) {
  if (href.startsWith("#")) {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }
  closeMenu?.();
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-sdge-navy text-white shadow-md">
      <div className="max-w-4xl mx-auto px-6 md:px-8 flex items-center justify-between h-14">
        {/* Brand */}
        <a
          href="#"
          onClick={(e) => handleNavClick(e, "#")}
          className="font-bold text-lg tracking-wide hover:text-sdge-yellow transition-colors"
        >
          PREVAIL
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="hover:text-sdge-yellow transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-sdge-yellow transition-colors"
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-sdge-navy border-t border-white/10 px-6 py-4 flex flex-col gap-3 text-sm font-medium">
          {navLinks.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) =>
                  handleNavClick(e, link.href, () => setMenuOpen(false))
                }
                className="hover:text-sdge-yellow transition-colors py-1"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="hover:text-sdge-yellow transition-colors py-1"
              >
                {link.label}
              </Link>
            ),
          )}
        </div>
      )}
    </nav>
  );
}
