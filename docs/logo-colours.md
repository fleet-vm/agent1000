# Logo colours

The wordmark is set in code, not drawn: `Agent` in Inter semibold, `1000` in
Plex Mono, tracked wide and hung from the cap line (`src/components/Wordmark.tsx`).
Every colour below is a token from `src/app/globals.css`, so the logo and the
site can never drift apart.

## The site's palette, for reference

### Ground and text

| Token       | Hex       | Role                                                    |
| ----------- | --------- | ------------------------------------------------------- |
| `ink`       | `#121215` | Body text, wordmark. Cool near-black, never pure black  |
| `paper`     | `#f5f5f4` | Page background                                         |
| `surface`   | `#ffffff` | Cards, the product frame, inputs, white bands           |
| `rule`      | `#e4e4e4` | The one hairline                                        |
| `muted`     | `#5c5c66` | Secondary text, ledes (6.1:1 on paper)                  |
| `muted-ink` | `#4b4b54` | Small secondary text (8.0:1 on paper)                   |

### The one accent

| Token         | Hex       | Role                                                     |
| ------------- | --------- | -------------------------------------------------------- |
| `signal`      | `#3d6e3d` | Green as text: links, eyebrows, the headline phrase      |
| `accent`      | `#4e814e` | Green as fill: primary buttons, darkens to `signal` on hover |
| `accent-soft` | `#e8efe8` | Tinted ground: pills, active tab hover                   |

### Status

| Status  | Foreground | Background |
| ------- | ---------- | ---------- |
| `live`  | `#3d6e3d`  | `#e6efe6`  |
| `pilot` | `#6b4a05`  | `#f5eedc`  |
| `ready` | `#4b4b54`  | `#ededec`  |

The rule behind it: green does one job, it marks what you can act on. The
status colours mark what state an agent is in. Nothing else on the site is
coloured. Inside a thread, amber means work is waiting on a named person and
green means a person decided.

## Recommendation

### 1. Wordmark: ink only (preferred)

A green logo at the top of every page spends the "green means act" rule on
something that is not a control, and it competes with the one green button
beside it. Ink on paper also reads as institutional, which fits the audience.

| Context                                  | Colour            |
| ---------------------------------------- | ----------------- |
| On paper or surface                      | `ink` `#121215`   |
| Reversed (dark ground, video, slides)    | `paper` `#f5f5f4` |

### 2. One touch of colour: the numerals only

If colour is wanted, put it on `1000` alone. The numerals are already a second
voice (mono, tracked, lifted), so they can carry it without the word going
green.

| Context   | Numerals                     | Word            |
| --------- | ---------------------------- | --------------- |
| On light  | `signal` `#3d6e3d`           | `ink`           |
| Reversed  | `live-bg` tint `#e6efe6`     | `paper`         |

Use `signal`, the text green, never `accent`, the fill green: it does not clear
AA at that size on the grey ground. Keep this version off the site header for
the reason in section 1. It suits the share card, print and a standalone
lockup.

### 3. Mark and favicon

Where a wordmark will not fit, use a tile with a glyph, not a coloured glyph on
white. A green glyph on white turns to mud at 16px.

| Variant          | Tile                | Glyph             |
| ---------------- | ------------------- | ----------------- |
| Green (default)  | `accent` `#4e814e`  | `paper` `#f5f5f4` |
| Ink              | `ink` `#121215`     | `paper` `#f5f5f4` |

The green tile is the one place the fill green belongs on the logo, because a
favicon is a tap target.

## Avoid

- Amber (`#6b4a05`) anywhere in the logo. On this site it means "waiting for a
  named person".
- Pure `#000` or `#fff`. The system uses `#121215` and `#f5f5f4` on purpose.
- Gradients or a second hue. There is one accent, and the wordmark gets its
  contrast from typography (sans against mono), not from colour.

## Not yet in the repo

There is no `icon.svg`, favicon or `opengraph-image` asset. When they are
added, build them from section 3 and section 1 respectively.
