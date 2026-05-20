"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { useAuth } from "@/lib/auth-context"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { User, Save, Calendar, Mail, Phone, Accessibility } from "lucide-react"
import type { UserProfileData } from "@/lib/types"

const defaultProfile: UserProfileData = {
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  emergencyContact: "",
  medicalNotes: "",
  accessibilityMode: "default",
}

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfileData>(defaultProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
      return
    }
    if (user) {
      setProfile((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        accessibilityMode: (localStorage.getItem("biohealth_accessibility_mode") as "default" | "senior") || "default",
      }))
    }
  }, [user])

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner className="h-8 w-8" /></div>
  if (!user) return null

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    localStorage.setItem("userProfile", JSON.stringify(profile))
    localStorage.setItem("biohealth_accessibility_mode", profile.accessibilityMode || "default")
    window.dispatchEvent(new Event("biohealth-accessibility-change"))
    setIsSaving(false)
    setIsEditing(false)
    toast.success("Profile saved successfully")
  }

  const handleChange = (field: keyof UserProfileData, value: string) => setProfile((prev) => ({ ...prev, [field]: value }))

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage member information and accessibility options</p>
          </div>
          <Button variant={isEditing ? "outline" : "default"} onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Cancel" : "Edit Profile"}</Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"><User className="w-10 h-10 text-primary" /></div>
              <div>
                <h2 className="text-xl font-semibold">{profile.fullName || "Your Name"}</h2>
                <p className="text-muted-foreground">{profile.email || "your.email@example.com"}</p>
                <p className="text-sm text-muted-foreground">Gender: {profile.gender || "Not set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Requirement-based member info including birth date, gender, and phone</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2"><Label htmlFor="fullName">Full Name</Label><Input id="fullName" value={profile.fullName} onChange={(e) => handleChange("fullName", e.target.value)} disabled={!isEditing} /></div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative"><Input id="dateOfBirth" type="date" value={profile.dateOfBirth} onChange={(e) => handleChange("dateOfBirth", e.target.value)} disabled={!isEditing} /><Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" /></div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Gender</Label>
              <RadioGroup value={profile.gender} onValueChange={(value) => handleChange("gender", value)} disabled={!isEditing} className="flex gap-4">
                <div className="flex items-center gap-2"><RadioGroupItem value="male" id="male" /><Label htmlFor="male" className="font-normal cursor-pointer">Male</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="female" id="female" /><Label htmlFor="female" className="font-normal cursor-pointer">Female</Label></div>
              </RadioGroup>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2"><Label htmlFor="email">Email</Label><div className="relative"><Input id="email" type="email" value={profile.email} onChange={(e) => handleChange("email", e.target.value)} disabled={!isEditing} /><Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" /></div></div>
              <div className="flex flex-col gap-2"><Label htmlFor="phone">Phone Number</Label><div className="relative"><Input id="phone" type="tel" value={profile.phone} onChange={(e) => handleChange("phone", e.target.value)} disabled={!isEditing} /><Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" /></div></div>
            </div>

            <div className="flex flex-col gap-2"><Label htmlFor="address">Address</Label><Input id="address" value={profile.address} onChange={(e) => handleChange("address", e.target.value)} disabled={!isEditing} placeholder="Enter your address" /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency & Medical</CardTitle>
            <CardDescription>Important health-related information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2"><Label htmlFor="emergencyContact">Emergency Contact</Label><Input id="emergencyContact" value={profile.emergencyContact} onChange={(e) => handleChange("emergencyContact", e.target.value)} disabled={!isEditing} placeholder="Name and phone number" /></div>
            <div className="flex flex-col gap-2"><Label htmlFor="medicalNotes">Medical Notes</Label><Textarea id="medicalNotes" value={profile.medicalNotes} onChange={(e) => handleChange("medicalNotes", e.target.value)} disabled={!isEditing} placeholder="Allergies, chronic conditions, medications, etc." rows={4} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Accessibility className="h-5 w-5 text-primary" /> Accessible UI Mode</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">Senior-friendly mode</p>
              <p className="text-sm text-muted-foreground">Larger text and roomier layout across the app</p>
            </div>
            <Switch checked={profile.accessibilityMode === "senior"} disabled={!isEditing} onCheckedChange={(checked) => setProfile((prev) => ({ ...prev, accessibilityMode: checked ? "senior" : "default" }))} />
          </CardContent>
        </Card>

        {isEditing && <Button onClick={handleSave} disabled={isSaving} className="w-full" size="lg"><Save className="w-4 h-4 mr-2" />{isSaving ? "Saving..." : "Save Profile"}</Button>}
      </div>
    </AppShell>
  )
}
