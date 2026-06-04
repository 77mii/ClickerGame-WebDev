/*
  Warnings:

  - A unique constraint covering the columns `[itemname,ownerId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Item_itemname_key";

-- CreateIndex
CREATE UNIQUE INDEX "Item_itemname_ownerId_key" ON "Item"("itemname", "ownerId");
