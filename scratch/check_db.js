const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany();
  console.log("Projects in Database:");
  projects.forEach(p => {
    console.log(`- ID: ${p.id}, Title: "${p.title}", Slug: "${p.slug}", Image: "${p.image}"`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
