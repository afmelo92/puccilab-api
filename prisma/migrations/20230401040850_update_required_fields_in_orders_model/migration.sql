/*
  Warnings:

  - Made the column `user_id` on table `Orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `patient_name` on table `Orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `patient_age` on table `Orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `patient_phone` on table `Orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `patient_sex` on table `Orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `Orders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_product_id_fkey";

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_user_id_fkey";

-- AlterTable
ALTER TABLE "Orders" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "patient_name" SET NOT NULL,
ALTER COLUMN "patient_age" SET NOT NULL,
ALTER COLUMN "patient_phone" SET NOT NULL,
ALTER COLUMN "patient_sex" SET NOT NULL,
ALTER COLUMN "product_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
