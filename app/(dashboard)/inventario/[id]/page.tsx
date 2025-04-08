"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProductById, deleteProduct } from "@/lib/actions"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ProductoDetallePage({ params }) {
  const router = useRouter()
  const { id } = params
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(Number.parseInt(id))
        setProduct(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleDelete = async () => {
    try {
      await deleteProduct(Number.parseInt(id))
      router.push("/inventario")
      router.refresh()
    } catch (err) {
      console.error("Error al eliminar el producto:", err)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Cargando...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-destructive mb-4">Error: {error}</p>
        <Button asChild variant="outline">
          <Link href="/inventario">Volver al Inventario</Link>
        </Button>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="mb-4">Producto no encontrado</p>
        <Button asChild variant="outline">
          <Link href="/inventario">Volver al Inventario</Link>
        </Button>
      </div>
    )
  }

  // Calcular el margen de ganancia
  const margin = (((product.price - product.cost) / product.price) * 100).toFixed(2)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon">
            <Link href="/inventario">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/inventario/${id}/editar`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente el producto "{product.name}" de tu
                  inventario.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Imagen del Producto</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <img
              src={product.image_url || "/placeholder.svg?height=200&width=200"}
              alt={product.name}
              className="rounded-md object-contain"
              style={{ maxHeight: "200px" }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <Tabs defaultValue="details">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Información del Producto</CardTitle>
                <TabsList>
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                  <TabsTrigger value="pricing">Precios</TabsTrigger>
                  <TabsTrigger value="inventory">Inventario</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="details" className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">SKU</h3>
                  <p>{product.sku}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Descripción</h3>
                  <p>{product.description || "Sin descripción"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Categoría</h3>
                  <p>{product.category_id || "Sin categoría"}</p>
                </div>
              </TabsContent>
              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Precio de Venta</h3>
                    <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Costo</h3>
                    <p className="text-xl font-bold">${product.cost.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Margen</h3>
                    <p className="text-xl font-bold">{margin}%</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="inventory" className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Stock Actual</h3>
                  <p className="text-xl font-bold">{product.stock} unidades</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Valor del Inventario</h3>
                  <p className="text-xl font-bold">${(product.cost * product.stock).toFixed(2)}</p>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
