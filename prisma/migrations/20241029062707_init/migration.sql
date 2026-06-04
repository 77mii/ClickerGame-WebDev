-- CreateTable
CREATE TABLE "ShopItem" (
    "id" SERIAL NOT NULL,
    "itemname" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "effect" TEXT NOT NULL,

    CONSTRAINT "ShopItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopItem_itemname_key" ON "ShopItem"("itemname");
