-- CreateTable
CREATE TABLE "Switches" (
    "id" TEXT NOT NULL,
    "new_user_id" TEXT NOT NULL,
    "new_user_duty_id" TEXT NOT NULL,
    "actual_user_id" TEXT NOT NULL,
    "actual_user_duty_id" TEXT NOT NULL,
    "analized" BOOLEAN NOT NULL,
    "accepted" BOOLEAN NOT NULL,

    CONSTRAINT "Switches_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Switches" ADD CONSTRAINT "Switches_new_user_id_fkey" FOREIGN KEY ("new_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Switches" ADD CONSTRAINT "Switches_new_user_duty_id_fkey" FOREIGN KEY ("new_user_duty_id") REFERENCES "Duties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Switches" ADD CONSTRAINT "Switches_actual_user_id_fkey" FOREIGN KEY ("actual_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Switches" ADD CONSTRAINT "Switches_actual_user_duty_id_fkey" FOREIGN KEY ("actual_user_duty_id") REFERENCES "Duties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
