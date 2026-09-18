-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "readingTimeMinutes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "wordCount" INTEGER NOT NULL DEFAULT 0;
