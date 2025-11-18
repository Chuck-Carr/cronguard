import postgres from 'postgres'

// Create database connection
const sql = postgres(process.env.DATABASE_URL!, {
  max: 10, // Maximum number of connections
  idle_timeout: 20,
  connect_timeout: 10,
})

export { sql }
