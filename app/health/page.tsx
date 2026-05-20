"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { useAuth } from "@/lib/auth-context"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Footprints, Flame, Plus, TrendingUp, Calendar } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

interface HealthEntry {
  date: string
  steps: number
  calories: number
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function getWeekData(entries: HealthEntry[]): { day: string; steps: number; calories: number }[] {
  const today = new Date()
  const weekData = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    const entry = entries.find((e) => e.date === dateStr)

    weekData.push({
      day: dayNames[date.getDay()],
      steps: entry?.steps || 0,
      calories: entry?.calories || 0,
    })
  }

  return weekData
}

function getTodayStr() {
  return new Date().toISOString().split("T")[0]
}

export default function HealthPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [entries, setEntries] = useState<HealthEntry[]>([])
  const [todaySteps, setTodaySteps] = useState("")
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily")

  useEffect(() => {
    const savedEntries = localStorage.getItem("healthEntries")
    if (savedEntries) {
      const parsed: HealthEntry[] = JSON.parse(savedEntries)
      setEntries(parsed)

      const today = getTodayStr()
      const todayEntry = parsed.find((e) => e.date === today)
      if (todayEntry) {
        setTodaySteps(todayEntry.steps.toString())
      }
    }
  }, [])

  const estimatedCalories = Math.round((parseInt(todaySteps) || 0) * 0.04)

  const handleSaveToday = () => {
    const today = getTodayStr()
    const steps = parseInt(todaySteps) || 0
    const calories = Math.round(steps * 0.04)

    const newEntries = entries.filter((e) => e.date !== today)
    newEntries.push({ date: today, steps, calories })
    newEntries.sort((a, b) => a.date.localeCompare(b.date))

    setEntries(newEntries)
    localStorage.setItem("healthEntries", JSON.stringify(newEntries))
    toast.success("Health data saved for today")
  }

  const todayEntry = entries.find((e) => e.date === getTodayStr())
  const weekData = getWeekData(entries)
  const weeklySteps = weekData.reduce((sum, d) => sum + d.steps, 0)
  const weeklyCalories = weekData.reduce((sum, d) => sum + d.calories, 0)
  const avgDailySteps = Math.round(weeklySteps / 7)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Health Monitor</h1>
          <p className="text-muted-foreground">
            Track your daily steps and calories automatically
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today&apos;s Steps
              </CardTitle>
              <Footprints className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {todayEntry?.steps.toLocaleString() || "0"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Goal: 10,000 steps
              </p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.min((todayEntry?.steps || 0) / 100, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Calories Burned
              </CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">
                {todayEntry?.calories.toLocaleString() || "0"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Automatically calculated from steps
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Weekly Average
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {avgDailySteps.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                steps per day
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Log Today&apos;s Activity</CardTitle>
            </div>
            <CardDescription>
              Enter your step count and calories will be calculated automatically
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1 flex flex-col gap-2">
                  <Label htmlFor="steps">Steps</Label>
                  <Input
                    id="steps"
                    type="number"
                    placeholder="e.g., 8500"
                    value={todaySteps}
                    onChange={(e) => setTodaySteps(e.target.value)}
                  />
                </div>

                <Button onClick={handleSaveToday} className="sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>

              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">Estimated Calories</p>
                <p className="text-2xl font-bold text-orange-500">
                  {estimatedCalories.toLocaleString()} kcal
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Formula: steps × 0.04
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Activity Overview</CardTitle>
                <CardDescription>Your health metrics over time</CardDescription>
              </div>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "daily" | "weekly")}>
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>

          <CardContent>
            <div className="h-[300px]">
              {viewMode === "daily" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="steps" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Steps" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="steps"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                      name="Steps"
                    />
                    <Line
                      type="monotone"
                      dataKey="calories"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--accent))" }}
                      name="Calories"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {weeklySteps.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Total steps this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-500">
                {weeklyCalories.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Total calories burned this week
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}