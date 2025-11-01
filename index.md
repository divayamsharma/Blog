---
layout: default
title: Home
---

<section class="container">
    <div style="margin: 4rem 0;">
        <h5 class="section-label">Welcome to My Blog</h5>
        <h1>Explore Articles</h1>
        <p>Deep dives on human potential, lifestyle design, & digital business.</p>

        <!-- Search -->
        <div style="margin: 2rem 0;">
            <input
                type="text"
                id="search-posts"
                placeholder="Search posts..."
                style="width: 100%; max-width: 400px; padding: 0.875rem; background-color: #1a1a1a; border: 1px solid #333; color: white; border-radius: 4px; font-size: 1rem;"
            >
        </div>
    </div>

    <div class="post-grid" id="posts-container">
        {% for post in site.posts %}
        <div class="post-card" data-title="{{ post.title | downcase }}" data-tags="{{ post.tags | join: ' ' | downcase }}">
            {% if post.image %}
            <div class="post-image">
                <img src="{{ post.image }}" alt="{{ post.title }}" loading="lazy">
            </div>
            {% else %}
            <div class="post-image" style="background: linear-gradient(135deg, #333, #555);"></div>
            {% endif %}
            <div class="post-content">
                <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
                <p>{{ post.excerpt | strip_html | truncatewords: 20 }}</p>
                <div class="post-meta">
                    <span>{{ site.author }}</span>
                    <span>{{ post.date | date: "%b %d, %Y" }}</span>
                </div>
                <a href="{{ post.url }}" style="display: inline-block; margin-top: 1rem;">Read Full Post →</a>
            </div>
        </div>
        {% endfor %}
    </div>

    {% if site.posts.size == 0 %}
    <div style="text-align: center; padding: 4rem 0;">
        <p>No posts yet. Check back soon!</p>
    </div>
    {% endif %}
</section>

<script>
document.getElementById('search-posts').addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    const posts = document.querySelectorAll('.post-card');

    posts.forEach(post => {
        const title = post.getAttribute('data-title');
        const tags = post.getAttribute('data-tags');
        const matches = title.includes(query) || tags.includes(query);
        post.style.display = matches ? 'block' : 'none';
    });
});
</script>
