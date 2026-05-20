"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [seniorMode, setSeniorMode] = useState(false)

  useEffect(() => {
    const syncMode = () => setSeniorMode(localStorage.getItem("biohealth_accessibility_mode") === "senior")
    syncMode()
    window.addEventListener("biohealth-accessibility-change", syncMode)
    return () => window.removeEventListener("biohealth-accessibility-change", syncMode)
  }, [])

  return (
    <div className={`min-h-screen bg-background ${seniorMode ? "senior-mode" : ""}`}>
      <Navigation />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
