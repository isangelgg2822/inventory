import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

// Datos de ejemplo para el inventario
const inventoryItems = [
  {
    id: 1,
    name: "Laptop HP Pavilion",
    sku: "LP-HP-001",
    category: "Electrónicos",
    stock: 15,
    price: 899.99,
    cost: 650.0,
  },
  {
    id: 2,
    name: 'Monitor Dell 27"',
    sku: "MN-DL-027",
    category: "Electrónicos",
    stock: 23,
    price: 299.99,
    cost: 180.0,
  },
  {
    id: 3,
    name: "Teclado Mecánico Logitech",
    sku: "KB-LG-001",
    category: "Accesorios",
    stock: 42,
    price: 129.99,
    cost: 75.0,
  },
  {
    id: 4,
    name: "Mouse Inalámbrico",
    sku: "MS-WL-001",
    category: "Accesorios",
    stock: 67,
    price: 49.99,
    cost: 22.0,
  },
  {
    id: 5,
    name: "Auriculares Bluetooth",
    sku: "HP-BT-001",
    category: "Audio",
    stock: 31,
    price: 79.99,
    cost: 35.0,
  },
  {
    id: 6,
    name: "Impresora Láser HP",
    sku: "PR-HP-001",
    category: "Oficina",
    stock: 8,
    price: 249.99,
    cost: 150.0,
  },
  {
    id: 7,
    name: "Disco Duro Externo 1TB",
    sku: "HD-EX-001",
    category: "Almacenamiento",
    stock: 19,
    price: 89.99,
    cost: 45.0,
  },
]

export default function InventarioPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">Gestiona tus productos, stock y precios.</p>
        </div>
        <Button asChild>
          <Link href="/inventario/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Link>
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar productos..." className="pl-8" />
        </div>
        <Button variant="outline">Filtros</Button>
        <Button variant="outline">Exportar</Button>
      </div>
      <Card>
        <CardHeader className="p-4">
          <CardTitle>Productos</CardTitle>
          <CardDescription>Lista de todos los productos en tu inventario.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Costo</TableHead>
                <TableHead className="text-right">Margen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map((item) => {
                const margin = (((item.price - item.cost) / item.price) * 100).toFixed(2)
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">{item.stock}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.cost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{margin}%</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
