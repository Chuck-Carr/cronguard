import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pingUrl: string }> }
) {
  return handlePing(req, params)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ pingUrl: string }> }
) {
  return handlePing(req, params)
}

async function handlePing(
  req: NextRequest,
  params: Promise<{ pingUrl: string }>
) {
  try {
    const { pingUrl } = await params
    
    const monitor = await prisma.monitor.findUnique({
      where: { pingUrl },
    })

    if (!monitor) {
      return NextResponse.json({ error: "Monitor not found" }, { status: 404 })
    }

    const now = new Date()
    const nextExpectedPingAt = new Date(
      now.getTime() + monitor.intervalSeconds * 1000
    )

    // Get optional message from query params or body
    let message: string | undefined
    if (req.method === "POST") {
      try {
        const body = await req.json()
        message = body.message
      } catch {
        // Body is optional
      }
    } else {
      message = req.nextUrl.searchParams.get("message") || undefined
    }

    // Get IP address
    const ipAddress = req.headers.get("x-forwarded-for") || 
                      req.headers.get("x-real-ip") || 
                      "unknown"

    // Update monitor and create ping in transaction
    await prisma.$transaction([
      prisma.monitor.update({
        where: { id: monitor.id },
        data: {
          status: "HEALTHY",
          lastPingAt: now,
          nextExpectedPingAt,
        },
      }),
      prisma.ping.create({
        data: {
          monitorId: monitor.id,
          pingedAt: now,
          message,
          ipAddress,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: "Ping received",
      nextPing: nextExpectedPingAt,
    })
  } catch (error) {
    console.error("Error handling ping:", error)
    return NextResponse.json(
      { error: "Failed to process ping" },
      { status: 500 }
    )
  }
}
