import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { canCreateMonitor } from "@/lib/plan-limits"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const monitors = await prisma.monitor.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { pings: true },
        },
      },
    })

    return NextResponse.json({ monitors })
  } catch (error) {
    console.error("Error fetching monitors:", error)
    return NextResponse.json(
      { error: "Failed to fetch monitors" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        _count: {
          select: { monitors: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check plan limits
    if (!canCreateMonitor(user.plan, user._count.monitors)) {
      return NextResponse.json(
        { error: "Monitor limit reached for your plan" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { name, intervalSeconds, gracePeriodSeconds } = body

    if (!name || !intervalSeconds) {
      return NextResponse.json(
        { error: "Name and interval are required" },
        { status: 400 }
      )
    }

    const monitor = await prisma.monitor.create({
      data: {
        userId: user.id,
        name,
        intervalSeconds,
        gracePeriodSeconds: gracePeriodSeconds || 300,
      },
    })

    return NextResponse.json({ monitor }, { status: 201 })
  } catch (error) {
    console.error("Error creating monitor:", error)
    return NextResponse.json(
      { error: "Failed to create monitor" },
      { status: 500 }
    )
  }
}
