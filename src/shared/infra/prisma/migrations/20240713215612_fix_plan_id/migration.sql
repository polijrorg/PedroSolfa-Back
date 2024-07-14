-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_plan_id_fkey";

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "plan_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
