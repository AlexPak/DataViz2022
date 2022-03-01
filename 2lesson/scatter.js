async function scatterPlot() {
  console.log("scatterPlot")
  const data = await d3.json("forviz.json");
  console.log(data)
  const xAcc = d => d[0];
  const yAcc = d => d[1];
  let dimensions = {
    width: window.innerWidth*0.5,
    height: 300,
    margin: {
      top: 30,
      left: 30,
      bottom: 30,
      right: 30
    }
  }

  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  let wrapper = d3.select("#wrapper").append("svg");
  wrapper.attr("width", dimensions.width);
  wrapper.attr("height", dimensions.height);
  let container = wrapper.append("g");
  container.attr("transform",`translate(${dimensions.margin.left},${dimensions.margin.top})`);
  let xScale = d3.scaleLinear()
    .domain(d3.extent(data,xAcc))
    .range([dimensions.margin.left, dimensions.boundedWidth]);

  let yScale = d3.scaleLinear()
    .domain(d3.extent(data,yAcc))
    .range([dimensions.margin.top, dimensions.boundedHeight]);
  let viz = container.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d=>xScale(xAcc(d)))
    .attr("cy", d=>yScale(yAcc(d)))
    .attr("r","5px")
    .attr("fill","#AA1111");
  let xAxisGen = d3.axisBottom().scale(xScale);
  let yAxisGen = d3.axisLeft().scale(yScale);
  const axisX = container.append("g").call(xAxisGen).style("transform",`translateY(${dimensions.boundedHeight}px)`)
  const axisy = container.append("g").call(yAxisGen).style("transform",`translateX(${dimensions.margin.left}px)`)


}

scatterPlot()
