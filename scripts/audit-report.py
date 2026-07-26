"""
ConnectZ CCTV Platform — Complete Professional Audit Report
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether, ListFlowable, ListItem
)
from reportlab.platypus.frames import Frame, PageTemplate
from reportlab.platypus.doctemplate import BaseDocTemplate
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

from reportlab.lib import colors

FONT_DIR = "/usr/share/fonts"
W, H = A4
MARGIN = 20 * mm

# Register fonts
pdfmetrics.registerFont(TTFont("Tinos", f"{FONT_DIR}/truetype/english/Tinos-Regular.ttf"))
pdfmetrics.registerFont(TTFont("TinosB", f"{FONT_DIR}/truetype/english/Tinos-Bold.ttf"))
pdfmetrics.registerFont(TTFont("TinosI", f"{FONT_DIR}/truetype/english/Tinos-Italic.ttf"))
pdfmetrics.registerFont(TTFont("TinosBI", f"{FONT_DIR}/truetype/english/Tinos-BoldItalic.ttf"))
pdfmetrics.registerFont(TTFont("Carlito", f"{FONT_DIR}/truetype/english/Carlito-Regular.ttf"))
pdfmetrics.registerFont(TTFont("CarlitoB", f"{FONT_DIR}/truetype/english/Carlito-Bold.ttf"))
registerFontFamily("Tinos", normal="Tinos", bold="TinosB", italic="TinosI", boldItalic="TinosBI")
registerFontFamily("Carlito", normal="Carlito", bold="CarlitoB")

# Colors
C_BG = HexColor("#FAFAFA")
C_WHITE = HexColor("#FFFFFF")
C_DARK = HexColor("#1E293B")
C_TEXT = HexColor("#334155")
C_MUTED = HexColor("#64748B")
C_BORDER = HexColor("#E2E8F0")
C_RED = HexColor("#DC2626")
C_ORANGE = HexColor("#EA580C")
C_YELLOW = HexColor("#CA8A04")
C_GREEN = HexColor("#16A34A")
C_BLUE = HexColor("#2563EB")
C_EMERALD = HexColor("#059669")
C_RED_BG = HexColor("#FEF2F2")
C_ORANGE_BG = HexColor("#FFF7ED")
C_YELLOW_BG = HexColor("#FEFCE8")
C_GREEN_BG = HexColor("#F0FDF4")
C_BLUE_BG = HexColor("#EFF6FF")

# Styles
ss = getSampleStyleSheet()
ss.add(ParagraphStyle(name='CoverTitle', fontName='Carlito', fontSize=28, leading=34, textColor=C_WHITE, alignment=TA_CENTER, spaceAfter=6))
ss.add(ParagraphStyle(name='CoverSub', fontName='Tinos', fontSize=13, leading=18, textColor=HexColor("#CBD5E1"), alignment=TA_CENTER, spaceAfter=4))
ss.add(ParagraphStyle(name='H1', fontName='Carlito', fontSize=20, leading=26, textColor=C_DARK, spaceBefore=16, spaceAfter=8, borderWidth=0, borderPadding=0))
ss.add(ParagraphStyle(name='H2', fontName='Carlito', fontSize=15, leading=20, textColor=C_DARK, spaceBefore=14, spaceAfter=6))
ss.add(ParagraphStyle(name='H3', fontName='Carlito', fontSize=12, leading=16, textColor=C_DARK, spaceBefore=10, spaceAfter=4))
ss.add(ParagraphStyle(name='Body', fontName='Tinos', fontSize=9.5, leading=14, textColor=C_TEXT, alignment=TA_JUSTIFY, spaceAfter=6))
ss.add(ParagraphStyle(name='BodySmall', fontName='Tinos', fontSize=8.5, leading=12, textColor=C_TEXT, alignment=TA_JUSTIFY, spaceAfter=4))
ss.add(ParagraphStyle(name='BulletBody', fontName='Tinos', fontSize=9, leading=13, textColor=C_TEXT, leftIndent=18, bulletIndent=6, spaceAfter=3, alignment=TA_LEFT))
ss.add(ParagraphStyle(name='TableCell', fontName='Tinos', fontSize=8, leading=11, textColor=C_TEXT))
ss.add(ParagraphStyle(name='TableCellBold', fontName='Carlito', fontSize=8, leading=11, textColor=C_DARK))
ss.add(ParagraphStyle(name='ScoreBig', fontName='Carlito', fontSize=22, leading=28, textColor=C_DARK, alignment=TA_CENTER, spaceBefore=4, spaceAfter=2))
ss.add(ParagraphStyle(name='ScoreLabel', fontName='Tinos', fontSize=9, leading=13, textColor=C_MUTED, alignment=TA_CENTER, spaceAfter=12))
ss.add(ParagraphStyle(name='Footer', fontName='Tinos', fontSize=7, leading=10, textColor=C_MUTED, alignment=TA_CENTER))
ss.add(ParagraphStyle(name='TOCEntry', fontName='Tinos', fontSize=10, leading=18, textColor=C_TEXT, leftIndent=20, spaceAfter=2))
ss.add(ParagraphStyle(name='TOCSection', fontName='Carlito', fontSize=10, leading=18, textColor=C_DARK, spaceBefore=8, spaceAfter=2, leftIndent=0))

PAGE_NUM = [0]

def header_footer(canvas, doc):
    canvas.saveState()
    if PAGE_NUM[0] > 1:
        canvas.setFont("Carlito", 7)
        canvas.setFillColor(C_MUTED)
        canvas.drawString(MARGIN, H - MARGIN + 14, "ConnectZ CCTV Platform - Comprehensive Audit Report")
        canvas.drawRightString(W - MARGIN, H - MARGIN + 14, f"Page {PAGE_NUM[0]}")
        canvas.setStrokeColor(C_BORDER)
        canvas.line(MARGIN, H - MARGIN + 10, W - MARGIN, H - MARGIN + 10)
    canvas.restoreState()

def on_page(canvas, doc):
    PAGE_NUM[0] += 1
    header_footer(canvas, doc)

template = PageTemplate(id='main', frames=[Frame(MARGIN, MARGIN, W - MARGIN, H - MARGIN - 12*mm)])

def P(text, style='Body', **kw):
    return Paragraph(text, styleName=style, **kw)

def H(text, style='H2', **kw):
    return Paragraph(text, styleName=style, **kw)

def S(text):
    return Paragraph(text, styleName='BodySmall')

def score_badge(score, label):
    color = C_RED if score < 40 else C_ORANGE if score < 60 else C_YELLOW if score < 75 else C_GREEN
    data = [[P(f'<b>{label}</b>', 'ScoreLabel'), P(f'<b>{score}/100</b>', 'ScoreBig')]]
    t = Table(data, colWidths=[W - 2*MARGIN - 20*mm, 60*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), color),
        ('BACKGROUND', (0, 0), (0, -1), C_WHITE),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, C_BORDER),
    ]))
    return t

def finding(sev, fid, title, desc, fix):
    sev_map = {'CRITICAL': ('#DC2626', C_RED_BG), 'HIGH': ('#EA580C', C_ORANGE_BG), 'MEDIUM': ('#CA8A04', C_YELLOW_BG), 'LOW': ('#16A34A', C_GREEN_BG)}
    hex_c, bg_c = sev_map.get(sev, ('#64748B', HexColor('#F1F5F9')))
    data = [[P(f'<b>[{sev}]</b>', 'BodySmall'), P(f'<b>{fid}</b> {title}', 'BodySmall')],
            [Paragraph(desc, 'BodySmall'), Paragraph(f'<b>Fix:</b> {fix}', 'BodySmall')]]
    t = Table(data, colWidths=[W - 2*MARGIN])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), bg_c),
        ('BACKGROUND', (0, 1), (-1, -1), C_WHITE),
        ('BACKGROUND', (0, 2), (-1, -1), C_WHITE),
        ('GRID', (0, 0), (-1, -1), 0.4, C_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    return t

def section_divider():
    return HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceBefore=8, spaceAfter=8)

# BUILD STORY
story = []

# COVER PAGE
story.append(Spacer(1, 60*mm))
story.append(P("CONNECTZ CCTV PLATFORM", 'CoverTitle'))
story.append(P("Comprehensive Professional Audit Report", 'CoverSub'))
story.append(Spacer(1, 20*mm))
story.append(HRFlowable(width="40%", thickness=1, color=C_EMERALD, spaceBefore=8, spaceAfter=8))
story.append(P("Prepared by: Senior Full Stack Software Architect", 'CoverSub'))
story.append(P("Date: July 27, 2025", 'CoverSub'))
story.append(P("Stack: Next.js 16.1 + TypeScript + Tailwind CSS 4 + Prisma + SQLite", 'CoverSub'))
story.append(P("Scope: 23 audit sections, 86+ findings", 'CoverSub'))
story.append(Spacer(1, 40*mm))

data = [[P(f'<b>Overall</b>', 'ScoreLabel'), P(f'<b>32/100</b>', 'ScoreBig'),
          P('<b>Frontend</b>', 'ScoreLabel'), P(f'<b>42/100</b>', 'ScoreBig'),
          P('<b>Backend</b>', 'ScoreLabel'), P(f'<b>28/100</b>', 'ScoreBig'),
          P('<b>Database</b>', 'ScoreLabel'), P(f'<b>35/100</b>', 'ScoreBig'),
          P('<b>Security</b>', 'ScoreLabel'), P(f'<b>15/100</b>', 'ScoreBig'),
          P('<b>UI/UX</b>', 'ScoreLabel'), P(f'<b>55/100</b>', 'ScoreBig'),
          P('<b>Performance</b>', 'ScoreLabel'), P(f'<b>38/100</b>', 'ScoreBig'),
          P('<b>Production Ready</b>', 'ScoreLabel'), P(f'<b>20/100</b>', 'ScoreBig')]]
st = Table(data, colWidths=[80*mm, 60*mm, 80*mm, 60*mm])
st.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), C_DARK),
    ('TEXTCOLOR', (0,0), (-1,-1), C_WHITE),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'), ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('GRID', (0,0), (-1,-1), 1, HexColor('#334155')),
    ('TOPPADDING', (0,0), (-1,-1), 6), ('BOTTOMPADDING', (0,0), (-1,-1), 6),
]))
story.append(st)
story.append(PageBreak())

# TABLE OF CONTENTS
toc_items = [
    ("1", "Project Structure"), ("2", "Next.js Review"), ("3", "Database Review"),
    ("4", "CRUD Analysis"), ("5", "API Review"), ("6", "Authentication"),
    ("7", "Admin Panel"), ("8", "Frontend Review"), ("9", "Routing Review"),
    ("10", "Component Review"), ("11", "Security Review"), ("12", "Performance Review"),
    ("13", "UI/UX Review"), ("14", "File Upload Review"), ("15", "Payment Review"),
    ("16", "Database vs UI"), ("17", "Dead Code"), ("18", "Dependencies"),
    ("19", "Bugs"), ("20", "Production Readiness"), ("21", "Improvements"),
    ("22", "Code Quality"), ("23", "Final Report"),
]
story.append(P("TABLE OF CONTENTS", 'H1'))
for num, title in toc_items:
    story.append(P(f'<b>Section {num}:</b>  {title}', 'TOCEntry'))
story.append(PageBreak())

# HELPER: add finding
F = finding

# ═══════════════════════════════════════════════════════════════════
# SECTION 1: PROJECT STRUCTURE
# ═══════════════════════════════════════════════════════════════════
story.append(P("Section 1: Project Structure", 'H1'))
story.append(P("The project follows Next.js 16 App Router with a (site) route group for public pages and a separate /admin route. The architecture separates concerns into components/pages/, lib/, store/ (Zustand), and hooks/. However, there are significant structural issues."))
story.append(F('CRITICAL', 'S-1.1', 'No middleware.ts exists', 'All route protection is client-side only via localStorage token checks. There is zero server-side protection for /admin or write-mutating API routes. Any visitor can curl POST /api/products to create products or DELETE to wipe the catalog.', 'Create src/middleware.ts that protects /admin/* and write-mutating /api/* routes using verifyToken() with admin role check.'))
story.append(F('HIGH', 'S-1.2', 'tool-results/ directory not gitignored', 'The tool-results/ directory containing 100+ agent scratch .txt files is tracked in git and will bloat the repository.', 'Add tool-results/ to .gitignore immediately.'))
story.append(F('HIGH', 'S-1.3', 'upload/ directory world-writable', 'The upload/ directory has drwxrwxrwx permissions (world-writable, owned by root). This is a security vulnerability on shared hosts.', 'chmod 755 upload/ and consider moving uploads to cloud storage.'))
story.append(F('HIGH', 'S-1.4', '--timeout file in project root', 'A 105KB PNG file named --timeout exists in the root directory, created by a misparsed bash command.', 'Delete the file.'))
story.append(F('MEDIUM', 'S-1.5', 'download/ contains dev artifacts', '14 PNG screenshots, a .docx guide, and cctv-guide-images/ are in the repo root instead of docs/ or public/.', 'Move documentation to docs/ and product images to public/.'))
story.append(F('MEDIUM', 'S-1.6', 'examples/websocket/ not integrated', 'Contains server.ts and frontend.tsx with cors: { origin: "*" }. Excluded from ESLint. Dead code.', 'Delete the examples/ directory or remove it from git.'))
story.append(F('MEDIUM', 'S-1.7', 'No error.tsx or not-found.tsx', 'No error boundary or custom 404 page exists anywhere. Users see default Next.js pages for errors and unknown routes.', 'Create src/app/(site)/error.tsx and src/app/not-found.tsx with branded UI.'))
story.append(F('MEDIUM', 'S-1.8', 'No sitemap.ts or manifest.ts', 'No sitemap.xml for SEO and no PWA web manifest file.', 'Create src/app/sitemap.ts and src/app/manifest.ts.'))
story.append(F('LOW', 'S-1.9', 'package.json has boilerplate name', 'The name field is "nextjs_tailwind_shadcn_ts" instead of the product name "ConnectZ".', 'Rename to connectz-cctv-platform.'))
story.append(section_divider())

# ═══════════════════════════════════════════════════════════════════
# SECTION 2: NEXT.JS REVIEW
# ═══════════════════════════════════════════════════════════════════
story.append(P("Section 2: Next.js Review", 'H1'))
story.append(P("The project uses Next.js 16.1.3 with App Router, Turbopack, React 19, and Tailwind CSS v4. All 13 routes have loading.tsx files (excellent). However, there are critical config issues."))
story.append(F('CRITICAL', 'S-2.1', 'ignoreBuildErrors: true in next.config.ts', 'TypeScript errors are silently swallowed at build time. Production deploys can ship broken types.', 'Remove typescript.ignoreBuildErrors or set to false.'))
story.append(F('HIGH', 'S-2.2', 'reactStrictMode: false', 'Disables React development-mode checks for unsafe lifecycles, deprecated APIs, and double-render detection.', 'Set reactStrictMode to true (the default).'))
story.append(F('HIGH', 'S-2.3', 'No security headers configured', 'No CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, or HSTS headers.', 'Add async headers() returning security headers in next.config.ts.'))
story.append(F('HIGH', 'S-2.4', 'poweredByHeader not disabled', 'Next.js exposes X-Powered-By: Next.js header, aiding server fingerprinting.', 'Set poweredByHeader: false in next.config.ts.'))
story.append(F('HIGH', 'S-2.5', 'Tailwind config file is dead (v3 format on v4 project)', 'tailwind.config.ts uses v3 Config type and tailwindcss-animate plugin, but the project is on Tailwind v4. globals.css does not reference it via @config.', 'Delete tailwind.config.ts or wire it via @config directive in globals.css.'))
story.append(F('MEDIUM', 'S-2.6', 'No redirects or rewrites configured', 'Common e-commerce redirects (www, http->https, trailing slash) are missing.', 'Add redirects() for canonical URLs.'))
story.append(F('MEDIUM', 'S-2.7', 'Image remote patterns stale', 'images.remotePatterns includes **.supabase.co and lh3.googleusercontent.com but project uses SQLite and has no Google auth.', 'Remove stale image domains.'))
story.append(F('MEDIUM', 'S-2.8', 'AppInitializer fetches all products on every page', 'AppInitializer in (site)/layout.tsx calls fetch("/api/products") on every navigation with no caching.', 'Use React Query (already installed but unused) or server-side data passing.'))
story.append(F('MEDIUM', 'S-2.9', 'tsconfig target is ES2017', 'Outdated target for Node 20+. Modern syntax gets downleveled unnecessarily.', 'Bump to ES2022.'))
story.append(F('MEDIUM', 'S-2.10', 'noImplicitAny: false', 'Combined with ESLint disabling no-explicit-any, the codebase is effectively untyped for any values.', 'Set to true.'))
story.append(section_divider())

# ═══════════════════════════════════════════════════════════════════
# SECTION 3: DATABASE REVIEW
# ═══════════════════════════════════════════════════════════════════
story.append(P("Section 3: Database Review", 'H1'))
story.append(P("The Prisma schema defines 5 models (User, CctvProduct, Order, OrderItem, AdminSettings) on SQLite. However, multiple critical issues exist including plaintext passwords, missing indexes, unused models, and missing tables for a full e-commerce platform."))
story.append(F('CRITICAL', 'S-3.1', 'Plaintext password storage', 'User.password stores raw plaintext. bcryptjs is installed but NEVER imported. signup/route.ts writes password directly; login/route.ts compares with !==.', 'Use bcrypt.hash() on signup and bcrypt.compare() on login. Add migration for existing data.'))
story.append(F('CRITICAL', 'S-3.2', 'Committed Supabase production credentials', 'scripts/seed-supabase.ts and seed-admin.ts contain a full PostgreSQL connection string with password: postgresql://postgres.debbzwyfvlkpsiozfbli:2lj9wOTytwVSYpvf@...', 'Delete both seed scripts, rotate the compromised database password.'))
story.append(F('CRITICAL', 'S-3.3', 'Duplicate SQLite database files', 'db/custom.db (40KB, Jul 17) and prisma/db/custom.db (61KB, Jul 20) are different files. .env points to the wrong one.', 'Use a single DB path relative to project root.'))
story.append(F('HIGH', 'S-3.4', 'No database indexes', 'No @@index on CctvProduct.brand, cameraType, price, or Order.status. Every query scans the full table.', 'Add @@index on brand, cameraType, price, createdAt for products and status, createdAt for orders.'))
story.append(F('HIGH', 'S-3.5', 'Float type for currency fields', 'CctvProduct.price and Order.totalAmount use Float, causing rounding errors with monetary values.', 'Change to Decimal or store as integer paise.'))
story.append(F('HIGH', 'S-3.6', 'Role stored as free-text string', 'User.role is String @default("customer") with no enum constraint. Typos in role assignment are silent bugs.', 'Use Prisma enum: enum Role { CUSTOMER ADMIN }.', ))
story.append(F('HIGH', 'S-3.7', 'OrderItem model never used', 'OrderItem is defined in schema with relations to Order and CctvProduct but no code ever writes to it. Orders use quoteData JSON string instead.', 'Implement normalized order items or remove the dead model.'))
story.append(F('HIGH', 'S-3.8', 'AdminSettings model never used', 'AdminSettings exists in schema but no API, no UI, and no code references it. Admin settings stored in localStorage.', 'Either implement AdminSettings API or remove the model.'))
story.append(F('MEDIUM', 'S-3.9', 'No soft-delete on any model', 'No deletedAt field. Deleted products are permanently gone.', 'Add deletedAt DateTime? to CctvProduct for soft-delete.'))
story.append(F('MEDIUM', 'S-3.10', 'Missing tables for full e-commerce', 'No Category, Brand, Review, Wishlist, Coupon, Address, Invoice, Payment, Shipping, ContactMessage, SupportTicket tables.', 'Add tables as business needs grow.'))
story.append(section_divider())

# ═══════════════════════════════════════════════════════════════════
# SECTION 4: CRUD ANALYSIS
# ═════════════════════════════════════════════════════════════════
story.append(P("Section 4: CRUD Analysis", 'H1'))
story.append(P("This section maps the CRUD completeness for every entity in the system, showing what exists in the database, API, frontend, and admin panel."))
crud_data = [
    ["Entity", "DB Model", "List API", "Create API", "Update API", "Delete API", "Admin UI", "Missing"],
    ["Products", "Yes", "Yes", "Yes (NO AUTH)", "Yes (NO AUTH)", "Yes (NO AUTH)", "Yes", "Auth protection"],
    ["Users", "Yes", "No", "Yes (signup)", "No", "No", "No", "Full user CRUD API + admin page"],
    ["Orders", "Yes", "No", "Yes (create-order)", "Yes (verify)", "No", "No", "Order list, fulfill, cancel"],
    ["OrderItems", "Yes", "No", "No", "No", "No", "No", "Never written to"],
    ["Auth", "No", "Login+Verify", "Signup", "No", "No", "Login page", "Logout, refresh, forgot-pwd"],
    ["Payments", "No", "No", "Create+Verify", "No", "No", "No", "Webhook, refund, history"],
    ["AdminSettings", "Yes", "No", "No", "No", "No", "No (localStorage)", "DB-backed settings API"],
    ["Cart", "No", "No", "No", "No", "No", "Yes (localStorage)", "Server-side cart sync"],
    ["Brands", "No", "No", "No", "No", "No", "No", "Brand table + admin"],
    ["Categories", "No", "No", "No", "No", "No", "No", "Category system"],
    ["Reviews", "No", "No", "No", "No", "No", "No", "Full review system"],
    ["Coupons", "No", "No", "No", "No", "No", "No", "Coupon system"],
    ["Inventory", "No", "No", "No", "No", "No", "No", "Stock tracking"],
    ["Contact", "No", "No", "No", "No", "No", "No", "Contact API + messages"],
]
crud_table_data = []
for row in crud_data:
    crud_table_data.append([P(f'<b>{row[0]}</b>', 'TableCellBold')]
            + [P(v, 'TableCell') for v in row[1:]])
crud_t = Table(crud_table_data, colWidths=[55*mm] + [19*mm]*7)
crud_t.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, -1), C_DARK), ('TEXTCOLOR', (0, 0), (0, -1), C_WHITE),
    ('BACKGROUND', (0, 1), (-1, -1), C_WHITE),
    ('GRID', (0, 0), (-1, -1), 0.4, C_BORDER),
    ('TOPPADDING', (0, 0), (-1, -1), 3), ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ('LEFTPADDING', (0, 0), (-1, -1), 4), ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('FONTSIZE', (0,0), (-1,-1), 8),
]))
story.append(crud_t)
story.append(section_divider())

# ═════════════════════════════════════════════════════════════════
# SECTION 5: API REVIEW
# ═════════════════════════════════════════════════════════════════════════════
story.append(P("Section 5: API Review", 'H1'))
story.append(P("The project has 8 API routes. The most critical finding is that product CRUD endpoints have zero authentication, meaning anyone on the internet can create, edit, or delete products. Payment endpoints also lack auth and amount verification."))
story.append(F('CRITICAL', 'S-5.1', 'No auth on POST/PUT/DELETE /api/products', 'Anyone can create, edit, or delete products with zero authentication. No verifyToken, no admin role check. This is the most exploitable vulnerability.', 'Add middleware.ts or auth helper. Check verifyToken + role===\"admin\" on write operations.'))
story.append(F('CRITICAL', 'S-5.2', 'Payment amount not server-verified', 'create-order accepts client-supplied amount directly. Attacker can pay 1 rupee for a 50,000 order. Verify endpoint does not compare Razorpay amount_paid to DB totalAmount.', 'Recompute total from quoteData/product IDs server-side. Verify amount_paid matches in verify endpoint.'))
story.append(F('CRITICAL', 'S-5.3', 'No Razorpay webhook endpoint', 'If user closes browser after paying but before client-side verify fires, order stays \"pending\" forever. No reconciliation mechanism.', 'Create /api/payments/webhook/route.ts with Razorpay webhook signature verification.'))
story.append(F('HIGH', 'S-5.4', 'No rate limiting on /api/auth/login', 'No brute-force protection. An attacker can try unlimited password attempts.', 'Add rate limiting (express-rate-limit or in-memory counter) and account lockout after N failures.'))
story.append(F('HIGH', 'S-5.5', 'No input validation with zod', 'zod is installed but never used. No email format, phone format, password strength, or field length validation on any route.', 'Create zod schemas for each endpoint and validate req.body.'))
story.append(F('HIGH', 'S-5.6', 'Inconsistent API response shapes', 'Three different error formats: { success:false, message }, { success:false, error }, { valid:false }. No standard error envelope.', 'Standardize to { success: boolean, data?, error?: { code, message } }. Use shared error handler.'))
story.append(F('HIGH', 'S-5.7', 'No pagination on GET /api/products', 'Returns entire catalog. Will not scale as product count grows.', 'Add limit/offset or cursor-based pagination.'))
story.append(F('HIGH', 'S-5.8', 'sortBy query param not whitelisted', 'sortBy taken directly from query string and passed to Prisma orderBy. Invalid values cause 500 instead of 400.', 'Whitelist allowed sort fields: price, createdAt, modelName, brand.'))
story.append(F('MEDIUM', 'S-5.9', 'Error responses leak internal details', 'payments/verify returns error.message directly to client, potentially exposing Razorpay internals.', 'Sanitize error messages before sending to client.'))
story.append(F('MEDIUM', 'S-5.10', '/api/ route returns placeholder', 'Returns { message: "Hello, world!" } - dead scaffold endpoint.', 'Remove or convert to /api/health.'))
story.append(section_divider())

# ═════════════════════════════════════════════════════════════════
# SECTION 6: AUTHENTICATION
# ═══════════════════════════════════════════════════════════════════
story.append(P("Section 6: Authentication", 'H1'))
story.append(P("Authentication uses a custom JWT system implemented in src/lib/auth.ts. Admin credentials are hardcoded with insecure fallbacks. Tokens are stored in localStorage (XSS-vulnerable). There is no refresh token rotation, no password reset, and no email verification."))
story.append(F('CRITICAL', 'S-6.1', 'Hardcoded admin password as fallback', 'login/route.ts line 6: ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "CCTV@Admin2024!Secure". If env var is unset, this is the live password. Same password also committed in scripts/seed-admin.ts.', 'Remove hardcoded fallback. Throw error if env var missing. Rotate the exposed password.'))
story.append(F('CRITICAL', 'S-6.2', 'Weak JWT secret fallback', 'auth.ts line 3: JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me". If env var missing, anyone can forge JWTs.', 'Remove fallback. Throw error at startup if JWT_SECRET not set.'))
story.append(F('CRITICAL', 'S-6.3', 'JWT stored in localStorage', 'Tokens in localStorage are readable by any XSS payload. Used in app-store.ts (connectz_token) and admin-client.tsx (admin_token).', 'Move to httpOnly cookies. Set token via Set-Cookie header on login.'))
story.append(F('HIGH', 'S-6.4', 'No email verification flow', 'Signup creates account immediately usable. No verification email sent.', 'Send verification email with token. Require verification before first purchase.'))
story.append(F('HIGH', 'S-6.5', 'No password reset or forgot-password', 'No way for users to reset passwords. Only option is to contact admin.', 'Implement /api/auth/forgot-password and /api/auth/reset-password.'))
story.append(F('HIGH', 'S-6.6', 'Admin login has no role check', 'admin-login.tsx calls onLogin(token, user) regardless of user.role. Any logged-in customer sees AdminPanel.', 'Verify role === "admin" after login before showing admin UI.'))
story.append(F('HIGH', 'S-6.7', 'No logout API endpoint', 'Logout is client-side only (localStorage clear). JWT remains valid server-side until 7-day expiry.', 'Create POST /api/auth/logout. Implement token blacklist or short-lived tokens.'))
story.append(F('MEDIUM', 'S-6.8', 'No refresh token rotation', 'Single access token with 7-day expiry. No rotation mechanism.', 'Implement refresh token pair.'))
story.append(F('MEDIUM', 'S-6.9', 'JSON.parse on localStorage without try/catch', 'app-store.ts lines 53-54 parse connectz_cart and connectz_user without error handling. Corrupted data crashes the entire app.', 'Wrap all JSON.parse calls in try/catch.'))
story.append(section_divider())
# ═════════════════════════════════════════════════════════════════
# SECTION 7: ADMIN PANEL
# ═════════════════════════════════════════════════════════════════════════════
story.append(P("Section 7: Admin Panel", 'H1'))
story.append(P("The admin panel (admin-panel.tsx, 674 lines) is a monolithic component handling products, quotes, and settings. It has no orders tab, no users tab, no analytics, and settings are per-device (localStorage)."))
story.append(F('HIGH', 'S-7.1', 'No Orders management tab', 'Admin cannot see, fulfill, cancel, or refund orders. The Order model exists in DB but has no admin UI.', 'Add Orders tab with list, detail, status management (pending/shipped/delivered/cancelled).'))
story.append(F('HIGH', 'S-7.2', 'No Users management tab', 'Admin cannot view, edit, or manage customer accounts.', 'Add Users tab with list, role toggle, account disable.'))
story.append(F('HIGH', 'S-7.3', 'Admin settings stored in localStorage', 'SettingsTab writes to localStorage("cctv_admin_settings"). Per-device, not shared between admin sessions.', 'Implement GET/PUT /api/admin/settings using the AdminSettings Prisma model.'))
story.append(F('HIGH', 'S-7.4', 'No product pagination in admin', 'All products loaded and rendered at once. Will degrade with 50+ products.', 'Add server-side pagination with page controls.'))
story.append(F('MEDIUM', 'S-7.5', 'Monolithic 674-line component', 'admin-panel.tsx handles products, quotes, and settings in one file. Should be split into separate components.', 'Split into AdminProducts, AdminQuotes, AdminSettings, AdminDashboard components.'))
story.append(F('MEDIUM', 'S-7.6', 'Uses confirm() and prompt()', 'Admin panel uses blocking browser dialogs (confirm, prompt) that do not work well on mobile Safari.', 'Use shadcn AlertDialog for confirmations, Input for text prompts.'))
story.append(F('MEDIUM', 'S-7.7', 'No image upload', 'Only URL field for product images. No drag-and-drop upload to cloud storage.', 'Add /api/upload endpoint with S3/Supabase Storage integration.'))
story.append(section_divider())
# ═════════════════════════════════════════════════════════════════
# SECTION 8: FRONTEND REVIEW
# ═════════════════════════════════════════════════════════════════════════════
story.append(P("Section 8: Frontend Review", 'H1'))
story.append(P("All 13 routes have loading.tsx files using the shared PageSkeleton component with appropriate variants. The UI uses Tailwind CSS with shadcn/ui components. Major issues include: email typo visible to users, duplicate back-to-top button, inconsistent SEO metadata, and missing error/404 pages."))
story.append(F('HIGH', 'S-8.1', 'Email typo visible on home page', 'home-page.tsx line 1069 displays "connectzsalesandervices@gmail.com" (missing \"s\" in services) but the mailto link has the correct email.', 'Fix line 1069 to use BRAND.email constant or correct the typo.'))
story.append(F('HIGH', 'S-8.2', 'No error.tsx or not-found.tsx', 'No branded error or 404 pages. Runtime errors and unknown routes show default Next.js pages.', 'Create src/app/(site)/error.tsx and src/app/not-found.tsx.'))
story.append(F('HIGH', 'S-8.3', 'Duplicate BackToTop button', 'home-page.tsx defines its own BackToTop (fixed bottom-24 right-6 z-40). Site footer also has one (fixed bottom-6 right-6 z-40). Two buttons visible on home page.', 'Remove BackToTop from home-page.tsx.'))
story.append(F('HIGH', 'S-8.4', 'Product detail has static metadata', 'generateMetadata returns generic "Loading Product..." title. The id param is available but not used to fetch real product data for SEO.', 'Fetch product in generateMetadata and return actual name/brand/description.'))
story.append(F('MEDIUM', 'S-8.5', 'Inconsistent page titles (no brand prefix)', 'About, Contact, Products, Builder, Cart, Checkout, Dashboard, Auth, Privacy, Terms pages all lack "| ConnectZ" prefix.', 'Add brand prefix to all page titles for consistent SEO.'))
story.append(F('MEDIUM', 'S-8.6', 'Cart/Checkout/Dashboard/Auth not noindexed', 'These pages should have robots: { index: false } in metadata to prevent search indexing.', 'Add robots: { index: false } to private pages.'))
story.append(F('MEDIUM', 'S-8.7', 'Dead /refund link in terms page', 'terms-page.tsx line 119 links to /refund which has no route. Clicking it shows default 404.', 'Remove the /refund link or create the page.'))
story.append(F('MEDIUM', 'S-8.8', 'Inconsistent working hours', 'Home page says "Mon-Sat: 9 AM-7 PM". Footer says "Mon-Sat: 9 AM-8 PM, Sun: 10 AM-6 PM".', 'Centralize working hours in BRAND constants.'))
story.append(F('MEDIUM', 'S-8.9', 'Inconsistent stat numbers', 'Home: "15+ Top Brands", About: "10+ Brand Partners". Home: "500+ Happy Customers", About: "500+ Products Delivered".', 'Use a single source of truth for all stats.'))
story.append(F('MEDIUM', 'S-8.10', 'Home page hardcodes contact info', 'Phone, email, WhatsApp URL hardcoded in CONTACT_CARDS array instead of using BRAND constants.', 'Import and use BRAND.phone, BRAND.email, BRAND.whatsapp.'))
story.append(section_divider())
# ═════════════════════════════════════════════════════════════════
# SECTION 9: ROUTING REVIEW
# ═════════════════════════════════════════════════════════════════════════════
story.append(P("Section 9: Routing Review", 'H1'))
story.append(P("All header and footer navigation links have been verified. 6 header nav links and 2 footer legal links all point to valid routes. One dead link was found in the terms page. Social media links in footer use placeholder URLs."))
story.append(F('HIGH', 'S-9.1', 'Dead /refund link in terms page', 'terms-page.tsx line 119 links to /refund which does not exist as a route.', 'Remove the link or create the refund page.'))
.append(F('MEDIUM', 'S-9.2', 'Social media links are placeholders', 'Facebook, Instagram, LinkedIn, YouTube URLs are https://<platform>.com/connectz which likely return 404.', 'Update with actual social media handles or remove links.'))
story.append(F('MEDIUM', 'S-9.3', 'Admin link exposed to all users', 'Site header shows Admin link (Settings icon) to everyone including unauthenticated visitors.', 'Hide admin link. Admins access /admin directly via URL.'))
story.append(section_divider())
# SECTIONS 10-12: COMPONENT, SECURITY, PERFORMANCE
story.append(P("Section 10: Component Review", 'H1'))
story.append(F('HIGH', 'S-10.1', '28 of 47 shadcn/ui components unused', 'alert, alert-dialog, aspect-ratio, avatar, breadcrumb, calendar, carousel, chart, checkbox, collapsible, command, context-menu, drawer, form, hover-card, input-otp, menubar, navigation-menu, pagination, popover, radio-group, resizable, scroll-area, sidebar, sonner, switch, table, toggle, toggle-group are never imported outside ui/ folder.', 'Run npx shadcn@latest diff to prune. Remove unused components and their deps.'))
story.append(F('HIGH', 'S-10.2', 'learning-system.tsx is 1496 lines', 'Massive single file with all learning content hardcoded in TSX. Should be split and content moved to data files.', 'Split by section. Move static content to JSON/data files or database.'))
story.append(F('HIGH', 'S-10.3', 'cctv-builder.tsx is 1075 lines', 'Monolithic builder component. Consider splitting by step.', 'Split into step components.'))
story.append(F('MEDIUM', 'S-10.4', 'Duplicate fmt function in razorpay-checkout.tsx', 'Currency formatter duplicated locally instead of importing from @/lib/format.ts.', 'Import fmt from @/lib/format.'))
story.append(F('MEDIUM', 'S-10.5', 'Duplicate WhatsApp URL construction', 'WhatsApp URL built in whatsapp-button.tsx (x2) and floating-whatsapp.tsx with duplicated logic.', 'Extract shared WhatsApp URL builder utility.'))
.append(F('MEDIUM', 'S-10.6', 'use-toast.tsx unused (sonner used instead)', 'Full shadcn toast hook coexists with sonner (which is actually used). Two parallel toast systems.', 'Remove use-toast.tsx and use sonner exclusively.'))
story.append(F('MEDIUM', 'S-10.7', 'design-tokens.ts almost entirely unused', 'Defines space, typography, radius, shadow, layout, transition, button presets but codebase uses raw Tailwind classes everywhere.', 'Adopt tokens across codebase or remove the file.'))
story.append(section_divider())
story.append(P("Section 11: Security Review", 'H1'))
story.append(P("The security posture is critically weak. Plaintext passwords, exposed credentials, no middleware, no rate limiting, no CSP headers, XSS-vulnerable token storage, and unauthenticated admin API access combine to make this easily exploitable."))
story.append(F('CRITICAL', 'S-11.1', 'dangerouslySetInnerHTML in learning-system.tsx', '3 instances of dangerouslySetInnerHTML used to render HTML content from static data. If data source is ever compromised, this is an XSS vector.', 'Use React components to render all content. If HTML must be used, sanitize with DOMPurify.'))
story.append(F('HIGH', 'S-11.2', 'Caddy serves on HTTP :81', 'Caddy listens on :81 without TLS. No automatic HTTPS. Production e-commerce site with payments served over plain HTTP.', 'Configure Caddy for port 443 with auto-TLS.'))
story.append(F('HIGH', 'S-11.3', 'XTransformPort SSRF risk in Caddy', 'Caddyfile has XTransformPort query-param reverse-proxy that allows proxying to any localhost port.', 'Remove the XTransformPort feature or restrict allowed ports.'))
story.append(F('MEDIUM', 'S-11.4', 'No CORS configuration on API routes', 'APIs are callable from any origin without restriction.', 'Add CORS headers allowing only your domain.'))
story.append(section_divider())
.append(P("Section 12: Performance Review", 'H1'))
story.append(F('HIGH', 'S-12.1', '22 unused production packages', 'bcryptjs, next-auth, @tanstack/react-query, @tanstack/react-table, @mdxeditor/editor, react-markdown, react-syntax-highlighter, z-ai-web-dev-sdk, and more are installed but never imported. This bloats node_modules and increases install/build time.', 'Run npx depcheck and remove all unused packages.'))
story.append(F('HIGH', 'S-12.2', 'No pagination on product APIs', 'GET /api/products returns entire catalog. Admin panel also loads all products at once.', 'Add cursor or offset-based pagination.'))
story.append(F('HIGH', 'S-12.3', 'No caching layer', 'Every API request hits SQLite directly. No Redis, no in-memory cache, no HTTP cache headers.', 'Add Cache-Control headers. Consider Redis for frequently-accessed data.'))
story.append(F('MEDIUM', 'S-12.4', 'Dynamic import in payment route', 'create-order/route.ts uses dynamic import() for @/lib/db instead of top-level static import. Hurts cold start.', 'Use static import at top of file.'))
story.append(F('MEDIUM', 'S-12.5', 'No select() in Zustand stores', 'Components subscribe to entire store objects. Re-renders on any state change.', 'Use useStore(selector) or Zustand selectors to subscribe to specific fields.'))
story.append(F('MEDIUM', 'S-12.6', 'Product images not optimized', 'Product images use raw <img> tags with external URLs instead of next/image.', 'Replace <img> with next/image with proper sizing.'))
.append(section_divider())
# SECTIONS 13-16: UI/UX, FILE UPLOAD, PAYMENT, DB VS UI
story.append(P("Section 13: UI/UX Review", 'H1'))
story.append(P("The UI uses a clean emerald-on-dark design system with shadcn/ui components. Dark mode is supported via next-themes. Design is generally consistent but has some inconsistencies."))
story.append(F('MEDIUM', 'S-13.1', 'Inconsistent dark mode support across components', 'admin-panel.tsx and admin-login.tsx have almost zero dark: classes. Footer uses hardcoded bg-[#111827] instead of theme-aware classes.', 'Add dark: variants to admin components.'))
story.append(F('MEDIUM', 'S-13.2', 'FAQ section missing aria-controls', 'Home page FAQ accordion uses role=button and aria-expanded but no aria-controls to link button to content panel.', 'Add aria-controls="faq-{i}" and matching id on content divs.'))
story.append(section_divider())
.append(P("Section 14: File Upload Review", 'H1'))
story.append(P("The project has NO file upload capability. Product images are referenced by URL only. There is no /api/upload endpoint. The admin panel has a URL input field for images."))
story.append(F('HIGH', 'S-14.1', 'No image upload endpoint or cloud storage', 'No way to upload product images through the admin panel. Images must be hosted externally and pasted as URLs.', 'Implement /api/upload with S3 or Supabase Storage integration.'))
story.append(section_divider())
.append(P("Section 15: Payment Review", 'H1'))
story.append(P("Razorpay integration exists but has critical gaps. The success flow works (create order, pay, verify signature) but there is no failure recovery, no amount verification, no webhook, and no idempotency."))
story.append(F('CRITICAL', 'S-15.1', 'Payment amount not verified server-side', 'Server trusts client-supplied amount. Attacker can intercept checkout and change amount to 1 rupee.', 'Recompute total from quoteData on server. Compare Razorpay amount_paid in verify.'))
.append(F('CRITICAL', 'S-15.2', 'No payment webhook', 'No /api/payments/webhook. Browser close after paying = stuck pending order forever.', 'Create webhook endpoint with Razorpay webhook signature verification.'))
story.append(F('HIGH', 'S-15.3', 'No idempotency on payment creation', 'Double-clicking pay button creates duplicate orders. Receipt format cctv_${Date.now()} not unique under concurrency.', 'Add idempotency key parameter. Use crypto.randomUUID().'))
story.append(F('HIGH', 'S-15.4', 'No refund flow', 'No API to initiate refunds through Razorpay. No refund UI.', 'Implement /api/payments/refund endpoint.'))
story.append(F('HIGH', 'S-15.5', 'Orders not linked to user accounts', 'Order.userId field exists in schema but is never set in create-order route. Even logged-in users create orphaned orders.', 'Pass auth token, extract user ID, set Order.userId.'))
story.append(F('MEDIUM', 'S-15.6', 'No payment method tracking', 'No record of UPI vs card vs netbanking payment method.', 'Record payment_method in Order schema and from Razorpay response.'))
.append(section_divider())
.append(P("Section 16: Database vs UI Cross-Reference", 'H1'))
story.append(P("Several database models, API routes, and UI features are disconnected. The AdminSettings model has no API or UI. OrderItem model has no writing code. Quotes are stored per-device in localStorage rather than in the database."))
story.append(F('HIGH', 'S-16.1', 'AdminSettings model has no API or UI', 'Prisma model exists but no API route, no admin settings page in UI. Settings stored in localStorage.', 'Create GET/PUT /api/admin/settings and use the model.'))
story.append(F('HIGH', 'S-16.2', 'OrderItem model is dead code', 'Defined in schema with full relations but no code ever creates OrderItem records.', 'Implement normalized order items or remove the model.'))
story.append(F('MEDIUM', 'S-16.3', 'Quotes stored in localStorage only', 'Builder quotes and admin saved quotes are per-device. No server-side persistence.', 'Add quotes table and API for persistence.'))
story.append(section_divider())
# SECTION 17: DEAD CODE
story.append(P("Section 17: Dead Code", 'H1'))
story.append(F('HIGH', 'S-17.1', '28 unused shadcn/ui components', 'alert, alert-dialog, aspect-ratio, avatar, breadcrumb, calendar, carousel, chart, checkbox, collapsible, command, context-menu, drawer, form, hover-card, input-otp, menubar, navigation-menu, pagination, popover, radio-group, resizable, scroll-area, sidebar, sonner, switch, table, toggle, toggle-group.', 'Prune with npx shadcn@latest diff.'))
story.append(F('HIGH', 'S-17.2', '/api/route.ts placeholder', 'Returns { message: "Hello, world!" } — never consumed.', 'Remove or convert to /api/health.'))
.append(F('MEDIUM', 'S-17.3', 'examples/websocket/ dead code', 'server.ts + frontend.tsx with cors: origin: *. Not wired into the app.', 'Delete the directory.'))
story.append(F('MEDIUM', 'S-17.4', 'UserProfile dead fields', 'address, city, state, pincode fields in app-store.ts UserProfile interface are never populated anywhere.', 'Remove dead fields or implement address management.'))
story.append(F('MEDIUM', 'S-17.5', 'SEED_PRODUCTS duplicated in admin-panel', '20 products hardcoded in admin-panel.tsx (lines 432-459) duplicating scripts/seed-products.ts purpose.', 'Remove inline seed data. Use seed script or batch API.'))
.append(F('MEDIUM', 'S-17.6', 'QUICK_TYPES duplicated in multiple files', 'Camera type options defined in camera-types.tsx, admin-panel.tsx, builder-store.ts, and cctv-store.ts.', 'Single source of truth in camera-types.tsx, import everywhere else.'))
story.append(section_divider())
# SECTION 18: DEPENDENCIES
story.append(P("Section 18: Dependencies", 'H1'))
story.append(F('CRITICAL', 'S-18.1', 'bcryptjs installed but NEVER used', 'Password hashing library is installed in package.json line 52 but never imported anywhere in src/. Passwords stored as plaintext.', 'Use it immediately for password hashing (see S-3.1).'))
story.append(F('HIGH', 'S-18.2', 'next-auth installed but NEVER used', 'Full NextAuth library installed but custom JWT auth implemented instead.', 'Remove next-auth from dependencies.'))
story.append(F('HIGH', 'S-18.3', '@tanstack/react-query installed but NEVER used', 'React Query installed but app uses raw fetch() everywhere with no caching.', 'Adopt React Query for data fetching or remove.'))
story.append(F('HIGH', 'S-18.4', 'zod installed but NEVER used', 'Schema validation library installed but no zod schemas exist on any API route.', 'Create validation schemas for all API inputs.'))
.append(F('HIGH', 'S-18.5', 'react-hook-form + @hookform/resolvers unused', 'Form library installed but admin form uses uncontrolled useState inputs.', 'Adopt for admin product form or remove.'))
story.append(F('MEDIUM', 'S-18.6', 'prisma in dependencies (not devDependencies)', 'prisma CLI is a build tool, should be in devDependencies. Only @prisma/client belongs in dependencies.', 'Move prisma to devDependencies.'))
story.append(F('MEDIUM', 'S-18.7', 'Heavy unused packages', '@mdxeditor/editor (~5MB), react-syntax-highlighter, sharp, @dnd-kit/*, recharts, @reactuses/core are all unused.', 'Remove all.'))
.append(section_divider())
# SECTION 19: BUGS
story.append(P("Section 19: Bugs", 'H1'))
story.append(F('HIGH', 'S-19.1', 'Email display typo on home page', 'connectzsalesandervices@gmail.com (missing s in services) displayed in contact section. mailto link has correct email.', 'Fix the displayed text to match BRAND.email.'))
story.append(F('MEDIUM', 'S-19.2', 'Duplicate py classes in product detail client', 'product-detail-client.tsx has both py-8 sm:py-10 and py-20 on the same element. The later wins, making the earlier dead.', 'Remove py-8 sm:py-10.'))
story.append(F('MEDIUM', 'S-19.3', 'Silent API error catching', 'product-detail-client.tsx line 30: .catch(() => {}). User sees infinite spinner on failure with no error message.', 'Add error state with retry button.'))
.append(F('MEDIUM', 'S-19.4', 'Dashboard loading flash for unauthenticated users', 'When unauthenticated user visits /dashboard, loading skeleton briefly flashes before client redirect to /auth.', 'Move auth check to server component page.tsx or use redirect().'))
story.append(section_divider())
# SECTION 20: PRODUCTION READINESS
story.append(P("Section 20: Production Readiness", 'H1'))
story.append(F('CRITICAL', 'S-20.1', 'No .env.example file', 'Required env vars (JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, DATABASE_URL) are not documented.', 'Create .env.example with all required variables documented.'))
story.append(F('CRITICAL', 'S-20.2', '.env committed to git', 'The .env file (containing DATABASE_URL) is tracked in git despite .gitignore.', 'Remove from git tracking: git rm --cached .env.'))
.append(F('HIGH', 'S-20.3', 'No Dockerfile or docker-compose.yml', 'No containerization exists for deployment.', 'Create Dockerfile and docker-compose.yml for production.'))
.append(F('HIGH', 'S-20.4', 'No CI/CD pipeline', 'No GitHub Actions, no automated testing, no automated deployment.', 'Create .github/workflows/ci.yml and deploy.yml.'))
.append(F('HIGH', 'S-20.5', 'No monitoring or error tracking', 'No Sentry, no Datadog, no health checks, no structured logging.', 'Add Sentry for error tracking. Add /api/health endpoint.'))
story.append(F('HIGH', 'S-20.6', 'No backup strategy', 'SQLite database file has no backup. If corrupted, all data is lost.', 'Implement scheduled SQLite backup to cloud storage.'))
story.append(F('MEDIUM', 'S-20.7', 'Caddy on HTTP :81', 'Production served over plain HTTP without TLS. No rate limiting.', 'Configure port 443 with auto-TLS.'))
story.append(section_divider())
# SECTION 21: IMPROVEMENTS
story.append(P("Section 21: Suggested Improvements", 'H1'))
improvements = [
    ("Inventory Management", "Track stock levels per product. Alert admin on low stock. Auto-hide out-of-stock items."),
    ("Analytics Dashboard", "Revenue charts, order trends, conversion funnels, popular products."),
    ("Order Management", "Admin can list, view details, update status (pending/paid/shipped/delivered/cancelled)."),
    ("Email Notifications", "Order confirmation, shipping update, delivery confirmation via email."),
    ("Wishlist", "Allow customers to save products for later. Persist in DB."),
    ("Reviews System", "Star ratings, text reviews, photo uploads on product pages."),
    ("Coupon/Discount System", "Promo codes, percentage/flat discounts, minimum order amounts."),
    ("Role Management", "Multiple admin levels (super-admin, editor, viewer)."),
    ("Audit Logs", "Track all admin actions (product changes, order updates, login attempts)."),
    ("Invoice Generator", "Auto-generate GST invoices for paid orders."),
    ("Returns System", "Return requests, refund processing, exchange management."),
    ("AI-Powered Search", "Semantic product search using embeddings."),
    ("Product Recommendations", "Based on viewing history and cart contents."),
    ("SMS Notifications", "Order updates via SMS for non-email users."),
    ("WhatsApp Business API", "Automated order updates via WhatsApp."),
]
for title, desc in improvements:
    story.append(P(f"<b>{title}:</b> {desc}", 'BulletBody'))
story.append(section_divider())
# SECTION 22: CODE QUALITY
story.append(P("Section 22: Code Quality", 'H1'))
story.append(F('CRITICAL', 'S-22.1', 'ESLint config disables all safety rules', 'no-explicit-any, no-unused-vars, exhaustive-deps, prefer-const, no-console, no-debugger, no-empty, no-redeclare, no-undef are all disabled.', 'Re-enable critical rules. Keep only intentional suppressions.'))
story.append(F('HIGH', 'S-22.2', 'Product field list duplicated 3 times', 'Product create (API), update (API), and admin form (UI) each manually list all 15+ fields. Any schema change requires 3 updates.', 'Create shared Prisma product schema object or use zod schema.'))
append(F('MEDIUM', 'S-22.3', 'Magic string localStorage keys', 'connectz_cart, connectz_token, connectz_user, admin_token, admin_user appear as hardcoded strings in 6+ files.', 'Define constants like STORAGE_KEYS.TOKEN in a shared module.'))
story.append(F('MEDIUM', 'S-22.4', 'Silent error swallowing', 'app-initializer.tsx .catch(() => {}), admin-client.tsx .catch(() => {}), product-detail .catch(() => {}). Users see no feedback on failures.', 'Replace with error state + retry button or toast notification.'))
story.append(section_divider())
# SECTION 23: FINAL REPORT
story.append(P("Section 23: Final Report", 'H1'))
story.append(P("This section consolidates all findings into categorized summary tables with priority levels."))
story.append(P("<b>A. Security Issues (Critical/High)</b>", 'H3'))
sec_a = [
    ("CRITICAL", "Plaintext password storage (bcryptjs unused)", "lib/auth.ts, signup route"),
    ("CRITICAL", "Hardcoded admin credentials in source + committed DB password", "login route, seed scripts"),
    ("CRITICAL", "Weak JWT secret fallback \"fallback-secret-change-me\"", "lib/auth.ts"),
    ("CRITICAL", "No middleware.ts - all routes unprotected server-side", "project root"),
    ("CRITICAL", "No auth on product CRUD APIs", "products/route.ts, products/[id]/route.ts"),
    ("CRITICAL", "Payment amount not server-verified", "payments/create-order route"),
    (CRITICAL", "No Razorpay webhook endpoint", "missing"),
    ("CRITICAL", "JWT in localStorage (XSS target)", "app-store.ts, admin-client.tsx"),
    ("CRITICAL", "ignoreBuildErrors: true in next.config.ts", "next.config.ts"),
    ("CRITICAL", "ESLint disables all safety rules", "eslint.config.mjs"),
    ("HIGH", "No security headers (CSP, HSTS, etc.)", "next.config.ts"),
    ("HIGH", "No rate limiting on login", "auth/login route"),
    ("HIGH", "No CORS configuration", "all API routes"),
    ("HIGH", "Admin login no role check - customers see admin panel", "admin-login.tsx"),
    ("HIGH", "Caddy on HTTP :81, no TLS", "Caddyfile"),
    ("HIGH", "XTransformPort SSRF risk in Caddy", "Caddyfile"),
    ("HIGH", "dangerouslySetInnerHTML in learning-system.tsx", "learning-system.tsx"),
    ("HIGH", "No email/password reset flows", "missing"),
]
for sev, title, loc in sec_a:
    story.append(f"[{sev}] <b>{title}</b> — <font size=8>{loc}</font>", 'BodySmall'))
story.append(P("<b>B. Database Gaps</b>", 'H3'))
sec_b = [
    ("HIGH", "No database indexes on hot queries", "schema.prisma"),
    ("HIGH", "Float for currency (should be Decimal/int)", "schema.prisma"),
    ("HIGH", "Role as free-text string (no enum)", "schema.prisma"),
    ("HIGH", "OrderItem model defined but never written to", "schema.prisma"),
    ("HIGH", "AdminSettings model defined but never used", "schema.prisma"),
    ("HIGH", "Order.userId defined but never set", "schema.prisma, create-order route"),
    ("HIGH", "No soft-delete on any model", "schema.prisma"),
    ("MEDIUM", "No Category, Brand, Review, Coupon tables", "schema.prisma"),
    ("MEDIUM", "Duplicate SQLite database files", "db/custom.db, prisma/db/custom.db"),
]
for sev, title, loc in sec_b:
    story.append(f"[{sev}] <b>{title}</b> — <font size=8>{loc}</font>", 'BodySmall'))
story.append(P("<b>C. Missing Pages</b>", 'H3'))
for title, loc in [("HIGH", "Error boundary (error.tsx)", "missing"), ("HIGH", "Custom 404 page (not-found.tsx)", "missing"), ("HIGH", "Refund policy page (/refund)", "terms-page.tsx"), ("MEDIUM", "Warranty information page", "terms-page.tsx (misleading link)"), ("MEDIUM", "Order management page (admin)", "missing"), ("MEDIUM", "User management page (admin)", "missing"), ("MEDIUM", "Analytics dashboard (admin)", "missing"), ("MEDIUM", "Settings page (admin, DB-backed)", "missing")]:
    story.append(f"[{sev}] {title} — <font size=8>{loc}</font>", 'BodySmall'))
story.append(P("<b>D. Priority Roadmap</b>", 'H3'))
story.append(P("<b>Phase 1 — Security Emergency (Days 1-3)</b>", 'H2'))
story.append(P("1. Rotate ALL leaked credentials (DB password, JWT secret, admin password) and move to env vars", 'Body'))
story.append(P("2. Create src/middleware.ts protecting /admin/* and write-mutating /api/* routes", 'Body'))
story.append(P("3. Hash passwords with bcryptjs (already installed) in signup and login", 'Body'))
story.append(P("4. Add security headers (CSP, HSTS, X-Frame-Options) in next.config.ts", 'Body'))
story.append(P("5. Remove hardcoded fallback credentials from auth.ts and login route", 'Body'))
story.append(P("6. Delete committed seed scripts with Supabase credentials", 'Body'))
story.append(P("<b>Phase 2 — Foundation (Days 4-7)</b>", 'H2'))
story.append(P("7. Re-enable TypeScript strict mode (ignoreBuildErrors: false, noImplicitAny: true)", 'Body'))
story.append(P("8. Re-enable ESLint safety rules", 'Body'))
story.append(P("9. Create error.tsx and not-found.tsx for all route groups", 'Body'))
append(P("10. Add zod validation to all API routes", 'Body'))
story.append(P("11. Standardize API response format", 'Body'))
story.append(P("12. Add pagination to products API", 'Body'))
story.append(P("13. Prune 22 unused packages and 28 unused UI components", 'Body'))
.append(P("<b>Phase 3 — Features (Days 8-21)</b>", 'H2'))
story.append(P("14. Add Orders management to admin", 'Body'))
story.append(P("15. Add Users management to admin", 'Body'))
.append(P("16. Implement Razorpay webhook + amount verification", 'Body'))
story.append(P("17. Move auth tokens to httpOnly cookies", 'Body'))
story.append(P("18. Add email verification and password reset", 'Body'))
story.append(P("19. Add image upload endpoint", 'Body'))
story.append(P("20. Implement review/rating system", 'Body'))
.append(P("21. Add coupon/discount system", 'Body'))
story.append(P("22. Create Dockerfile and CI/CD pipeline", 'Body'))
story.append(P("23. Add Sentry error monitoring and /api/health endpoint", 'Body'))
story.append(P("<b>Phase 4 — Polish (Days 22-30)</b>", 'H2'))
story.append(P("24. Fix all medium/low findings from this audit", 'Body'))
.append(P("25. Add dynamic product metadata for SEO", 'Body'))
story.append(P("26. Centralize all constants (working hours, stats, contact info)", 'Body'))
story.append(P("27. Remove all dead code and duplicated logic", 'Body'))
.append(P("28. Final build verification + push to production", 'Body'))
)
# BUILD
doc = SimpleDocTemplate('/home/z/my-project/download/ConnectZ-Audit-Report.pdf', pagesize=A4, topMargin=MARGIN, bottomMargin=MARGIN, leftMargin=MARGIN, rightMargin=MARGIN)
doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
print(f'PDF saved to /home/z/my-project/download/ConnectZ-Audit-Report.pdf')
