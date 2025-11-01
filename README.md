# High-Performance Blog (Dan Koe Inspired)

A beautiful, performant blog built with Jekyll for GitHub Pages. Features a minimalist dark design inspired by The Dan Koe, markdown-based posts, and an interactive knowledge graph visualization.

## Features

✨ **Beautiful Design**
- Dark theme matching The Dan Koe's aesthetic
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Optimized typography

📝 **Markdown Posts**
- Write posts in Markdown in your Obsidian vault
- Automatic date-based URLs
- Support for categories and tags
- Reading time estimates
- Social media metadata

🔗 **Interactive Knowledge Graph**
- Visual representation of topic relationships
- D3.js visualization (lightweight, ~30KB)
- Drag, zoom, and click interactions
- Auto-generated from post tags
- Performance-optimized rendering

🚀 **High Performance**
- Static site generation with Jekyll
- Lazy image loading
- Minimal CSS/JS footprint
- Cached requests
- Optimized for Google PageSpeed
- GitHub Pages hosting (free)

🔍 **Search & Discovery**
- Full-text search on blog page
- Tag-based filtering
- Related posts section
- Knowledge graph exploration

## Project Structure

```
.
├── _config.yml              # Jekyll configuration
├── _layouts/                # HTML templates
│   ├── default.html         # Base layout
│   ├── home.html           # Homepage
│   └── post.html           # Blog post
├── _includes/              # Reusable components
│   ├── header.html
│   └── footer.html
├── _posts/                 # Your blog posts (Markdown)
│   └── YYYY-MM-DD-title.md
├── assets/
│   ├── css/
│   │   └── style.scss      # Main stylesheet
│   ├── js/
│   │   ├── main.js         # Core functionality
│   │   ├── knowledge-graph.js
│   │   └── search.js
│   ├── data/
│   │   └── posts-graph.json # Auto-generated
│   └── images/
├── scripts/
│   └── generate-graph-data.js # Build script
├── Gemfile                 # Ruby dependencies
├── package.json            # Node dependencies
└── blog.md, graph.md, etc  # Key pages
```

## Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/your-blog.git
cd your-blog

# Install Ruby dependencies
bundle install

# Install Node dependencies
npm install
```

### 2. Configure Your Site

Edit `_config.yml`:

```yaml
title: Your Name
description: Your tagline
url: "https://yourusername.github.io"
author: Your Name

# Update social links
social:
  links:
    - https://twitter.com/yourhandle
    - https://github.com/yourhandle
    - https://linkedin.com/in/yourhandle
```

### 3. Create Your First Post

Create `_posts/2024-01-15-my-first-post.md`:

```markdown
---
layout: post
title: "My First Post"
date: 2024-01-15 10:00:00 +0000
categories: [business]
tags: [startup, learning]
image: /assets/images/post.jpg
excerpt: "Brief description of your post"
reading_time: 5
---

Your content in Markdown...
```

### 4. Run Locally

```bash
# Start development server
npm run serve

