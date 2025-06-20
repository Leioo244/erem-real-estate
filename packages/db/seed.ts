/*
  Seeder Script – يستورد بيانات Excel إلى PostgreSQL عبر Prisma
  تشغيل:  pnpm ts-node packages/db/seed.ts 
*/
import { PrismaClient, Prisma } from '@prisma/client';
import * as XLSX from 'xlsx';
import path from 'path';

const prisma = new PrismaClient();

// موقع ملف الإكسل (ضعه في جذر المستودع أو حدد مسار مخصص)
const EXCEL_PATH = path.resolve(__dirname, '../../data/real_estate_ai_template.xlsx');

// Helper: read sheet to JSON
function readSheet(sheetName: string) {
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json<any>(sheet, { defval: null });
}

async function main() {
  // 1) construction_costs
  const constructionRows = readSheet('construction_costs');
  for (const row of constructionRows) {
    await prisma.constructionCost.upsert({
      where: {
        city_district_asset_type_finish_grade: {
          city: row.city,
          district: row.district,
          asset_type: row.asset_type,
          finish_grade: row.finish_grade,
        },
      },
      update: {
        cost_skeleton_m2: row.cost_skeleton_m2,
        cost_finish_m2: row.cost_finish_m2,
        source: row.source ?? undefined,
      },
      create: {
        city: row.city,
        district: row.district,
        asset_type: row.asset_type,
        finish_grade: row.finish_grade,
        cost_skeleton_m2: row.cost_skeleton_m2,
        cost_finish_m2: row.cost_finish_m2,
        source: row.source ?? undefined,
      },
    });
  }

  // 2) land_prices
  const landRows = readSheet('land_prices');
  for (const row of landRows) {
    await prisma.landPrice.upsert({
      where: {
        city_district: {
          city: row.city,
          district: row.district,
        },
      },
      update: { land_price_m2: row.land_price_m2, source: row.source ?? undefined },
      create: { city: row.city, district: row.district, land_price_m2: row.land_price_m2, source: row.source ?? undefined },
    });
  }

  // 3) finance_params
  const financeRows = readSheet('finance_params');
  for (const row of financeRows) {
    await prisma.financeParam.create({
      data: {
        bank_name: row.bank_name,
        product: row.product,
        max_LTV: row.max_LTV,
        APR: row.APR,
        term_years: row.term_years,
        upfront_fee: row.upfront_fee ?? null,
        source: row.source ?? undefined,
      },
    });
  }

// 4) permit_fees
const permitRows = readSheet('permit_fees');
for (const row of permitRows) {
  if (!row.asset_category || !row.fee_pct) continue; // تجاهل الصفوف الناقصة

  await prisma.permitFee.upsert({
    where: {
      asset_category: row.asset_category,
    },
    update: {
      fee_pct: row.fee_pct,
    },
    create: {
      asset_category: row.asset_category,
      fee_pct: row.fee_pct,
    }
  });
}
  // 5) city_index
  const cityIndexRows = readSheet('city_index');
  for (const row of cityIndexRows) {
    await prisma.cityIndex.upsert({
      where: { city: row.city },
      update: {
        index_vs_الرياض: row.index_vs_الرياض,
        index_vs_جدة: row.index_vs_جدة,
        index_vs_الدمام: row.index_vs_الدمام,
      },
      create: {
        city: row.city,
        index_vs_الرياض: row.index_vs_الرياض,
        index_vs_جدة: row.index_vs_جدة,
        index_vs_الدمام: row.index_vs_الدمام,
      },
    });
  }

  console.log('✅ Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
