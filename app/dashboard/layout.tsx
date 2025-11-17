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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <DashboardNav user={{ email: session.user.email!, plan: session.user.plan! }} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
