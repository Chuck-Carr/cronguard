import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { User } from "@/lib/types"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Check if user exists
    const [existingUser] = await sql<User[]>`
      SELECT * FROM "User" WHERE email = ${email}
    `

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const [user] = await sql<User[]>`
      INSERT INTO "User" (id, email, "passwordHash", plan, "createdAt", "updatedAt")
      VALUES (${randomUUID()}, ${email}, ${passwordHash}, 'FREE', NOW(), NOW())
      RETURNING id, email, plan, "createdAt"
    `

    return NextResponse.json(
      { user, message: "User created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}
