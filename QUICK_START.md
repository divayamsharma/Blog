# Quick Start (5 Minutes)

## 1. Install & Run

```bash
# Go to project folder
cd your-blog

# Install everything
bundle install && npm install

# Start server
npm run serve
```

Visit: **http://localhost:4000**

## 2. Create Your First Post

Create file: `_posts/2024-01-15-hello-world.md`

```markdown
---
layout: post
title: "Hello World"
date: 2024-01-15 10:00:00 +0000
categories: [life]
tags: [first-post]
excerpt: "My first blog post"
reading_time: 3
---

# Welcome!

This is my first post. I'm excited to start blogging!

## What to expect

- Thoughts on life and business
- Tips and insights
- Stories from my journey
```

**Refresh browser** → Post appears at `/blog/hello-world/`

## 3. Customize

**Edit `_config.yml`:**
```yaml
title: Your Name
description: Your tagline
author: Your Name
url: "https://yourusername.github.io"
```

**Edit `index.md`:**
- Change hero headline
- Update resource cards
- Customize about section

**Edit colors in `assets/css/style.scss`:**
```scss
$bg-primary: #0a0a0a;        // Background
$text-primary: #ffffff;       // Text color
$accent: #ffffff;             // Hover color
```

## 4. Deploy

```bash
# Commit changes
git add .
git commit -m "Setup my blog"
git push origin main

# Go to GitHub repository settings
# Enable GitHub Pages
# Done! Site will be live in ~2 minutes
```

## Common Commands

```bash
npm run serve         # Start dev server (hot reload)
npm run build        # Build static site
npm run clean        # Clear build cache
npm run graph        # Regenerate knowledge graph
npm run test         # Test build
```

## Markdown Cheat Sheet

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
~~Strikethrough~~

- Bullet list
- Another item

1. Numbered list
2. Another item

[Link text](https://example.com)
![Image alt](image.jpg)

> Blockquote text

\`\`\`python
code block
\`\`\`

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
```

## Front Matter Template

Copy and paste for each post:

```markdown
---
layout: post
title: "Your Article Title"
date: 2024-01-15 10:00:00 +0000
categories: [category-name]
tags: [tag1, tag2, tag3]
excerpt: "2-3 sentence summary"
reading_time: 5
---
```

## Files to Edit

| File | What to Change |
|------|---|
| `_config.yml` | Site title, author, URL, social |
| `index.md` | Hero section, resources, about |
| `_includes/header.html` | Navigation links |
| `_includes/footer.html` | Footer text, social links |
| `about.md` | Your bio and background |
| `assets/css/style.scss` | Colors, fonts, design |

## Folder Structure

```
_posts/              ← Your blog posts (Markdown)
assets/
  ├── css/           ← Styling
  ├── js/            ← JavaScript
  ├── data/          ← Graph data (auto-generated)
  └── images/        ← Your images
_includes/           ← Header, footer
_layouts/            ← Post template
index.md             ← Homepage
blog.md              ← Blog listing
about.md             ← About page
graph.md             ← Knowledge graph
```

## Writing Tips

✅ **Do:**
- Use clear, descriptive titles
- Write in active voice
- Break content into sections
- Use images to break up text
- Add relevant tags (2-4 per post)
- Proofread before publishing

❌ **Don't:**
- Write very long posts (aim for 1000-2000 words)
- Use ALL CAPS
- Add too many nested headings
- Include large unoptimized images
- Overuse tags or categories

## Image Optimization

1. Resize images to needed dimensions
2. Compress with [Squoosh.app](https://squoosh.app)
3. Target: <200KB per image
4. Save as JPG or WebP
5. Place in `assets/images/`
6. Reference in post: `![Alt text](/assets/images/file.jpg)`

## Troubleshooting

**Site not showing changes?**
- Stop server (Ctrl+C)
- Run: `npm run clean`
- Run: `npm run serve`

**Graph not updating?**
- Run: `npm run graph`
- Clear browser cache

**Build error?**
- Check front matter format
- Verify YAML syntax
- Run: `npm run build --verbose`

## Knowledge Graph

Your tags automatically create a visual graph at `/graph/`:
- Each tag = node
- Each post = center node
- Connected by shared tags
- Click nodes to view posts
- Hover to highlight connections

**Pro tip:** Use consistent tag names like `personal-growth` not `pGrowth` or `growth`

## SEO Quick Wins

- ✅ Use descriptive post titles
- ✅ Write good excerpts (150 chars)
- ✅ Include relevant tags
- ✅ Use alt text on images
- ✅ Link to other posts
- ✅ Use headings properly (H2, H3)

## Useful Links

- [Markdown Guide](https://www.markdownguide.org/)
- [Jekyll Docs](https://jekyllrb.com/docs/)
- [GitHub Pages Help](https://pages.github.com/)
- [D3.js Docs](https://d3js.org/)

## Next

1. Read `SETUP_GUIDE.md` for detailed instructions
2. Read `PROJECT_SUMMARY.md` for full feature list
3. Write your first post!

---

**Questions?** Check the full `README.md` or `SETUP_GUIDE.md`

**Ready to deploy?** Push to GitHub and enable Pages in settings.

**Happy writing!** 🚀
