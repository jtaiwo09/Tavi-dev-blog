/*
  Warnings:

  - Added the required column `categoryId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "excerpt" TEXT,
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "slug" SET NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- CreateIndex
CREATE INDEX "Post_categoryId_idx" ON "Post"("categoryId");

-- CreateIndex
CREATE INDEX "Post_published_idx" ON "Post"("published");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
