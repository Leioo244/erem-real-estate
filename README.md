/*
  ProjectForm – محدث: يرسل البيانات إلى /api/projects ثم يُعيد التوجيه إلى /summary/[projectId]
*/

"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

const formSchema = z.object({
  asset_type: z.enum([
    "فيلا مستقلة",
    "فيلا دوبلكس",
    "شقة",
    "عمارة شقق",
    "مجمع تجاري",
    "مبنى مكاتب",
  ]),
  floor_count: z.number().min(1).max(10),
  unit_count: z.number().min(1).optional(),
  land_area: z.number().min(50),
  finish_grade: z.enum(["عظم", "عادي", "ممتاز", "فاخر"]),
  financing_type: z.enum(["نقدي", "بنكي"]),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string(),
  }),
});

type FormType = z.infer<typeof formSchema>;

export default function ProjectForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: { financing_type: "نقدي" },
  });

  const onMapSelect = useCallback(
    (lat: number, lng: number, address: string) => {
      setValue("location", { lat, lng, address });
    },
    [setValue]
  );

  const onSubmit = async (data: FormType) => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          city: data.location.address.split(",")[0], // تقريبي
          district: null, // يمكن تحسينه بتقسيم العنوان
          user_id: 1, // TODO: من الـ session
          ltv_ratio: data.financing_type === "بنكي" ? 0.8 : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "فشل الحفظ");
      router.push(`/summary/${json.projectId}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const financingType = watch("financing_type");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>بيانات المشروع</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right">
          {/* اختصرت التعليقات للحجم */}
          <div className="space-y-1">
            <label className="font-semibold">نوع الأصل</label>
            <Select onValueChange={(v)=>setValue("asset_type", v as any)}>
              <SelectTrigger><SelectValue placeholder="اختر"/></SelectTrigger>
              <SelectContent>{["فيلا مستقلة","فيلا دوبلكس","شقة","عمارة شقق","مجمع تجاري","مبنى مكاتب"].map((t)=>(<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><label className="font-semibold">عدد الأدوار</label><Input type="number" min={1} max={10} {...register("floor_count",{ valueAsNumber:true})}/></div>
          <div className="space-y-1"><label className="font-semibold">مساحة الأرض (م²)</label><Input type="number" min={50} {...register("land_area",{ valueAsNumber:true})}/></div>
          <div className="space-y-1"><label className="font-semibold">جودة التشطيب</label><Select onValueChange={(v)=>setValue("finish_grade", v as any)}><SelectTrigger><SelectValue placeholder="اختر"/></SelectTrigger><SelectContent>{["عظم","عادي","ممتاز","فاخر"].map(g=>(<SelectItem key={g} value={g}>{g}</SelectItem>))}</SelectContent></Select></div>
          <div className="space-y-1"><label className="font-semibold">طريقة التمويل</label><Select onValueChange={(v)=>setValue("financing_type", v as any)} defaultValue="نقدي"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{['نقدي','بنكي'].map(t=>(<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent></Select></div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>اختيار الموقع</CardTitle></CardHeader><CardContent><MapPicker onSelect={onMapSelect}/>{errors.location && <p className="text-red-500 text-sm mt-2">اختر الموقع</p>}</CardContent></Card>
      <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting?"جاري الحفظ…":"احسب"}</Button>
    </form>
  );
}
