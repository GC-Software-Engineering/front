"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Activity, FileText, Hospital, Brain, Shield, Heart, ArrowRight, ScanText, Accessibility, Search } from "lucide-react"

const features = [
  {
    title: "Member Flow",
    description: "Landing, sign up, log in, and password recovery screens for non-members.",
    icon: Shield,
  },
  {
    title: "Diagnosis Data Input",
    description: "Enter medical info directly or upload clinic documents for OCR-style extraction.",
    icon: ScanText,
  },
  {
    title: "AI Health Prediction",
    description: "Generate disease-risk summaries and management recommendations from records.",
    icon: Brain,
  },
  {
    title: "Nearby Hospital Search",
    description: "Type your address and get nearby hospital suggestions without a map view.",
    icon: Hospital,
  },
  {
    title: "Body Diagnosis View",
    description: "Browse medical history by body region using an interactive human body interface.",
    icon: Activity,
  },
  {
    title: "Date-based Records",
    description: "Search and filter diagnosis history by visit date, file date, or keyword.",
    icon: Search,
  },
  {
    title: "Medical Summary",
    description: "Summarize records using diagnosis codes and extracted text for fast review.",
    icon: FileText,
  },
  {
    title: "Accessible UI",
    description: "Switch to a senior-friendly large-text interface for easier use.",
    icon: Accessibility,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Bio-Health</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login"><Button variant="ghost">Log In</Button></Link>
            <Link href="/signup"><Button>Get Started</Button></Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary mb-6">
              <Shield className="h-4 w-4" />
              <span>My Bio-Health Care Data Bank</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
              Your Personal Healthcare Management System
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl text-pretty">
Take charge of your health with Bio-Health. Monitor your daily activity, store medical records, and get smart AI insights—all in one simple and secure platform.            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/signup"><Button size="lg" className="gap-2">Create Free Account <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link href="/login"><Button size="lg" variant="outline">Sign In</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">Feature screens matched to the spec</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">The upgraded structure is focused on your software engineering project presentation and UI flow.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
