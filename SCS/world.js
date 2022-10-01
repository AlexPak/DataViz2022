// TODO Добавить функцию заражения красным цветом синих (Соударение, Социальная дистанция, Время совместного пребиывания)
// Done
// TODO Добавить табличку где можно вводить параметры виральности и смотреть статистику смертности
// Done
// https://bl.ocks.org/HarryStevens/f636199a46fc4b210fbca3b1dc4ef372
//


var timeSeries = Array();
var simulation = d3.forceSimulation();

async function buildWorld(n,mortality,virality,incubation) {
    console.log(n);
    let data = [];
    var RandomInt = (max) => Math.floor(Math.random() * max);
    // const incubation = 500;
    // const mortality = 0.2;

    var dimension = {
        width_box: window.innerWidth*0.9,
        height_box: window.innerHeight*0.8,
        width_plot: window.innerWidth*0.7,
        height_plot: window.innerHeight*0.15,
        nodePadding: 5,
        margin: {
            top: 15,
            left: 15,
            bottom: 15,
            right: 15
        }
    }

    dimension.boundedWidth = dimension.width_box - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height_box - dimension.margin.top - dimension.margin.bottom;
    dimension.boundedPlotWidth = dimension.width_plot - dimension.margin.left - dimension.margin.right;
    dimension.boundedPlotHeight = dimension.height_plot - dimension.margin.top - dimension.margin.bottom;

    var radius = (d) => d.radius;


    for(let i = 0; i < n; i++) {
        data.push({
            radius: 3,
            x:Math.random()*dimension.boundedWidth,
            y:Math.random()*dimension.boundedHeight,
            vx: 5 * Math.cos(Math.random() * 2 * Math.PI),
            vy: 5 * Math.sin(Math.random() * 2 * Math.PI),
            color: "blue",
            period: 0
        })
    }
    data[RandomInt(n)].color = "red";

    const plot = d3.select("#plot").append("svg");
    plot.attr("width",dimension.width_plot);
    plot.attr("height",dimension.height_plot);
    const bounded_plot = plot.append("g");
    bounded_plot.style("transform",`translate(${dimension.margin.left+10}px,${dimension.margin.top-3}px)`);
    const yScaler = d3.scaleLinear()
        .domain([0,$("#population").val()])
        .range([dimension.boundedPlotHeight,0]);

    const xScaler = d3.scaleLinear()
        .domain([0,3000])
        .range([0,dimension.boundedPlotWidth]);

    const yAxisGenerator = d3.axisLeft()
        .scale(yScaler);

    const xAxisGenertor = d3.axisBottom()
        .scale(xScaler);

    const yAxis = bounded_plot.append("g").call(yAxisGenerator);
    const xAxis = bounded_plot.append("g").call(xAxisGenertor)
        .style("transform",`translateY(${dimension.boundedPlotHeight}px)`)

    const lineGenerator1 = d3.line()
        .x(d=>xScaler(d.iter))
        .y(d=>yScaler(d.infested));

    const lineGenerator2 = d3.line()
        .x(d=>xScaler(d.iter))
        .y(d=>yScaler(d.dead));


    const wrapper = d3.select("#sandbox");
    const svg = wrapper.append("svg");
    svg.attr("width",dimension.width_box);
    svg.attr("height", dimension.height_box);


    const bounded_prtcl = svg.append("g");
    bounded_prtcl.style("transform",`translate(${dimension.margin.left},${dimension.margin.top})`);

    bounded_prtcl.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d)=>d.x)
        .attr("cy", (d)=>d.y)
        .attr('r',radius)
        .attr("fill",(d)=>d.color);



    let infest = (data,node) => {
        // console.log("collide_callback");
        if (data.color == "red" || node.color == "red") {
            if(Math.random()<virality) {
                data.color = "red";
                node.color = "red";
            }
        }
    };

    let collide = d3.forceCollide(radius,infest)
    let itera = 0;

        simulation
        .alphaDecay(0.0)
        .velocityDecay(0.0)
        .nodes(data)
        .force("collide", collide.strength(1).iterations(1))
        .on("tick",()=>{
            itera += 1;
            data.forEach((d)=>{
                if(d.color==="red") {
                    d.period += 1;
                    if(d.period>incubation) {
                        if(Math.random()<mortality) {
                            d.color="blue";
                            d.period = 0;
                        }
                    }
                }
            });


            data = data.filter((d)=>{
                return ((d.period<incubation) || (Math.random()>mortality));
            })
            $("#iter").html(itera);

            // console.time("render-particle");
            var u = bounded_prtcl
                .selectAll('circle')
                .data(data)
                .join('circle')
                .attr('r', radius)
                .attr('cx', (d) => {
                    if((d.x > dimension.boundedWidth) || (d.x < d.radius)) {
                        d.vx *= -1
                    }
                    return d.x;
                })
                .attr('cy', (d) => {
                    if((d.y > dimension.boundedHeight) || (d.y < d.radius)) {
                        d.vy *= -1
                    }
                    return d.y;
                })
                .attr("fill",(d)=>d.color);
            // console.timeEnd("render-particle");

            console.time("plot");
            timeSeries.push(
                {
                    infested: data.filter((d)=>d.color=="red").length,
                    dead: $("#population").val() - data.length,
                    iter: itera
                }
            );

            if(itera%30==0) {
                const line1 = bounded_plot.append("path")
                    .attr("d", lineGenerator1(timeSeries))
                    .attr("fill", "none")
                    .attr("stroke", "#ff0000")
                    .attr("stroke-width", 2)

                const line2 = bounded_plot.append("path")
                    .attr("d", lineGenerator2(timeSeries))
                    .attr("fill", "none")
                    .attr("stroke", "#000000")
                    .attr("stroke-width", 2)
            }

            console.timeEnd("plot");
            // $("#plot").html(JSON.stringify(timeSeries[timeSeries.length-1]));
    });
    simulation.stop();

}

async function reconfig() {
    simulation.stop();
    d3.select("#sandbox svg").remove();
    d3.select("#plot svg").remove();
    timeSeries = Array();
    simulation = d3.forceSimulation();
    buildWorld($("#population").val(),$("#mortality").val(),$("#virality").val(),$("#incubation").val())
}


buildWorld($("#population").val(),$("#mortality").val(),$("#virality").val(),$("#incubation").val())