# Visit http://localhost:4000
```

### 5. Deploy to GitHub Pages

```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main
```

Then enable GitHub Pages in your repository settings:
- Go to Settings → Pages
- Source: Deploy from a branch
- Branch: main (or master), folder: / (or /docs)

## Using with Obsidian

To integrate with your Obsidian vault:

1. **Create a blog folder** in your vault:
   ```
   Obsidian Vault/
   ├── Blog Posts/
   │   ├── 2024-01-15-first-post.md
   │   └── 2024-01-20-second-post.md
   └── ... other notes
   ```

2. **Symlink or copy** posts to `_posts/`:
   ```bash
   # On macOS/Linux
   ln -s ~/path/to/vault/"Blog Posts" _posts

   # On Windows (with admin)
   mklink /D _posts "C:\path\to\vault\Blog Posts"
   ```

3. **Write posts in Obsidian** with proper front matter:
   ```markdown
   ---
   layout: post
   title: "Post Title"
   date: 2024-01-15 10:00:00 +0000
   categories: [category]
   tags: [tag1, tag2]
   ---

   Your content here...
   ```

## Customization

### Colors

Edit `assets/css/style.scss` variables:

```scss
$bg-primary: #0a0a0a;      // Main background
$bg-secondary: #1a1a1a;    // Card background
$text-primary: #ffffff;     // Main text
$text-secondary: #b0b0b0;  // Secondary text
$accent: #ffffff;           // Accent color
```

### Fonts

Change font family in `assets/css/style.scss`:

```scss
$font-family-main: 'Your Font', sans-serif;
```

### Homepage

Edit `index.md` to customize sections:
- Hero section
- Resources section
- Blog preview

### Navigation

Edit `_includes/header.html` to add/remove nav items

### Footer

Edit `_includes/footer.html` for social links and footer content

## Writing Best Practices

### Front Matter Template

```markdown
---
layout: post
title: "Your Article Title"
date: 2024-01-15 10:30:00 +0000
categories: [category-name]
tags: [tag1, tag2, tag3]
author: Your Name
image: /assets/images/featured.jpg
excerpt: "2-3 sentence summary for social sharing"
reading_time: 7
last_modified_at: 2024-01-16
---
```

### Markdown Tips

- **Use headings** for structure (##, ###, etc)
- **Keep paragraphs short** for readability
- **Use lists** to break up content
- **Add images** with lazy loading: `![Alt text](/path/to/image.jpg)`
- **Use blockquotes** for emphasis: `> Quote text`
- **Code blocks** with syntax highlighting

### SEO Best Practices

- Use descriptive titles (50-60 characters)
- Write compelling excerpts (150-160 characters)
- Include relevant tags (2-4 per post)
- Add images with alt text
- Use descriptive URLs (auto-generated from filename)

## Knowledge Graph

The knowledge graph is **auto-generated** during build:

1. Reads all posts and their tags
2. Creates nodes for tags, categories, and posts
3. Links related posts by shared tags
4. Generates `assets/data/posts-graph.json`

**Best practices for better graph:**
- Use consistent tag names (lowercase, hyphenated)
- Tag related posts with common tags
- Avoid too many unique tags (keeps graph cleaner)
- Use 2-4 tags per post

## Performance Optimization

### Image Optimization

```bash
# Use ImageOptim (macOS)
open /Applications/ImageOptim.app

# Or use Squoosh online
https://squoosh.app
```

### CSS/JS Minification

```bash
npm run optimize
```

This will:
- Minify CSS with csso
- Minify JavaScript with terser
- Optimize images

### Performance Checklist

- [ ] Images optimized and compressed
- [ ] All external links have `rel="noopener noreferrer"`
- [ ] Lazy loading enabled for images
- [ ] No large font files
- [ ] CSS minified
- [ ] JS deferred or async

## Deployment

### GitHub Pages (Recommended)

1. Push code to GitHub
2. Enable Pages in repository settings
3. Custom domain optional

### Other Platforms

Works on:
- Netlify
- Vercel
- Traditional web hosting (with Ruby support)

## Troubleshooting

### Build Fails Locally

```bash
# Clear cache
npm run clean

# Rebuild
npm run build

# Check logs
bundle exec jekyll build --verbose
```

### Graph Not Generating

```bash
# Regenerate
npm run graph

# Check file exists
ls -la assets/data/posts-graph.json
```

### Images Not Loading

- Check image paths (use absolute paths: `/assets/images/image.jpg`)
- Verify images exist in `assets/images/`
- Use web formats: JPG, PNG, WebP

### Slow Build Time

- Reduce number of posts
- Optimize images
- Remove unused plugins

## Advanced Usage

### Scheduling Posts

GitHub Actions will rebuild on push. Schedule drafts with:

```markdown
---
draft: true
---
```

Then remove `draft` when ready to publish.

### Custom Plugins

Add Ruby gems to `Gemfile`:

```ruby
gem "jekyll-your-plugin"
```

Then run `bundle install` and update `_config.yml`.

### Analytics

Add to `_includes/header.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_ID');
</script>
```

## Support & Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Markdown Guide](https://www.markdownguide.org/)
- [D3.js Documentation](https://d3js.org/)
- [GitHub Pages Help](https://docs.github.com/en/pages)

## License

MIT License - feel free to use for personal or commercial projects.

## Made with ❤️

Inspired by [The Dan Koe](https://thedankoe.com) and built for creators, writers, and makers who want a beautiful, performant blog.

---

**Next Steps:**
1. Update `_config.yml` with your information
2. Create your first post in `_posts/`
3. Push to GitHub and enable Pages
4. Customize colors and fonts to match your brand
5. Start writing!
