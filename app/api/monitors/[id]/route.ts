import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const monitor = await prisma.monitor.findFirst({
    where: {
      id,
      userId: session.user.id
    }
  })

  if (!monitor) {
    return NextResponse.json({ error: 'Monitor not found' }, { status: 404 })
  }

  return NextResponse.json({ monitor })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify monitor belongs to user
  const monitor = await prisma.monitor.findFirst({
    where: {
      id,
      userId: session.user.id
    }
  })

  if (!monitor) {
    return NextResponse.json({ error: 'Monitor not found' }, { status: 404 })
  }

  // Delete monitor (cascades to pings and alerts)
  await prisma.monitor.delete({
    where: { id }
  })

  return NextResponse.json({ success: true })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, intervalSeconds, gracePeriodSeconds, slackWebhookUrl, discordWebhookUrl, alertEmails } = body

  // Verify monitor belongs to user
  const monitor = await prisma.monitor.findFirst({
    where: {
      id,
      userId: session.user.id
    }
  })

  if (!monitor) {
    return NextResponse.json({ error: 'Monitor not found' }, { status: 404 })
  }

  // Update monitor
  const updated = await prisma.monitor.update({
    where: { id },
    data: {
      name,
      intervalSeconds,
      gracePeriodSeconds,
      slackWebhookUrl,
      discordWebhookUrl,
      alertEmails,
    }
  })

  return NextResponse.json({ monitor: updated })
}
