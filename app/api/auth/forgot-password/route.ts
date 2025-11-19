import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { User } from "@/lib/types"
import { randomBytes } from "crypto"
import { Resend } from "resend"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Check if user exists
    const [user] = await sql<User[]>`
      SELECT * FROM "User" WHERE email = ${email}
    `

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists, a reset link has been sent"
      })
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Store token in database
    await sql`
      UPDATE "User"
      SET "resetToken" = ${resetToken},
          "resetTokenExpiry" = ${resetTokenExpiry},
          "updatedAt" = NOW()
      WHERE id = ${user.id}
    `

    // Send password reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'
      
      try {
        await resend.emails.send({
          from: fromEmail,
          to: user.email,
          subject: 'Reset Your TaskAlive Password',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
                  .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                  .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px; }
                  .footer { text-align: center; margin-top: 24px; font-size: 14px; color: #6b7280; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0; font-size: 24px;">Reset Your Password</h1>
                  </div>
                  <div class="content">
                    <p>Hello,</p>
                    <p>You requested to reset your password for your TaskAlive account. Click the button below to create a new password:</p>
                    <div style="text-align: center;">
                      <a href="${resetUrl}" class="button">Reset Password</a>
                    </div>
                    <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">
                      This link will expire in 1 hour. If you didn't request this reset, you can safely ignore this email.
                    </p>
                    <p style="margin-top: 16px; font-size: 14px; color: #6b7280;">
                      Or copy and paste this URL into your browser:<br>
                      <span style="color: #2563eb;">${resetUrl}</span>
                    </p>
                  </div>
                  <div class="footer">
                    <p>This is an automated email from TaskAlive.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        })
        console.log(`✅ Password reset email sent to ${email}`)
      } catch (error) {
        console.error('Failed to send password reset email:', error)
        // Continue anyway - don't fail the request if email fails
      }
    } else {
      // Development fallback - log to console
      console.log(`🔗 Password reset link for ${email}: ${resetUrl}`)
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists, a reset link has been sent",
      // Remove this in production - only for development
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
    })
  } catch (error) {
    console.error("Error processing password reset:", error)
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    )
  }
}
