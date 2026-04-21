import { cn } from "@/lib/utils";

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium transition disabled:opacity-50",
        "bg-accent text-slate-900 hover:bg-cyan-300",
        className
      )}
      {...props}
    />
  );
}
