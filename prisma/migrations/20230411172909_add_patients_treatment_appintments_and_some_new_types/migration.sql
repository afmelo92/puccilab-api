/*
  Warnings:

  - Added the required column `address` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anesthesia_reaction_description` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `another_info_description` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth_date` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blood_pressure_description` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cellphone` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `civ_status` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctor_id` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exp_org` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `has_alergy_description` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heart_problems_description` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medical_treatment_description` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profession` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rg` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taking_medicine_description` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `sex` on the `Patients` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "Maybe" AS ENUM ('YES', 'NO', 'MAYBE');

-- CreateEnum
CREATE TYPE "BloodPressureOps" AS ENUM ('NORMAL', 'HIGH', 'LOW', 'CONTROLLED');

-- CreateEnum
CREATE TYPE "BleedingOps" AS ENUM ('NORMAL', 'EXCESSIVE');

-- CreateEnum
CREATE TYPE "HealingOps" AS ENUM ('NORMAL', 'SLOW');

-- CreateEnum
CREATE TYPE "GumBleedingOps" AS ENUM ('YES', 'NO', 'HYGIENE', 'SOMETIMES');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'DOCTOR';
ALTER TYPE "Role" ADD VALUE 'PATIENT';
ALTER TYPE "Role" ADD VALUE 'LAB';

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "patient_id" TEXT;

-- AlterTable
ALTER TABLE "Patients" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "alcohol" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "anesthesia_reaction" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "anesthesia_reaction_description" TEXT NOT NULL,
ADD COLUMN     "another_info" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "another_info_description" TEXT NOT NULL,
ADD COLUMN     "birth_date" TEXT NOT NULL,
ADD COLUMN     "bleeding" "BleedingOps" NOT NULL DEFAULT 'NORMAL',
ADD COLUMN     "blood_pressure" "BloodPressureOps" NOT NULL DEFAULT 'NORMAL',
ADD COLUMN     "blood_pressure_description" TEXT NOT NULL,
ADD COLUMN     "breathing_problems" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "bruxism" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cellphone" TEXT NOT NULL,
ADD COLUMN     "civ_status" TEXT NOT NULL,
ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "doctor_id" TEXT NOT NULL,
ADD COLUMN     "ear_pain" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "exp_org" TEXT NOT NULL,
ADD COLUMN     "gastric_problems" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gum_bleeding" "GumBleedingOps" NOT NULL DEFAULT 'NO',
ADD COLUMN     "has_alergy" "Maybe" NOT NULL DEFAULT 'NO',
ADD COLUMN     "has_alergy_description" TEXT NOT NULL,
ADD COLUMN     "has_diabetes" "Maybe" NOT NULL DEFAULT 'NO',
ADD COLUMN     "healing" "HealingOps" NOT NULL DEFAULT 'NORMAL',
ADD COLUMN     "heart_problems" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "heart_problems_description" TEXT NOT NULL,
ADD COLUMN     "hepatitis" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hiv" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "joint_problems" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "medical_treatment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "medical_treatment_description" TEXT NOT NULL,
ADD COLUMN     "mouth_pain" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pregnant_breastfeeding" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profession" TEXT NOT NULL,
ADD COLUMN     "rg" TEXT NOT NULL,
ADD COLUMN     "rheumatic_fever" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "smoke" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "taking_medicine" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "taking_medicine_description" TEXT NOT NULL,
ADD COLUMN     "teeth_gum_pain" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "sex",
ADD COLUMN     "sex" "Sex" NOT NULL;

-- CreateTable
CREATE TABLE "Appointments" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "treatment_id" TEXT NOT NULL,
    "initial_time" TIMESTAMP(3) NOT NULL,
    "finish_time" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Treatments" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "initial_time" TIMESTAMP(3) NOT NULL,
    "finish_time" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Treatments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Services" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AppointmentsToServices" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Appointments_uid_key" ON "Appointments"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Treatments_uid_key" ON "Treatments"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Services_uid_key" ON "Services"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "_AppointmentsToServices_AB_unique" ON "_AppointmentsToServices"("A", "B");

-- CreateIndex
CREATE INDEX "_AppointmentsToServices_B_index" ON "_AppointmentsToServices"("B");

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patients"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patients" ADD CONSTRAINT "Patients_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patients"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_treatment_id_fkey" FOREIGN KEY ("treatment_id") REFERENCES "Treatments"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatments" ADD CONSTRAINT "Treatments_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatments" ADD CONSTRAINT "Treatments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patients"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppointmentsToServices" ADD CONSTRAINT "_AppointmentsToServices_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppointmentsToServices" ADD CONSTRAINT "_AppointmentsToServices_B_fkey" FOREIGN KEY ("B") REFERENCES "Services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
