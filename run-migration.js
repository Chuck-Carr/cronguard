import postgres from 'postgres'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const sql = postgres(process.env.DATABASE_URL)

async function runMigration() {
  try {
    const migrationSQL = readFileSync(join(__dirname, 'add-pause-and-tags.sql'), 'utf8')
    
    console.log('Running migration...')
    await sql.unsafe(migrationSQL)
    console.log('✅ Migration completed successfully')
    
    await sql.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    await sql.end()
    process.exit(1)
  }
}

runMigration()
