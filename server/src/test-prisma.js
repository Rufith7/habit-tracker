const prisma = require("./lib/prisma");

async function main() {
  const userCount = await prisma.user.count();

  console.log("✅ Prisma connected");
  console.log("Users:", userCount);
}

main()
  .catch((error) => {
    console.error("❌ Prisma connection failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });