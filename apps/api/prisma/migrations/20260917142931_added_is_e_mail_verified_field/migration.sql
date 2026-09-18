/*
  Warnings:

  - You are about to drop the column `published` on the `Post` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Post_published_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "published",
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;
