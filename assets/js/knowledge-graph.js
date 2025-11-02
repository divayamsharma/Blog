// Lightweight Knowledge Graph Visualization
// Uses D3.js v7 for efficient graph rendering

class KnowledgeGraph {
    constructor(containerId = 'knowledge-graph') {
        this.containerId = containerId;
        this.nodes = [];
        this.links = [];
        this.svg = null;
        this.simulation = null;
        this.labelSimulation = null;
        this.labelNodes = [];
    }

    // Build graph from posts
    async buildGraphFromPosts() {
        try {
            // Fetch posts data with baseurl support
            const baseurl = document.documentElement.getAttribute('data-baseurl') || '';
            const response = await fetch(`${baseurl}/assets/data/posts-graph.json`);
            const data = await response.json();

            this.nodes = data.nodes;
            this.links = data.links;

            this.render();
        } catch (error) {
            console.error('Error loading graph data:', error);
            this.showFallback();
        }
    }

    // Render the force-directed graph
    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Responsive sizing
        const width = container.offsetWidth;
        const height = Math.max(600, window.innerHeight * 0.7);

        // Create SVG
        this.svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background-color', '#1a1a1a');

        // Define arrow marker
        this.svg.append('defs').append('marker')
            .attr('id', 'arrowhead')
            .attr('markerWidth', 10)
            .attr('markerHeight', 10)
            .attr('refX', 15)
            .attr('refY', 3)
            .attr('orient', 'auto')
            .append('polygon')
            .attr('points', '0 0, 10 3, 0 6')
            .attr('fill', '#666');

