# Title Sizing Reference for UnderlinedTitle Implementation

## Font Sizes from Typography System

### H1 - Hero/Page Titles
- **Mobile:** 38px
- **Desktop:** 50px (1024px+)
- **Line Height:** 1.2
- **Font:** Poppins Bold (700)

### H2 - Section Titles
- **Mobile:** 28px
- **Desktop:** 38px (1024px+)
- **Line Height:** 1.3
- **Font:** Poppins Bold (700)

### H3 - Subsection Titles
- Font sizes vary by usage

---

## Old Implementation Classes

### `cda-page-title`
- Only sets: `font-family: Poppins` and `font-weight: 700`
- **Does NOT set font-size**

### `title-large-pink` / `title-large-orange` etc.
- Only sets: `--u-color` CSS variable
- **Does NOT set font-size**
- Used for old underline color only

### Size comes from HTML tag:
- `<h1 className="cda-page-title title-large-pink">`
  - Gets 38px/50px from h1 tag
  - Gets font-family/weight from cda-page-title
  - Gets color variable from title-large-pink (old system)

---

## Correct UnderlinedTitle Implementation

### For Hero Titles (H1 - 50px):
```jsx
<UnderlinedTitle
  as="h1"
  className="cda-page-title"
  underlineColor="#FF60DF"
  size="large"
>
  Learn More About Us
</UnderlinedTitle>
```

**Result:**
- H1 provides: 38px mobile, 50px desktop
- cda-page-title provides: Poppins Bold
- UnderlinedTitle provides: Curved SVG underline
- size="large" provides: 11px stroke width

---

### For Section Titles (H2 - 38px):
```jsx
<UnderlinedTitle
  as="h2"
  className="cda-title"
  underlineColor="#FF60DF"
  size="medium"
>
  The Foundation Of Our Work
</UnderlinedTitle>
```

**Result:**
- H2 provides: 28px mobile, 38px desktop
- cda-title provides: Poppins Bold
- UnderlinedTitle provides: Curved SVG underline
- size="medium" provides: 9px stroke width

---

### For Small Text (18px):
```jsx
<UnderlinedTitle
  as="h3"
  className="text-lg font-bold"
  underlineColor="#FF60DF"
  size="small"
>
  Small Heading
</UnderlinedTitle>
```

**Result:**
- text-lg provides: 18px
- font-bold provides: 700 weight
- UnderlinedTitle provides: Curved SVG underline
- size="small" provides: 7px stroke width

---

## Size Prop Mapping

| Text Size | `size` prop | Stroke Width | Use Case |
|-----------|-------------|--------------|----------|
| 50px (H1) | `large` | 11px | Hero/page titles |
| 38px (H2) | `medium` | 9px | Section titles |
| 18px (H3) | `small` | 7px | Card/subsection titles |

---

## Common Mistakes to Avoid

### ❌ Wrong - Loses H1 sizing:
```jsx
<div className="cda-page-title title-large-pink">
  <UnderlinedTitle as="span">
    Title
  </UnderlinedTitle>
</div>
```
**Problem:** No h1 tag means no 38px/50px sizing

---

### ❌ Wrong - Double wrapping:
```jsx
<h1>
  <UnderlinedTitle as="h2">
    Title
  </UnderlinedTitle>
</h1>
```
**Problem:** h1 wrapping h2 is invalid HTML

---

### ✅ Correct:
```jsx
<UnderlinedTitle
  as="h1"
  className="cda-page-title"
  underlineColor="#FF60DF"
>
  Title
</UnderlinedTitle>
```
**Result:** Proper h1 tag with all styling

---

## For Pages Using HeroSection Component

The HeroSection component renders titles like:
```jsx
<h1
  className={`cda-hero__title-text ${titleClassName}`}
  dangerouslySetInnerHTML={{ __html: titleHtml }}
/>
```

Where `titleClassName` might be `"cda-page-title title-large-pink"`

### Option 1: Pass Custom Title Element
```jsx
<HeroSection
  title={
    <UnderlinedTitle
      as="h1"
      className="cda-page-title"
      underlineColor="#FF60DF"
    >
      Learn More About Us
    </UnderlinedTitle>
  }
  description="..."
  // ... rest of props
/>
```

### Option 2: Update Individual Page Files
If title comes from CMS (titleHtml), need to handle it in the page file before passing to HeroSection.

---

## Summary

**Key Points:**
1. ✅ Keep the h1/h2/h3 tags via `as` prop
2. ✅ Keep `cda-page-title` or `cda-title` className for font
3. ✅ Use `size` prop to match text size (large/medium/small)
4. ✅ Remove old `title-large-pink` classes (not needed)
5. ✅ Add `underlineColor` prop with hex value

**The h1/h2/h3 tag provides the responsive font sizing automatically!**
