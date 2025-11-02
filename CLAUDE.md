# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **production-grade static blog platform** combining Jekyll (Ruby static site generator), Node.js build scripts, and vanilla JavaScript. It features an interactive D3.js knowledge graph, automatic content processing, and GitHub Pages hosting with CI/CD automation.

**Type:** Static Site Generator + Blog Platform
**Build System:** Jekyll + Node.js + GitHub Actions
**Hosting:** GitHub Pages (CDN-backed)
**Technologies:** Ruby, Node.js, SCSS, Vanilla JavaScript, D3.js, Jekyll plugins

## Common Development Commands

```bash
# Development
npm run serve              # Start local dev server at http://localhost:4000 with live reload

# Building
npm run build              # Build site with Jekyll (runs graph generation automatically)
npm run graph              # Generate knowledge graph JSON from post metadata
npm run clean              # Clear Jekyll cache and build artifacts

# Testing & Optimization
npm run test               # Build with strict front matter validation (validates all posts)
npm run optimize           # Full build + CSS minification + JS minification for production

# Deployment
./deploy.sh                # Interactive Git helper (stages, commits, pushes to main)
git push origin main       # Triggers GitHub Actions workflow automatically
```

**Single Test:** Jekyll doesn't have traditional unit tests. Validate individual features with:
```bash
npm run test               # Validates front matter syntax across all posts
```

## Architecture & Code Structure

### Overall Architecture

**Data Flow:**
1. **Content Layer:** Markdown files in `_posts/` with YAML front matter
2. **Build Layer:** `npm run graph` generates JSON graph from post metadata, Jekyll converts Markdown → HTML
3. **Optimization Layer:** GitHub Actions minifies CSS/JS, validates HTML links
4. **Deployment Layer:** Static files published to GitHub Pages CDN

**Key Principle:** Content → Markdown → Build → Static HTML → CDN Distribution

### Directory Structure & Purposes

| Directory | Purpose |
|-----------|---------|
| `_posts/` | Blog post Markdown files (YYYY-MM-DD-title.md format) |
| `_layouts/` | HTML templates: default.html, home.html, post.html |
| `_includes/` | Reusable HTML components: header.html, footer.html |
| `assets/css/` | SCSS stylesheet (compiled to CSS) |
| `assets/js/` | Client-side JavaScript: main.js, knowledge-graph.js |
| `assets/data/` | Generated posts-graph.json (auto-created by npm run graph) |
| `scripts/` | Build utilities: generate-graph-data.js |
| `.github/workflows/` | GitHub Actions CI/CD: build-and-deploy.yml |

### Key Technologies

**Backend/Build:**
- **Jekyll 4.0.1** - Markdown to HTML conversion, site generation
- **Ruby 3.1** - Jekyll runtime
- **Node.js 18+** - Build scripting (graph generation, minification)
- **js-yaml** - YAML front matter parsing

**Frontend:**
- **SCSS** - CSS preprocessing (compiles to CSS via Jekyll)
- **Vanilla JavaScript** - No framework dependencies (performance-focused)
- **D3.js v7** - Interactive knowledge graph visualization
- **Native Web APIs** - IntersectionObserver (lazy loading), Fetch API

**Development Tools:**
- **csso-cli 4.0.1** - CSS minification
- **terser 5.20.0** - JavaScript minification
- **htmlproofer** - Link validation (in GitHub Actions)

### Important Build Processes

#### `npm run graph` (Pre-build Hook)
Automatically runs before every build via `prebuild` script:
- Reads all `.md` files from `_posts/`
- Parses YAML front matter (title, tags, categories)
- Generates `assets/data/posts-graph.json` with:
  - Node types: Posts (size 8, white), Tags (size 6, colored), Categories (size 7, teal)
  - Links: Post→Tag, Post→Category, Post→Post (shared tags)
- Used by D3.js visualization on `/graph` page

#### GitHub Actions Pipeline (.github/workflows/build-and-deploy.yml)
1. Setup Ruby 3.1 + Node 18
2. Install dependencies (bundle install, npm install)
3. Run graph generation (npm run graph)
4. Build with Jekyll + strict front matter validation
5. Minify CSS/JS for production
6. Validate all HTML links (htmlproofer)
7. Deploy to GitHub Pages (automatic CDN distribution)

**Triggered on:** Push to main/master or manual workflow_dispatch

### Configuration Files to Know

**`_config.yml`** - Site configuration
- Site title, description, author
- Social links
- Theme settings
- Jekyll plugins: jekyll-feed, jekyll-seo-tag, jekyll-sitemap

**`package.json`** - Node dependencies & build scripts
- Only 1 production dependency (js-yaml)
- 2 dev dependencies (csso-cli, terser)

**`Gemfile`** - Ruby dependencies
- Jekyll 4.0.1
- webrick server

**Post Front Matter Example:**
```yaml
---
layout: post
title: "Post Title"
date: 2024-01-15 10:00:00 +0000
categories: [category]
tags: [tag1, tag2]
author: Name
image: /assets/images/featured.jpg
excerpt: "Social sharing description"
reading_time: 5
---
```

