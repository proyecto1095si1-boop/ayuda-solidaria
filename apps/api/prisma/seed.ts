import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Settings
  await prisma.platformSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      platformFeePercent: 12,
      processorFeePercent: 6.4,
      minDonationAmount: 500,
    },
  });

  // Admin user
  const passwordHash = await bcrypt.hash('Admin123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ayudasolidaria.com.ar' },
    update: {},
    create: {
      email: 'admin@ayudasolidaria.com.ar',
      passwordHash,
      fullName: 'Administrador Principal',
      role: Role.ADMIN,
      emailVerified: true,
      isActive: true,
    },
  });

  console.log('✅ Admin creado:', admin.email);
  console.log('   Password: Admin123!');
  console.log('✅ Settings de comisiones creados (12% + 6.4%)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
