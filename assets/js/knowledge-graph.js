// Lightweight Knowledge Graph Visualization
// Uses D3.js v7 for efficient graph rendering

class KnowledgeGraph {
    constructor(containerId = 'knowledge-graph') {
        this.containerId = containerId;
        this.nodes = [];
        this.links = [];
        this.svg = null;
        this.simulation = null;
    }

    // Build graph from posts
    async buildGraphFromPosts() {
        try {
            // Fetch posts data
            const response = await fetch('/assets/data/posts-graph.json');
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

        // Create force simulation
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links)
                .id(d => d.id)
                .distance(100)
                .strength(0.5))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(30));

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

        // Add labels
        node.append('text')
            .text(d => d.label)
            .attr('font-size', '11px')
            .attr('text-anchor', 'middle')
            .attr('dy', '.3em')
            .attr('fill', '#fff')
            .attr('pointer-events', 'none')
            .style('font-weight', 500)
            .style('text-shadow', '0 0 4px rgba(0,0,0,0.8)');

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

            link.style('stroke', '#333')
                .style('opacity', 0.6);

            node.style('opacity', 1);
        }.bind(this));

        // Update positions on tick
        this.simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });

        // Add zoom
        const zoom = d3.zoom()
            .on('zoom', (event) => {
                this.svg.selectAll('g').attr('transform', event.transform);
            });

        this.svg.call(zoom);
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
document.addEventListener('DOMContentLoaded', () => {
    const graph = new KnowledgeGraph('knowledge-graph');
    graph.buildGraphFromPosts();
});
