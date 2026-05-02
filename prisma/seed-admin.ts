import { PrismaClient } from "@prisma/client/index";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_POOL_URL || "postgresql://postgres.awspyoqeurfwhhxgmspk:faizganteng01@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true",
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding admin account...");

  const adminPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@motomart.com" },
    update: {
      password: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
    create: {
      name: "Admin MotoMart",
      email: "admin@motomart.com",
      password: adminPassword,
      phone: "081234567890",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log(`✅ Admin berhasil dibuat/diperbarui!`);
  console.log(`   📧 Email: ${admin.email}`);
  console.log(`   🔑 Password: admin123`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
