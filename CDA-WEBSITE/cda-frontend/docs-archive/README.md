# Documentation Archive

This folder contains deprecated or outdated documentation files that are kept for historical reference.

## Purpose

When documentation becomes outdated due to implementation changes, it's moved here rather than deleted. This:
- Preserves historical context
- Helps understand past decisions
- Provides reference for migration paths
- Maintains audit trail

## Naming Convention

Archived files use the following naming pattern:
```
DEPRECATED_[YYYY-MM-DD]_[original-filename].md
```

**Example:**
```
DEPRECATED_2025-11-14_OLD-UNDERLINE-GUIDE.md
```

## Archive Process

### When to Archive a File

Archive a documentation file when:
1. **Implementation Changed**: The code no longer matches the documentation
2. **Replaced**: A newer version of the documentation exists
3. **Feature Removed**: The feature documented no longer exists
4. **Superseded**: Information consolidated into another document

### Do NOT Archive When:
- File just needs minor updates (fix typos, update dates)
- Information is still partially accurate
- File can be corrected instead of replaced

### How to Archive

1. **Add Deprecation Header** to the original file:
   ```markdown
   ## ⚠️ DEPRECATED

   **Deprecated Date**: [Date]
   **Reason**: [Why this file is deprecated]
   **Replacement**: See [new-file.md](../new-file.md) for current information
   **Archived As**: [DEPRECATED_YYYY-MM-DD_filename.md](DEPRECATED_YYYY-MM-DD_filename.md)

   ---

   This documentation is outdated and kept for historical reference only.
   ```

2. **Rename and Move**:
   ```bash
   mv FILENAME.md docs-archive/DEPRECATED_2025-11-14_FILENAME.md
   ```

3. **Update References**:
   - Update DOCUMENTATION_INDEX.md to remove from active list
   - Add to archive section
   - Update any cross-references in other files

4. **Create Replacement** (if applicable):
   - Write new documentation with correct information
   - Reference the archived file for context if needed
   - Update all internal links

## Current Archive Contents

*No files currently archived* - All documentation is active and verified as of November 14, 2025.

---

**Last Updated**: November 14, 2025
**Maintained By**: Development Team
