"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { AuthUser } from "@/lib/types"

interface SignupPayload {
  name: string
  email: string
  password: string
  phone: string
  dateOfBirth: string
  gender: "male" | "female" | ""
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (payload: SignupPayload) => Promise<{ success: boolean; error?: string }>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const PUBLIC_ROUTES = ["/", "/login", "/signup", "/forgot-password"]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const storedUser = localStorage.getItem("biohealth_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading && !user && !PUBLIC_ROUTES.includes(pathname)) {
      router.push("/login")
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = JSON.parse(localStorage.getItem("biohealth_users") || "[]")
    const foundUser = users.find((u: { email: string; password: string }) => u.email === email && u.password === password)

    if (!foundUser) {
      return { success: false, error: "Invalid email or password" }
    }

    const userData: AuthUser = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      phone: foundUser.phone,
      dateOfBirth: foundUser.dateOfBirth,
      gender: foundUser.gender,
    }

    setUser(userData)
    localStorage.setItem("biohealth_user", JSON.stringify(userData))
    return { success: true }
  }

  const signup = async (payload: SignupPayload): Promise<{ success: boolean; error?: string }> => {
    const users = JSON.parse(localStorage.getItem("biohealth_users") || "[]")

    if (users.some((u: { email: string }) => u.email === payload.email)) {
      return { success: false, error: "Email already exists" }
    }

    const newUser = {
      id: crypto.randomUUID(),
      ...payload,
    }

    users.push(newUser)
    localStorage.setItem("biohealth_users", JSON.stringify(users))

    const userData: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      dateOfBirth: newUser.dateOfBirth,
      gender: newUser.gender,
    }

    setUser(userData)
    localStorage.setItem("biohealth_user", JSON.stringify(userData))
    return { success: true }
  }

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const users = JSON.parse(localStorage.getItem("biohealth_users") || "[]")
    const foundUser = users.find((u: { email: string }) => u.email === email)

    if (!foundUser) {
      return { success: false, error: "No account found for that email" }
    }

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("biohealth_user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
