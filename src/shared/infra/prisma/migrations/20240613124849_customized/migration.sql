/*
  Warnings:

  - Added the required column `city` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profession` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialization` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "profession" TEXT NOT NULL,
ADD COLUMN     "specialization" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
