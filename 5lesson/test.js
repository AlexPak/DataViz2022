async function test() {
    console.log("+++")
    const data_eng = [
        { ind: 0, label: "A" },
        { ind: 1, label: "B" },
        { ind: 2, label: "C" },
        { ind: 3, label: "D" },
        { ind: 4, label: "E" },
        { ind: 5, label: "F" },
        { ind: 6, label: "G" },
        { ind: 7, label: "H" },
    ]

    const data_rus = [
        { ind: 0, label: "À" },
        { ind: 1, label: "Á" },
        { ind: 2, label: "Â" },
        { ind: 3, label: "Ã" },
        { ind: 4, label: "Ä" },
        { ind: 5, label: "Å" },
        { ind: 6, label: "Æ" },
        { ind: 7, label: "Ç" },
    ]


    const width = 600
    const dimensions = {
        width: width,
        height: width,
        margin: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        }
    }
    const accessor = d => d.ind;
    const accessorLabel = d => d.label;
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

    const wrapper = d3.select("#wrapper").append("svg").attr("width", dimensions.width).attr("height", dimensions.height );
    const bounded = wrapper.append("g");
    bounded.style("transform", `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`)
    xyScaler = d3.scaleLinear().domain([0, data_eng.length]).range([dimensions.boundedHeight, 0]);

    let abcGroup = bounded.selectAll("rect").data(data_eng)
    abcGroup.exit().remove()
    let enter = abcGroup.enter()
        .append("text")
        .text(d => accessorLabel(d))
        .attr("x", d => xyScaler(accessor(d)) + dimensions.height / (2 * data_eng.length))
        .attr("y", d => xyScaler(accessor(d)) + dimensions.width / (2 * data_eng.length))

        .style("fill", "black")
        .style("font-size", "24px")
        .style("font-family", "sans-serif")

    let mIndex = 0

    drawABC()
    const button = d3.select("body")
        .append("button")
        .text("Change ABC")

    button.node().addEventListener("click", onClick)

    function onClick() {
        mIndex = (mIndex + 1) % 2
        drawHistogram(metrics[mIndex])
        console.log(mIndex)
    }


}

test()