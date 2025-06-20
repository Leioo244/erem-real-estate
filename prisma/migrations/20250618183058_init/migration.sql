-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('فيلا_مستقلة', 'فيلا_دوبلكس', 'شقة', 'عمارة_شقق', 'مجمع_تجاري', 'مبنى_مكاتب');

-- CreateTable
CREATE TABLE "ConstructionCost" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "asset_type" TEXT NOT NULL,
    "finish_grade" TEXT NOT NULL,
    "cost_skeleton_m2" DECIMAL(65,30) NOT NULL,
    "cost_finish_m2" DECIMAL(65,30) NOT NULL,
    "source" TEXT,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConstructionCost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandPrice" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "land_price_m2" DECIMAL(65,30) NOT NULL,
    "source" TEXT,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LandPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceParam" (
    "id" SERIAL NOT NULL,
    "bank_name" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "max_LTV" DOUBLE PRECISION NOT NULL,
    "APR" DOUBLE PRECISION,
    "term_years" INTEGER,
    "upfront_fee" DOUBLE PRECISION,
    "source" TEXT,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinanceParam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermitFee" (
    "id" SERIAL NOT NULL,
    "asset_category" TEXT NOT NULL,
    "fee_pct" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PermitFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CityIndex" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "index_vs_الرياض" DOUBLE PRECISION NOT NULL,
    "index_vs_جدة" DOUBLE PRECISION,
    "index_vs_الدمام" DOUBLE PRECISION,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CityIndex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "asset_type" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "land_area_m2" DOUBLE PRECISION NOT NULL,
    "floor_count" INTEGER,
    "coverage_pct" DOUBLE PRECISION,
    "built_up_m2" DOUBLE PRECISION,
    "finish_grade" TEXT NOT NULL,
    "financing_type" TEXT NOT NULL,
    "bankProductId" INTEGER,
    "ltv_ratio" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "pdf_url" TEXT NOT NULL,
    "total_cost" DECIMAL(65,30) NOT NULL,
    "loan_amount" DECIMAL(65,30),
    "monthly_payment" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConstructionCost_city_district_idx" ON "ConstructionCost"("city", "district");

-- CreateIndex
CREATE UNIQUE INDEX "LandPrice_city_district_key" ON "LandPrice"("city", "district");

-- CreateIndex
CREATE UNIQUE INDEX "CityIndex_city_key" ON "CityIndex"("city");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Report_projectId_key" ON "Report"("projectId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
