const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up test user and monitor...\n')

  // Create test user
  const email = 'test@example.com'
  const password = 'password123'
  const passwordHash = await bcrypt.hash(password, 10)

  let user = await prisma.user.findUnique({ where: { email } })
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        plan: 'FREE',
      },
    })
    console.log('✅ Test user created:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}\n`)
  } else {
    console.log('ℹ️  Test user already exists\n')
  }

  // Create test monitor
  const monitor = await prisma.monitor.create({
    data: {
      userId: user.id,
      name: 'Test Cron Job',
      intervalSeconds: 60, // Check every minute
      gracePeriodSeconds: 30, // 30 second grace period
      status: 'HEALTHY',
    },
  })

  console.log('✅ Test monitor created:')
  console.log(`   Name: ${monitor.name}`)
  console.log(`   Ping URL: http://localhost:3000/api/ping/${monitor.pingUrl}`)
  console.log(`   Interval: ${monitor.intervalSeconds}s`)
  console.log(`   Grace Period: ${monitor.gracePeriodSeconds}s\n`)

  console.log('📝 Test the ping endpoint:')
  console.log(`   curl http://localhost:3000/api/ping/${monitor.pingUrl}\n`)

  console.log('🔐 Login credentials:')
  console.log(`   Email: ${email}`)
  console.log(`   Password: ${password}`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
