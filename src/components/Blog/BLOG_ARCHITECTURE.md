# Blog System Architecture & Implementation Guide

## Overview

The blog system features a modern Lexical-based rich text editor with comprehensive formatting capabilities, modular React components, and seamless Cloudinary image integration.

## Directory Structure

```
src/components/Blog/
├── index.jsx                    # Main orchestrator component
├── BlogListView.jsx            # Blog list display with search/filter
├── BlogItem.jsx                # Individual blog post card
├── BlogEditorView.jsx          # Editor form wrapper with validation
├── BlogEditor.jsx              # Lexical editor wrapper
├── ImageUploader.jsx           # Image file/URL upload handler
├── Toast.jsx                   # Notification component
├── styles.css                  # Complete theme styling
├── themes/
│   └── BlogTheme.js           # Lexical CSS class mappings
└── plugins/
    ├── ToolbarPlugin.js       # Rich formatting toolbar (14+ options)
    ├── CodeHighlightPlugin.js # Syntax highlighting for code blocks
    ├── ListMaxIndentLevelPlugin.js  # Limit list nesting depth
    └── AutoLinkPlugin.js      # Auto-detect and link URLs
```

## Component Architecture

### 1. **BlogManager** (`index.jsx`)

Central orchestrator for the entire blog system.

**State:**

- `currentView`: 'list' | 'create' | 'edit'
- `editingBlog`: Current blog being edited
- `isSaving`: Prevents double submissions
- `saveError`: Error feedback to user
- `toastConfig`: Toast notification state

**Features:**

- View switching (list ↔ editor)
- Redux integration for CRUD operations
- Error handling with user feedback
- Auto-fetch on component mount
- Proper cleanup on unmount

**Flow:**

```
List View (display all posts)
    ↓
Create/Edit (forms open)
    ↓
Save (Redux dispatch)
    ↓ Toast notification
Back to List View
```

### 2. **BlogListView** (`BlogListView.jsx`)

Displays all published blog posts with search and filter capabilities.

**Props:**

- `blogs`: Array of blog posts
- `loading`: Loading state
- `error`: Error message
- `onEdit`: Callback when edit button clicked
- `onDelete`: Callback when delete button clicked
- `onNew`: Callback to create new blog

**Features:**

- Animated loading spinner
- Empty state messaging
- Search by title
- Category filtering dropdown
- Responsive grid layout

### 3. **BlogItem** (`BlogItem.jsx`)

Individual blog post card component.

**Props:**

- `blog`: Blog object with title, excerpt, coverImage, etc.
- `onEdit`: Edit action callback
- `onDelete`: Delete action callback

**Features:**

- Cover image with fallback
- Status badge (published/draft)
- Author and publication date
- Hover-reveal action buttons
- Smooth transitions

### 4. **BlogEditorView** (`BlogEditorView.jsx`)

Form wrapper for creating/editing blog posts.

**Features:**

- Title input with validation (5+ characters)
- Category dropdown (required)
- Featured image upload
- Lexical rich text editor
- Real-time form validation
- Error display inline
- Save button with loading state

**Validation:**

```javascript
- Title: min 5 characters
- Category: required selection
- Content: must not be empty
- Image: optional (accepts file or URL)
```

### 5. **BlogEditor** (`BlogEditor.jsx`)

Lexical rich text editor with enhanced plugins.

**Nodes:**

- `HeadingNode`: h1-h5 headings
- `ListNode`, `ListItemNode`: Ordered/unordered lists
- `QuoteNode`: Block quotes
- `CodeNode`, `CodeHighlightNode`: Code blocks with syntax highlighting
- `LinkNode`, `AutoLinkNode`: Hyperlinks
- `TableNode`, `TableCellNode`, `TableRowNode`: Tables

**Plugins:**

- `ToolbarPlugin`: Formatting controls
- `HistoryPlugin`: Undo/redo
- `ListPlugin`: List handling
- `LinkPlugin`: Link management
- `CodeHighlightPlugin`: Syntax highlighting
- `AutoLinkPlugin`: URL detection
- `ListMaxIndentLevelPlugin`: Depth control
- `MarkdownShortcutPlugin`: Keyboard shortcuts
- `OnChangePlugin`: State synchronization

**Initialization:**

```javascript
// Ensures non-empty editor root
const EMPTY_CONTENT = {
  root: {
    children: [{
      children: [],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "paragraph",
      version: 1,
    }],
    ...
  }
};

// Sanitizes content on load
const ensureNonEmptyContent = (content) => {
  // Returns EMPTY_CONTENT if invalid/empty
  // Prevents "root never empty" error
};
```

### 6. **ToolbarPlugin** (`plugins/ToolbarPlugin.js`)

Comprehensive formatting toolbar with 14+ options.

**Toolbar Sections:**

1. **Block Type Selector** (Dropdown)

   - Paragraph
   - Heading 1-3
   - Quote
   - Code Block

