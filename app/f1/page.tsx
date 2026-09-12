import type { Metadata } from "next";
import F1Dashboard from "./f1-dashboard";

export const metadata: Metadata = {
  title: "F1 Calendar | Sleepy Sturgeon",
  description: "2026 F1 calendar, live championship standings and next-race briefing.",
};

export default function F1Page() {
  return <F1Dashboard />;
}
