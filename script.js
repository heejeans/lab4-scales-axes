let wealthHealth;
d3.csv('wealth-health-2014.csv', d3.autoType).then(data=>{
	wealthHealth = data;
	console.log(wealthHealth);


    const margin = {top:20, left:20, right:20, bottom:20};
    const width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    let padding = 1;

	const svg = d3.select('.chart')
		.append('svg')
    	.attr('width', width + margin.left + margin.right)
    	.attr('height', height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    let incomeExtent = d3.extent(data, d => d.Income)
    let lifeExtent = d3.extent(data, d => d.LifeExpectancy)
    let popExtent = d3.extent(data, d => d.Population)

    console.log(lifeExtent)
    console.log(incomeExtent)
    
    const xScale = d3
        .scaleLinear()
        .domain([0, incomeExtent[1] ])
        .range([padding, width - padding * 2])
    
    console.log(xScale(incomeExtent[1]));

    const yScale = d3
        .scaleLinear()
        .domain([lifeExtent[0], lifeExtent[1]])
        .range([height - padding, padding])
    
    const aScale = d3
        .scaleSqrt()
        .domain([popExtent[0], popExtent[1]])
        .range([0, 20]);

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5, "s")
    
    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(7)
    
    const regionNames = Array.from( new Set(data.map(d=>d.Region)))
    console.log(regionNames)

    const colorScale = d3.scaleOrdinal(d3.schemePastel1)
       
    svg.selectAll('circle')
    .data(wealthHealth)
    .enter()
    .append("circle")
    .attr('cx', d=>xScale(d.Income))
    .attr('cy', d=>yScale(d.LifeExpectancy))
    .attr("r", function(d) {
        if (d.Population < 100000000 && d.Population > 10000000){
            return 6;
        }
        else if (d.Population < 10000000){
            return 5;
        }
        else{
            return aScale(d.Population);
        }
    })
    .attr("fill", d=>colorScale(d.Region))
    .attr("stroke", "black")
    .attr("stroke-opacity", "0.5")
    .attr("fill-opacity", "0.6")
    .on("mouseenter", (event, d) => {
        const pos = d3.pointer(event, window); // pos = [x,y]
        d3.select(".tooltip")
            .html(`Country: ${d.Country}<br>Region: ${d.Region}<br>Population: ${d3.format(",")(d.Population)}<br>Income: ${d3.format(",")(d.Income)}<br>Life Expectancy: ${d.LifeExpectancy}`)
            .style("display", "block")
            .attr("fill", "white")
            
            .style("top", pos[1] + "px")
            .style("left", pos[0] + "px");
    })
    .on("mouseleave", (event, d) => {
        d3.select(".tooltip").
            style("display","none")
    });

    svg.append("g")
	.attr("class", "axis x-axis")
    // .attr("transform", `translate(0, ${height})`)
    .attr("transform", "translate(0, " + (height - padding) + ")")
	.call(xAxis);
    
    svg.append("g")
	.attr("class", "axis y-axis")
    // .attr("transform", `translate(padding, ${0})`)
    .attr("transform", "translate(" + padding + ", 0)")
	.call(yAxis);

    let texts = svg.selectAll('.chart')
		.data(wealthHealth)
		.enter()

    
    texts.append("text")
        .attr("class", "label xlabel")
		.attr('x', width - 60)
		.attr('y', height - 8)
        .attr("text-anchor", "end")
		// add attrs such as alignment-baseline and text-anchor as necessary
		.text("Income")

    texts.append("text")
        .attr("class", "label ylabel")
        .attr('x', width - 590)
        .attr('y', height - 460)
        .attr("alignment-baseline", "hanging")
        // add attrs such as alignment-baseline and text-anchor as necessary
        .text("Life Expectancy")

    svg.selectAll('.chart')
        .data(regionNames)
        .enter()
        .append("rect")
        .attr("x", width - 150)
        .attr("y", (datum, index)=>300 + index*20)
	    .attr("width", 12)
	    .attr("height", 12)
        .attr("fill", d=>(colorScale(d)))
        .attr("stroke", "black")
        .attr("stroke-opacity", "0.5")
    
    svg.selectAll('.chart')
        .data(regionNames)
        .enter()
        .append("text")
        // .attr('height', 20)
        .attr('x', width - 130)
        .attr("y", (datum, index)=>310 + index*20)
        .attr("font-size", 11)
        .text((d) => d)
})  
