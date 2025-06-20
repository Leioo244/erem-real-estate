/* صفحة تسجيل الدخول (Email Magic Link) */
"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await signIn("email", { email, redirect: false });
    setSent(true);
  };
  return (
    <main className="min-h-screen flex items-center justify-center bg-primary-200/20 rtl:text-right">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-96 space-y-4">
        <h1 className="text-xl font-bold text-primary-600 mb-2">تسجيل الدخول</h1>
        <p className="text-sm text-gray-600">أدخل بريدك – سنرسل لك رابط دخول صالح لـ 10 دقائق.</p>
        <Input type="email" placeholder="example@mail.com" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <Button type="submit" className="w-full" disabled={sent}>{sent?"تم الإرسال – تحقق من بريدك":"أرسل الرابط"}</Button>
      </form>
    </main>
  );
}
