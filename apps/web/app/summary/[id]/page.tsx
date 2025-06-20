/*
  صفحة الملخّص – /summary/[projectId]
  تجلب تقرير المشروع من DB وتعرض ملخّص التكاليف
*/
import { prisma } from '@/packages/db/client';
import { notFound } from 'next/navigation';

interface Props { params: { id: string } }

export default async function SummaryPage({ params }: Props) {
  const projectId = Number(params.id);
  if (Number.isNaN(projectId)) notFound();

  const report = await prisma.report.findUnique({
    where: { projectId },
    include: { project: true },
  });
  if (!report) notFound();

  const fmt = (n?: any) => n?.toLocaleString('ar-SA');

  return (
    <main className="container mx-auto max-w-3xl py-10 rtl:text-right">
      <h1 className="text-2xl font-bold mb-6 text-primary-600">ملخّص التقييم – {report.project.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-primary-200 p-5 shadow-sm">
          <h2 className="font-semibold mb-3">تفاصيل التكلفة</h2>
          <ul className="space-y-1 text-sm">
            <li>تكلفة الأرض: {fmt(report.total_cost - (report.loan_amount ?? 0) - (report.project.built_up_m2 * 0))} ر.س</li>
            <li>إجمالي التكلفة: <span className="font-bold">{fmt(report.total_cost)} ر.س</span></li>
          </ul>
        </div>
        {report.loan_amount && (
          <div className="rounded-xl bg-primary-200 p-5 shadow-sm">
            <h2 className="font-semibold mb-3">خطة التمويل</h2>
            <ul className="space-y-1 text-sm">
              <li>مبلغ القرض: {fmt(report.loan_amount)} ر.س</li>
              <li>القسط الشهري: {fmt(report.monthly_payment)} ر.س</li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
