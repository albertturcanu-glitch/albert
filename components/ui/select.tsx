import { cn } from "@/lib/utils";

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-foreground",
        className
      )}
      {...props}
    />
  );
}
