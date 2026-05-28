import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  const projectsPath = path.join(process.cwd(), 'src', 'data', 'projects.json')
  if (fs.existsSync(projectsPath)) {
    const data = JSON.parse(fs.readFileSync(projectsPath, 'utf8'))
    for (const p of data) {
      await prisma.project.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          titleKey: p.titleKey,
          categoryKey: p.categoryKey,
          title: p.title,
          slug: p.slug,
          image: p.image,
          size: p.size,
          year: String(p.year),
          catId: p.catId,
          client: p.client,
          duration: p.duration,
          role: p.role,
          liveLink: p.liveLink,
          overview: p.overview,
          challenge: p.challenge,
          solution: p.solution,
          results: p.results,
          gallery: p.gallery
        }
      })
    }
    console.log('Projects seeded!')
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
