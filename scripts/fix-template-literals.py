import re

with open('src/components/learning-system.tsx', 'r') as f:
    content = f.read()

# Replace template literal classNames that contain ${} with cn() calls
# Pattern 1: className={`...${var}...`}
def replace_template_literal(match):
    inner = match.group(1)
    # Split by ${...} patterns
    parts = re.split(r'\$\{([^}]+)\}', inner)
    # parts alternates between static strings and variable names
    args = []
    for i, part in enumerate(parts):
        part = part.strip()
        if not part:
            continue
        if i % 2 == 0:
            # Static string - add as quoted
            args.append(f'"{part}"')
        else:
            # Variable
            args.append(part)
    return 'className={cn(' + ', '.join(args) + ')}'

# Find all className={`...${...}...`} patterns and replace
content = re.sub(
    r'className=\{`([^`]*)`\}',
    replace_template_literal,
    content
)

with open('src/components/learning-system.tsx', 'w') as f:
    f.write(content)

print('Done - replaced template literals with cn()')