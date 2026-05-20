"use client"

import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Activity, FileText, Hospital, Brain, CalendarDays, Accessibility, ScanText, HeartPulse } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Spinner } from "@/components/ui/spinner"

const quickActions = [
  { title: "Diagnosis Record Input", description: "Write or upload medical data", href: "/records", icon: FileText, color: "bg-primary" },
  { title: "OCR + AI Prediction", description: "Analyze uploaded files and get recommendations", href: "/records?tab=prediction", icon: Brain, color: "bg-chart-3" },
  { title: "Body Diagnosis View", description: "Check treated parts by body region", href: "/body-view", icon: HeartPulse, color: "bg-chart-4" },
  { title: "Nearby Hospitals", description: "Search hospitals by typed address", href: "/hospitals", icon: Hospital, color: "bg-accent" },
]

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner className="h-8 w-8" /></div>
  if (!user) return null

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <section className="rounded-3xl border bg-gradient-to-r from-primary/10 via-white to-accent/10 p-6">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="mt-2 text-muted-foreground">Main integrated screen for health records, AI predictions, body-part diagnosis view, and hospital recommendations.</p>
        </section>



        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-2`}><Icon className="h-6 w-6 text-white" /></div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        <section>
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle>Recommended first flow</CardTitle>
            </CardHeader>
            <CardContent> 
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Open profile and show member information including gender.</li>
                <li>Go to medical records and add a direct diagnosis entry.</li>
                <li>Upload a document to simulate OCR extraction.</li>
                <li>Run AI prediction and management recommendation.</li>
                <li>Open body view and explain region-based treatment history.</li>
                <li>Search hospitals by address and show suggested facilities.</li>
              </ol>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/records"><Button>Open Medical Records</Button></Link>
                <Link href="/body-view"><Button variant="outline">Open Body View</Button></Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  )
}
