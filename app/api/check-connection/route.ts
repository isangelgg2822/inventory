import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Obtener variables de entorno
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Verificar que existan
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        message: "Variables de entorno faltantes",
      })
    }

    // Crear cliente
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Probar la conexión con una consulta simple
    const { data, error } = await supabase.from("products").select("count").limit(1)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Conexión establecida correctamente",
    })
  } catch (error) {
    console.error("Error al verificar la conexión:", error)

    return NextResponse.json({
      success: false,
      message: `Error de conexión: ${error.message || "Error desconocido"}`,
    })
  }
}
