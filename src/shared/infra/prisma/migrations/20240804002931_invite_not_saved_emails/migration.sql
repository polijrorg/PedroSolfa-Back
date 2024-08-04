/*
  Warnings:

  - You are about to drop the column `plan_id` on the `Users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_plan_id_fkey";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "plan_id";

-- CreateTable
CREATE TABLE "InvitedEmails" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "InvitedEmails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InvitedAdms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PlansToUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_InvitedAdms_AB_unique" ON "_InvitedAdms"("A", "B");

-- CreateIndex
CREATE INDEX "_InvitedAdms_B_index" ON "_InvitedAdms"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PlansToUsers_AB_unique" ON "_PlansToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_PlansToUsers_B_index" ON "_PlansToUsers"("B");

-- AddForeignKey
ALTER TABLE "InvitedEmails" ADD CONSTRAINT "InvitedEmails_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvitedAdms" ADD CONSTRAINT "_InvitedAdms_A_fkey" FOREIGN KEY ("A") REFERENCES "Groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvitedAdms" ADD CONSTRAINT "_InvitedAdms_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlansToUsers" ADD CONSTRAINT "_PlansToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlansToUsers" ADD CONSTRAINT "_PlansToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
