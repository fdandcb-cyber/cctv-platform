const { PrismaClient } = require('@prisma/client');

const DATABASE_URL = 'postgresql://postgres.debbzwyfvlkpsiozfbli:2lj9wOTytwVSYpvf@aws-1-ap-south-1.pooler.supabase.com:5432/postgres';

const prisma = new PrismaClient({
  datasources: { db: { url: DATABASE_URL } }
});

async function seed() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'connectzsalesandservices@gmail.com' },
    update: {},
    create: {
      email: 'connectzsalesandservices@gmail.com',
      name: 'ConnectZ Admin',
      password: 'CCTV@Admin2024!Secure',
      role: 'admin'
    }
  });
  console.log('✅ Admin user created:', admin.email);

  // Verify tables
  const tables = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;
  console.log('✅ Tables in Supabase:', tables.map(t => t.tablename));

  await prisma.$disconnect();
  console.log('✅ Done!');
}

seed().catch(e => { console.error('❌ Error:', e.message); process.exit(1); });