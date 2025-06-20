/*
  Next.js (App Router) – صفحة /new-project
  ▸ تعرض ProjectForm مع حاوية RTL
*/

import dynamic from 'next/dynamic';
import { Metadata } from 'next';

// منع SSR لأن ProjectForm يستخدم MapPicker (client‑side)
const ProjectForm = dynamic(() => import('../../components/ProjectForm'), { ssr: false });

export const metadata: Metadata = {
  title: 'إنشاء مشروع جديد | إرم',
};

export default function NewProjectPage() {
  return (
    <main className="container mx-auto max-w-2xl py-10 rtl:text-right">
      <h1 className="text-2xl font-bold mb-6 text-primary-600">إنشاء مشروع جديد</h1>
      <ProjectForm />
    </main>
  );
}