        // Create force simulation with increased spacing to prevent label overlap
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links)
                .id(d => d.id)
                .distance(180)  // Increased from 100 to spread nodes further apart
                .strength(0.4))  // Slightly reduced to allow more movement
            .force('charge', d3.forceManyBody().strength(-400))  // Increased repulsion
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(65))  // Increased from 30 to 65 for more space

        // Create link elements
        const link = this.svg.selectAll('line')
            .data(this.links)
            .enter()
            .append('line')
            .attr('stroke', '#333')
            .attr('stroke-width', 1.5)
            .attr('opacity', 0.6)
            .attr('marker-end', 'url(#arrowhead)');

        // Create node groups
        const node = this.svg.selectAll('g.node')
            .data(this.nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .call(d3.drag()
                .on('start', (event, d) => this.dragStarted(event, d))
                .on('drag', (event, d) => this.dragged(event, d))
                .on('end', (event, d) => this.dragEnded(event, d)));

        // Add circles
        node.append('circle')
            .attr('r', d => d.size || 6)
            .attr('fill', d => d.color || '#fff')
            .attr('opacity', 0.8)
            .style('cursor', 'pointer');

        // Add label backgrounds for better readability
        // Position will be updated dynamically by label simulation
        node.append('rect')
            .attr('class', 'label-bg')
            .attr('x', -40)
            .attr('y', -12)
            .attr('width', 80)
            .attr('height', 24)
            .attr('rx', 4)
            .attr('fill', 'rgba(0, 0, 0, 0.6)')
            .attr('pointer-events', 'none')
            .style('will-change', 'x, y');

        // Add labels with better contrast
        node.append('text')
            .text(d => d.label)
            .attr('font-size', '11px')
            .attr('text-anchor', 'middle')
            .attr('dy', '.3em')
            .attr('fill', '#fff')
            .attr('pointer-events', 'none')
            .style('font-weight', 600)
            .style('letter-spacing', '0.5px');

        // Measure text dimensions to calculate proper spacing
        // This ensures long titles get enough space
        const textDimensions = {};
        node.each(function(d) {
            const text = d3.select(this).select('text');
            try {
                const bbox = text.node().getBBox();
                textDimensions[d.id] = {
                    width: bbox.width,
                    height: bbox.height
                };
            } catch (e) {
                // Fallback for text that can't be measured
                textDimensions[d.id] = {
                    width: d.label.length * 6.5, // ~6.5px per character at 11px font
                    height: 16
                };
            }
        });

        // Create label nodes with MUCH larger initial spacing
        // Position labels in a circular pattern far from nodes to minimize initial overlap
        this.labelNodes = this.nodes.map((d, i) => {
            const dims = textDimensions[d.id];

            // Calculate much larger radius to keep labels far apart
            // This prevents initial overlap by positioning labels in a sparse pattern
            const angle = (Math.PI * 2 * i) / this.nodes.length;

            // Use canvas dimensions to space labels across the full area
            const circleRadius = Math.min(width, height) / 2.5;

            // Position label far from center using angle
            const labelX = (width / 2) + Math.cos(angle) * circleRadius;
            const labelY = (height / 2) + Math.sin(angle) * circleRadius;

            return {
                id: `label-${d.id}`,
                parentId: d.id,
                x: labelX,
                y: labelY,
                vx: 0,
                vy: 0,
                width: dims.width,
                height: dims.height,
                collisionRadius: dims.width / 2 + 20 // Extra padding for collision
            };
        });

        // Create separate simulation for label positioning
        // Labels repel each other (like magnets with same poles) but are attracted to their nodes
        // This creates a "magnetic repulsion" effect where overlapping labels push away
        this.labelSimulation = d3.forceSimulation(this.labelNodes)
            .force('label-charge', d3.forceManyBody().strength(-600)) // Very strong repulsion
            .force('label-collision', d3.forceCollide()
                .radius(d => d.collisionRadius + 15)) // EXTRA padding to prevent ANY overlap
            .velocityDecay(0.25) // Lower decay = more movement = labels spread out more
            .on('tick', () => {
                // Manually apply attraction to parent nodes during simulation
                this.labelNodes.forEach(label => {
                    const parentNode = this.nodes.find(n => n.id === label.parentId);
                    if (parentNode) {
                        // Calculate desired distance - labels should stay visible but close to nodes
                        const desiredDistance = Math.max(60, label.width / 2 + 40);
                        const angle = Math.atan2(label.y - (parentNode.y || 0), label.x - (parentNode.x || 0));
                        const distance = Math.sqrt(
                            Math.pow(label.x - (parentNode.x || 0), 2) +
                            Math.pow(label.y - (parentNode.y || 0), 2)
                        );

                        // Apply very strong attraction to keep labels from wandering too far
                        const strength = 0.25; // Increased from 0.2 - MUCH stronger pull
                        if (distance > desiredDistance) {
                            // Too far - pull toward parent strongly
                            label.vx -= Math.cos(angle) * strength;
                            label.vy -= Math.sin(angle) * strength;
                        } else if (distance < desiredDistance * 0.6) {
                            // Too close - push away
                            label.vx += Math.cos(angle) * strength;
                            label.vy += Math.sin(angle) * strength;
                        }
                    }
                });
            })
            .stop(); // Don't auto-tick, we'll update manually

        // Run MANY more initial ticks to achieve stable equilibrium
        // With stronger repulsion and wider initial spacing, need MORE convergence
        for (let i = 0; i < 500; i++) {
            this.labelSimulation.tick();
        }

        // Add click handler
        node.on('click', (event, d) => {
            if (d.url) {
                window.location.href = d.url;
            }
        });

        // Add hover effects
        node.on('mouseenter', function(event, d) {
            d3.select(this).select('circle')
                .transition()
                .duration(200)
                .attr('r', d => (d.size || 6) * 1.5)
                .attr('opacity', 1);

            d3.select(this).select('text')
                .transition()
                .duration(200)
                .attr('font-size', '13px');

            d3.select(this).select('.label-bg')
                .transition()
                .duration(200)
                .attr('fill', 'rgba(0, 0, 0, 0.8)');

            // Highlight connected nodes
            link.style('stroke', l => {
                if (l.source.id === d.id || l.target.id === d.id) {
                    return '#fff';
                }
                return '#333';
            })
            .style('opacity', l => {
                if (l.source.id === d.id || l.target.id === d.id) {
                    return 0.9;
                }
                return 0.2;
            });

            node.style('opacity', n => {
                if (n.id === d.id) return 1;
                const connected = this.links.some(l =>
                    (l.source.id === d.id && l.target.id === n.id) ||
                    (l.source.id === n.id && l.target.id === d.id)
                );
                return connected ? 1 : 0.2;
            });
        })
        .on('mouseleave', function(event, d) {
            d3.select(this).select('circle')
                .transition()
                .duration(200)
                .attr('r', d => d.size || 6)
                .attr('opacity', 0.8);

            d3.select(this).select('text')
                .transition()
                .duration(200)
                .attr('font-size', '11px');

            d3.select(this).select('.label-bg')
                .transition()
                .duration(200)
                .attr('fill', 'rgba(0, 0, 0, 0.6)');

            link.style('stroke', '#333')
                .style('opacity', 0.6);

            node.style('opacity', 1);
        }.bind(this));

        // Update positions on tick
        this.simulation.on('tick', () => {
            // Update label positions multiple times per tick to keep them properly repelled
            // With stronger repulsion forces, more ticks per frame ensure smooth, stable positioning
            // This creates a "magnetic repulsion" effect where labels push away like south poles
            for (let i = 0; i < 20; i++) {
                this.labelSimulation.tick();
            }

            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            // Update node and label positions
            node.attr('transform', d => `translate(${d.x},${d.y})`);

            // Position labels based on label node positions
            // Calculate offset from parent node to label node
            node.each(d => {
                const labelNode = this.labelNodes.find(ln => ln.parentId === d.id);
                if (labelNode) {
                    const offsetX = labelNode.x - (d.x || 0);
                    const offsetY = labelNode.y - (d.y || 0);

                    d3.select(this).select('.label-bg')
                        .attr('x', offsetX - 40)
                        .attr('y', offsetY - 12);

                    d3.select(this).select('text')
                        .attr('x', offsetX)
                        .attr('y', offsetY);
                }
            });
        });

        // Add zoom with constrained scale limits
        const zoom = d3.zoom()
            .scaleExtent([0.5, 5]) // Min zoom: 0.5x (50%), Max zoom: 5x (500%)
            .on('zoom', (event) => {
                this.svg.selectAll('g').attr('transform', event.transform);
            });

        this.svg.call(zoom);
    }

    // Detect and fix overlapping labels using brute-force collision detection
    // This solves the initial positioning problem where labels overlap on page load
    detectAndFixLabelOverlaps(nodeSelection, textDimensions) {
        // Brute-force approach: check all pairs of labels for overlap
        // If overlap detected, push them apart
        const maxIterations = 50;
        const pushStrength = 2;

        for (let iteration = 0; iteration < maxIterations; iteration++) {
            let hasOverlap = false;

            // Check each pair of labels
            for (let i = 0; i < this.labelNodes.length; i++) {
                for (let j = i + 1; j < this.labelNodes.length; j++) {
                    const labelA = this.labelNodes[i];
                    const labelB = this.labelNodes[j];

                    // Get bounding box corners for both labels
                    const boxA = this.getLabelBoundingBox(labelA);
                    const boxB = this.getLabelBoundingBox(labelB);

                    // Check if boxes overlap
                    if (this.doBoxesOverlap(boxA, boxB)) {
                        hasOverlap = true;

                        // Calculate direction from A to B
                        const dx = labelB.x - labelA.x;
                        const dy = labelB.y - labelA.y;
                        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

                        // Push them apart
                        const angle = Math.atan2(dy, dx);
                        labelA.x -= Math.cos(angle) * pushStrength;
                        labelA.y -= Math.sin(angle) * pushStrength;
                        labelB.x += Math.cos(angle) * pushStrength;
                        labelB.y += Math.sin(angle) * pushStrength;
                    }
                }
            }

            // If no overlaps found, we're done
            if (!hasOverlap) break;
        }
    }

    // Get bounding box for a label node
    getLabelBoundingBox(labelNode) {
        const halfWidth = labelNode.width / 2;
        const halfHeight = labelNode.height / 2;

        return {
            x0: labelNode.x - halfWidth,
            x1: labelNode.x + halfWidth,
            y0: labelNode.y - halfHeight,
            y1: labelNode.y + halfHeight
        };
    }

    // Check if two bounding boxes overlap
    doBoxesOverlap(boxA, boxB) {
        // Add padding for safety margin
        const padding = 8;

        return !(
            boxA.x1 + padding < boxB.x0 ||
            boxA.x0 - padding > boxB.x1 ||
            boxA.y1 + padding < boxB.y0 ||
            boxA.y0 - padding > boxB.y1
        );
    }

    dragStarted(event, d) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    dragEnded(event, d) {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    showFallback() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: #999;">
                    <p>Knowledge graph data is being generated. Check back soon!</p>
                </div>
            `;
        }
    }
}

// Initialize on page load
// Wait for D3.js to be available
function initializeGraph() {
    if (typeof d3 === 'undefined') {
        // D3 not ready yet, try again in 100ms
        setTimeout(initializeGraph, 100);
        return;
    }

    const graph = new KnowledgeGraph('knowledge-graph');
    graph.buildGraphFromPosts();
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGraph);
} else {
    // DOM already loaded
    initializeGraph();
}
