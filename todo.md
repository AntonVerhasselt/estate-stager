TODOs:

1. Define real style components:
   - Decide on all 4 properties (e.g. style, colorPalette, materials, roomType).
   - For each property, specify _exactly 6_ selectable options (plus "other" if needed).
   - Write in schema-friendly way (see `schema.ts` for how we're using `v.union(...)`).

2. Update DB schema:
   - Update the `styleImages` table in `schema.ts`.
     - Change each property to allow ONLY the 6 options defined above, via `v.union(...)`.
     - Add a new boolean property: `deleted` (default: false or optional).
     - Make sure frontend/backend agree on type.

3. Update functionality:
   - Update Unsplash import/fetch logic for style images:
     - When new images are inserted, ensure 4 properties (with new options) are present in insertion, even if via `undefined` or empty arrays.
   - Update analyze (Gemini integration):
     - Update prompt/system instructions to reflect new 4 properties and their 6-option choices.
     - Update analysis result schema and type to match.
   - Update all code that references the changed structure: adjust property names/lists everywhere.
