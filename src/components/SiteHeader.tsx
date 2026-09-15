import { SiteNav } from "@/components/SiteNav";

/**
 * Every page, `/` included. The wordmark, the tabs, and the one primary
 * button. The nav is a client component because the active tab comes from the
 * pathname and the small-screen menu has to open.
 */
export function SiteHeader() {
  return <SiteNav />;
}
