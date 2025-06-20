/* صفحة "تقاريري" – تعرض كل التقارير المحفوظة */
import { import { getServerSession } from "next-auth/next"; } from "next-auth/next";
import { authOptions } from "@/apps/web/lib/auth";
import { prisma } from "@/packages/db/client";
import Link from "next/link";

export default async function ReportsPage() {
  const session = await import { getServerSession } from "next-auth/next";(authOptions);
  if (!session?.user?.id) {
    return <p className="p-10 text-center">الرجاء تسجيل الدخول أولاً.</p>;
  }
  const reports = await prisma.report.findMany({
    where: { userId: Number(session.user.id) },
    include: { project: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <main className="container mx-auto max-w-4xl py-10 rtl:text-right space-y-6">
      <h1 className="text-2xl font-bold text-primary-600 mb-4">تقاريري</h1>
      {reports.length === 0 ? (
        <p>لا يوجد تقارير بعد.</p>
      ) : (
        <ul className="space-y-4">
          {reports.map((r) => (
            <li key={r.id} className="border rounded-lg p-4 flex justify-between items-center bg-primary-200/30">
              <div>
                <p className="font-semibold">{r.project.title}</p>
                <p className="text-sm text-gray-600">{r.project.city} – {r.project.createdAt.toLocaleDateString('ar-SA')}</p>
              </div>
              <Link href={r.pdf_url} target="_blank" className="text-primary-600 underline">تحميل</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
