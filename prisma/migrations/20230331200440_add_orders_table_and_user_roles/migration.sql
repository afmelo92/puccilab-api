/*
  Warnings:

  - Made the column `category` on table `Products` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Products" ALTER COLUMN "category" SET NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Orders" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "user_id" TEXT,
    "patient_name" TEXT,
    "patient_age" INTEGER,
    "patient_phone" TEXT,
    "patient_sex" TEXT,
    "product_id" TEXT,
    "deadline" TEXT NOT NULL,
    "deadline_period" TEXT NOT NULL,
    "final_status" BOOLEAN NOT NULL,
    "prepare_color" TEXT NOT NULL,
    "final_color" TEXT NOT NULL,
    "gum_color" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "odgm" TEXT[],
    "map_a" TEXT[],
    "map_b" TEXT[],
    "antagonista" INTEGER NOT NULL,
    "componentes" INTEGER NOT NULL,
    "modelo_estudo" INTEGER NOT NULL,
    "modelo_trabalho" INTEGER NOT NULL,
    "moldeira" INTEGER NOT NULL,
    "relacionamento_oclusao" INTEGER NOT NULL,
    "outros" INTEGER NOT NULL,
    "aditional_info" TEXT,
    "files" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Patients" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Orders_uid_key" ON "Orders"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Patients_uid_key" ON "Patients"("uid");

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
