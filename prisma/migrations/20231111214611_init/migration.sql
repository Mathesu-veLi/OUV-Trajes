/*
  Warnings:

  - You are about to drop the column `productName` on the `Cart` table. All the data in the column will be lost.
  - Added the required column `productId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "productName",
ADD COLUMN     "productId" INTEGER NOT NULL;