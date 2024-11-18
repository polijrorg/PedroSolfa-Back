-- CreateTable
CREATE TABLE "Offers" (
    "id" TEXT NOT NULL,
    "offering_user_id" TEXT NOT NULL,
    "offering_user_duty_id" TEXT NOT NULL,
    "taking_user_id" TEXT,
    "taking_user_duty_id" TEXT,
    "analized" BOOLEAN NOT NULL,
    "accepted" BOOLEAN NOT NULL,

    CONSTRAINT "Offers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Offers" ADD CONSTRAINT "Offers_offering_user_id_fkey" FOREIGN KEY ("offering_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offers" ADD CONSTRAINT "Offers_offering_user_duty_id_fkey" FOREIGN KEY ("offering_user_duty_id") REFERENCES "Duties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offers" ADD CONSTRAINT "Offers_taking_user_id_fkey" FOREIGN KEY ("taking_user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offers" ADD CONSTRAINT "Offers_taking_user_duty_id_fkey" FOREIGN KEY ("taking_user_duty_id") REFERENCES "Duties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
