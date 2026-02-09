# Study Break Roulette

A tiny static site that picks a short web game from `games.json`.

## Run Locally

Because browsers block `fetch()` from `file://`, you need a local web server.

Option A: Python (built-in)
```bash
python3 -m http.server 5173
```
Then open `http://localhost:5173/` in your browser.

Option B: Node (if you have `npx`)
```bash
npx serve .
```

## Edit `games.json` (Schema)

Each item should be an object with these fields:

- `title` (string): Display name.
- `url` (string): Full URL for the game.
- `minutes` (number or string): Approximate playtime (1, 3, 5).
- `description` (string): Short summary shown on the card.
- `tags` (array of strings): Optional labels (max 4 shown).
- `safe` (boolean): `true` if vetted/safer.
- `sketchy` (boolean): Optional flag to exclude from safe mode.
- `weight` (number): Optional base weight for selection (default 1).

Example:
```json
{
  "title": "Puzzled Tetris",
  "url": "https://example.com/tetris",
  "minutes": 3,
  "description": "Quick block puzzle.",
  "tags": ["puzzle", "classic"],
  "safe": true,
  "sketchy": false,
  "weight": 1
}
```

## Safety Checklist

- Verify each `url` loads over HTTPS.
- Avoid sites with aggressive ads/popups.
- Mark questionable sites with `sketchy: true`.
- Use `safe: true` only for curated links.
- Check that `minutes` matches the time filters (1, 3, 5) so filtering works.
