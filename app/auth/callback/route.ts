import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")

  // Redirigir al dashboard después de la autenticación
  return NextResponse.redirect(new URL("/dashboard", request.url))
}
