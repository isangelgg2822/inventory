"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseClient } from "./supabase"
import type { Product, Sale, SaleItem } from "@/types/database"

// Función auxiliar para manejar la inicialización de Supabase
async function getSupabase() {
  try {
    return getSupabaseClient()
  } catch (error) {
    console.error("Error al obtener el cliente de Supabase:", error.message)
    throw new Error(`No se pudo conectar a la base de datos: ${error.message}`)
  }
}

// Productos
export async function getProducts() {
  try {
    const supabase = await getSupabase()
    const { data, error } = await supabase.from("products").select("*")

    if (error) {
      console.error("Error al obtener productos:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error inesperado al obtener productos:", error)
    return []
  }
}

export async function getProductById(id: number) {
  try {
    const supabase = await getSupabase()
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error al obtener producto con ID ${id}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`Error inesperado al obtener producto con ID ${id}:`, error)
    return null
  }
}

export async function createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">) {
  try {
    console.log("Creando producto:", product)
    const supabase = await getSupabase()
    const { data, error } = await supabase.from("products").insert([product]).select()

    if (error) {
      console.error("Error al crear producto:", error)
      throw new Error(error.message)
    }

    console.log("Producto creado:", data)
    revalidatePath("/inventario")
    return data[0]
  } catch (error) {
    console.error("Error inesperado al crear producto:", error)
    throw error
  }
}

export async function updateProduct(id: number, product: Partial<Product>) {
  try {
    const supabase = await getSupabase()
    const { data, error } = await supabase.from("products").update(product).eq("id", id).select()

    if (error) {
      console.error(`Error al actualizar producto con ID ${id}:`, error)
      throw new Error(error.message)
    }

    revalidatePath("/inventario")
    return data[0]
  } catch (error) {
    console.error(`Error inesperado al actualizar producto con ID ${id}:`, error)
    throw error
  }
}

export async function deleteProduct(id: number) {
  try {
    const supabase = await getSupabase()
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error(`Error al eliminar producto con ID ${id}:`, error)
      throw new Error(error.message)
    }

    revalidatePath("/inventario")
    return true
  } catch (error) {
    console.error(`Error inesperado al eliminar producto con ID ${id}:`, error)
    throw error
  }
}

// Categorías
export async function getCategories() {
  try {
    const supabase = await getSupabase()
    const { data, error } = await supabase.from("categories").select("*")

    if (error) {
      console.error("Error al obtener categorías:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error inesperado al obtener categorías:", error)
    return []
  }
}

// Clientes
export async function getCustomers() {
  try {
    const supabase = await getSupabase()
    const { data, error } = await supabase.from("customers").select("*")

    if (error) {
      console.error("Error al obtener clientes:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error inesperado al obtener clientes:", error)
    return []
  }
}

// Ventas
export async function createSale(
  sale: Omit<Sale, "id" | "created_at" | "updated_at">,
  items: Omit<SaleItem, "id" | "sale_id" | "created_at" | "updated_at">[],
) {
  try {
    console.log("Creando venta:", sale, "con items:", items)
    const supabase = await getSupabase()

    // Iniciar una transacción
    const { data: saleData, error: saleError } = await supabase.from("sales").insert([sale]).select()

    if (saleError) {
      console.error("Error al crear venta:", saleError)
      throw new Error(saleError.message)
    }

    if (!saleData || saleData.length === 0) {
      throw new Error("No se pudo crear la venta")
    }

    const saleId = saleData[0].id

    // Insertar los items de la venta
    const saleItems = items.map((item) => ({
      ...item,
      sale_id: saleId,
      total: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("sale_items").insert(saleItems)

    if (itemsError) {
      console.error("Error al crear items de venta:", itemsError)
      throw new Error(itemsError.message)
    }

    // Actualizar el stock de los productos
    for (const item of items) {
      const { error: updateError } = await supabase.rpc("decrease_stock", {
        p_id: item.product_id,
        quantity: item.quantity,
      })

      if (updateError) {
        console.error(`Error al actualizar stock del producto ${item.product_id}:`, updateError)
        throw new Error(updateError.message)
      }
    }

    revalidatePath("/pos")
    revalidatePath("/inventario")
    return saleId
  } catch (error) {
    console.error("Error inesperado al crear venta:", error)
    throw error
  }
}

export async function getSales() {
  try {
    const supabase = await getSupabase()
    const { data, error } = await supabase.from("sales").select("*")

    if (error) {
      console.error("Error al obtener ventas:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error inesperado al obtener ventas:", error)
    return []
  }
}

export async function getSaleWithItems(saleId: number) {
  try {
    const supabase = await getSupabase()
    const { data: sale, error: saleError } = await supabase
      .from("sales")
      .select("*, customers(*)")
      .eq("id", saleId)
      .single()

    if (saleError) {
      console.error(`Error al obtener venta con ID ${saleId}:`, saleError)
      throw new Error(saleError.message)
    }

    const { data: items, error: itemsError } = await supabase
      .from("sale_items")
      .select("*, products(*)")
      .eq("sale_id", saleId)

    if (itemsError) {
      console.error(`Error al obtener items de venta con ID ${saleId}:`, itemsError)
      throw new Error(itemsError.message)
    }

    return { ...sale, items: items || [] }
  } catch (error) {
    console.error(`Error inesperado al obtener venta con items para ID ${saleId}:`, error)
    throw error
  }
}
