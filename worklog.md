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

---
Task ID: 2
Agent: Main
Task: Update NVR channels to include 128/256, add 48-port PoE, fix algorithm bug, add exceedsMax warning

Work Log:
- Updated NVR available channels from [4,8,16,32,64] to [4,8,16,32,64,128,256] per user specification
- DVR channels remain [4,8,16,32] — max 32ch for DVR (confirmed by user)
- Added 48-port to PoE switch options [4,8,16,24,48] — was missing before
- Fixed critical algorithm bug: `remaining -= chosen` changed to `remaining -= used` in both recorder and power config loops (was causing incorrect distribution in edge cases)
- Added `exceedsMax` flag to getRecorderConfig return type — triggers red warning when cameras exceed max single unit (32 for DVR, 256 for NVR)
- Added red alert UI in Step 7 showing "X cameras exceed the maximum available single DVR/NVR (32/256 channels)"
- Updated unit breakdown to always show when exceedsMax is true (even for single large units)
- Fixed PoE info text to mention 48-port variant
- Fixed monitorSize store initial value from '21.5"' to '21.5' (mismatch with Select value)
- Verified admin panel is complete: Products CRUD, Saved Quotes (localStorage), Settings, Dashboard stats
- Verified all algorithms with node test script: 68 cameras NVR→128ch, 40 cameras DVR→32ch+8ch, 300 cameras NVR→256ch+64ch, 32 cameras PoE→48p(32used), 68 cameras PoE→48p+24p
- Build passes successfully, dev server returns 200

Stage Summary:
- NVR now supports up to 256 channels (4/8/16/32/64/128/256)
- DVR stays at max 32 channels (4/8/16/32) — correct per market
- PoE switches now include 48-port (4/8/16/24/48) — no fake 32-port
- Algorithm bug fixed: remaining now correctly decrements by `used` not `chosen`
- Red warning shown when camera count exceeds maximum single DVR/NVR unit
- All calculations verified with edge case testing

---
Task ID: 3
Agent: Main
Task: PoE max 24, builder uses real products from DB, admin panel seed data

Work Log:
- Fixed PoE max to 24-port (removed 48). PoE options now [4, 8, 16, 24]
- Updated CameraSelection interface: added productId, brand, modelName, price, salePrice, imageUrl, cameraType fields
- Added normalizeResolution() and cameraTypeToForm() helper functions to builder-store.ts
- Added 1MP to BITRATE_GB_PER_DAY map (7.6 GB/day)
- Completely rewrote Step 6: now shows product grid fetched from /api/products, filtered by system type
  - Analog system: filters products with recorderType=DVR or technology=HD-TVI/HD-CVI/AHD
  - IP system: filters products with recorderType=NVR or technology=IP
  - WiFi system: filters products with cameraType=WiFi/4G or technology=WiFi IP
- Product grid shows: image, brand, model, resolution badge, type badge, price (with sale price)
- Search by brand/model/resolution + filter by camera type (Dome/Bullet/PTZ/WiFi/4G)
- Empty state with link to Admin Panel when no products found for system type
- Selected cameras table shows: product image, brand+model, resolution, technology dropdown, +/- qty, line total
- Camera subtotal shown in table footer and final summary
- Updated copy quote to include: brand, model, MP, type, technology, unit price, line total, camera subtotal
- Updated HDD breakdown to show brand+model instead of generic form factor
- Updated final summary to show per-product line items with prices
- Added SeedDataButton to admin panel: 20 sample products (6 analog cameras, 6 IP cameras, 2 WiFi cameras, 5 DVR/NVR recorders)
- Seed data covers: Hikvision (HD-TVI, IP), Dahua (HD-CVI, IP), TP-Link (WiFi), with real model numbers and prices
- Removed unused mpOptions/formOptions constants from builder
- Added Search, Package icons, useStore import
- Build passes with zero errors

Stage Summary:
- Builder now pulls real products from database (added via Admin Panel)
- Step 6 shows product catalog with images, brand, model, price
- Admin Panel has "Seed Sample Data" button to quickly populate 20 products
- PoE max is 24-port (4/8/16/24 only)
- All calculations (NVR, DVR, PoE, HDD, cable) use resolution from actual product data
