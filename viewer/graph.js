fetch("../output/knowledge-graph.json")
    .then(response => response.json())
    .then(graph => {

        const elements = [];

        // -----------------------------
        // Convert Nodes
        // -----------------------------
        graph.nodes.forEach(node => {

            elements.push({
                data: {
                    id: node.id,
                    label: node.id,
                    type: node.type
                }
            });

        });

        // -----------------------------
        // Convert Edges
        // -----------------------------
        graph.edges.forEach((edge, index) => {

            elements.push({
                data: {
                    id: "edge_" + index,
                    source: edge.from,
                    target: edge.to,
                    label: edge.relation
                }
            });

        });

        const cy = cytoscape({

            container: document.getElementById("cy"),

            elements: elements,

            style: [

                // =======================
                // Page
                // =======================
                {
                    selector: 'node[type="Page"]',
                    style: {
                        label: 'data(label)',
                        'background-color': '#f39c12',
                        color: '#000',
                        'font-size': 12,
                        'text-wrap': 'wrap',
                        'text-max-width': 120,
                        'border-width': 2,
                        'border-color': '#555'
                    }
                },

                // =======================
                // Locator
                // =======================
                {
                    selector: 'node[type="Locator"]',
                    style: {
                        label: 'data(label)',
                        'background-color': '#2ecc71',
                        color: '#fff',
                        'font-size': 10,
                        'text-wrap': 'wrap',
                        'text-max-width': 120,
                        'border-width': 2,
                        'border-color': '#555'
                    }
                },

                // =======================
                // Method
                // =======================
                {
                    selector: 'node[type="Method"]',
                    style: {
                        label: 'data(label)',
                        'background-color': '#3498db',
                        color: '#fff',
                        'font-size': 10,
                        'text-wrap': 'wrap',
                        'text-max-width': 120,
                        'border-width': 2,
                        'border-color': '#555'
                    }
                },

                // =======================
                // Test
                // =======================
                {
                    selector: 'node[type="Test"]',
                    style: {
                        label: 'data(label)',
                        'background-color': '#e74c3c',
                        color: '#fff',
                        'font-size': 10,
                        'text-wrap': 'wrap',
                        'text-max-width': 120,
                        'border-width': 2,
                        'border-color': '#555'
                    }
                },

                // =======================
                // Assertion
                // =======================
                {
                    selector: 'node[type="Assertion"]',
                    style: {
                        label: 'data(label)',
                        'background-color': '#9b59b6',
                        color: '#fff',
                        'font-size': 10,
                        'text-wrap': 'wrap',
                        'text-max-width': 120,
                        'border-width': 2,
                        'border-color': '#555'
                    }
                },

                // =======================
                // Default Node
                // =======================
                {
                    selector: 'node',
                    style: {
                        label: 'data(label)',
                        'background-color': '#95a5a6',
                        color: '#fff',
                        'font-size': 10
                    }
                },

                // =======================
                // Edge
                // =======================
                {
                    selector: 'edge',
                    style: {
                        width: 2,
                        label: 'data(label)',
                        'curve-style': 'bezier',
                        'target-arrow-shape': 'triangle',
                        'target-arrow-color': '#888',
                        'line-color': '#888',
                        'font-size': 8,
                        'text-background-color': '#fff',
                        'text-background-opacity': 1,
                        'text-background-padding': 2
                    }
                }

            ],

            layout: {
                name: 'breadthfirst',
                directed: true,
                padding: 30,
                spacingFactor: 1.5,
                animate: true
            }

        });

        // ==========================================
        // Search
        // ==========================================

        const searchBox = document.getElementById("searchBox");

        if (searchBox) {

            searchBox.addEventListener("keyup", function () {

                const value = this.value.toLowerCase();

                cy.nodes().forEach(node => {

                    if (value !== "" &&
                        node.id().toLowerCase().includes(value)) {

                        node.style("border-width", 5);
                        node.style("border-color", "red");

                    } else {

                        node.style("border-width", 2);
                        node.style("border-color", "#555");

                    }

                });

            });

        }

        // ==========================================
        // Highlight Dependencies
        // ==========================================

        cy.on("tap", "node", function (evt) {

            const node = evt.target;

            cy.elements().style("opacity", 0.15);

            node.style("opacity", 1);

            node.connectedEdges().style("opacity", 1);

            node.neighborhood().style("opacity", 1);

        });

        // ==========================================
        // Reset
        // ==========================================

        cy.on("tap", function (evt) {

            if (evt.target === cy) {

                cy.elements().style("opacity", 1);

            }

        });

    })
    .catch(error => {

        console.error("Failed to load graph:", error);

    });