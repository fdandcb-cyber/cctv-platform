---
Task ID: 1
Agent: Main
Task: Fix CCTV builder - multi-tech, NVR stacking, PoE reality, HDD calculation, admin panel

Work Log:
- Analyzed existing codebase: builder-store.ts, cctv-builder.tsx (1070 lines), page.tsx (653 lines)
- Deep-learned CCTV domain: NVR channels (4/8/16/32/64), DVR max 32ch, PoE switches (4/8/16/24 port only, NO 32-port), SMPS (4/8/16ch), H.265+ bitrates
- Rewrote builder-store.ts: cameraTech → cameraTechs[], recorderSuggestion → recorderUnits[], powerSuggestion → powerUnits[], removed 32 camera cap
- Rewrote cctv-builder.tsx (~1296 lines): multi-select camera technology with checkboxes, per-camera tech dropdown in Step 6, correct NVR/DVR stacking for any camera count, correct PoE switch stacking (24-port max), proper HDD calculation using real H.265+ bitrates per MP, unit breakdown cards for multi-unit suggestions, copy/print quote functionality
- Created admin-panel.tsx: 3 tabs (Products with search/filter/CRUD, Saved Quotes with localStorage, Settings with company info and builder defaults)
- Updated page.tsx: extracted admin to separate component, fixed setFilter destructure, fixed features type safety
- Fixed TypeScript errors: Mouse/Keyboard imports, PropertyType cast, RecorderUnit type mapping, null coalescing for form fields
- Verified calculations with comprehensive test script covering 4/16/68/100 camera scenarios

Stage Summary:
- 68 IP cameras now correctly suggests: 2x NVR (64ch + 4ch), 3x 24-port Gigabit PoE switches (was broken: showed 32ch NVR and 32-port PoE)
- Camera technology is now multi-select (user can pick Night Vision + Two-Way Talk etc.)
- HDD calculation uses real H.265+ bitrates: 2MP=15.1GB/day, 4MP=30.2GB/day, 8MP=60.5GB/day (with 70% motion factor)
- Admin panel with Products, Quotes, and Settings tabs
- All files: builder-store.ts, cctv-builder.tsx, admin-panel.tsx, page.tsx
