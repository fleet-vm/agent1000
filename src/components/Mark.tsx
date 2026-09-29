/**
 * Agent1000 mark — "many seats, one of them is yours".
 *
 * The mark is three drawings, not one. Which one you get is decided by the
 * rendered size, because sixteen seats turn to mud below about 48 px:
 *
 *   >= 48 px   4x4   sixteen seats, one filled
 *   20-47 px   2x2   four seats, one filled
 *   < 20 px    seat  only the one seat is left
 *
 * Colour comes from `currentColor`, so the mark is ink on paper and paper on
 * ink without a second component. Green belongs on the tile only — see the
 * note on MarkTile below.
 */
import type { SVGProps } from 'react'

export type MarkVariant = '4x4' | '2x2' | 'seat'

export function markVariantFor(size: number): MarkVariant {
  if (size >= 48) return '4x4'
  if (size >= 20) return '2x2'
  return 'seat'
}

/**
 * A tile carries its glyph on a solid ground, so the glyph holds together at a
 * smaller size than it would on paper. These thresholds are the tile's own
 * size, not the glyph's.
 */
export function tileVariantFor(tileSize: number): MarkVariant {
  if (tileSize >= 96) return '4x4'
  if (tileSize >= 24) return '2x2'
  return 'seat'
}

type MarkProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
  /** Rendered size in px. Also picks the drawing unless `variant` is set. */
  size?: number
  /** Force a drawing. Only do this when you know the display size. */
  variant?: MarkVariant
  /** Give the mark an accessible name. Omit it when the mark is decorative. */
  title?: string
}

const CELLS_4 = [0, 18, 36, 54]
const FILLED_4 = { x: 36, y: 18 }
const SW_4 = 3.4

const CELLS_2 = [0, 34]
const FILLED_2 = { x: 34, y: 0 }
const SW_2 = 5

function Glyph({ variant }: { variant: MarkVariant }) {
  if (variant === 'seat') {
    return <rect x={7} y={7} width={50} height={50} rx={13} fill="currentColor" />
  }

  const [cells, filled, sw, cell, rx, fillRx] =
    variant === '4x4'
      ? ([CELLS_4, FILLED_4, SW_4, 10, 1.4, 2.4] as const)
      : ([CELLS_2, FILLED_2, SW_2, 30, 6.5, 7.5] as const)

  return (
    <>
      <g fill="none" stroke="currentColor" strokeWidth={sw}>
        {cells.flatMap((y) =>
          cells
            .filter((x) => !(x === filled.x && y === filled.y))
            .map((x) => (
              <rect
                key={`${x}-${y}`}
                x={x + sw / 2}
                y={y + sw / 2}
                width={cell - sw}
                height={cell - sw}
                rx={rx}
              />
            )),
        )}
      </g>
      <rect x={filled.x} y={filled.y} width={cell} height={cell} rx={fillRx} fill="currentColor" />
    </>
  )
}

export function Mark({ size = 24, variant, title, ...rest }: MarkProps) {
  const drawing = variant ?? markVariantFor(size)
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <Glyph variant={drawing} />
    </svg>
  )
}

/**
 * The mark on a filled tile — app icon, avatar, anywhere the mark needs its own
 * ground. This is the one place `accent` belongs on the logo, because a tile is
 * a tap target. Paper on accent is 4.2:1, which clears the 3:1 a graphic needs;
 * never set small text in that pair.
 */
export function MarkTile({
  size = 32,
  ground = 'var(--color-accent, #4e814e)',
  glyph = 'var(--color-paper, #f5f5f4)',
  title,
  ...rest
}: MarkProps & { ground?: string; glyph?: string }) {
  const drawing = tileVariantFor(size)
  const offset = (64 - 64 * 0.62) / 2
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <rect x={0} y={0} width={64} height={64} rx={14.28} fill={ground} />
      <g transform={`translate(${offset} ${offset}) scale(0.62)`} color={glyph}>
        <Glyph variant={drawing} />
      </g>
    </svg>
  )
}
