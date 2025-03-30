-- DropForeignKey
ALTER TABLE "Switches" DROP CONSTRAINT "Switches_actual_user_duty_id_fkey";

-- DropForeignKey
ALTER TABLE "Switches" DROP CONSTRAINT "Switches_actual_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Switches" DROP CONSTRAINT "Switches_new_user_duty_id_fkey";

-- DropForeignKey
ALTER TABLE "Switches" DROP CONSTRAINT "Switches_new_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Switches" ADD CONSTRAINT "Switches_new_user_id_fkey" FOREIGN KEY ("new_user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Switches" ADD CONSTRAINT "Switches_new_user_duty_id_fkey" FOREIGN KEY ("new_user_duty_id") REFERENCES "Duties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Switches" ADD CONSTRAINT "Switches_actual_user_id_fkey" FOREIGN KEY ("actual_user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Switches" ADD CONSTRAINT "Switches_actual_user_duty_id_fkey" FOREIGN KEY ("actual_user_duty_id") REFERENCES "Duties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
