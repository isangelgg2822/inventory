import { createClient } from "@supabase/supabase-js"

// Verificar que las variables de entorno estén definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validar que tenemos los valores necesarios
if (!supabaseUrl) {
  console.error("ERROR: La variable de entorno NEXT_PUBLIC_SUPABASE_URL no está definida.")
}

if (!supabaseAnonKey) {
  console.error("ERROR: La variable de entorno NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida.")
}

// Crear cliente solo si tenemos las credenciales
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Función para obtener el cliente, con validación
export function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      "No se pudo inicializar el cliente de Supabase. Verifica las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    )
  }
  return supabase
}
