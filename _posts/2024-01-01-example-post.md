---
layout: post
title: "Getting Started with This Blog"
date: 2024-01-01 10:00:00 +0000
categories: [getting-started]
tags: [tutorial, blog, markdown]
author: Your Name
image: https://thedankoe.com/wp-content/uploads/2025/05/thedankoe_create_white_line_art_on_a_black_background_of_a_gl_2642575d-9192-413e-ab15-734ef5753334_3.png
excerpt: "Learn how to use this blog and create your first post."
reading_time: 5
---

Welcome to your new blog! This template is designed to be simple, performant, and beautiful. Let me walk you through how to use it.

## How to Create Posts

Posts are written in Markdown and stored in the `_posts` folder. The filename format is important:

```
_posts/YYYY-MM-DD-post-title.md
```

## Front Matter

Every post needs front matter at the top with this structure:

```yaml
---
layout: post
title: "Your Post Title"
date: 2024-01-01 10:00:00 +0000
categories: [category-name]
tags: [tag1, tag2, tag3]
author: Your Name
image: /path/to/image.jpg
excerpt: "Brief summary of the post"
reading_time: 5
---
```

## Writing Content

You can use standard Markdown syntax:

### Headings

```markdown
# H1
## H2
### H3
```

### Lists

```markdown
- Unordered list item
- Another item

1. Ordered list item
2. Another item
```

### Code

Use triple backticks for code blocks:

```python
def hello_world():
    print("Hello, World!")
```

### Blockquotes

> This is a blockquote. Use it to highlight important ideas.

### Links and Images

[Link text](https://example.com)

![Alt text](/path/to/image.jpg)

## Knowledge Graph

The knowledge graph on the `/graph/` page automatically pulls tags from your posts. Use relevant tags to build the graph:

- Use 2-4 tags per post
- Keep tags consistent (lowercase, hyphenated)
- Related posts will appear in the graph

## Performance Tips

1. **Optimize images** - Use tools like ImageOptim or Squoosh
2. **Lazy load images** - Use `loading="lazy"` attribute
3. **Minimize tags** - Keep the number of unique tags reasonable
4. **Use caching** - GitHub Pages has built-in caching

## Next Steps

1. Edit `_config.yml` with your site information
2. Replace the logo and favicon in `/assets/`
3. Update social links in `_includes/footer.html`
4. Create your first real post by duplicating this file
5. Push to GitHub and enable GitHub Pages in your repository settings

Happy writing!
