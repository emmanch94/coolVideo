"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ShimmerButton, type ShimmerButtonProps } from "@/components/ui/shimmer-button";
import { cn } from "@/lib/utils";

/** Magic UI ShimmerButton styled with the brand gradient. Navigates when `href` is set. */
export function CtaButton({
  href,
  children,
  className,
  onClick,
  ...props
}: ShimmerButtonProps & { href?: string }) {
  const router = useRouter();
  return (
    <ShimmerButton
      shimmerColor="#fbcfe8"
      shimmerSize="0.08em"
      background="linear-gradient(110deg, #6d28d9 0%, #c026d3 55%, #ea580c 100%)"
      className={cn("gap-2 px-7 py-3.5 text-sm font-medium shadow-2xl shadow-fuchsia-600/30", className)}
      onClick={(e) => {
        onClick?.(e);
        if (href && !e.defaultPrevented) router.push(href);
      }}
      {...props}
    >
      {children}
      <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
    </ShimmerButton>
  );
}
