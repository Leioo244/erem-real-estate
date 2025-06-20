/*
  ProjectForm – نموذج إدخال مشروع جديد + MapPicker
  مسار الحفظ: apps/web/components/ProjectForm.tsx
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

// Dynamic import to avoid SSR issues with google maps
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

export default function ProjectForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      financing_type: "نقدي",
    },
  });

  const onMapSelect = useCallback((lat: number, lng: number, address: string) => {
    setValue("location", { lat, lng, address });
  }, [setValue]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("form data", data);
    // TODO: call /api/projects to persist then redirect to summary page
  };

  const financingType = watch("financing_type");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>بيانات المشروع</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right">
          {/* Asset Type */}
          <div className="space-y-1">
            <label className="font-semibold">نوع الأصل</label>
            <Select {...register("asset_type", { required: true })} onValueChange={(v)=>setValue("asset_type", v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "فيلا مستقلة",
                  "فيلا دوبلكس",
                  "شقة",
                  "عمارة شقق",
                  "مجمع تجاري",
                  "مبنى مكاتب",
                ].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.asset_type && <p className="text-red-500 text-sm">مطلوب</p>}
          </div>

          {/* Floors */}
          <div className="space-y-1">
            <label className="font-semibold">عدد الأدوار</label>
            <Input type="number" min={1} max={10} {...register("floor_count", { valueAsNumber: true })} />
            {errors.floor_count && <p className="text-red-500 text-sm">مطلوب</p>}
          </div>

          {/* Units */}
          <div className="space-y-1">
            <label className="font-semibold">عدد الوحدات</label>
            <Input type="number" min={1} {...register("unit_count", { valueAsNumber: true })} />
          </div>

          {/* Land area */}
          <div className="space-y-1">
            <label className="font-semibold">مساحة الأرض (م²)</label>
            <Input type="number" min={50} {...register("land_area", { valueAsNumber: true })} />
            {errors.land_area && <p className="text-red-500 text-sm">مطلوب</p>}
          </div>

          {/* Finish Grade */}
          <div className="space-y-1">
            <label className="font-semibold">جودة التشطيب</label>
            <Select {...register("finish_grade", { required: true })} onValueChange={(v)=>setValue("finish_grade", v as any)}>
              <SelectTrigger><SelectValue placeholder="اختر"/></SelectTrigger>
              <SelectContent>
                {["عظم", "عادي", "ممتاز", "فاخر"].map((g)=>(<SelectItem key={g} value={g}>{g}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          {/* Financing */}
          <div className="space-y-1">
            <label className="font-semibold">طريقة التمويل</label>
            <Select {...register("financing_type", { required: true })} onValueChange={(v)=>setValue("financing_type", v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['نقدي', 'بنكي'].map((t)=>(<SelectItem key={t} value={t}>{t}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Bank fields would go here when financingType === 'بنكي' */}
        </CardContent>
      </Card>

      {/* Map Picker */}
      <Card>
        <CardHeader>
          <CardTitle>اختيار الموقع</CardTitle>
        </CardHeader>
        <CardContent>
          <MapPicker onSelect={onMapSelect} />
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">احسب</Button>
    </form>
  );
}
