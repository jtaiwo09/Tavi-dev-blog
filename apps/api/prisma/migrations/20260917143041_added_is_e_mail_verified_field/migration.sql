/*
  Warnings:

  - You are about to drop the column `isEmailVerified` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "isEmailVerified";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;
