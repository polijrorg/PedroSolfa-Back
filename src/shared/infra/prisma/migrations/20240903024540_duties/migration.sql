-- CreateTable
CREATE TABLE "Duties" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "Duties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DutiesToUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DutiesToUsers_AB_unique" ON "_DutiesToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_DutiesToUsers_B_index" ON "_DutiesToUsers"("B");

-- AddForeignKey
ALTER TABLE "Duties" ADD CONSTRAINT "Duties_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DutiesToUsers" ADD CONSTRAINT "_DutiesToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Duties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DutiesToUsers" ADD CONSTRAINT "_DutiesToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
