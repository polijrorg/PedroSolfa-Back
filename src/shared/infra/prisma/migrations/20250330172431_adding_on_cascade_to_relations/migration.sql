-- DropForeignKey
ALTER TABLE "OfferPropositions" DROP CONSTRAINT "OfferPropositions_offer_id_fkey";

-- DropForeignKey
ALTER TABLE "OfferPropositions" DROP CONSTRAINT "OfferPropositions_proposition_user_duty_id_fkey";

-- DropForeignKey
ALTER TABLE "OfferPropositions" DROP CONSTRAINT "OfferPropositions_proposition_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Offers" DROP CONSTRAINT "Offers_offering_user_duty_id_fkey";

-- DropForeignKey
ALTER TABLE "Offers" DROP CONSTRAINT "Offers_offering_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Offers" ADD CONSTRAINT "Offers_offering_user_id_fkey" FOREIGN KEY ("offering_user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offers" ADD CONSTRAINT "Offers_offering_user_duty_id_fkey" FOREIGN KEY ("offering_user_duty_id") REFERENCES "Duties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferPropositions" ADD CONSTRAINT "OfferPropositions_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "Offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferPropositions" ADD CONSTRAINT "OfferPropositions_proposition_user_id_fkey" FOREIGN KEY ("proposition_user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferPropositions" ADD CONSTRAINT "OfferPropositions_proposition_user_duty_id_fkey" FOREIGN KEY ("proposition_user_duty_id") REFERENCES "Duties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
