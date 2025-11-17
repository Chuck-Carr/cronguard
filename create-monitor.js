const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const email = 'chuck.carr4@yahoo.com'
  
  const user = await prisma.user.findUnique({ where: { email } })
  
  if (!user) {
    console.error('❌ User not found:', email)
    process.exit(1)
  }

  const monitor = await prisma.monitor.create({
    data: {
      userId: user.id,
      name: 'Test Cron Job',
      intervalSeconds: 60, // Check every minute
      gracePeriodSeconds: 30, // 30 second grace period
      status: 'HEALTHY',
    },
  })

  console.log('✅ Monitor created for', email)
  console.log(`   Name: ${monitor.name}`)
  console.log(`   Ping URL: http://localhost:3000/api/ping/${monitor.pingUrl}`)
  console.log(`   Interval: ${monitor.intervalSeconds}s`)
  console.log(`   Grace Period: ${monitor.gracePeriodSeconds}s\n`)
  console.log('📝 Test it:')
  console.log(`   curl http://localhost:3000/api/ping/${monitor.pingUrl}`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
