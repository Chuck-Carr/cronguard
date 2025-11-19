import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { DashboardNav } from '@/components/dashboard/nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardNav user={{ email: session.user.email!, plan: session.user.plan! }} />
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="max-w-7xl mx-auto px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
