# Complete Setup Guide

This guide walks you through setting up your blog from scratch to deployment.

## Prerequisites

- **Git** - [Install Git](https://git-scm.com)
- **GitHub account** - [Sign up here](https://github.com)
- **Ruby 3.0+** - [Install Ruby](https://www.ruby-lang.org/en/downloads/)
- **Node.js 16+** - [Install Node](https://nodejs.org)
- **Text editor** - VSCode, Sublime, or any editor you prefer

## Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name your repo: `yourusername.github.io`
3. Add description: "My personal blog"
4. Choose "Public"
5. Click "Create repository"

## Step 2: Clone and Setup

```bash
# Clone the template (or use this repo as template)
git clone https://github.com/yourusername/yourusername.github.io.git
cd yourusername.github.io

# Install dependencies
bundle install --path vendor/bundle
npm install

# Verify installation
bundle exec jekyll --version
npm --version
```

## Step 3: Configure Site

**Edit `_config.yml`:**

```yaml
# Basic info
title: Your Name
description: Your tagline here (50-60 chars)
url: "https://yourusername.github.io"
baseurl: ""

# Author info
author: Your Name
author_url: https://yourusername.github.io

# Social links
social:
  links:
    - https://twitter.com/yourhandle
    - https://github.com/yourusername
    - https://linkedin.com/in/yourhandle

# Email (optional)
email: you@example.com
```

**Edit `_includes/footer.html`:**
- Update social media links
- Update footer text

**Edit `about.md`:**
- Add your bio and background
- Update your projects

## Step 4: Create Posts Directory

Markdown files go in `_posts/` with the format: `YYYY-MM-DD-title.md`

**Example:**
```
_posts/
├── 2024-01-15-first-post.md
├── 2024-01-20-second-post.md
└── 2024-02-01-another-post.md
```

## Step 5: Write Your First Post

Create `_posts/2024-01-01-hello-world.md`:

```markdown
---
layout: post
title: "Hello World"
date: 2024-01-01 10:00:00 +0000
categories: [life]
tags: [first-post, hello]
image: /assets/images/featured.jpg
excerpt: "My first blog post exploring life and thoughts."
reading_time: 3
---

# Welcome to my blog

This is my first post. I'm excited to share my thoughts on life, business, and growth.

## What to expect

- Articles on personal development
- Insights from my journey
- Tips and strategies I've learned

Looking forward to connecting with you!
```

## Step 6: Test Locally

```bash
# Start development server
npm run serve

# Open in browser: http://localhost:4000

# In another terminal, generate graph data:
npm run graph
```

**Keyboard shortcuts while serving:**
- Press `q` to quit
- Auto-reload on file changes
- Check console for errors

## Step 7: Customize Design

### Colors

Edit `assets/css/style.scss` at the top:

```scss
$bg-primary: #0a0a0a;        // Main background
$bg-secondary: #1a1a1a;      // Cards, footer
$text-primary: #ffffff;       // Main text
$text-secondary: #b0b0b0;    // Secondary text
$accent: #ffffff;             // Hover effects
$border-color: #333333;       // Borders
```

**Tip:** Use a color picker like [Coolors.co](https://coolors.co) to find complementary colors.

### Fonts

Change in `style.scss`:

```scss
$font-family-main: 'Your Font', sans-serif;
```

Add custom fonts:
```scss
@import url('https://fonts.googleapis.com/css2?family=Your+Font:wght@400;600;700&display=swap');
```

### Homepage

Edit `index.md`:
- Change hero headline and subtitle
- Update resources section
- Edit about section

## Step 8: Add Images

1. Create folder: `assets/images/`
2. Add your images (JPG, PNG, WebP)
3. Optimize images:
   - Use [Squoosh.app](https://squoosh.app)
   - Or ImageOptim if on macOS
4. Reference in posts:
   ```markdown
   ![Alt text](/assets/images/filename.jpg)
   ```

## Step 9: Integrate with Obsidian

### Option A: Symlink (Recommended)

**macOS/Linux:**
```bash
ln -s ~/path/to/obsidian/vault/"Blog Posts" _posts
```

**Windows (Admin PowerShell):**
```powershell
New-Item -ItemType SymbolicLink -Path "_posts" -Target "C:\path\to\vault\Blog Posts"
```

### Option B: Copy Files

```bash
# Copy posts folder
cp -r ~/obsidian/vault/"Blog Posts"/* _posts/

# Or use sync tool like:
# - Syncthing
# - rsync
# - git submodules
```

### Option C: Git Submodule

```bash
git submodule add https://github.com/yourusername/obsidian-posts.git _posts
```

## Step 10: Deploy to GitHub Pages

### Enable GitHub Pages

1. Go to your repository settings
2. Scroll to "GitHub Pages" section
3. Source: Deploy from a branch
4. Branch: main, folder: / (root)
5. Save

### Deploy Code

```bash
# Check everything works
npm run test

# Build once locally
npm run build

# Commit and push
git add .
git commit -m "Initial blog setup"
git push origin main
```

**That's it!** Your site will be live at `https://yourusername.github.io`

### Monitor Deployment

GitHub will automatically build and deploy on each push. Monitor progress:
1. Go to repository
2. Click "Actions" tab
3. Watch build process
4. Check for errors in logs

## Step 11: Custom Domain (Optional)

To use your own domain:

1. **Buy domain** - [Namecheap](https://namecheap.com), [GoDaddy](https://godaddy.com), etc.

2. **Update DNS settings** at your domain registrar:
   ```
   yourusername.github.io
   ```
   or the GitHub IP addresses provided in their docs.

3. **Add CNAME file** to root:
   ```bash
   echo "yourdomain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

4. **Update _config.yml**:
   ```yaml
   url: "https://yourdomain.com"
   ```

## Step 12: SEO & Analytics (Optional)

### Add Google Analytics

Edit `_includes/header.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Add Sitemap

Already included via `jekyll-sitemap` plugin. Verify:
- Visit `yoursitename.github.io/sitemap.xml`

### Submit to Search Engines

1. **Google:**
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add property
   - Submit sitemap

2. **Bing:**
   - Go to [Bing Webmaster Tools](https://www.bing.com/webmaster)
   - Add site
   - Submit sitemap

## Troubleshooting

### Build fails locally

```bash
# Clear cache
npm run clean

# Reinstall gems
bundle install --path vendor/bundle

# Try building
bundle exec jekyll build --verbose
```

### Changes not showing

```bash
# Stop server (Ctrl+C)
# Clear cache
npm run clean

# Restart server
npm run serve
```

### Graph not updating

```bash
# Regenerate graph data
npm run graph

# Verify file exists
ls -la assets/data/posts-graph.json
```

### Images not loading

- Check path starts with `/`
- Verify file exists in `assets/images/`
- Check filename matches exactly (case-sensitive)

### Slow build

- Optimize images
- Reduce post count while testing
- Remove large files from repo

## Common Tasks

### Add Social Links

Edit `_includes/footer.html`:
```html
<a href="https://twitter.com/yourhandle" title="Twitter">
  <span>𝕏</span>
</a>
```

### Change Post Layout

Edit `_layouts/post.html` to customize:
- Post header
- Meta information
- Related posts section

### Add Categories Page

Create `categories.md`:
```markdown
---
layout: default
title: Categories
permalink: /categories/
---

{% assign sorted_cats = site.posts | map: 'categories' | join: ',' | split: ',' | uniq | sort %}

{% for cat in sorted_cats %}
### {{ cat }}
{% assign posts = site.posts | where: 'categories', cat %}
{% for post in posts %}
- [{{ post.title }}]({{ post.url }})
{% endfor %}
{% endfor %}
```

### Change Post URL Structure

Edit `_config.yml`:
```yaml
permalink: /:categories/:year/:month/:day/:title/
```

## Performance Tips

1. **Optimize images** before adding (max 200KB each)
2. **Use lazy loading** - Already built in
3. **Minimize CSS** - Run `npm run optimize`
4. **Cache busting** - Add version to CSS:
   ```html
   <link rel="stylesheet" href="/assets/css/style.css?v=1.0">
   ```

## Backup & Version Control

```bash
# Good commit practices
git add .
git commit -m "feat: add new blog post"
git commit -m "fix: correct typo in article"
git commit -m "style: update color scheme"

# Keep commits organized and descriptive
git log --oneline
```

## Next Steps

1. ✅ Write your first post
2. ✅ Customize colors and fonts
3. ✅ Add your bio and social links
4. ✅ Deploy to GitHub Pages
5. ✅ Set up analytics
6. ✅ Get your domain
7. ✅ Start writing consistently!

## Resources

- [Jekyll Docs](https://jekyllrb.com/docs/)
- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Pages Help](https://docs.github.com/en/pages)
- [D3.js Guide](https://d3js.org/)
- [Web Performance Guide](https://web.dev/performance/)

## Support

If you run into issues:

1. Check [Jekyll Troubleshooting](https://jekyllrb.com/docs/troubleshooting/)
2. Search [Stack Overflow](https://stackoverflow.com/questions/tagged/jekyll)
3. Check GitHub Issues in this repo
4. Review error messages carefully

---

**Congratulations!** You now have a beautiful, performant blog. Keep writing! 🚀
