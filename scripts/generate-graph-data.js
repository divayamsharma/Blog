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

            // Extract date from filename (YYYY-MM-DD-title.md)
            const dateMatch = file.match(/^(\d{4})-(\d{2})-(\d{2})-/);
            const [, year, month, day] = dateMatch || ['', '', '', ''];

            // Get category (first one if multiple)
            const categories = frontMatter.categories || [];
            const category = Array.isArray(categories) ? categories[0] : categories;

            // Generate URL based on Jekyll permalink: /:categories/:year/:month/:day/:title/
            const titleSlug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '');
            const url = category
                ? `/${category}/${year}/${month}/${day}/${titleSlug}/`
                : `/${year}/${month}/${day}/${titleSlug}/`;

            const postNode = {
                id: postId,
                label: frontMatter.title || 'Untitled',
                type: 'post',
                size: 8,
                color: '#ffffff',
                url: url
            };

            this.nodes.set(postId, postNode);

            // Store tags and categories for linking posts together
            // but don't create separate nodes for them
            postNode.tags = frontMatter.tags || [];
            postNode.categories = frontMatter.categories || [];
        });
    }

    /**
     * Link related posts based on shared tags and categories
     */
    linkRelatedPosts() {
        const postNodes = Array.from(this.nodes.values()).filter(n => n.type === 'post');

        for (let i = 0; i < postNodes.length; i++) {
            for (let j = i + 1; j < postNodes.length; j++) {
                const post1 = postNodes[i];
                const post2 = postNodes[j];

                // Find shared tags and categories
                const sharedTags = (post1.tags || []).filter(tag =>
                    (post2.tags || []).includes(tag)
                );
                const sharedCategories = (post1.categories || []).filter(cat =>
                    (post2.categories || []).includes(cat)
                );

                const totalShared = sharedTags.length + sharedCategories.length;

                // Link if they share tags or categories
                if (totalShared > 0) {
                    this.links.push({
                        source: post1.id,
                        target: post2.id,
                        strength: Math.min(totalShared / 3, 1) // Normalize strength
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
        const postCount = Array.from(this.nodes.values()).filter(n => n.type === 'post').length;
        const graphData = {
            nodes: Array.from(this.nodes.values()),
            links: this.links,
            generated: new Date().toISOString(),
            postCount: postCount
        };

        // Create output directory if needed
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }

        // Write JSON file
        const outputPath = path.join(this.outputDir, 'posts-graph.json');
        fs.writeFileSync(outputPath, JSON.stringify(graphData, null, 2));

        console.log(`✓ Graph data generated: ${outputPath}`);
        console.log(`  Posts: ${postCount}`);
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
