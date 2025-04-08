import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, FileText } from "lucide-react"
import Link from "next/link"

// Datos de ejemplo para facturas
const invoices = [
  {
    id: 1,
    number: "FAC-2023-001",
    date: "2023-10-15",
    customer: "Juan Pérez",
    total: 1299.99,
    status: "paid",
  },
  {
    id: 2,
    number: "FAC-2023-002",
    date: "2023-10-18",
    customer: "María García",
    total: 459.97,
    status: "paid",
  },
  {
    id: 3,
    number: "FAC-2023-003",
    date: "2023-10-20",
    customer: "Carlos Rodríguez",
    total: 89.99,
    status: "pending",
  },
  {
    id: 4,
    number: "FAC-2023-004",
    date: "2023-10-22",
    customer: "Ana Martínez",
    total: 249.99,
    status: "paid",
  },
  {
    id: 5,
    number: "FAC-2023-005",
    date: "2023-10-25",
    customer: "Pedro López",
    total: 1749.95,
    status: "cancelled",
  },
]

// Función para formatear la fecha
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString("es-ES", options)
}

// Componente para mostrar el estado de la factura
function StatusBadge({ status }) {
  const statusMap = {
    paid: { label: "Pagada", variant: "success" },
    pending: { label: "Pendiente", variant: "warning" },
    cancelled: { label: "Cancelada", variant: "destructive" },
  }

  const { label, variant } = statusMap[status] || { label: status, variant: "default" }

  return <Badge variant={variant}>{label}</Badge>
}

export default function FacturasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facturas</h1>
          <p className="text-muted-foreground">Gestiona tus facturas y ventas realizadas.</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar facturas..." className="pl-8" />
        </div>
        <Button variant="outline">Filtros</Button>
        <Button variant="outline">Exportar</Button>
      </div>
      <Card>
        <CardHeader className="p-4">
          <CardTitle>Historial de Facturas</CardTitle>
          <CardDescription>Lista de todas las facturas emitidas.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    <Link href={`/facturas/${invoice.id}`} className="hover:underline">
                      {invoice.number}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell className="text-right">${invoice.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/facturas/${invoice.id}`}>
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">Ver factura</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
