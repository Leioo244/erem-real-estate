/*
  generateReportPdf – محدث لإظهار عمود المقارنة إن وُجد
*/
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '@/packages/db/client';

export async function generateReportPdf(projectId: number, summary: any) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error('Project not found');

  const hasCompare = !!summary.compare_city;

  const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"/><style>
  body{font-family:'Arial';margin:40px}
  table{width:100%;border-collapse:collapse}
  th,td{border:1px solid #ccc;padding:6px}
  th{background:#E0F1F3}
  </style></head><body>
  <h1>تقرير تقييم عقاري</h1>
  <p>${project.city}${project.district ? ' – ' + project.district : ''}</p>
  <table>
    <thead><tr><th>البند</th><th>${project.city}</th>${hasCompare?`<th>${summary.compare_city}</th>`:''}</tr></thead>
    <tbody>
      <tr><td>إجمالي التكلفة</td><td>${summary.total_cost.toLocaleString('ar-SA')}</td>${hasCompare?`<td>${summary.compare_total.toLocaleString('ar-SA')}</td>`:''}</tr>
    </tbody>
  </table>
  </body></html>`;

  const browser = await puppeteer.launch({ headless:'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil:'networkidle0' });
  const buffer = await page.pdf({ format:'A4', printBackground:true });
  await browser.close();

  const file = `report_${projectId}_${Date.now()}.pdf`;
  const out = path.resolve('public/reports', file);
  await fs.mkdir(path.dirname(out), { recursive:true });
  await fs.writeFile(out, buffer);
  return `/reports/${file}`;
}
