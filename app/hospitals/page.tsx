"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { useAuth } from "@/lib/auth-context"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Hospital,
  Search,
  MapPin,
  Phone,
  Clock,
  Star,
  Navigation,
  Building2,
} from "lucide-react"

interface HospitalResult {
  id: string
  name: string
  address: string
  distance: string
  phone: string
  rating: number
  type: "hospital" | "clinic" | "emergency"
  openNow: boolean
  hours: string
}

// Simulated hospital data based on location search
function searchHospitals(location: string): HospitalResult[] {
  const baseHospitals: Omit<HospitalResult, "id" | "distance">[] = [
    {
      name: "City General Hospital",
      address: "123 Medical Center Dr",
      phone: "(555) 123-4567",
      rating: 4.5,
      type: "hospital",
      openNow: true,
      hours: "24/7 Emergency Services",
    }
  ]

  // Add location-specific prefix and randomize distances
  return baseHospitals.map((hospital, index) => ({
    ...hospital,
    id: `hospital-${index}`,
    address: `${hospital.address}, ${location || "Your Area"}`,
    distance: `${(Math.random() * 5 + 0.5).toFixed(1)} mi`,
  })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
}

const typeColors = {
  hospital: "bg-blue-100 text-blue-800",
  clinic: "bg-green-100 text-green-800",
  emergency: "bg-red-100 text-red-800",
}

const typeLabels = {
  hospital: "Hospital",
  clinic: "Clinic",
  emergency: "Emergency",
}

export default function HospitalsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [location, setLocation] = useState("")
  const [hospitals, setHospitals] = useState<HospitalResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [filterType, setFilterType] = useState<"all" | "hospital" | "clinic" | "emergency">("all")

  const handleSearch = async () => {
    if (!location.trim()) {
      toast.error("Please enter a location")
      return
    }

    setIsSearching(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    const results = searchHospitals(location)
    setHospitals(results)
    setIsSearching(false)
    setHasSearched(true)
    toast.success(`Found ${results.length} healthcare facilities`)
  }

  const filteredHospitals = filterType === "all" 
    ? hospitals 
    : hospitals.filter((h) => h.type === filterType)

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
          <h1 className="text-3xl font-bold text-foreground">Find Hospitals</h1>
          <p className="text-muted-foreground">
            Search for nearby hospitals and healthcare facilities
          </p>
        </div>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Search by Location
            </CardTitle>
            <CardDescription>
              Enter your address or city to find nearby healthcare facilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 relative">
                <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter address, city, or zip code..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching}>
                <Search className="h-4 w-4 mr-2" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filter Buttons */}
        {hasSearched && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
            >
              All ({hospitals.length})
            </Button>
            <Button
              variant={filterType === "hospital" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("hospital")}
            >
              <Building2 className="h-4 w-4 mr-1" />
              Hospitals ({hospitals.filter((h) => h.type === "hospital").length})
            </Button>
            <Button
              variant={filterType === "clinic" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("clinic")}
            >
              <Hospital className="h-4 w-4 mr-1" />
              Clinics ({hospitals.filter((h) => h.type === "clinic").length})
            </Button>
            <Button
              variant={filterType === "emergency" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("emergency")}
            >
              <Clock className="h-4 w-4 mr-1" />
              Emergency ({hospitals.filter((h) => h.type === "emergency").length})
            </Button>
          </div>
        )}

        {/* Results */}
        {hasSearched && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">
              {filteredHospitals.length} Result{filteredHospitals.length !== 1 ? "s" : ""} Found
            </h2>

            {filteredHospitals.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Hospital className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No facilities found matching your filter
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredHospitals.map((hospital) => (
                  <Card key={hospital.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${typeColors[hospital.type]}`}>
                            {hospital.type === "emergency" ? (
                              <Clock className="h-6 w-6" />
                            ) : hospital.type === "clinic" ? (
                              <Hospital className="h-6 w-6" />
                            ) : (
                              <Building2 className="h-6 w-6" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">{hospital.name}</h3>
                              <Badge variant="outline" className={typeColors[hospital.type]}>
                                {typeLabels[hospital.type]}
                              </Badge>
                              {hospital.openNow ? (
                                <Badge variant="outline" className="bg-green-100 text-green-800">
                                  Open Now
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                                  Closed
                                </Badge>
                              )}
                            </div>
                            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                              <p className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {hospital.address}
                              </p>
                              <p className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {hospital.phone}
                              </p>
                              <p className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {hospital.hours}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{hospital.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-right">
                            <p className="text-lg font-semibold text-primary">{hospital.distance}</p>
                            <p className="text-xs text-muted-foreground">away</p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={`tel:${hospital.phone}`}>
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <Card>
            <CardContent className="py-12 text-center">
              <Hospital className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Enter your location above to find nearby hospitals and clinics
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
