/*
  Warnings:

  - You are about to drop the column `accepted` on the `Offers` table. All the data in the column will be lost.
  - You are about to drop the column `analized` on the `Offers` table. All the data in the column will be lost.
  - You are about to drop the column `taking_user_duty_id` on the `Offers` table. All the data in the column will be lost.
  - You are about to drop the column `taking_user_id` on the `Offers` table. All the data in the column will be lost.
  - Added the required column `closed` to the `Offers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Offers" DROP CONSTRAINT "Offers_taking_user_duty_id_fkey";

-- DropForeignKey
ALTER TABLE "Offers" DROP CONSTRAINT "Offers_taking_user_id_fkey";

-- AlterTable
ALTER TABLE "Offers" DROP COLUMN "accepted",
DROP COLUMN "analized",
DROP COLUMN "taking_user_duty_id",
DROP COLUMN "taking_user_id",
ADD COLUMN     "closed" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "OfferPropositions" (
    "id" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "proposition_user_id" TEXT NOT NULL,
    "proposition_user_duty_id" TEXT NOT NULL,
    "analized" BOOLEAN NOT NULL DEFAULT false,
    "accepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OfferPropositions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OfferPropositions" ADD CONSTRAINT "OfferPropositions_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "Offers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferPropositions" ADD CONSTRAINT "OfferPropositions_proposition_user_id_fkey" FOREIGN KEY ("proposition_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferPropositions" ADD CONSTRAINT "OfferPropositions_proposition_user_duty_id_fkey" FOREIGN KEY ("proposition_user_duty_id") REFERENCES "Duties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
