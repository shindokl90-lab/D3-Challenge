// D3 Journalism Challenge 
// Create SVGs and corresponding wrappers 
// remember to append the svg group with attributes

var svgWidth = 960;
var svgHeight = 500;
var margin = {
    top: 20, 
    right:80, 
    bottom: 60, 
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svg.svgHeight - margin.top - margin.bottom; 

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Import data

d3.csv("assets/data/data/.csv").then(function(stateData){
    // Step One: Clean and Organize Data 
    stateData.forEach(function(data){
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
    console.log(stateData);

    // Step Two: Create Axis
    var xScale = d3.scaleLinear()
        .domain([0.9 * d3.min(stateData, s => s.poverty), 1.1 * d3.max(stateData, s => s.healthcare)])
        .range([height,0]);
    var yScale = d3.scaleLinear()
        .domain([0.9* d3.min(stateData, s => s.healthcare), 1.1 * d3.max(stateData, s => s.healthcare)])
        .range([height, 0]);
    
    var xAxis = d3.axisBottom(xScale).ticks(8);
    var yAxis = d3.axisLeft(yscale).ticks(12);

    // Step Three: Place Axes on Chart

    chartGroup.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);
    chartGroup.append("g")
        call(yAxis);

    // Make Bubbles for Bubble Chart

    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "15")
        .classed("stateCircle", true);

    var circlesText = chartGroup.append("g").selectAll("text")
        .data(stateData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare)+5)
        .classed("stateText", true);

    // Step Four: Create Tooltip on hover

    //Initialize

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80,-60])
        .html(function(d){
            return(`${d.state}<hr>poverty: ${d.poverty}%<hr>healthcare: ${d.healthcare}%`);

        });

    // Bring tooltip into chart

    chartGroup.call(toolTip);

    // Mouse hover and mouse out

    circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
    })
        .on("mouseout", function(d){
            toolTip.hide(d);
        });

    // Create Labels and Clean Chart

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 -(height/2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height+margin.top+30})`)
        .attr("class", "aText")
        .text("in poverty (%)");

}
).catch(function(error){
    console.log(error);
}); 