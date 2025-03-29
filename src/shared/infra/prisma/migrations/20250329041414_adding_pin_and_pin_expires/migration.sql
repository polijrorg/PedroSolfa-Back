-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "pin" TEXT,
ADD COLUMN     "pinExpires" TIMESTAMP(3);
