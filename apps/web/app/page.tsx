import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login'); // يحوّل مباشرة لصفحة الدخول
  return null;
}
