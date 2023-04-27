/*
  Warnings:

  - Made the column `uid` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "uid" SET NOT NULL;
