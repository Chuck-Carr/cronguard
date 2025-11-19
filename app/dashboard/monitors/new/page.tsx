import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { User } from '@/lib/types'
import { redirect } from 'next/navigation'
import NewMonitorForm from './form'

export default async function NewMonitorPageWrapper() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const [user] = await sql<User[]>`
    SELECT * FROM "User" WHERE id = ${session.user.id}
  `

  if (!user) {
    redirect('/login')
  }

  return <NewMonitorForm userPlan={user.plan} />
}
