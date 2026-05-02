import { PrismaClient } from "@prisma/client/index";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "faiz_motor",
  port: Number(process.env.DB_PORT) || 3306,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.savedMotor.deleteMany();
  await prisma.review.deleteMany();
  await prisma.motorPhoto.deleteMany();
  await prisma.motor.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      name: "Admin MotoMart",
      email: "admin@motomart.com",
      password: adminPassword,
      phone: "081234567890",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create dummy user
  const userPassword = await bcrypt.hash("user123", 12);
  const user = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "budi@example.com",
      password: userPassword,
      phone: "081298765432",
      role: "USER",
      status: "ACTIVE",
    },
  });
  console.log(`✅ User created: ${user.email}`);

  // Create 5 sample motors
  const motorsData = [
    {
      name: "Honda Beat Street 2024",
      brand: "Honda",
      year: 2024,
      color: "Hitam",
      condition: "BARU" as const,
      price: 18500000,
      description:
        "Honda Beat Street terbaru dengan desain sporty dan fitur lengkap. Mesin 110cc eSP+ yang irit bahan bakar dengan Smart Key System.",
      status: "TERSEDIA" as const,
      viewCount: 150,
    },
    {
      name: "Yamaha NMAX 155 Connected",
      brand: "Yamaha",
      year: 2024,
      color: "Biru",
      condition: "BARU" as const,
      price: 32000000,
      description:
        "Yamaha NMAX 155 Connected terbaru dengan fitur Y-Connect, ABS, dan Traction Control. Skutik premium dengan performa dan kenyamanan terbaik.",
      status: "TERSEDIA" as const,
      viewCount: 320,
    },
    {
      name: "Kawasaki Ninja 250 ABS SE",
      brand: "Kawasaki",
      year: 2023,
      color: "Hijau",
      condition: "BEKAS" as const,
      price: 45000000,
      description:
        "Kawasaki Ninja 250 ABS Special Edition. Kondisi mulus, KM rendah (5000 km), full original. Pajak hidup sampai 2025.",
      status: "TERSEDIA" as const,
      viewCount: 480,
    },
    {
      name: "Honda Vario 160 CBS",
      brand: "Honda",
      year: 2023,
      color: "Merah",
      condition: "BEKAS" as const,
      price: 22000000,
      description:
        "Honda Vario 160 CBS kondisi terawat. Servis rutin di AHASS, ban baru, body mulus tanpa lecet. Surat-surat lengkap.",
      status: "DIPESAN" as const,
      viewCount: 200,
    },
    {
      name: "Suzuki GSX-R150",
      brand: "Suzuki",
      year: 2022,
      color: "Putih Biru",
      condition: "BEKAS" as const,
      price: 25000000,
      description:
        "Suzuki GSX-R150 sport fairing. Performa mesin DOHC 150cc yang bertenaga. Sudah modif ringan: slip-on exhaust, rear set, windshield racing.",
      status: "TERJUAL" as const,
      viewCount: 560,
    },
  ];

  const motors = [];
  for (const motorData of motorsData) {
    const motor = await prisma.motor.create({
      data: motorData,
    });
    motors.push(motor);
    console.log(`✅ Motor created: ${motor.name}`);
  }

  // Create sample reviews
  const reviewsData = [
    {
      userId: user.id,
      motorId: motors[0].id,
      rating: 5,
      comment:
        "Motor yang sangat bagus! Desainnya keren dan sangat irit bahan bakar. Recommended banget!",
      status: "APPROVED" as const,
    },
    {
      userId: user.id,
      motorId: motors[1].id,
      rating: 4,
      comment:
        "NMAX memang premium, fitur Y-Connect sangat membantu. Minus hanya di harga yang cukup tinggi.",
      status: "APPROVED" as const,
    },
    {
      userId: user.id,
      motorId: motors[2].id,
      rating: 5,
      comment:
        "Ninja 250 idaman! Kondisi bekas tapi masih seperti baru. Penjual sangat kooperatif.",
      status: "PENDING" as const,
    },
  ];

  for (const reviewData of reviewsData) {
    const review = await prisma.review.create({
      data: reviewData,
    });
    console.log(
      `✅ Review created for motor ${review.motorId} (${review.status})`
    );
  }

  // Create saved motor
  await prisma.savedMotor.create({
    data: {
      userId: user.id,
      motorId: motors[1].id,
    },
  });
  console.log(`✅ Saved motor created for user ${user.name}`);

  console.log("\n🎉 Seeding completed!");
  console.log(`   📧 Admin login: admin@motomart.com / admin123`);
  console.log(`   📧 User login:  budi@example.com / user123`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
