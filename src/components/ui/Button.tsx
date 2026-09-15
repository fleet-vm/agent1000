import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * The two buttons. `primary` is the green fill and there is one per view;
 * `secondary` is the outline. Both are links, because on this site a button
 * only ever goes somewhere -- the forms have their own submit controls.
 */
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-sm border text-ui font-medium whitespace-nowrap transition-colors duration-150";

const TONE = {
  primary: "border-accent bg-accent text-white hover:border-signal hover:bg-signal",
  secondary: "border-rule bg-surface text-ink hover:border-muted",
} as const;

const SIZE = {
  md: "h-9 px-3",
  lg: "h-11 px-5",
} as const;

export function ButtonLink({
  href,
  tone = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  tone?: keyof typeof TONE;
  size?: keyof typeof SIZE;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(BASE, TONE[tone], SIZE[size], className)}>
      {children}
    </Link>
  );
}

export const buttonClass = (tone: keyof typeof TONE = "primary", size: keyof typeof SIZE = "md") =>
  cn(BASE, TONE[tone], SIZE[size]);