## Styling & Frontend

**Main stylesheet:** `assets/css/style.scss`
- Converted to CSS by Jekyll during build
- Custom properties (CSS variables) for theming
- Compiled to minified CSS.min in production (via csso-cli)

**Images:** Lazy loaded using IntersectionObserver API in main.js

**Knowledge Graph:** Interactive D3.js visualization at `/graph` page
- Loads data from `assets/data/posts-graph.json`
- Supports drag, zoom, and click interactions
- Auto-updates when posts change (regenerated by npm run graph)
- **Important:** Uses `data-baseurl` HTML attribute for correct fetch path on GitHub Pages
  - Read via: `document.documentElement.getAttribute('data-baseurl')`
  - Location: `_layouts/default.html` line 2
  - Ensures graph works at any baseurl (local `/`, GitHub Pages `/Blog/`, etc.)

## Content Management

### Creating Posts
1. Create file: `_posts/YYYY-MM-DD-title.md`
2. Add YAML front matter with title, date, tags, categories
3. Write Markdown content
4. Push to GitHub → automatic build & deploy

### Obsidian Integration
- Symlink Obsidian vault to `_posts/` directory
- Edit posts in Obsidian
- Commit & push → auto-deployed blog
- Graph auto-updates from post metadata

## Testing & Quality

**Front Matter Validation:**
```bash
npm run test     # Validates YAML syntax across all posts
```

**Local Build Verification:**
```bash
npm run build    # Test build locally before pushing
```

**Production Optimization:**
```bash
npm run optimize # Full build with CSS/JS minification
```

## Deployment

**Automatic Deployment:**
1. Commit changes locally
2. `git push origin main`
3. GitHub Actions automatically:
   - Generates graph data
   - Builds with Jekyll
   - Minifies CSS/JS
   - Validates HTML links
   - Publishes to GitHub Pages CDN

**Manual Deployment Helper:**
```bash
./deploy.sh     # Interactive script: stages, commits, pushes
```

**No downtime:** Changes live within ~2 minutes of push

## Performance Targets

- Page load: < 2 seconds
- CSS size: < 20 KB (minified)
- JavaScript: < 50 KB (minified)
- Lighthouse score: 90+
- Core Web Vitals: All green

## Integration Notes

**Obsidian:** Can write posts directly in Obsidian and push to GitHub
**GitHub Pages:** Free hosting, CDN-backed, auto-HTTPS
  - Site deployed at: https://divayamsharma.github.io/Blog/
  - Uses baseurl: `/Blog` (project subdirectory, not user site)
  - All links must use `{{ site.baseurl }}` filter for proper routing
**GitHub Actions:** Fully automated CI/CD using official GitHub Pages deployment
  - Workflow: `.github/workflows/build-and-deploy.yml`
  - Uses `actions/upload-pages-artifact@v3` and `actions/deploy-pages@v4`
  - Proper permissions: `pages: write`, `id-token: write`
**Custom Domain:** Optional (update DNS + CNAME in GitHub Pages settings)

## File Reference

**Edit Often:**
- `_posts/*.md` - Blog content
- `assets/css/style.scss` - Styling
- `_config.yml` - Site settings

**Edit Rarely:**
- `_layouts/` - HTML structure
- `_includes/` - Components
- `scripts/generate-graph-data.js` - Graph generation logic

**Important - Baseurl in Links:**
When editing templates, ALWAYS use one of these patterns for links:
- Navigation: `href="{{ site.baseurl }}/blog"` (uses site.baseurl variable)
- Assets: `href="{{ '/assets/css/style.css' | relative_url }}"` (uses relative_url filter)
- Post links: `href="{{ post.url | relative_url }}"` (filters post URLs)
- DO NOT use hardcoded absolute paths like `href="/blog"` - they will break in subdirectories!

**Never Edit (Auto-Generated):**
- `_site/` - Build output
- `assets/data/posts-graph.json` - Auto-generated graph
- `.jekyll-cache/` - Build cache

## Documentation Files

For detailed information, refer to:
- `START_HERE.md` - Quick setup guide
- `README.md` - Complete feature documentation
- `ARCHITECTURE.md` - Technical deep dive
- `QUICK_START.md` - Commands and tips
- `SETUP_GUIDE.md` - Detailed setup instructions

## Known Issues & Solutions

### Knowledge Graph Label Repulsion Issue (SOLVED ✅)
**Issue:** Node labels still overlapped despite spacing and backgrounds. Needed smarter positioning.

**Root Cause:**
- Labels were positioned statically relative to nodes
- No dynamic adjustment when labels got close to each other
- Wanted behavior like magnetic repulsion (south pole to south pole)

**Solution: Magnetic Label Repulsion System**
Implemented a separate D3.js force simulation just for labels:

1. **Create invisible label nodes:**
   ```javascript
   this.labelNodes = this.nodes.map((d, i) => {
       const angle = (Math.PI * 2 * i) / this.nodes.length;
       return {
           id: `label-${d.id}`,
           parentId: d.id,
           x: (d.x || 0) + Math.cos(angle) * 45,
           y: (d.y || 0) + Math.sin(angle) * 45
       };
   });
   ```

