#!/usr/bin/env node

/**
 * Generate Knowledge Graph Data from Posts
 * Run this during Jekyll build to create posts-graph.json
 * Can be integrated into GitHub Actions or pre-commit hooks
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class GraphDataGenerator {
    constructor(postsDir = '_posts', outputDir = 'assets/data') {
        this.postsDir = postsDir;
        this.outputDir = outputDir;
        this.nodes = new Map();
        this.links = [];
        this.colorMap = new Map();
    }

    /**
     * Generate random color for consistent node coloring
     */
    getColorForTag(tag) {
        if (!this.colorMap.has(tag)) {
            const colors = [
                '#ffffff', '#e0e0e0', '#c0c0c0', '#a0a0a0',
                '#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d'
            ];
            const index = this.colorMap.size % colors.length;
            this.colorMap.set(tag, colors[index]);
        }
        return this.colorMap.get(tag);
    }

    /**
     * Parse front matter from markdown file
     */
    parseFrontMatter(content) {
        const match = content.match(/^---\n([\s\S]*?)\n---/);
        if (!match) return null;

        try {
            return yaml.load(match[1]);
        } catch (error) {
            console.error('Error parsing front matter:', error);
            return null;
        }
    }

    /**
     * Read and process all posts
     */
    processPosts() {
        if (!fs.existsSync(this.postsDir)) {
            console.error(`Posts directory not found: ${this.postsDir}`);
            return;
        }

        const files = fs.readdirSync(this.postsDir).filter(f => f.endsWith('.md'));

        files.forEach(file => {
            const filePath = path.join(this.postsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const frontMatter = this.parseFrontMatter(content);

            if (!frontMatter) {
                console.warn(`Skipping ${file} - invalid front matter`);
                return;
            }

            // Create node for post
            const postId = `post-${file.replace('.md', '')}`;
            const postNode = {
                id: postId,
                label: frontMatter.title || 'Untitled',
                type: 'post',
                size: 8,
                color: '#ffffff',
                url: `/blog/${file.replace('.md', '')}/`
            };

            this.nodes.set(postId, postNode);

            // Create nodes and links for tags
            const tags = frontMatter.tags || [];
            tags.forEach(tag => {
                const tagId = `tag-${tag}`;

                // Create tag node if it doesn't exist
                if (!this.nodes.has(tagId)) {
                    this.nodes.set(tagId, {
                        id: tagId,
                        label: tag,
                        type: 'tag',
                        size: 6,
                        color: this.getColorForTag(tag),
                        url: `/blog/?tag=${tag}`
                    });
                }

                // Create link between post and tag
                this.links.push({
                    source: postId,
                    target: tagId
                });
            });

            // Create nodes for categories
            const categories = frontMatter.categories || [];
            categories.forEach(category => {
                const categoryId = `category-${category}`;

                if (!this.nodes.has(categoryId)) {
                    this.nodes.set(categoryId, {
                        id: categoryId,
                        label: category,
                        type: 'category',
                        size: 7,
                        color: '#4ecdc4',
                        url: `/blog/?category=${category}`
                    });
                }

                this.links.push({
                    source: postId,
                    target: categoryId
                });
            });
        });
    }

    /**
     * Link related posts based on shared tags
     */
    linkRelatedPosts() {
        const postNodes = Array.from(this.nodes.values()).filter(n => n.type === 'post');

        for (let i = 0; i < postNodes.length; i++) {
            for (let j = i + 1; j < postNodes.length; j++) {
                const post1 = postNodes[i];
                const post2 = postNodes[j];

                // Find shared tags
                const sharedTags = [];
                for (const link of this.links) {
                    if (link.source === post1.id && link.target.startsWith('tag-')) {
                        if (this.links.some(l => l.source === post2.id && l.target === link.target)) {
                            sharedTags.push(link.target);
                        }
                    }
                }

                // Link if they share tags
                if (sharedTags.length > 0) {
                    this.links.push({
                        source: post1.id,
                        target: post2.id,
                        strength: Math.min(sharedTags.length / 3, 1) // Normalize strength
                    });
                }
            }
        }
    }

    /**
     * Generate and save the graph data
     */
    generate() {
        console.log('Generating knowledge graph data...');

        this.processPosts();
        this.linkRelatedPosts();

        // Prepare data for D3.js
        const graphData = {
            nodes: Array.from(this.nodes.values()),
            links: this.links,
            generated: new Date().toISOString(),
            postCount: Array.from(this.nodes.values()).filter(n => n.type === 'post').length,
            tagCount: Array.from(this.nodes.values()).filter(n => n.type === 'tag').length
        };

        // Create output directory if needed
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }

        // Write JSON file
        const outputPath = path.join(this.outputDir, 'posts-graph.json');
        fs.writeFileSync(outputPath, JSON.stringify(graphData, null, 2));

        console.log(`✓ Graph data generated: ${outputPath}`);
        console.log(`  Posts: ${graphData.postCount}`);
        console.log(`  Tags: ${graphData.tagCount}`);
        console.log(`  Links: ${graphData.links.length}`);

        return graphData;
    }
}

// Run if executed directly
if (require.main === module) {
    const generator = new GraphDataGenerator();
    generator.generate();
}

module.exports = GraphDataGenerator;
