/**
 * Agent1000 logo — the mark locked up with the existing wordmark.
 *
 * Everything is sized in `em` off one number, so the lockup can never drift:
 * set `size` (the wordmark's font size in px) and the mark, the gap and the
 * stacked spacing all follow.
 *
 *   mark side   1.06em
 *   gap         0.30em   (horizontal)
 *   stacked     mark is 1.54em, gap below it 0.46em
 *
 * This file assumes `<Wordmark />` renders the name at the inherited font size
 * and colour. If yours takes props, pass them through the `wordmark` slot.
 */
import type { ReactNode } from 'react'
import { Mark, markVariantFor } from '@/components/Mark'
import { Wordmark } from '@/components/Wordmark'

type LogoProps = {
  /** Wordmark font size in px. Everything else is derived from it. */
  size?: number
  orientation?: 'horizontal' | 'stacked'
  /** Replace the wordmark, e.g. <Wordmark accent /> for the share-card version. */
  wordmark?: ReactNode
  /** Accessible name. Set it to `false` when a nearby heading already says it. */
  label?: string | false
  className?: string
}

export function Logo({
  size = 20,
  orientation = 'horizontal',
  wordmark,
  label = 'Agent1000',
  className,
}: LogoProps) {
  const markSize = orientation === 'stacked' ? size * 1.54 : size * 1.06
  const word = wordmark ?? <Wordmark />

  return (
    <span
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      style={{
        fontSize: size,
        display: 'inline-flex',
        flexDirection: orientation === 'stacked' ? 'column' : 'row',
        alignItems: orientation === 'stacked' ? 'flex-start' : 'center',
        gap: orientation === 'stacked' ? '0.46em' : '0.3em',
        color: 'var(--color-ink, #121215)',
        lineHeight: 1,
      }}
    >
      <Mark size={markSize} />
      <span aria-hidden={label ? true : undefined}>{word}</span>
    </span>
  )
}

/**
 * Handy when you need to know which drawing a given lockup will use — e.g. to
 * decide whether a header at 18px should drop to the compact form.
 */
export function logoMarkVariant(size: number) {
  return markVariantFor(size * 1.06)
}
