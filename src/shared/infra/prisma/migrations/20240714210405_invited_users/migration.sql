-- CreateTable
CREATE TABLE "_InvitedUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_InvitedUsers_AB_unique" ON "_InvitedUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_InvitedUsers_B_index" ON "_InvitedUsers"("B");

-- AddForeignKey
ALTER TABLE "_InvitedUsers" ADD CONSTRAINT "_InvitedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvitedUsers" ADD CONSTRAINT "_InvitedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
