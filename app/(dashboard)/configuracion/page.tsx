"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function ConfiguracionPage() {
  const [configStatus, setConfigStatus] = useState({
    supabaseUrl: {
      value: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      status: "checking",
    },
    supabaseAnonKey: {
      value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      status: "checking",
    },
    connection: {
      status: "checking",
      message: "Comprobando conexión...",
    },
  })

  useEffect(() => {
    // Verificar variables de entorno
    setConfigStatus((prev) => ({
      ...prev,
      supabaseUrl: {
        ...prev.supabaseUrl,
        status: prev.supabaseUrl.value ? "success" : "error",
      },
      supabaseAnonKey: {
        ...prev.supabaseAnonKey,
        status: prev.supabaseAnonKey.value ? "success" : "error",
      },
    }))

    // Verificar conexión
    const checkConnection = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          throw new Error("Variables de entorno faltantes")
        }

        const res = await fetch("/api/check-connection")
        const data = await res.json()

        setConfigStatus((prev) => ({
          ...prev,
          connection: {
            status: data.success ? "success" : "error",
            message: data.message,
          },
        }))
      } catch (error) {
        setConfigStatus((prev) => ({
          ...prev,
          connection: {
            status: "error",
            message: error.message || "Error al comprobar la conexión",
          },
        }))
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración del Sistema</h1>
        <p className="text-muted-foreground">Verifica y administra la configuración de tu sistema.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Supabase</CardTitle>
          <CardDescription>Diagnóstico de la conexión con la base de datos y variables de entorno</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <StatusItem
              label="URL de Supabase"
              status={configStatus.supabaseUrl.status}
              value={
                configStatus.supabaseUrl.value
                  ? `${configStatus.supabaseUrl.value.substring(0, 15)}...`
                  : "No configurado"
              }
              message={
                configStatus.supabaseUrl.status === "error"
                  ? "La variable NEXT_PUBLIC_SUPABASE_URL no está configurada"
                  : "Variable configurada correctamente"
              }
            />

            <StatusItem
              label="Clave Anónima"
              status={configStatus.supabaseAnonKey.status}
              value={
                configStatus.supabaseAnonKey.value
                  ? `${configStatus.supabaseAnonKey.value.substring(0, 5)}...`
                  : "No configurado"
              }
              message={
                configStatus.supabaseAnonKey.status === "error"
                  ? "La variable NEXT_PUBLIC_SUPABASE_ANON_KEY no está configurada"
                  : "Variable configurada correctamente"
              }
            />

            <StatusItem
              label="Conexión a Supabase"
              status={configStatus.connection.status}
              message={configStatus.connection.message}
            />
          </div>

          <Alert
            variant="destructive"
            className={
              configStatus.supabaseUrl.status === "error" || configStatus.supabaseAnonKey.status === "error"
                ? "block"
                : "hidden"
            }
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Configuración Incompleta</AlertTitle>
            <AlertDescription>
              <p>Para configurar correctamente Supabase, sigue estos pasos:</p>
              <ol className="list-decimal pl-4 mt-2">
                <li>
                  Crea un archivo <code>.env.local</code> en la raíz del proyecto
                </li>
                <li>Añade las siguientes variables:</li>
                <pre className="bg-destructive/10 p-2 rounded mt-1 text-xs">
                  NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
                  <br />
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
                </pre>
                <li>Reinicia el servidor de desarrollo</li>
              </ol>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>Verificar de nuevo</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function StatusItem({ label, status, value, message }) {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center justify-between">
        <div className="font-medium">{label}</div>
        <StatusBadge status={status} />
      </div>
      {value && <div className="text-sm text-muted-foreground">{value}</div>}
      <div className={`text-sm ${status === "error" ? "text-destructive" : "text-muted-foreground"}`}>{message}</div>
    </div>
  )
}

function StatusBadge({ status }) {
  if (status === "checking") {
    return <span className="text-sm text-muted-foreground">Verificando...</span>
  }

  if (status === "success") {
    return (
      <span className="flex items-center text-sm text-green-600">
        <CheckCircle2 className="mr-1 h-4 w-4" />
        Correcto
      </span>
    )
  }

  if (status === "error") {
    return (
      <span className="flex items-center text-sm text-destructive">
        <AlertCircle className="mr-1 h-4 w-4" />
        Error
      </span>
    )
  }

  return null
}