2. **Create separate label simulation with repulsion:**
   ```javascript
   this.labelSimulation = d3.forceSimulation(this.labelNodes)
       .force('label-charge', d3.forceManyBody().strength(-400))  // Magnetic repulsion
       .force('label-link', d3.forceLink(labelLinks)
           .distance(45)
           .strength(0.9))  // Attract to parent node
       .force('label-collision', d3.forceCollide().radius(60))
       .stop();
   ```

3. **Update labels on every tick:**
   ```javascript
   this.simulation.on('tick', () => {
       for (let i = 0; i < 8; i++) {
           this.labelSimulation.tick();  // Multiple updates = strong repulsion
       }
       // Position labels based on label node positions
       node.each(d => {
           const labelNode = this.labelNodes.find(ln => ln.parentId === d.id);
           const offsetX = labelNode.x - (d.x || 0);
           const offsetY = labelNode.y - (d.y || 0);
           // Apply offset to label elements
       });
   });
   ```

**How It Works:**
- Each label has its own invisible "label node"
- Label nodes repel each other with charge force -400 (like magnets)
- Label nodes are linked to their parent nodes (distance 45px, strength 0.9)
- Every frame, label simulation runs 8 times to maintain strong repulsion
- Labels display at label node positions, creating dynamic spacing

**Result:**
- ✅ Zero label overlap - magnetic repulsion keeps them apart
- ✅ Dynamic positioning - labels adjust when nodes move
- ✅ Smooth behavior - labels feel natural (like magnetic fields)
- ✅ No performance impact - only 9 invisible nodes

**Location:** `assets/js/knowledge-graph.js` lines 11-12, 123-159, 236-259

### Knowledge Graph Baseurl Issue (SOLVED)
**Issue:** Graph fails to load with "Knowledge graph data is being generated" message on GitHub Pages
**Root Causes:**
1. Fetch path hardcoded as `/assets/data/posts-graph.json` instead of using baseurl
2. D3.js library might not be loaded when graph initialization runs

**Solution:**
1. Pass baseurl to JavaScript via HTML attribute:
   ```html
   <html lang="en" data-baseurl="{{ site.baseurl }}">
   ```
2. Read baseurl in JavaScript:
   ```javascript
   const baseurl = document.documentElement.getAttribute('data-baseurl') || '';
   const response = await fetch(`${baseurl}/assets/data/posts-graph.json`);
   ```
3. Wait for D3.js before initializing:
   ```javascript
   function initializeGraph() {
       if (typeof d3 === 'undefined') {
           setTimeout(initializeGraph, 100);
           return;
       }
       // Initialize graph
   }
   ```

**Location:** `assets/js/knowledge-graph.js` lines 14-29, 218-237

### Pagination Gem Warning
**Issue:** Build shows deprecation warning: "pagination turned on but jekyll-paginate gem missing"
**Status:** Non-critical (site still builds and deploys correctly)
**Future Fix:** Add `jekyll-paginate` to Gemfile if pagination is needed

## Quick Tips

- **Live reload:** Changes in `_posts/`, `_includes/`, or `assets/css/` auto-reload in dev server
- **Image optimization:** Use WebP format when possible for faster loading
- **Post ordering:** Jekyll orders posts by date in filename (YYYY-MM-DD)
- **Graph updates:** Always run `npm run graph` before checking in new posts (or it auto-runs with prebuild)
- **Building:** Always test locally with `npm run serve` before pushing to GitHub
- **Baseurl fixes:** Any JavaScript that fetches assets must use `data-baseurl` attribute pattern (see Knowledge Graph Baseurl Issue)

## Roadmap & Next Steps

### High Priority Issues (ALL COMPLETED ✅)
1. **Graph Node Filtering** ✅ - Show only blog posts
   - Status: DONE - Posts only, no tags or categories displayed
   - File: `scripts/generate-graph-data.js`
   - Implementation: Store tag/category data on posts but don't create separate nodes

2. **Graph Zoom Constraint** ✅ - Prevent content from vanishing
   - Status: DONE - Zoom limited to 0.5x to 5x (50-500%)
   - File: `assets/js/knowledge-graph.js` (lines 180-186)
   - Implementation: Added scaleExtent([0.5, 5]) to d3.zoom()

3. **Label Overlap Prevention** ✅ - Node names overlap when zooming
   - Status: DONE - Increased spacing + label backgrounds
   - File: `assets/js/knowledge-graph.js` (lines 59-67, 97-117)
   - Implementation: Collision radius 30→65, link distance 100→180, label backgrounds

### Medium Priority Optimizations
- Add `jekyll-paginate` gem to Gemfile (remove deprecation warning)
- Implement gzip compression for posts-graph.json (12KB → 3KB)
- Add HTTP cache headers to graph data
- Add keyboard navigation (arrow keys, Enter key)

### Low Priority Enhancements
- Add ARIA labels for accessibility
- Implement post-to-post link filtering for large datasets (100+ posts)
- Preload D3.js on pages leading to graph
- Minify JSON structure for future scalability
