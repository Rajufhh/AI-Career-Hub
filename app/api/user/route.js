import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

export async function GET() {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // In a real application, you would fetch user data from a database here
  // For now, we'll just return the session user data
  return NextResponse.json({ user: session.user })
}

