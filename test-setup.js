const postgres = require('postgres')
const bcrypt = require('bcryptjs')
const { randomBytes } = require('crypto')

const sql = postgres(process.env.DATABASE_URL)

async function main() {
  console.log('🚀 Setting up test user and monitor...\n')

  // Create test user
  const email = 'test@example.com'
  const password = 'password123'
  const passwordHash = await bcrypt.hash(password, 10)

  let [user] = await sql`SELECT * FROM "User" WHERE email = ${email}`
  
  if (!user) {
    [user] = await sql`
      INSERT INTO "User" (email, "passwordHash", plan, "createdAt", "updatedAt")
      VALUES (${email}, ${passwordHash}, 'FREE', NOW(), NOW())
      RETURNING *
    `
    console.log('✅ Test user created:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}\n`)
  } else {
    console.log('ℹ️  Test user already exists\n')
  }

  // Create test monitor
  const pingUrl = randomBytes(16).toString('hex')
  
  const [monitor] = await sql`
    INSERT INTO "Monitor" (
      "userId",
      name,
      "intervalSeconds",
      "gracePeriodSeconds",
      status,
      "pingUrl",
      "createdAt",
      "updatedAt"
    ) VALUES (
      ${user.id},
      'Test Cron Job',
      60,
      30,
      'HEALTHY',
      ${pingUrl},
      NOW(),
      NOW()
    )
    RETURNING *
  `

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
    await sql.end()
  })
