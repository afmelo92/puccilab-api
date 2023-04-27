/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "uid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Users_uid_key" ON "Users"("uid");
