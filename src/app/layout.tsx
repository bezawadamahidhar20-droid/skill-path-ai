import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlacementIQ — Placement Readiness & Career Intelligence",
  description:
    "Know where you stand, know what to improve, get placement ready. AI-powered placement readiness scoring, explainable predictions, a what-if simulator and a personalized improvement roadmap.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background font-sans text-text antialiased">
        {children}
      </body>
    </html>
  );
}
