import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { User } from "@/lib/types"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Find user with valid reset token
    const [user] = await sql<User[]>`
      SELECT * FROM "User" 
      WHERE "resetToken" = ${token}
        AND "resetTokenExpiry" > NOW()
    `

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10)

    // Update password and clear reset token
    await sql`
      UPDATE "User"
      SET "passwordHash" = ${passwordHash},
          "resetToken" = NULL,
          "resetTokenExpiry" = NULL,
          "updatedAt" = NOW()
      WHERE id = ${user.id}
    `

    return NextResponse.json({
      success: true,
      message: "Password reset successfully"
    })
  } catch (error) {
    console.error("Error resetting password:", error)
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    )
  }
}
