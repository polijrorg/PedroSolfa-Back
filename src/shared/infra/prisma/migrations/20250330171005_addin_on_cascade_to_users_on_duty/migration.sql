-- DropForeignKey
ALTER TABLE "Duties" DROP CONSTRAINT "Duties_group_id_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnDuty" DROP CONSTRAINT "UsersOnDuty_duty_id_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnDuty" DROP CONSTRAINT "UsersOnDuty_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Duties" ADD CONSTRAINT "Duties_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnDuty" ADD CONSTRAINT "UsersOnDuty_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnDuty" ADD CONSTRAINT "UsersOnDuty_duty_id_fkey" FOREIGN KEY ("duty_id") REFERENCES "Duties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
