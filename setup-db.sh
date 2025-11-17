#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

echo "🚀 CronGuard Database Setup"
echo ""

# Check if DATABASE_URL is set
if grep -q "postgresql://user:password@host:5432/database" .env; then
    echo "❌ Please update DATABASE_URL in .env file first!"
    echo ""
    echo "Get a free database from Supabase:"
    echo "1. Go to https://supabase.com"
    echo "2. Create a new project"
    echo "3. Copy the connection string from Project Settings > Database"
    echo "4. Update DATABASE_URL in .env"
    exit 1
fi

# Check if NEXTAUTH_SECRET is set
if grep -q "generate-with-openssl-rand-base64-32" .env; then
    echo "⚠️  Generating NEXTAUTH_SECRET..."
    SECRET=$(openssl rand -base64 32)
    # Update .env file with generated secret
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|NEXTAUTH_SECRET=\"generate-with-openssl-rand-base64-32\"|NEXTAUTH_SECRET=\"$SECRET\"|" .env
    else
        sed -i "s|NEXTAUTH_SECRET=\"generate-with-openssl-rand-base64-32\"|NEXTAUTH_SECRET=\"$SECRET\"|" .env
    fi
    echo "✅ NEXTAUTH_SECRET generated"
fi

echo ""
echo "📦 Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

echo ""
echo "🗄️  Running database migrations..."
npx prisma migrate dev --name init

if [ $? -ne 0 ]; then
    echo "❌ Failed to run migrations"
    exit 1
fi

echo ""
echo "✅ Database setup complete!"
echo ""
echo "🎉 You can now run: npm run dev"
echo ""
echo "Optional: Open Prisma Studio to view your database:"
echo "  npx prisma studio"
