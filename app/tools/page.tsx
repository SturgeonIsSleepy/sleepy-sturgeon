import type { Metadata } from "next";
import ToolsWorkspace from "./tools-workspace";

export const metadata: Metadata = {
  title: "Tools Page | Sleepy Sturgeon",
  description: "PowerShell-style utilities workspace.",
};

export default function ToolsPage() {
  return <ToolsWorkspace />;
}
