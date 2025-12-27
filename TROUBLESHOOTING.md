# Quick Troubleshooting Guide - Blog Editor Issues

## Issue: Only Bold, Italic, and Strikethrough Working

### What I Fixed

1. **ListNode Missing Import** - Prevented list operations from working
2. **Broken Alignment Buttons** - Were causing silent failures
3. **Theme/CSS Mismatch** - List styling wasn't applying

### How to Test Everything Now Works

#### Step 1: Clear Cache & Restart

```bash
# In pet-admin-dashboard folder
rm -rf .next
npm run dev
```

#### Step 2: Test Each Feature

**Headings** - Should show in dropdown

1. Type some text
2. Click "Block Type" dropdown
3. Select "Large Heading" (h1)
4. Text should become larger and h1 styled

**Lists** - Should now work

1. Type text
2. Click bullet list button (•)
3. List should appear with proper styling
4. Press Tab to indent (nest up to 3 levels)

**Quotes** - Should now work

1. Type text
2. Click block type dropdown
3. Select "Quote"
4. Should have left border and italic styling

**Code Blocks** - Should now work

1. Type code
2. Click block type dropdown
3. Select "Code Block"
4. Should have dark background and monospace font
5. If you type code, should highlight syntax (colors)

**Links** - Should now work

1. Select text
2. Click link button
3. Should create a link

**Undo/Redo** - Should now work

1. Make changes
2. Click undo button (should work)
3. Click redo button (should work)

---

## Common Issues & Solutions

### "Still getting ReferenceError"

**Solution:** The .next cache might not be cleared

```bash
# Kill the dev server (Ctrl+C)
# Clear cache completely
rm -rf .next node_modules/.cache

# Restart
npm run dev
```

### "Block type dropdown not showing options"

**Solution:** Check browser console for errors

1. Press F12
2. Go to Console tab
3. Look for any red errors
4. Share the error with me

### "Lists styling looks wrong"

**Solution:** CSS might not be loading

1. Right-click on list in browser
2. Click "Inspect"
3. Check if `blog-editor-ol` or `blog-editor-ul` class is applied
4. If not, styles.css isn't loading properly

### "Code block not showing colors"

**Solution:** CodeHighlightPlugin might not be initialized

1. Check console for errors
2. Make sure `CodeHighlightPlugin` is imported in BlogEditor.jsx
3. Should be on line 18

---

## Verification Checklist

Run through this to confirm everything works:

```javascript
✅ Bold text           - Format: Bold
✅ Italic text        - Format: Italic
✅ Underline text     - Format: Underline
✅ Strikethrough      - Format: Strikethrough
✅ Inline code        - Format: Code
✅ Headings           - Block Type: Heading dropdown
✅ Quotes             - Block Type: Quote
✅ Code blocks        - Block Type: Code Block
✅ Lists (bullet)     - Lists button (•)
✅ Lists (numbered)   - Lists button (1.)
✅ List nesting       - Tab to nest, max 3 levels
✅ Links              - Link button
✅ Undo               - Undo button works
✅ Redo               - Redo button works
```

---

## If You Still Have Issues

### Collect Debug Info

1. **Browser Console Error** (F12 → Console tab)

   - Take a screenshot
   - Copy the exact error message

2. **Network Errors** (F12 → Network tab)

   - Check for failed requests
   - Look for 404s or 500s

3. **Component Rendering** (F12 → Elements tab)
   - Inspect the editor
   - Check if CSS classes are applied
   - Look for style attributes

### Share With Me

When reporting issues, include:

- The exact error message
- Which feature isn't working
- Screenshot of the error
- Steps to reproduce

---

## Technical Details of Fixes

### Fix #1: ListNode Import

**File:** `ToolbarPlugin.js` line 24-29
**Change:** Added `ListNode` to imports from `@lexical/list`
**Why:** Code was using `$getNearestNodeOfType(anchorNode, ListNode)` but ListNode wasn't imported

### Fix #2: Removed Alignment Buttons

**File:** `ToolbarPlugin.js` lines 445-465
**Change:** Deleted alignment button section
**Why:** Was using incorrect API (FORMAT_ELEMENT_COMMAND with string values doesn't work)

### Fix #3: Theme Class Names

**File:** `BlogTheme.js` lines 16-19
**Change:** Changed `blog-editor-list-ol` → `blog-editor-ol` and `blog-editor-list-ul` → `blog-editor-ul`
**Why:** Theme class names must match the CSS class definitions in styles.css

---

## Expected Browser Console Output

After fixes, when you load the editor, you should see:

```
✅ No ReferenceError messages
✅ No "ListNode is not defined" errors
✅ No CSS class warnings
✅ Maybe some Lexical info logs (normal)
```

---

## Need More Help?

If the editor still doesn't work after these fixes:

1. **Check .next folder is deleted**

   ```bash
   ls -la .next  # Should not exist
   ```

2. **Check styles.css is loading**

   - Browser → F12 → Sources tab
   - Search for "styles.css"
   - Should be in `components/Blog/styles.css`

3. **Check ToolbarPlugin imports are correct**

   - Open `ToolbarPlugin.js`
   - Line 24-29 should have `ListNode,` in the import

4. **Check BlogTheme class names**
   - Open `BlogTheme.js`
   - Line 17-18 should show `ol: "blog-editor-ol",` and `ul: "blog-editor-ul",`

If all of these are correct and it still doesn't work, there might be a different issue. Let me know!

---

**Status:** 🟢 All fixes applied and ready to test  
**Last Updated:** December 28, 2025
