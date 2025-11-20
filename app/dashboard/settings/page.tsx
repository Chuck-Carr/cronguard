import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { User } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PasswordChangeForm } from '@/components/settings/password-change-form'
import { SubscriptionCard } from '@/components/settings/subscription-card'
import { formatDate } from '@/lib/date-utils'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const [user] = await sql<(User & { monitorCount: number })[]>`
    SELECT u.*, COUNT(m.id)::int as "monitorCount"
    FROM "User" u
    LEFT JOIN "Monitor" m ON m."userId" = u.id
    WHERE u.id = ${session.user.id}
    GROUP BY u.id
  `

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Account Settings
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Manage your account details and subscription
        </p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details and usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Email</div>
              <div className="text-base text-zinc-900 dark:text-white mt-1">{user.email}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Current Plan</div>
              <div className="text-base font-semibold text-zinc-900 dark:text-white mt-1">
                <span className={`
                  px-2 py-1 rounded text-sm
                  ${user.plan === 'FREE' ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300' : ''}
                  ${user.plan === 'STARTER' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                  ${user.plan === 'PRO' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                  ${user.plan === 'ENTERPRISE' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                `}>
                  {user.plan}
                </span>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Monitors</div>
              <div className="text-base text-zinc-900 dark:text-white mt-1">{user.monitorCount}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Member Since</div>
              <div className="text-base text-zinc-900 dark:text-white mt-1">{formatDate(user.createdAt)} ET</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm />
        </CardContent>
      </Card>

      {/* Subscription Management */}
      <SubscriptionCard currentPlan={user.plan} stripeCustomerId={user.stripeCustomerId} />
    </div>
  )
}
