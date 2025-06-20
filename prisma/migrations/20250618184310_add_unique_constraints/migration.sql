/*
  Warnings:

  - A unique constraint covering the columns `[city,district,asset_type,finish_grade]` on the table `ConstructionCost` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[asset_category]` on the table `PermitFee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ConstructionCost_city_district_asset_type_finish_grade_key" ON "ConstructionCost"("city", "district", "asset_type", "finish_grade");

-- CreateIndex
CREATE UNIQUE INDEX "PermitFee_asset_category_key" ON "PermitFee"("asset_category");
