/*
  Warnings:

  - You are about to drop the `_DutiesToUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DutiesToUsers" DROP CONSTRAINT "_DutiesToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_DutiesToUsers" DROP CONSTRAINT "_DutiesToUsers_B_fkey";

-- DropTable
DROP TABLE "_DutiesToUsers";

-- CreateTable
CREATE TABLE "UsersOnDuty" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "duty_id" TEXT NOT NULL,
    "role" TEXT,

    CONSTRAINT "UsersOnDuty_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UsersOnDuty" ADD CONSTRAINT "UsersOnDuty_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnDuty" ADD CONSTRAINT "UsersOnDuty_duty_id_fkey" FOREIGN KEY ("duty_id") REFERENCES "Duties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
