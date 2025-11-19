import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, message } = await req.json()

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 })
    }

    // TODO: Implement email sending via Resend
    // For now, just log to console
    console.log('Support request:', {
      from: session.user.email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    })

    // In production, you would send an email like:
    // await resend.emails.send({
    //   from: process.env.FROM_EMAIL,
    //   to: process.env.SUPPORT_EMAIL,
    //   subject: `Support Request: ${subject}`,
    //   html: `
    //     <p><strong>From:</strong> ${session.user.email}</p>
    //     <p><strong>Subject:</strong> ${subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `,
    // })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Support request error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
