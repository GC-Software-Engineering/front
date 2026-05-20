"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Activity, FileText, User, Hospital, Heart, Menu, X, LogOut, LayoutDashboard, Accessibility } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/health", label: "Health Monitor", icon: Activity },
  { href: "/records", label: "Medical Records", icon: FileText },
  { href: "/body-view", label: "Body View", icon: Heart },
  { href: "/hospitals", label: "Find Hospitals", icon: Hospital },
  { href: "/profile", label: "Profile", icon: User },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [seniorMode, setSeniorMode] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    setSeniorMode(localStorage.getItem("biohealth_accessibility_mode") === "senior")
  }, [])

  const toggleSeniorMode = () => {
    const next = !seniorMode
    setSeniorMode(next)
    localStorage.setItem("biohealth_accessibility_mode", next ? "senior" : "default")
    window.dispatchEvent(new Event("biohealth-accessibility-change"))
  }

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary"><Heart className="h-5 w-5 text-primary-foreground" /></div>
          <span className="text-lg font-semibold text-foreground">Bio-Health</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors", isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button variant={seniorMode ? "default" : "outline"} size="sm" onClick={toggleSeniorMode}>
            <Accessibility className="mr-2 h-4 w-4" />
            {seniorMode ? "Senior mode on" : "Senior mode"}
          </Button>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground text-xs">{getInitials(user.name)}</AvatarFallback></Avatar>
                  <span className="text-sm font-medium">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild><Link href="/profile" className="flex items-center gap-2"><User className="h-4 w-4" />Profile</Link></DropdownMenuItem>
                <DropdownMenuItem onClick={toggleSeniorMode} className="cursor-pointer"><Accessibility className="mr-2 h-4 w-4" />{seniorMode ? "Use default UI" : "Use senior-friendly UI"}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer"><LogOut className="h-4 w-4 mr-2" />Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden border-t bg-card p-4">
          <div className="flex flex-col gap-2">
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 mb-2 border-b pb-4">
                <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary text-primary-foreground">{getInitials(user.name)}</AvatarFallback></Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}
            <button onClick={toggleSeniorMode} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
              <Accessibility className="h-5 w-5" />{seniorMode ? "Use default UI" : "Use senior-friendly UI"}
            </button>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className={cn("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors", isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                  <Icon className="h-5 w-5" />{item.label}
                </Link>
              )
            })}
            <button onClick={() => { setMobileMenuOpen(false); logout() }} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors mt-2">
              <LogOut className="h-5 w-5" />Log out
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}
