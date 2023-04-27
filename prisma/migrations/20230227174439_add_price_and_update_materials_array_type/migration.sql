/*
  Warnings:

  - The `materials` column on the `Products` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 100,
DROP COLUMN "materials",
ADD COLUMN     "materials" TEXT[];
