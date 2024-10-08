/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// initialize the Prisma Client
const prisma = new PrismaClient();
const roundsOfHashing = 10;

async function main() {
  // create two dummy users
  const pass_mesum = await bcrypt.hash('mesum', roundsOfHashing);

  const user1 = await prisma.user.upsert({
    where: { username: 'mesum@gmail.com' },
    update: {
      password: pass_mesum,
      name: 'Muhammad Mesum',
      image: 'test.png',
      role: 'Admin',
    },
    create: {
      username: 'mesum@gmail.com',
      password: pass_mesum,
      name: 'Muhammad Mesum',
      image: 'test.png',
      role: 'Admin',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { username: 'curator@gmail.com' },
    update: {
      password: pass_mesum,
      name: 'Mesum Curator',
      image: 'test.png',
      role: 'Curator',
    },
    create: {
      username: 'curator@gmail.com',
      password: pass_mesum,
      name: 'Mesum Curator',
      image: 'test.png',
      role: 'Curator',
    },
  });

  const board1 = await prisma.board.upsert({
    where: { board_id: 'cmb1' },
    update: {
      board_name: 'Cambridge',
    },
    create: {
      board_id: 'cmb1',
      board_name: 'Cambridge',
    },
  });

  const board2 = await prisma.board.upsert({
    where: { board_id: 'gce1' },
    update: {
      board_name: 'GCE',
    },
    create: {
      board_id: 'gce1',
      board_name: 'GCE',
    },
  });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close the Prisma Client at the end
    await prisma.$disconnect();
  });
