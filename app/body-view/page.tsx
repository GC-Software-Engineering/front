"use client"

import { useState } from "react"
import RealHumanBody from "@/components/body/real-human-body"
import RegionPanel from "@/components/body/region-panel"
import { AppShell } from "@/components/app-shell"

export default function BodyViewPage() {
  const [selected, setSelected] = useState("head")

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="rounded-3xl border bg-gradient-to-r from-cyan-50 via-white to-sky-50 p-6 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            Body Analysis
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Click a major body region to view related organs and treatment history.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_420px]">
          <div className="rounded-[32px] border bg-white p-6 shadow-sm flex items-center justify-center">
            <RealHumanBody selected={selected} onSelect={setSelected} />
          </div>

          <div className="rounded-[32px] border bg-white shadow-sm">
            <RegionPanel region={selected} />
          </div>
        </div>
      </div>
    </AppShell>
  )
}