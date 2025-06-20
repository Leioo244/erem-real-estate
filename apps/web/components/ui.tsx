/*
  Minimal shadcn‑style UI primitives (TailwindCSS)
  – يُغطي Button / Input / Card / Select المطلوبة لتشغيل الصفحات دون أخطاء.
  – يمكنك لاحقاً استبدالها بمكتبة shadcn/ui الرسمية (run: npx shadcn-ui@latest add button …)
*/
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

/* -------------------- Button -------------------- */
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-600",
        outline: "border border-gray-300 hover:bg-gray-50",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={clsx(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = "Button";

/* -------------------- Input -------------------- */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 disabled:cursor-not-allowed",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

/* -------------------- Card -------------------- */
export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("rounded-xl border bg-white shadow-sm", className)} {...props} />
);
export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("border-b p-4", className)} {...props} />
);
export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={clsx("text-lg font-semibold", className)} {...props} />
);
export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("p-4", className)} {...props} />
);

/* -------------------- Select -------------------- */
export const Select = ({ children, className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={clsx(
      "w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600",
      className
    )}
    {...props}
  >
    {children}
  </select>
);
export const SelectItem = (props: React.OptionHTMLAttributes<HTMLOptionElement>) => <option {...props} />;
export const SelectTrigger = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />; // Placeholder – للـ API المتوافق مع shadcn
export const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>; // نفس الشيء
export const SelectValue = ({ placeholder }: { placeholder?: string }) => <option value="" disabled selected>{placeholder}</option>;

/*
  ملاحظة: هذه المكونات تفي بالغرض للتشغيل المحلي السريع. عند رغبتك في تجربة shadcn-ui
you can run:
    npx shadcn-ui@latest add button input card select
وسيتم استبدالها بمكونات جاهزة أكثر ثراءً.
*/
