import prisma from './src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@motomart.com' },
    update: { password: hash, role: 'ADMIN' },
    create: {
      name: 'Admin MotoMart',
      email: 'admin@motomart.com',
      password: hash,
      role: 'ADMIN',
      phone: '081234567890'
    }
  });
  console.log('Admin user created successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
