import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";

/** Every page except `/`, which is the wordmark at full size and needs no nav. */
export function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto w-full max-w-[1120px] px-6 py-3.5">
        <Link href="/" className="inline-block">
          <Wordmark className="text-[19px] text-ink" />
        </Link>
      </div>
    </header>
  );
}