2. **Text Formatting**

   - Bold (Ctrl+B)
   - Italic (Ctrl+I)
   - Underline (Ctrl+U)
   - Strikethrough (Ctrl+Shift+S)
   - Inline Code (Ctrl+`)

3. **Lists**

   - Unordered List
   - Ordered List
   - (Automatic nesting support)

4. **Links**

   - Insert Link (Ctrl+K)
   - Toggle link formatting

5. **Alignment**

   - Left align
   - Center align
   - Right align
   - Justify

6. **History**
   - Undo (Ctrl+Z)
   - Redo (Ctrl+Y)

**Features:**

- State tracking for all formatting options
- Disabled undo/redo when unavailable
- Active state highlighting
- Proper hover states
- Keyboard shortcut support

### 7. **ImageUploader** (`ImageUploader.jsx`)

Handles image uploads with validation.

**Features:**

- Drag-drop support
- File picker (click to upload)
- URL paste support
- File type validation (jpeg, png, gif, webp)
- Size limit enforcement (5MB)
- Image preview with remove button
- Base64 conversion for upload

**Validation:**

```javascript
// File type
const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

// File size
const maxSize = 5 * 1024 * 1024; // 5MB

// Base64 conversion
const reader = new FileReader();
reader.readAsDataURL(file);
```

### 8. **Toast** (`Toast.jsx`)

Non-blocking notification component.

**Types:**

- `success`: Green with checkmark
- `error`: Red with alert icon
- `info`: Blue with info icon

**Features:**

- Auto-dismiss after 3 seconds
- Click to close button
- Type-based styling
- Smooth animations
- Stack multiple toasts

### 9. **BlogTheme** (`themes/BlogTheme.js`)

Comprehensive CSS class mappings for all Lexical elements.

**Class Mapping Categories:**

1. **Block-level**

   - `.blog-editor-paragraph`
   - `.blog-editor-h1` through `.blog-editor-h5`
   - `.blog-editor-ol`, `.blog-editor-ul`
   - `.blog-editor-quote`
   - `.blog-editor-code`

2. **Inline Formatting**

   - `.blog-editor-text-bold`
   - `.blog-editor-text-italic`
   - `.blog-editor-text-underline`
   - `.blog-editor-text-strikethrough`
   - `.blog-editor-text-code`

3. **Code Highlighting Tokens**

   - `.blog-editor-tokenKeyword`
   - `.blog-editor-tokenString`
   - `.blog-editor-tokenNumber`
   - `.blog-editor-tokenComment`
   - `.blog-editor-tokenAttr`
   - (60+ total tokens)

4. **Links**

   - `.blog-editor-link`
   - `.blog-editor-autolink`

5. **Tables**

   - `.blog-editor-table`
   - `.blog-editor-tablecell`
   - `.blog-editor-tablecell-selected`
   - `.blog-editor-tablecell-primary`

6. **Toolbar**
   - `.blog-editor-toolbar`
   - `.blog-editor-toolbar-button`
   - `.blog-editor-toolbar-button.active`
   - `.blog-editor-toolbar-button:disabled`

## Data Flow

### Create Blog Flow

```
1. User clicks "Create New Blog"
   ↓
2. View switches to BlogEditorView
   ↓
3. User fills form:
   - Title
   - Category
   - Cover Image (optional, converted to base64)
   - Content (via Lexical editor)
   ↓
4. User clicks Save
   ↓
5. Real-time validation:
   - Title length check
   - Category required
   - Content non-empty
   ↓
6. If valid, dispatch Redux createBlog action:
   POST /api/blogs/admin
   {
     title: string,
     category: string,
     excerpt: string,
     content: { root: {...} },  // Lexical JSON
     coverImage: "data:image/jpeg;base64,..."  // Base64
   }
   ↓
7. Backend processing:
   - Detects base64 image
   - Calls CloudinaryHelper.uploadBase64Image()
   - Converts to Cloudinary URL
   - Saves blog with image URL
   ↓
8. Redux updates store with new blog
   ↓
9. Toast notification shows success
   ↓
10. View switches back to list
    ↓
11. New blog appears in list
```

### Backend Integration

**Cloudinary Upload Process:**

```typescript
// 1. Frontend detects base64 image
if (coverImage.startsWith("data:image")) {
  // Send as-is
}

// 2. Backend receives and processes
const cloudinaryHelper = new CloudinaryHelper();
const result = await cloudinaryHelper.uploadBase64Image(
  base64String,
  "pickmypit/blogs"
);

// 3. Cloudinary returns secure URL
const imageUrl = result.secure_url;

// 4. Save to MongoDB with URL
await Blog.create({
  ...blogData,
  coverImage: imageUrl,
});
```

## API Integration

### Routes

**Public Routes:**

```
GET  /api/blogs             # Get all published blogs
GET  /api/blogs/:slug       # Get blog by slug
```

**Admin Routes (requires authentication):**

```
POST   /api/blogs/admin                  # Create blog
GET    /api/blogs/admin/all              # Get all blogs (draft + published)
GET    /api/blogs/admin/:id              # Get specific blog
PUT    /api/blogs/admin/:id              # Update blog
DELETE /api/blogs/admin/:id              # Delete blog
```

### Error Handling

**Response Codes:**

- `201`: Blog created successfully
- `200`: Blog updated/fetched successfully
- `204`: Blog deleted successfully
- `400`: Validation error (bad request)
- `401`: Unauthorized (missing/invalid token)
- `409`: Conflict (duplicate title)
- `500`: Server error

**Error Response Format:**

```json
{
  "success": false,
  "message": "User-friendly error message",
  "error": "Technical error details"
}
```

## Keyboard Shortcuts

| Action        | Shortcut                            | Browser Support |
| ------------- | ----------------------------------- | --------------- |
| Bold          | Ctrl/Cmd + B                        | All             |
| Italic        | Ctrl/Cmd + I                        | All             |
| Underline     | Ctrl/Cmd + U                        | All             |
| Strikethrough | Ctrl/Cmd + Shift + S                | All             |
| Code          | Ctrl/Cmd + \`                       | All             |
| Undo          | Ctrl/Cmd + Z                        | All             |
| Redo          | Ctrl/Cmd + Y / Ctrl/Cmd + Shift + Z | All             |
| Insert Link   | Ctrl/Cmd + K                        | All             |

## CSS Styling

### Theme Classes Hierarchy

```
.blog-editor-wrapper (container)
  ├── .blog-editor-toolbar (formatting controls)
  │   ├── .blog-editor-blocktype-select
  │   ├── .blog-editor-toolbar-button
  │   └── .blog-editor-toolbar-divider
  │
  └── .blog-editor-contenteditable (editor content)
      ├── .blog-editor-paragraph
      ├── .blog-editor-h1 to .blog-editor-h5
      ├── .blog-editor-ol / .blog-editor-ul
      ├── .blog-editor-listitem
      ├── .blog-editor-quote
      ├── .blog-editor-code
      │   └── .blog-editor-tokenKeyword (etc.)
      ├── .blog-editor-link
      └── .blog-editor-table
```

### Custom Styling

To override theme styles, add CSS after importing `styles.css`:

```css
/* Example: Larger headings */
.blog-editor-h1 {
  font-size: 2.5rem;
}

/* Example: Custom code block colors */
.blog-editor-code {
  background-color: #1e1e1e;
  color: #d4d4d4;
}

/* Example: Link color */
.blog-editor-link {
  color: #00d4ff;
}
```

## Redux Integration

### Blog Slice (`redux/slices/blogSlice.js`)

**Actions:**

- `fetchBlogs`: Load all blogs
- `createBlog`: Create new blog
- `updateBlog`: Update existing blog
- `deleteBlog`: Delete blog

**State:**

```javascript
{
  posts: [],          // Array of blog objects
  pagination: {},     // Pagination info
  loading: false,     // Loading state
  error: null,        // Error message
  selectedBlog: null, // Current blog
}
```

## Performance Considerations

1. **Lazy Loading**

   - Blogs loaded with pagination
   - Images lazy-loaded via Cloudinary

2. **Memoization**

   - Components wrapped with React.memo where appropriate
   - Callback functions memoized with useCallback
   - Selectors memoized in Redux

3. **Code Splitting**

   - Plugins loaded dynamically
   - Editor components code-split

4. **Bundle Size**
   - Lexical tree-shakeable
   - Only required plugins imported
   - CSS split by feature

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Fallbacks for older browsers
- Mobile-friendly UI (responsive design)
- Touch support for mobile

## Security

1. **XSS Prevention**

   - HTML content sanitized by Lexical
   - Base64 images validated on frontend
   - Backend validates image format

2. **CSRF Protection**

   - Admin routes require authentication
   - JWT token validation
   - Cookie-based token storage

3. **File Validation**
   - File type checking (whitelist)
   - File size enforcement
   - Base64 format validation

## Troubleshooting

### Editor Won't Load

- Check Lexical imports are correct
- Ensure BlogTheme.js is properly imported
- Verify plugins are installed

### Content Not Saving

- Check Redux store for errors
- Verify API endpoint is correct
- Check browser console for network errors

### Images Not Uploading

- Verify Cloudinary credentials
- Check file type (jpeg, png, gif, webp)
- Verify file size < 5MB
- Check base64 conversion in browser console

### Toolbar Not Showing

- Ensure ToolbarPlugin.js is imported
- Check CSS classes are defined
- Verify LexicalComposer wrapper is correct

## Future Enhancements

1. **Advanced Features**

   - Table support (already in place, needs UI)
   - Mentions (@username)
   - Hashtags
   - Collaborative editing

2. **Performance**

   - Virtual scrolling for large lists
   - Service worker caching
   - Image optimization

3. **UX**

   - Floating link editor (like Rich_text_editor)
   - Drag-drop blocks reordering
   - Command palette (/)
   - Mentions dropdown

4. **Analytics**
   - View count tracking
   - Reading time calculation
   - Engagement metrics

## Configuration

### Environment Variables (Backend)

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
```

### Component Props

All components are fully controlled and accept standard React props for customization.

## License & Attribution

- Built with [Lexical](https://lexical.dev/)
- Images hosted on Cloudinary
- UI components with Tailwind CSS
- Icons from Lucide React

## Support & Contribution

For issues or improvements, refer to the project documentation and Redux/Lexical official guides.
