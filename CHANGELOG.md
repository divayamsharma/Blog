# Changelog

All changes made to the Dan Koe Blog project will be documented here.

---

## [GitHub Pages Deployment Fixed] - 2025-11-02

### Issue
GitHub Pages showing 404 errors when clicking navigation links or blog posts. Site was deployed but all internal links were broken.

### Root Causes & Fixes

#### 1. Configuration Issue - `_config.yml`
**Problem:** Placeholder values in config (title: "Your Name", url: "https://yourusername.github.io")
**Solution:** Updated with actual values:
- `title: Divayam's Blog`
- `url: https://divayamsharma.github.io`
- `baseurl: /Blog` (critical for subdirectory deployment)

#### 2. GitHub Actions Permissions - `.github/workflows/build-and-deploy.yml`
**Problem:** Using outdated `peaceiris/actions-gh-pages@v3` action causing 403 permission errors
**Solution:** Replaced with official GitHub Pages actions:
- Added permissions block: `pages: write`, `id-token: write`, `contents: read`
- Changed to `actions/upload-pages-artifact@v3`
- Changed to `actions/deploy-pages@v4`
- Added environment configuration for GitHub Pages
- Set `JEKYLL_ENV=production` for proper build

#### 3. Navigation Links - `_includes/header.html` & `_includes/footer.html`
**Problem:** Hardcoded links without baseurl: `href="/blog"`, `href="/about"`, etc.
**Solution:** Updated to use baseurl variable:
```html
<a href="{{ site.baseurl }}/">Home</a>
<a href="{{ site.baseurl }}/blog">Blog</a>
<a href="{{ site.baseurl }}/graph">Knowledge Graph</a>
<a href="{{ site.baseurl }}/about">About</a>
```

#### 4. Asset Links - `_layouts/default.html`
**Problem:** Favicon used hardcoded path: `href="/assets/favicon.svg"`
**Solution:** Updated to use relative_url filter:
```html
<link rel="icon" type="image/svg+xml" href="{{ '/assets/favicon.svg' | relative_url }}">
```

#### 5. Post Links - `index.md`, `blog.md`, `_layouts/post.html`
**Problem:** Post URLs generated without baseurl: `href="{{ post.url }}"`
**Solution:** Updated to use relative_url filter:
```html
<a href="{{ post.url | relative_url }}">{{ post.title }}</a>
```

### Verification
✅ All pages now accessible:
- Homepage: https://divayamsharma.github.io/Blog/ (HTTP 200)
- Blog: https://divayamsharma.github.io/Blog/blog/ (HTTP 200)
- About: https://divayamsharma.github.io/Blog/about/ (HTTP 200)
- Graph: https://divayamsharma.github.io/Blog/graph/ (HTTP 200)
- Posts: https://divayamsharma.github.io/Blog/self-improvement/2024/01/22/deliberate-practice/ (HTTP 200)

### Critical Learning
GitHub Pages deployed at project subdirectory (`/Blog/`) requires:
1. `baseurl: /Blog` in `_config.yml`
2. All navigation links use `{{ site.baseurl }}/path`
3. All asset/post links use `| relative_url` filter
4. Never use hardcoded absolute paths like `href="/page"`

---

## [Initial Setup] - 2024-11-01

### Created Files (28 total)

#### Documentation Files
- `START_HERE.md` - Quick start guide with 3-step launch instructions
- `QUICK_START.md` - 5-minute reference guide with commands and markdown cheat sheet
- `SETUP_GUIDE.md` - Comprehensive 2-3 hour step-by-step setup guide
- `README.md` - Full feature documentation and customization guide
- `PROJECT_SUMMARY.md` - What's included and how to use everything
- `ARCHITECTURE.md` - Technical documentation of how the system works
- `LAUNCH_CHECKLIST.md` - Pre-launch verification and SEO checklist
- `INDEX.md` - Documentation index and roadmap

#### Configuration Files
- `_config.yml` - Jekyll configuration (Site title, author, URL, plugins)
- `jekyll_config.yml` - Backup Jekyll configuration
- `Gemfile` - Ruby dependencies for Jekyll
- `package.json` - Node.js scripts and dependencies
- `.gitignore` - Git ignore rules for vendor, cache, OS files

#### Layout & Template Files
- `_layouts/default.html` - Base HTML template with header/footer
- `_layouts/home.html` - Homepage layout
- `_layouts/post.html` - Blog post template with related posts section
- `_includes/header.html` - Navigation header component
- `_includes/footer.html` - Footer with social links

#### Content Pages
- `index.md` - Homepage with hero section and resources
- `about.md` - About/bio page template
- `blog.md` - Blog listing page with search functionality
- `graph.md` - Knowledge graph visualization page

