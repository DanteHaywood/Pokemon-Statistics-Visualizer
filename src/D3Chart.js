import * as d3 from 'd3'

const MARGIN = { TOP: 10, BOTTOM: 80, LEFT: 70, RIGHT: 10 }
const PADDING = {LEFT: 10, RIGHT: 10}
var cWidth

class D3Chart {
	constructor(element, data, selectedXAxis, selectedYAxis, highlights, onClick, color, columnId) {

		let vis = this
		const id = "scatter";
		vis.color = color;
		vis.columnId = columnId;
		vis.onClick = onClick;

		console.log("here is the first chart datum:", data[0]);
		cWidth = element.parentNode.parentNode.clientWidth;
		const WIDTH = element.parentNode.parentNode.clientWidth - MARGIN.LEFT - MARGIN.RIGHT - PADDING.LEFT - PADDING.RIGHT;
		const HEIGHT = Math.floor(window.outerHeight * .45) - MARGIN.TOP - MARGIN.BOTTOM;

		//Reset the height of the accompanying Column. This is required for flexbox items
		d3.select(columnId)
			.style("height", Math.floor(window.outerHeight * .45) + "px")


		vis.g = d3.select(element)
			.append("svg")
				.attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
				.attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
				.classed("chart", true)
				.classed("line-chart", true)
			.append("g")
				.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

		vis.x = d3.scaleLinear()
			.range([0 , WIDTH])

		vis.y = d3.scaleLinear()
			.range([HEIGHT , 0])

		vis.xAxisGroup = vis.g.append("g")
			.attr("transform", `translate(0, ${HEIGHT})`)
		vis.yAxisGroup = vis.g.append("g")

		vis.g.append("text")
			.attr("x", WIDTH / 2)
			.attr("y", HEIGHT + 40)
			.attr("font-size", 20)
			.attr("text-anchor", "middle")
			.classed("line-x-axis-label", true)

		vis.g.append("text")
			.attr("x", -(HEIGHT / 2))
			.attr("y", -40)
			.attr("transform", "rotate(-90)")
			.attr("font-size", 20)
			.attr("text-anchor", "middle")
			.classed("line-y-axis-label", true)



		vis.update(selectedXAxis, selectedYAxis, data)
	}

	highlight = (highlights) => {
		d3.selectAll(".scatter-highlight")
			.classed("scatter-highlight", false)
			.transition(500)
				.attr("r", 3);
		if (highlights.length > 0){
			highlights.map(function(d, i){
				d3.select("#scatter-circle-" + d["id"])
				.classed("scatter-highlight", true)
				.transition(500)
					.attr("r", 35);
			})
		}
	}

	update(selectedXAxis, selectedYAxis, data) {
		let vis = this
		vis.data = data
		vis.selectedXAxis = selectedXAxis
		vis.selectedYAxis = selectedYAxis
		const xMax = d3.max(vis.data, d => +d[vis.selectedXAxis])
		const yMax = d3.max(vis.data, d => +d[vis.selectedYAxis])
		// Buffer the edges by 5%
		vis.x.domain([0 , (xMax + Math.floor(xMax*.05))])
		vis.y.domain([0 , (yMax + Math.floor(yMax*.05))])

		const xAxisCall = d3.axisBottom(vis.x)
		const yAxisCall = d3.axisLeft(vis.y)

		vis.xAxisGroup.transition(500).call(xAxisCall)
		vis.yAxisGroup.transition(500).call(yAxisCall)

		//const tooltip = d3.selectAll("tooltip")

		d3.select(".line-x-axis-label")
			.text(selectedXAxis)
		d3.select(".line-y-axis-label")
			.text(selectedYAxis)

		// JOIN
		const circles = vis.g.selectAll("circle")
			.data(vis.data, d => d.Name)

		// EXIT
		circles.exit()
		.transition(500)
			.attr("cy", vis.y(0))
			.remove()

		// UPDATE
		circles.transition(500)
			.attr("cx", d => vis.x(d[vis.selectedXAxis]))
			.attr("cy", function(d) {
				if(d.Name === "Charmander"){
					console.log("I am updating Charmander in update to:", vis.y(d[vis.selectedYAxis]))
				}
				return vis.y(d[vis.selectedYAxis]);
			})

		var tooltip = d3.select(".chart-area")
	    .append("div")
	    .style("opacity", 0)
			.classed("tooltip", true)
	    .classed("tooltip-linechart", true)
	    .style("background-color", "white")
	    .style("border", "solid")
	    .style("border-width", "2px")
	    .style("border-radius", "5px")
	    .style("padding", "5px")

		var mouseover = function(d) {
		  tooltip
		      .style("opacity", 1)
	    d3.select(this)
	      .style("stroke", "black")
	      .style("opacity", 1)
	  }

	  var mousemove = function(d) {
	    tooltip
				.style("top",  d3.mouse(this)[1] + 30 + "px")
				.style("left", function() {
					if (d3.mouse(this)[0] + 200 > cWidth){
						return d3.mouse(this)[0] - 25  + "px";
					} else {
						return d3.mouse(this)[0] + 80  + "px"
				}}.bind(this))
			tooltip
				.html("<b>" + d.Name + "</b><br/>" + vis.selectedXAxis + ": "
					+ d[vis.selectedXAxis] + "<br/>" + vis.selectedYAxis + ": "
					+ d[vis.selectedYAxis] +  "<br/>Type 1: " + d["Type 1"] +
					"<br/>Type 2: " + d["Type 2"]
				);
				//.text(d.Name)
	  }
	  var mouseleave = function(d) {
	    tooltip
	      .style("opacity", 0)
	    d3.select(this)
	      .style("stroke", "none")
	      .style("opacity", 0.8)
	  }

		var handleClicked = function(d) {
			if (d.clicked){
				d.clicked = false;
				vis.onClick(d);
			} else {
				d.clicked = true;
				vis.onClick(d);
			}
		}

		// ENTER
		circles.enter().append("circle")
			.attr("cx", d => vis.x(d[vis.selectedXAxis]))
			//.attr("cy", d => vis.y(d[vis.selectedYAxis]))
			.attr("cy", d => vis.y(0))
			.attr("r", 3)
			.attr("fill", d => vis.color(d))
			.classed("scatter-circle", true)
			.attr("id", d => "scatter-circle-" + d["id"])
			.on("mouseover", mouseover)
			.on("mousemove",mousemove)
			.on("mouseleave", mouseleave)
			.on("click", handleClicked)
			.transition(500)
				.attr("cy", function(d) {
					if(d.Name === "Charmander"){
						console.log("I am updating Charmander in enter to:", vis.y(d[vis.selectedYAxis]))
					}
					return vis.y(d[vis.selectedYAxis]);
				})
		;
	}
}

export default D3Chart
