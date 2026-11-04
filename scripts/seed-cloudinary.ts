import "dotenv/config";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";
import cloudinary from "../src/lib/cloudinary";

const imageRoot = path.join(process.cwd(), "public", "destinations");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const cloudinaryRoot = "drishya/destinations";
// Without this flag, photos already recorded in the database are skipped, so
// adding a district only uploads its new folders.
const overwrite = process.argv.includes("--overwrite");

function requireEnvironment(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function getDirectories(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

async function main() {
  requireEnvironment("CLOUDINARY_CLOUD_NAME");
  requireEnvironment("CLOUDINARY_API_KEY");
  requireEnvironment("CLOUDINARY_API_SECRET");

  const connectionString =
    process.env.DIRECT_URL ??
    process.env.DATABASE_URL ??
    (() => {
      throw new Error(
        "Missing required environment variable: DIRECT_URL or DATABASE_URL",
      );
    })();
  const prisma = new PrismaClient({
    adapter: new PrismaNeon({ connectionString }),
  });

  try {
    const destinations = await prisma.destination.findMany({
      select: { id: true, districtId: true, slug: true },
    });
    const existingImages = await prisma.destinationImage.findMany({
      select: { publicId: true },
    });
    const uploadedPublicIds = new Set(existingImages.map((image) => image.publicId));

    const destinationByKey = new Map(
      destinations.map((destination) => [
        `${destination.districtId}/${destination.slug}`,
        destination,
      ]),
    );

    const districtDirectories = await getDirectories(imageRoot);
    let uploadedCount = 0;
    let skippedCount = 0;

    for (const districtDirectory of districtDirectories) {
      const districtId = districtDirectory.toLowerCase();
      const destinationDirectories = await getDirectories(
        path.join(imageRoot, districtDirectory),
      );

      for (const slug of destinationDirectories) {
        const key = `${districtId}/${slug}`;
        const destination = destinationByKey.get(key);
        if (!destination) {
          throw new Error(
            `No Neon destination matches folder "${districtDirectory}/${slug}"`,
          );
        }

        const destinationPath = path.join(
          imageRoot,
          districtDirectory,
          slug,
        );
        const files = (await readdir(destinationPath, { withFileTypes: true }))
          .filter(
            (entry) =>
              entry.isFile() &&
              supportedExtensions.has(path.extname(entry.name).toLowerCase()),
          )
          .map((entry) => entry.name)
          .sort((a, b) => a.localeCompare(b));

        if (files.length === 0) {
          throw new Error(`No supported images found in "${destinationPath}"`);
        }

        const publicIds = new Set<string>();
        for (const [sortOrder, filename] of files.entries()) {
          const extension = path.extname(filename).toLowerCase();
          const basename = path.basename(filename, extension);
          const publicId = `${cloudinaryRoot}/${districtId}/${slug}/${basename}`;

          if (publicIds.has(publicId)) {
            throw new Error(
              `Duplicate image name ignoring extension in "${destinationPath}": ${filename}`,
            );
          }
          publicIds.add(publicId);

          if (!overwrite && uploadedPublicIds.has(publicId)) {
            skippedCount += 1;
            continue;
          }

          const uploaded = await cloudinary.uploader.upload(
            path.join(destinationPath, filename),
            {
              public_id: publicId,
              overwrite: true,
              unique_filename: false,
              resource_type: "image",
            },
          );

          await prisma.destinationImage.upsert({
            where: { publicId: uploaded.public_id },
            create: {
              destinationId: destination.id,
              publicId: uploaded.public_id,
              secureUrl: uploaded.secure_url,
              originalFilename: filename,
              sortOrder,
              isCover: sortOrder === 0,
            },
            update: {
              destinationId: destination.id,
              secureUrl: uploaded.secure_url,
              originalFilename: filename,
              sortOrder,
              isCover: sortOrder === 0,
            },
          });

          uploadedCount += 1;
          console.log(`Uploaded ${districtId}/${slug}/${filename}`);
        }
      }
    }

    console.log(
      `Cloudinary image seed complete: ${uploadedCount} uploaded, ${skippedCount} already uploaded and skipped`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
