const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Mapping local BMP images from /public/projects to active projects...");

  // Project mappings
  const mappings = [
    {
      slug: "chitropot-workshop",
      cover: "/projects/image_001.bmp",
      gallery: [
        "/projects/image_002.bmp",
        "/projects/image_003.bmp",
        "/projects/image_004.bmp",
        "/projects/image_005.bmp",
        "/projects/image_006.bmp"
      ],
      blocks: [
        { id: "txt-1", type: "text", content: "### Creative Strategy & Brand Architecture\nServing as the visual strategy lead for the Fine Arts Admission Workshop." },
        { id: "img-1", type: "image", urls: ["/projects/image_002.bmp", "/projects/image_003.bmp"], gridColumns: 2 },
        { id: "img-2", type: "image", urls: ["/projects/image_004.bmp"], gridColumns: 1 },
        { id: "txt-2", type: "text", content: "### Visual Systems\nWe curated custom watercolor assets and organic textures inspired by fine arts heritages." },
        { id: "img-3", type: "image", urls: ["/projects/image_005.bmp", "/projects/image_006.bmp"], gridColumns: 2 }
      ]
    },
    {
      slug: "gallery-hamiduzzaman",
      cover: "/projects/image_015.bmp",
      gallery: [
        "/projects/image_016.bmp",
        "/projects/image_017.bmp",
        "/projects/image_018.bmp",
        "/projects/image_019.bmp",
        "/projects/image_020.bmp"
      ],
      blocks: [
        { id: "txt-1", type: "text", content: "### Curator Showcase\nManaging and designing catalogs, brochures, and visual representations for prestigious fine arts exhibitions." },
        { id: "img-1", type: "image", urls: ["/projects/image_016.bmp", "/projects/image_017.bmp"], gridColumns: 2 },
        { id: "img-2", type: "image", urls: ["/projects/image_018.bmp"], gridColumns: 1 },
        { id: "img-3", type: "image", urls: ["/projects/image_019.bmp", "/projects/image_020.bmp"], gridColumns: 2 }
      ]
    },
    {
      slug: "charukola-animation-festival",
      cover: "/projects/image_031.bmp",
      gallery: [
        "/projects/image_032.bmp",
        "/projects/image_033.bmp",
        "/projects/image_034.bmp",
        "/projects/image_035.bmp"
      ],
      blocks: [
        { id: "txt-1", type: "text", content: "### Visual identity & Motion Suite\nCrafting festival graphics and title layouts for animations." },
        { id: "img-1", type: "image", urls: ["/projects/image_032.bmp", "/projects/image_033.bmp"], gridColumns: 2 },
        { id: "img-2", type: "image", urls: ["/projects/image_034.bmp", "/projects/image_035.bmp"], gridColumns: 2 }
      ]
    },
    {
      slug: "woven-heritage-shital-pati",
      cover: "/projects/image_045.bmp",
      gallery: [
        "/projects/image_046.bmp",
        "/projects/image_047.bmp",
        "/projects/image_048.bmp",
        "/projects/image_049.bmp"
      ],
      blocks: [
        { id: "txt-1", type: "text", content: "### Exploring Weaving Geometries\nTranslating artisanal craft into modern digital vectors." },
        { id: "img-1", type: "image", urls: ["/projects/image_046.bmp", "/projects/image_047.bmp"], gridColumns: 2 },
        { id: "img-2", type: "image", urls: ["/projects/image_048.bmp", "/projects/image_049.bmp"], gridColumns: 2 }
      ]
    },
    {
      slug: "jhumur-biva-animation",
      cover: "/projects/image_064.bmp",
      gallery: [
        "/projects/image_065.bmp",
        "/projects/image_066.bmp",
        "/projects/image_067.bmp",
        "/projects/image_068.bmp"
      ],
      blocks: [
        { id: "txt-1", type: "text", content: "### Expressive Broadcast Character Design\nStoryboards, frames, and background designs for children series." },
        { id: "img-1", type: "image", urls: ["/projects/image_065.bmp", "/projects/image_066.bmp"], gridColumns: 2 },
        { id: "img-2", type: "image", urls: ["/projects/image_067.bmp", "/projects/image_068.bmp"], gridColumns: 2 }
      ]
    },
    {
      slug: "dikkha-e-learning",
      cover: "/projects/image_098.bmp",
      gallery: [
        "/projects/image_099.bmp",
        "/projects/image_100.bmp",
        "/projects/image_101.bmp",
        "/projects/image_102.bmp"
      ],
      blocks: [
        { id: "txt-1", type: "text", content: "### SNappy Transitions & Educational Diagrams\nExplanatory animations for over 30 interactive modules." },
        { id: "img-1", type: "image", urls: ["/projects/image_099.bmp", "/projects/image_100.bmp"], gridColumns: 2 },
        { id: "img-2", type: "image", urls: ["/projects/image_101.bmp", "/projects/image_102.bmp"], gridColumns: 2 }
      ]
    },
    {
      slug: "zainul-mela-poster",
      cover: "/projects/image_126.bmp",
      gallery: [
        "/projects/image_127.bmp",
        "/projects/image_128.bmp",
        "/projects/image_129.bmp",
        "/projects/image_130.bmp"
      ],
      blocks: [
        { id: "txt-1", type: "text", content: "### Zainul Mela 2024 Visual Systems\nVisual systems and hand-drawn folk illustrations." },
        { id: "img-1", type: "image", urls: ["/projects/image_127.bmp", "/projects/image_128.bmp"], gridColumns: 2 },
        { id: "img-2", type: "image", urls: ["/projects/image_129.bmp", "/projects/image_130.bmp"], gridColumns: 2 }
      ]
    },
    {
      slug: "brand",
      cover: "/projects/image_145.bmp",
      gallery: [
        "/projects/image_146.bmp",
        "/projects/image_147.bmp",
        "/projects/image_148.bmp",
        "/projects/image_149.bmp"
      ],
      blocks: [
        { id: "txt-1", type: "text", content: "### Creative Brand Identites\nDeveloping pristine minimal systems." },
        { id: "img-1", type: "image", urls: ["/projects/image_146.bmp", "/projects/image_147.bmp"], gridColumns: 2 },
        { id: "img-2", type: "image", urls: ["/projects/image_148.bmp", "/projects/image_149.bmp"], gridColumns: 2 }
      ]
    }
  ];

  for (const map of mappings) {
    try {
      const updated = await prisma.project.update({
        where: { slug: map.slug },
        data: {
          image: map.cover,
          gallery: map.gallery,
          blocks: map.blocks
        }
      });
      console.log(`Successfully updated project: "${updated.title}" with local BMP assets.`);
    } catch (err) {
      console.error(`Failed to update project for slug: "${map.slug}". It may not exist in the database.`, err.message);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
