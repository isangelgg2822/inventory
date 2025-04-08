"use client"

import { AuthForm } from "@/components/auth-form"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tab === "signup" ? "signup" : "signin")
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Bienvenido a VentasPro</h1>
          <p className="text-sm text-muted-foreground">
            {activeTab === "signin"
              ? "Ingresa tus credenciales para acceder al sistema"
              : "Crea una cuenta para comenzar a usar el sistema"}
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
