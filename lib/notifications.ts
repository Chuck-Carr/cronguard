import { Resend } from 'resend'
import { AlertType } from './types'

const resend = new Resend(process.env.RESEND_API_KEY)
const fromEmail = process.env.FROM_EMAIL || 'alerts@taskalive.io'
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface Monitor {
  id: string
  name: string
  lastPingAt: Date | null
  intervalSeconds: number
}

interface User {
  email: string
}

// Send email alert
export async function sendEmailAlert(
  user: User,
  monitor: Monitor,
  alertType: AlertType
) {
  if (!process.env.RESEND_API_KEY) {
    console.log('⚠️  RESEND_API_KEY not set, skipping email alert')
    return
  }

  const isDown = alertType === 'DOWN'
  const subject = isDown 
    ? `🚨 Monitor Down: ${monitor.name}`
    : `✅ Monitor Recovered: ${monitor.name}`

  const monitorUrl = `${appUrl}/dashboard/monitors/${monitor.id}`
  
  try {
    await resend.emails.send({
      from: fromEmail,
      to: user.email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: ${isDown ? '#dc2626' : '#16a34a'}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px; }
              .details { background: white; padding: 16px; border-radius: 6px; margin-top: 16px; }
              .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
              .detail-label { font-weight: 600; color: #6b7280; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">${isDown ? '🚨 Monitor Down' : '✅ Monitor Recovered'}</h1>
              </div>
              <div class="content">
                <h2 style="margin-top: 0;">${monitor.name}</h2>
                <p>${isDown 
                  ? 'Your monitor has not received a ping within the expected interval and grace period.' 
                  : 'Your monitor has received a ping and is now back online.'
                }</p>
                
                <div class="details">
                  <div class="detail-row">
                    <span class="detail-label">Monitor:</span>
                    <span>${monitor.name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span>${isDown ? '🔴 Down' : '🟢 Healthy'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Last Ping:</span>
                    <span>${monitor.lastPingAt ? new Date(monitor.lastPingAt).toLocaleString() : 'Never'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Expected Interval:</span>
                    <span>Every ${formatInterval(monitor.intervalSeconds)}</span>
                  </div>
                </div>
                
                <a href="${monitorUrl}" class="button">View Monitor Details</a>
                
                <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">
                  This is an automated alert from TaskAlive.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    })
    
    console.log(`📧 Email sent to ${user.email} for ${monitor.name} (${alertType})`)
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

// Send Discord webhook
export async function sendDiscordWebhook(
  webhookUrl: string,
  monitor: Monitor,
  alertType: AlertType
) {
  const isDown = alertType === 'DOWN'
  const monitorUrl = `${appUrl}/dashboard/monitors/${monitor.id}`
  
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: isDown ? '🚨 Monitor Down' : '✅ Monitor Recovered',
          description: `**${monitor.name}**`,
          color: isDown ? 0xdc2626 : 0x16a34a, // Red or Green
          fields: [
            {
              name: 'Status',
              value: isDown ? '🔴 Down' : '🟢 Healthy',
              inline: true
            },
            {
              name: 'Last Ping',
              value: monitor.lastPingAt 
                ? new Date(monitor.lastPingAt).toLocaleString() 
                : 'Never',
              inline: true
            },
            {
              name: 'Expected Interval',
              value: `Every ${formatInterval(monitor.intervalSeconds)}`,
              inline: true
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'TaskAlive'
          },
          url: monitorUrl
        }]
      })
    })
    
    console.log(`📢 Discord webhook sent for ${monitor.name} (${alertType})`)
  } catch (error) {
    console.error('Failed to send Discord webhook:', error)
    throw error
  }
}

// Send Slack webhook
export async function sendSlackWebhook(
  webhookUrl: string,
  monitor: Monitor,
  alertType: AlertType
) {
  const isDown = alertType === 'DOWN'
  const monitorUrl = `${appUrl}/dashboard/monitors/${monitor.id}`
  
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: isDown 
          ? `🚨 *Monitor Down*: ${monitor.name}`
          : `✅ *Monitor Recovered*: ${monitor.name}`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: isDown ? '🚨 Monitor Down' : '✅ Monitor Recovered'
            }
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Monitor:*\n${monitor.name}`
              },
              {
                type: 'mrkdwn',
                text: `*Status:*\n${isDown ? '🔴 Down' : '🟢 Healthy'}`
              },
              {
                type: 'mrkdwn',
                text: `*Last Ping:*\n${monitor.lastPingAt ? new Date(monitor.lastPingAt).toLocaleString() : 'Never'}`
              },
              {
                type: 'mrkdwn',
                text: `*Expected Interval:*\nEvery ${formatInterval(monitor.intervalSeconds)}`
              }
            ]
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'View Monitor'
                },
                url: monitorUrl
              }
            ]
          }
        ]
      })
    })
    
    console.log(`💬 Slack webhook sent for ${monitor.name} (${alertType})`)
  } catch (error) {
    console.error('Failed to send Slack webhook:', error)
    throw error
  }
}

// Send Teams webhook
export async function sendTeamsWebhook(
  webhookUrl: string,
  monitor: Monitor,
  alertType: AlertType
) {
  const isDown = alertType === 'DOWN'
  const monitorUrl = `${appUrl}/dashboard/monitors/${monitor.id}`
  
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "@type": "MessageCard",
        "@context": "https://schema.org/extensions",
        "summary": isDown 
          ? `Monitor Down: ${monitor.name}`
          : `Monitor Recovered: ${monitor.name}`,
        "themeColor": isDown ? "DC2626" : "16A34A", // Red or Green
        "title": isDown ? "🚨 Monitor Down" : "✅ Monitor Recovered",
        "sections": [
          {
            "activityTitle": monitor.name,
            "facts": [
              {
                "name": "Status:",
                "value": isDown ? "🔴 Down" : "🟢 Healthy"
              },
              {
                "name": "Last Ping:",
                "value": monitor.lastPingAt 
                  ? new Date(monitor.lastPingAt).toLocaleString() 
                  : "Never"
              },
              {
                "name": "Expected Interval:",
                "value": `Every ${formatInterval(monitor.intervalSeconds)}`
              }
            ],
            "text": isDown
              ? "Your monitor has not received a ping within the expected interval and grace period."
              : "Your monitor has received a ping and is now back online."
          }
        ],
        "potentialAction": [
          {
            "@type": "OpenUri",
            "name": "View Monitor Details",
            "targets": [
              {
                "os": "default",
                "uri": monitorUrl
              }
            ]
          }
        ]
      })
    })
    
    console.log(`📢 Teams webhook sent for ${monitor.name} (${alertType})`)
  } catch (error) {
    console.error('Failed to send Teams webhook:', error)
    throw error
  }
}

function formatInterval(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}
