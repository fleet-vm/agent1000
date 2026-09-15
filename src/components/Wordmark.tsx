import { cn } from "@/lib/cn";

/**
 * The wordmark. One instrument, two voices.
 *
 * `Agent` is set in Inter; `1000` in Plex Mono, tracked wide and hung from
 * the cap line rather than the baseline, so the numerals read as a register
 * stamped on the word instead of a quantity following it.
 *
 * The lift is derived, not eyeballed. Inter's cap height is 0.727em; Plex
 * Mono's is 0.698em. With the numerals at 0.62em, their cap top sits
 * 0.698 x 0.62 = 0.433em above a shared baseline, against 0.727em for the
 * word: a difference of 0.294em of the display size, which is 0.475em of the
 * numerals' own size.
 *
 * The negative right margin cancels the trailing letter-space that tracking
 * adds after the final `0`, so the lockup's optical right edge is true.
 */
export function Wordmark({
  className,
  as: Tag = "span",
}: {
  className?: string;
  as?: "span" | "h1";
}) {
  return (
    <Tag className={cn("block font-sans leading-none", className)}>
      <span className="sr-only">Agent1000</span>
      <span aria-hidden="true" className="inline-flex items-baseline">
        <span className="font-semibold tracking-[-0.03em]">Agent</span>
        <span
          className="tabular inline-block font-mono font-medium"
          style={{
            fontSize: "0.62em",
            letterSpacing: "0.18em",
            marginLeft: "0.06em",
            marginRight: "-0.18em",
            transform: "translateY(-0.475em)",
          }}
        >
          1000
        </span>
      </span>
    </Tag>
  );
}
