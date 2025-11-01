---
layout: default
title: Knowledge Graph
permalink: /graph/
graph: true
---

<section class="container">
    <div style="margin: 4rem 0;">
        <h5 class="section-label">Explore</h5>
        <h1>Knowledge Graph</h1>
        <p>Visualize connections between ideas and topics in my writing. Hover over nodes to see relationships.</p>

        <div class="divider" style="margin: 2rem 0;"></div>

        <div class="knowledge-graph">
            <div class="graph-container" id="knowledge-graph"></div>
            <div class="graph-legend">
                <div class="legend-item">
                    <div class="dot" style="background-color: #fff;"></div>
                    <span>Main Topics</span>
                </div>
                <div class="legend-item">
                    <div class="dot" style="background-color: #666;"></div>
                    <span>Connections</span>
                </div>
                <div class="legend-item">
                    <span>Click nodes to view related posts</span>
                </div>
            </div>
        </div>

        <div class="divider" style="margin: 2rem 0;"></div>

        <div style="max-width: 800px;">
            <h2>How This Works</h2>
            <p>This interactive graph is built from the tags and categories in my blog posts. Each node represents a topic, and the connections show how ideas relate to each other.</p>
            <ul style="margin-left: 1.5rem; color: #b0b0b0;">
                <li><strong>Hover</strong> over a node to highlight its connections</li>
                <li><strong>Drag</strong> nodes to rearrange the graph</li>
                <li><strong>Scroll</strong> to zoom in and out</li>
                <li><strong>Click</strong> a node to view related articles</li>
            </ul>
            <p style="margin-top: 1rem;">This visualization helps you discover content by exploring how topics interconnect, similar to Obsidian's graph view but optimized for minimal performance impact.</p>
        </div>
    </div>
</section>