#### Styling & Scripts
- `assets/css/style.scss` - Main stylesheet (800+ lines)
  - Dark theme (#0a0a0a, #ffffff, #b0b0b0)
  - Responsive design (mobile, tablet, desktop)
  - Animations and hover effects
- `assets/js/main.js` - Core functionality (lazy loading, search, analytics)
- `assets/js/knowledge-graph.js` - D3.js interactive graph visualization
- `assets/data/posts-graph.json` - Sample graph data

#### Build System & Deployment
- `scripts/generate-graph-data.js` - Node.js script to generate graph from posts
- `.github/workflows/build-and-deploy.yml` - GitHub Actions CI/CD workflow

#### Example Content
- `_posts/2024-01-01-example-post.md` - Example blog post template

#### Preview
- `index.html` - Static HTML preview (created later)

---

## [Gemfile Modifications] - 2024-11-01

### Changed: `Gemfile`

**Reason:** Original Gemfile had problematic gems causing dependency conflicts with Ruby 2.6

**Original:**
```ruby
gem "jekyll", "~> 4.3.0"
gem "jekyll-assets"
gem "jekyll-minifier"
```

**Modified to:**
```ruby
gem "jekyll", "4.0.1"
gem "webrick"
```

**Details:**
- Removed `jekyll-assets` and `jekyll-minifier` (caused native extension issues)
- Downgraded Jekyll to 4.0.1 for Ruby 2.6 compatibility
- Kept essential plugins: jekyll-feed, jekyll-seo-tag, jekyll-sitemap

---

## [package.json Script Updates] - 2024-11-01

### Changed: `package.json` Scripts

**Reason:** Added `bundle exec` prefix to ensure bundled gems are used

**Changes:**
```json
"serve": "bundle exec jekyll serve --livereload"
"build": "bundle exec jekyll build"
"clean": "bundle exec jekyll clean"
"test": "bundle exec jekyll build --strict_front_matter"
```

**Why:** Ensures Jekyll runs from vendor/bundle instead of system Ruby

---

## [HTML Preview Created] - 2024-11-01

### Created: `index.html`

**Reason:** Local Jekyll not compatible with Ruby 2.6. Created static HTML preview as alternative.

**Features:**
- Dark theme matching Dan Koe's design
- Navigation with Home, Blog, Graph, About links
- Hero section with headline and CTA
- Resources section with cards
- Blog section (placeholder for when deployed)
- About section with bio template
- Footer with copyright

**Status:** Fully functional static preview
**Location:** `/Users/divi/This Mac/Dockerr/LLM_Work/Dan_Koe/index.html`

---

## Deployment Status

### Current
- ✅ All files created
- ✅ Configuration complete
- ✅ Preview HTML working
- ❌ Local Jekyll (Ruby 2.6 incompatibility)

### Recommended Next Step
Deploy to GitHub Pages (handles Jekyll automatically with newer Ruby)

```bash
cd "/Users/divi/This Mac/Dockerr/LLM_Work/Dan_Koe"
git add .
git commit -m "Initial blog setup"
git push origin main
```

---

## Notes

### Ruby Version Issue
- System Ruby: 2.6.10
- Required for modern Jekyll: 3.0+
- Solution: Use GitHub Pages (automatic Ruby 3.x)

### Files to Edit
- `_config.yml` - Site information
- `index.md` - Homepage
- `about.md` - Your bio
- `assets/css/style.scss` - Colors and fonts
- `_includes/footer.html` - Social links
- `_posts/*.md` - Create new blog posts here

### Never Edit
- `_layouts/` - HTML templates
- `assets/js/` - JavaScript code
- `scripts/` - Build scripts
- `.github/workflows/` - Deployment config

---

## [Deploy Script Created] - 2024-11-01

### Created: `deploy.sh`

**Reason:** Simplify the process of updating files on GitHub. No need to manually run git commands every time.

**What it does:**
1. Prompts user for commit message: "What changes did you make?"
2. Runs `git add .`
3. Runs `git commit -m "your message"`
4. Runs `git push origin main`
5. Shows success/error status

**How to use:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Benefits:**
- ✅ One command instead of 3
- ✅ Interactive prompt for commit message
- ✅ Error handling built-in
- ✅ Clear success/failure messages
- ✅ Works for any file changes

---

## Deployment Status Summary

### Current Status (2025-11-02)
✅ **FULLY DEPLOYED AND WORKING**

- Site URL: https://divayamsharma.github.io/Blog/
- All pages accessible (HTTP 200)
- All navigation working
- All post links working
- GitHub Actions CI/CD fully functional
- Automatic builds on git push

### Previous Status (2024-11-01)
- ✅ All files created
- ✅ Configuration complete
- ✅ Deploy script created
- ❌ GitHub Actions had permission errors (NOW FIXED)
- ❌ Links breaking on navigation (NOW FIXED)

---

## Future Changes Log

*(New changes will be added below)*

---

**Last Updated:** 2025-11-02
**Status:** ✅ PRODUCTION READY - All systems deployed and fully operational
