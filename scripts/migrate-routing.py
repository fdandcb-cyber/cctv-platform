#!/usr/bin/env python3
"""Migrate setView() calls to next/link + router.push() across all components."""

import re, os

BASE = "/home/z/my-project/src"

# Mapping from view name to URL path
VIEW_TO_URL = {
    "home": "/",
    "products": "/products",
    "product-detail": None,  # special case
    "cart": "/cart",
    "checkout": "/checkout",
    "login": "/auth",
    "signup": "/auth",
    "dashboard": "/dashboard",
    "about": "/about",
    "contact": "/contact",
    "services": "/services",
    "privacy": "/privacy",
    "terms": "/terms",
    "builder": "/builder",
    "learn": "/learn",
    "admin": "/admin",
    "detail": "/products",  # legacy
    "compare": "/products",  # legacy
    "catalog": "/products",  # legacy
}

FILES_TO_MIGRATE = [
    # (filepath, needs_router, needs_link, remove_setView_import)
    "components/layout/site-header.tsx",
    "components/layout/site-footer.tsx",
    "components/pages/home-page.tsx",
    "components/pages/products-page.tsx",
    "components/pages/product-detail-page.tsx",
    "components/pages/cart-page.tsx",
    "components/pages/checkout-page.tsx",
    "components/pages/auth-page.tsx",
    "components/pages/dashboard-page.tsx",
    "components/pages/about-page.tsx",
    "components/pages/privacy-page.tsx",
    "components/pages/terms-page.tsx",
    "components/pages/contact-page.tsx",
    "components/pages/services-page.tsx",
    "components/learning-system.tsx",
    "components/cctv-builder.tsx",
]

def migrate_file(filepath):
    full = os.path.join(BASE, filepath)
    if not os.path.exists(full):
        print(f"  SKIP (not found): {filepath}")
        return
    
    with open(full, "r") as f:
        content = f.read()
    
    original = content
    
    needs_router = False
    needs_link = False
    
    # Check which imports are already present
    has_use_router = "useRouter" in content and "next/navigation" in content
    has_link = 'from "next/link"' in content or "from 'next/link'" in content
    has_cn_import = 'from "@/lib/utils"' in content
    
    # Find all setView calls and their context
    # Pattern 1: onClick={() => setView("xxx")}
    # Pattern 2: setView("xxx"); (standalone statement)
    
    # We need to handle these patterns:
    # 1. setView("home") -> router.push("/")
    # 2. setView("product-detail") -> needs special handling (product ID)
    # 3. onClick={() => setView("xxx")} -> onClick={() => router.push("/xxx")}
    
    # First, let's identify which files use setView
    setview_count = content.count("setView(")
    if setview_count == 0:
        print(f"  NO CHANGES: {filepath}")
        return
    
    needs_router = True
    
    # Replace setView calls
    # We'll do this in multiple passes
    
    # Pass 1: Handle simple setView("xxx") calls that are standalone or in callbacks
    for view_name, url in VIEW_TO_URL.items():
        if url is None:
            continue
        
        # Pattern: setView("viewname") -> router.push("/url")
        # But we need to be careful not to match inside import statements
        
        # In JSX onClick: onClick={() => setView("xxx")}
        content = content.replace(
            f'setView("{view_name}")',
            f'router.push("{url}")'
        )
    
    # Pass 2: Handle product-detail special cases
    # Pattern: setSelectedProduct(rp); setView("product-detail"); 
    # This should become: router.push(`/products/${rp.id}`)
    # This is in product-detail-page.tsx related products section
    if "product-detail" in original:
        # Handle the related products click pattern:
        # onClick={() => {
        #   useStore.getState().setSelectedProduct(rp);
        #   setView("product-detail");
        #   setQuantity(1);
        #   setImgError(false);
        #   window.scrollTo({ top: 0, behavior: "smooth" });
        # }}
        # Replace with:
        # onClick={() => router.push(`/products/${rp.id}`)}
        old_pattern = """onClick={() => {
                      useStore.getState().setSelectedProduct(rp);
                      router.push("/products");
                      setQuantity(1);
                      setImgError(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}"""
        new_pattern = """onClick={() => router.push(`/products/${rp.id}`)}"""
        content = content.replace(old_pattern, new_pattern)
    
    # Pass 3: Handle the ProductCard handleViewDetails pattern:
    # const handleViewDetails = () => {
    #   setSelectedProduct(p);
    #   setView("product-detail");
    # };
    # This is in products-page.tsx
    if "handleViewDetails" in original and "products-page" in filepath:
        old_func = """  const handleViewDetails = () => {
    setSelectedProduct(p);
    router.push("/products");
  };"""
        new_func = """  const handleViewDetails = () => {
    router.push(`/products/${p.id}`);
  };"""
        content = content.replace(old_func, new_func)
        # Remove setSelectedProduct import if no longer needed
        # Actually keep it, it might be used elsewhere
    
    # Now add useRouter import if needed
    if needs_router and not has_use_router:
        # Add to existing imports
        if 'from "next/navigation"' in content or "from 'next/navigation'" in content:
            pass  # already imported
        else:
            # Add import after the last import
            # Find a good place to add it
            lines = content.split('\n')
            import_indices = []
            for i, line in enumerate(lines):
                if line.strip().startswith('import ') or line.strip().startswith('} from'):
                    import_indices.append(i)
            
            if import_indices:
                last_import_idx = import_indices[-1]
                lines.insert(last_import_idx + 1, 'import { useRouter } from "next/navigation";')
                content = '\n'.join(lines)
    
    # Add const router = useRouter(); after the component function declaration
    # Find the component function and add useRouter after the first line that has useAppStore or similar hooks
    if needs_router and "const router = useRouter();" not in content:
        # Find a good place - after existing hooks
        lines = content.split('\n')
        inserted = False
        for i, line in enumerate(lines):
            if ('useAppStore' in line and '=' in line) or ('useStore' in line and '=' in line):
                # Insert router hook after this line
                lines.insert(i + 1, '  const router = useRouter();')
                content = '\n'.join(lines)
                inserted = True
                break
        
        if not inserted:
            # Try after function declaration
            for i, line in enumerate(lines):
                if 'export function' in line or 'function ' in line:
                    lines.insert(i + 1, '  const router = useRouter();')
                    content = '\n'.join(lines)
                    break
    
    # Remove setView from useAppStore destructuring if present
    # Pattern: const { ..., setView, ... } = useAppStore();
    # We need to remove setView from the destructuring
    content = re.sub(r',?\s*setView(?=,|\s*})', '', content)
    # Clean up double commas
    content = re.sub(r',\s*,', ',', content)
    # Clean up trailing comma before closing brace
    content = re.sub(r',(\s*})', r'\1', content)
    
    # Remove unused import of AppView type if only used for setView
    # Keep the import but remove the type if it's no longer used
    # Actually let's keep it for now, it won't cause errors
    
    if content != original:
        with open(full, "w") as f:
            f.write(content)
        print(f"  MIGRATED: {filepath} ({setview_count} setView calls)")
    else:
        print(f"  NO CHANGES (content same): {filepath}")

print("=== MIGRATING setView() calls to router.push() ===\n")
for f in FILES_TO_MIGRATE:
    migrate_file(f)
    print()

print("=== DONE ===")