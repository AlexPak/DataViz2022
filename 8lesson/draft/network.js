
async function drawLineChart() {
    let data = await d3.json("./graph.json");
    let edges = data.edges;
    let nodes = data.nodes;

    const width = 800
    let dimensions = {
        width: width,
        height: width * 0.6,
        margin: {
            top: 30,
            right: 10,
            bottom: 50,
            left:50,
        },
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        .attr("class", "main");

    const bounds = wrapper.append("g")
        .style("trasnform", `translate(${dimensions.margin.left}px,${dimensions.margin.top})`);

    let colors = d3.scaleOrdinal(d3.schemeAccent);
    let networkCenter = d3.forceCenter().x(250).y(250);
    let manyBody = d3.forceManyBody().strength(-100);

    let modulePosition = {
        "2": { x: 0, y: 0 },
        "3": { x: 200, y: 25 },
        "1": { x: 0, y: 200 },
    }

    let forceX = d3.forceX(function (d) { return modulePosition[d.module] ? modulePosition[d.module].x : 250 }).strength(0.05);
    let forceY = d3.forceY(function (d) { return modulePosition[d.module] ? modulePosition[d.module].y : 250 }).strength(0.05);

    let force = d3.forceSimulation(nodes)
        .force("charge", manyBody)
        .force("link", d3.forceLink(edges).distance(50).iterations(1))
        .force("center", networkCenter)
        .force("x", forceX)
        .force("y", forceY)
        .on("tick", updateNetwork);

    let edgeEnter = d3.select("svg.main").selectAll("g.edge")
        .data(edges)
        .enter()
        .append("g")
        .attr("class", "edge");

    edgeEnter.append("line")
        .style("stroke-width", d => d.border ? "3px" : "1px")
        .style("stroke", "black")
        .style("pointer-events", "none");

    let nodeEnter = d3.select("svg.main").selectAll("g.node")
        .data(nodes, function (d) {return d.id })
        .enter()
        .append("g")
        .attr("class", "node");

    nodeEnter.append("circle")
        .attr("r", 8)
        .style("fill", d => colors(d.module))
        .style("stroke", "black")
        .style("stroke-width", d => d.border ? "3px" : "1px")

    nodeEnter.append("text")
        .style("text-anchor", "middle")
        .attr("y", 3)
        .style("stroke-width", "1px")
        .style("stroke-opacity", 0.75)
        .style("stroke", "white")
        .style("font-size", "8px")
        .text(d => d.id)
        .style("pointer-events", "none");



    function updateNetwork() {
        d3.select("svg.main").selectAll("line")
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)

        d3.select("svg.main").selectAll("g.node")
            .attr("transform", function (d) { return "translate("+d.x+","+d.y+")" });
    }

}


drawLineChart();
