"use client";

import { useState } from "react";

const tools = [
  {
    id: "f1-calendar",
    command: "f1-calendar",
    title: "F1 CALENDAR",
    summary: "Explore the full calendar, live championship progression and the next-race briefing.",
    href: "/f1#calendar",
  },
];

export default function ToolsWorkspace() {
  const [active, setActive] = useState(tools[0].id);
  const selected = tools.find((tool) => tool.id === active) ?? tools[0];

  return (
    <main className="tools-workspace">
      <header className="tools-titlebar">
        <a href="/#tools" className="tools-brand" aria-label="Back to the Sleepy Sturgeon tools overview">
          <img src="/sturgeon-hero.png" alt="" />
          <span>SLEEPY STURGEON</span>
        </a>
        <strong>TOOLS PAGE</strong>
      </header>
      <div className="tools-layout">
        <aside className="tools-sidebar" aria-label="Feature list">
          <p>FUNCTIONS</p>
          {tools.map((tool) => (
            <button type="button" key={tool.id} data-active={active === tool.id || undefined} onClick={() => setActive(tool.id)}>
              <span>›_</span>{tool.command}
            </button>
          ))}
          <div className="tools-terminal-status">PS C:\TOOLS&gt;<i /></div>
        </aside>
        <section className="tools-detail" aria-labelledby="tool-detail-title">
          <p className="tools-command">PS C:\TOOLS&gt; Get-Module {selected.command}</p>
          <div className="tools-detail-card">
            <span>// AVAILABLE MODULE</span>
            <h1 id="tool-detail-title">{selected.title}</h1>
            <p>{selected.summary}</p>
            <dl>
              <div><dt>STATUS</dt><dd>READY</dd></div>
              <div><dt>TYPE</dt><dd>LIVE DATA VIEW</dd></div>
              <div><dt>ENTRY</dt><dd>{selected.href}</dd></div>
            </dl>
            <a href={selected.href}><span>PS&gt;</span> Start-Module {selected.command}<b>↗</b></a>
          </div>
        </section>
      </div>
    </main>
  );
}
