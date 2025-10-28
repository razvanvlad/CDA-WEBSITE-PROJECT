#!/usr/bin/env python3
"""Extract all button-related CSS from global.css"""

import re
from collections import defaultdict

css_file = r"c:\xampp\htdocs\CDA-WEBSITE-PROJECT\CDA-WEBSITE\cda-frontend\src\styles\global.css"

with open(css_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Track all button selectors and their line numbers
selectors = defaultdict(list)
current_selector = None
current_block = []
brace_depth = 0
start_line = 0

for i, line in enumerate(lines, 1):
    # Check if this line starts a new selector with 'button' in it
    if re.search(r'(\.button|button\[)', line.strip()) and '{' in line:
        selector = line.split('{')[0].strip()
        current_selector = selector
        start_line = i
        current_block = [line]
        brace_depth = line.count('{') - line.count('}')
    elif current_selector and brace_depth > 0:
        current_block.append(line)
        brace_depth += line.count('{') - line.count('}')
        if brace_depth == 0:
            # Block complete
            block_text = ''.join(current_block)
            selectors[current_selector].append({
                'line': start_line,
                'content': block_text
            })
            current_selector = None
            current_block = []

# Print results
print("=" * 80)
print("BUTTON SELECTORS FOUND IN global.css")
print("=" * 80)

for selector in sorted(selectors.keys()):
    occurrences = selectors[selector]
    print(f"\n{selector}")
    print(f"  Found {len(occurrences)} time(s) at line(s): {', '.join(str(o['line']) for o in occurrences)}")
    if len(occurrences) > 1:
        print("  ** DUPLICATE DETECTED **")

print("\n" + "=" * 80)
print("DUPLICATE ANALYSIS")
print("=" * 80)

duplicates = {sel: occs for sel, occs in selectors.items() if len(occs) > 1}
for selector, occurrences in sorted(duplicates.items()):
    print(f"\n{selector}")
    for i, occ in enumerate(occurrences, 1):
        print(f"\n  Occurrence #{i} (Line {occ['line']}):")
        print("  " + "-" * 70)
        for line in occ['content'].split('\n')[:10]:
            print(f"  {line}")
