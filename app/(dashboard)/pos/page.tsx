"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Datos de ejemplo para productos
const productCategories = [
  {
    id: 1,
    name: "Electrónicos",
    products: [
      { id: 1, name: "Laptop HP Pavilion", price: 899.99, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: 'Monitor Dell 27"', price: 299.99, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "Smartphone Samsung", price: 699.99, image: "/placeholder.svg?height=80&width=80" },
    ],
  },
  {
    id: 2,
    name: "Accesorios",
    products: [
      { id: 4, name: "Teclado Mecánico", price: 129.99, image: "/placeholder.svg?height=80&width=80" },
      { id: 5, name: "Mouse Inalámbrico", price: 49.99, image: "/placeholder.svg?height=80&width=80" },
      { id: 6, name: "Auriculares Bluetooth", price: 79.99, image: "/placeholder.svg?height=80&width=80" },
    ],
  },
  {
    id: 3,
    name: "Oficina",
    products: [
      { id: 7, name: "Impresora Láser", price: 249.99, image: "/placeholder.svg?height=80&width=80" },
      { id: 8, name: "Papel A4 (Resma)", price: 9.99, image: "/placeholder.svg?height=80&width=80" },
      { id: 9, name: "Grapadora", price: 12.99, image: "/placeholder.svg?height=80&width=80" },
    ],
  },
]

export default function POSPage() {
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  const addToCart = (product) => {
    try {
      console.log("Añadiendo producto al carrito:", product)

      const existingItem = cart.find((item) => item.id === product.id)
      if (existingItem) {
        setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
      } else {
        setCart([...cart, { ...product, quantity: 1 }])
      }

      console.log("Producto añadido al carrito")
    } catch (error) {
      console.error("Error al añadir producto al carrito:", error)
      setError("Error al añadir producto al carrito: " + (error.message || "Error desconocido"))
    }
  }

  const removeFromCart = (productId) => {
    try {
      setCart(cart.filter((item) => item.id !== productId))
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error)
      setError("Error al eliminar producto del carrito: " + (error.message || "Error desconocido"))
    }
  }

  const updateQuantity = (productId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        removeFromCart(productId)
        return
      }
      setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
    } catch (error) {
      console.error("Error al actualizar cantidad:", error)
      setError("Error al actualizar cantidad: " + (error.message || "Error desconocido"))
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.16 // 16% de impuesto
  const total = subtotal + tax

  const filteredProducts = productCategories
    .map((category) => ({
      ...category,
      products: category.products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())),
    }))
    .filter((category) => category.products.length > 0)

  const handleCheckout = (paymentMethod) => {
    try {
      console.log(`Procesando pago con ${paymentMethod}`, { cart, subtotal, tax, total })
      // Aquí iría la lógica para procesar el pago
      alert(`Venta completada. Total: $${total.toFixed(2)}`)
      setCart([])
    } catch (error) {
      console.error("Error al procesar el pago:", error)
      setError("Error al procesar el pago: " + (error.message || "Error desconocido"))
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {error && (
        <Alert variant="destructive" className="absolute top-4 right-4 w-96 z-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Tabs defaultValue={productCategories[0]?.id.toString()} className="flex-1 flex flex-col">
          <TabsList className="mb-4">
            {productCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id.toString()}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex-1 overflow-auto">
            {searchTerm ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.flatMap((category) =>
                  category.products.map((product) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => addToCart(product)}
                    >
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="mb-2 rounded-md"
                          width={80}
                          height={80}
                        />
                        <h3 className="font-medium text-sm">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                  )),
                )}
              </div>
            ) : (
              productCategories.map((category) => (
                <TabsContent key={category.id} value={category.id.toString()} className="mt-0 flex-1">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {category.products.map((product) => (
                      <Card
                        key={product.id}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => addToCart(product)}
                      >
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="mb-2 rounded-md"
                            width={80}
                            height={80}
                          />
                          <h3 className="font-medium text-sm">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))
            )}
          </div>
        </Tabs>
      </div>
      <Card className="w-96 flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Carrito de Compra
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-2" />
              <p>El carrito está vacío</p>
              <p className="text-sm">Agrega productos haciendo clic en ellos</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        updateQuantity(item.id, item.quantity - 1)
                      }}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        updateQuantity(item.id, item.quantity + 1)
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFromCart(item.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col border-t pt-4">
          <div className="w-full space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Impuesto (16%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 w-full">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleCheckout("efectivo")}
              disabled={cart.length === 0}
            >
              <Banknote className="mr-2 h-4 w-4" />
              Efectivo
            </Button>
            <Button className="w-full" onClick={() => handleCheckout("tarjeta")} disabled={cart.length === 0}>
              <CreditCard className="mr-2 h-4 w-4" />
              Tarjeta
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
