/*
  Warnings:

  - You are about to drop the column `max_groups` on the `Plans` table. All the data in the column will be lost.
  - You are about to drop the `_PlansToUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PlansToUsers" DROP CONSTRAINT "_PlansToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlansToUsers" DROP CONSTRAINT "_PlansToUsers_B_fkey";

-- AlterTable
ALTER TABLE "Plans" DROP COLUMN "max_groups";

-- DropTable
DROP TABLE "_PlansToUsers";

-- CreateTable
CREATE TABLE "Subscriptions" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriptions_group_id_key" ON "Subscriptions"("group_id");

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
