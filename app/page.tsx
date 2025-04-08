import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-background">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Sistema de Inventario y Punto de Venta
        </h1>
        <p className="text-lg text-muted-foreground sm:text-xl">
          Una solución completa para gestionar tu inventario y ventas, similar a Odoo pero más simple y fácil de usar.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/dashboard">Acceder al Sistema</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
