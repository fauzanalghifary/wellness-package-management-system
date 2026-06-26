import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedPackages = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Deep Tissue Massage',
    description: 'A focused massage session for muscle tension and recovery.',
    priceCents: 7500,
    durationMinutes: 60
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Guided Meditation Session',
    description: 'A calming session built around breathwork and guided focus.',
    priceCents: 3500,
    durationMinutes: 30
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    name: 'Nutrition Consultation',
    description:
      'A practical consultation for meal planning and nutrition habits.',
    priceCents: 6000,
    durationMinutes: 45
  }
];

async function main(): Promise<void> {
  for (const wellnessPackage of seedPackages) {
    await prisma.wellnessPackage.upsert({
      where: { id: wellnessPackage.id },
      create: wellnessPackage,
      update: {
        ...wellnessPackage,
        deletedAt: null
      }
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
