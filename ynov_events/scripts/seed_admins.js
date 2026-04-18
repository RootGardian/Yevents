const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const password = 'Ynov@admin@2024';
  const hashedPassword = await bcrypt.hash(password, 12);

  const admins = [
    { name: 'Ahmed Bangoura', email: 'ahmedbangoura@yevents.ma', isSuperAdmin: true },
    { name: 'Daphne Bouyedi', email: 'daphneebouyedi@yevents.ma', isSuperAdmin: false }
  ];

  console.log('--- Starting Admin Seeding ---');

  for (const adminData of admins) {
    const user = await prisma.admin.upsert({
      where: { email: adminData.email },
      update: {
        name: adminData.name,
        password: hashedPassword,
        isSuperAdmin: adminData.isSuperAdmin
      },
      create: {
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        isSuperAdmin: adminData.isSuperAdmin
      }
    });
    console.log(`[SEED] Admin created/updated: ${user.email}`);
  }

  console.log('--- Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
