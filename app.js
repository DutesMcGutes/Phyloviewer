// Data matrix and labeling
const data = [
    [0, 20, 10, 5],
    [20, 0, 15, 10],
    [10, 15, 0, 25],
    [5, 10, 25, 0],
  ];
  
  const labels = ["Species A", "Species B", "Species C", "Species D"];
  
  // Dimensions for viz
  const width = 700;
  const height = 700;
  const outerRadius = Math.min(width, height) * 0.5 - 40;
  const innerRadius = outerRadius - 30;
  
  // create SVG Container
  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);
  
  // make Chord Layout
  const chord = d3.chord()
    .padAngle(0.05) // Padding between groups
    .sortSubgroups(d3.descending)(data);
  
  // color Scale
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  
  // Draw Groups (as arcs)
  const group = svg.append("g")
    .selectAll("g")
    .data(chord.groups)
    .join("g");
  
  group.append("path")
    .style("fill", d => color(d.index))
    .style("stroke", d => d3.rgb(color(d.index)).darker())
    .attr("d", d3.arc().innerRadius(innerRadius).outerRadius(outerRadius));
  
  // Group labels
  group.append("text")
    .each(d => (d.angle = (d.startAngle + d.endAngle) / 2))
    .attr("dy", ".35em")
    .attr("transform", d => `
      rotate(${(d.angle * 180) / Math.PI - 90})
      translate(${outerRadius + 10})
      ${d.angle > Math.PI ? "rotate(180)" : ""}
    `)
    .style("text-anchor", d => (d.angle > Math.PI ? "end" : null))
    .text(d => labels[d.index]);
  
  // Draw Chords (Relationships btwn Species)
  svg.append("g")
    .attr("fill-opacity", 0.67)
    .selectAll("path")
    .data(chord)
    .join("path")
    .attr("d", d3.ribbon().radius(innerRadius))
    .style("fill", d => color(d.target.index))
    .style("stroke", d => d3.rgb(color(d.target.index)).darker());
  
  // Interactive feature for Highlighting 
  group.on("mouseover", (event, d) => {
    svg.selectAll("path")
      .style("opacity", 0.1);
  
    svg.selectAll("path")
      .filter(path => path.source.index === d.index || path.target.index === d.index)
      .style("opacity", 1);
  });
  
  group.on("mouseout", () => {
    svg.selectAll("path").style("opacity", 1);
  });
  
  // Title
  svg.append("text")
    .attr("x", 0)
    .attr("y", -outerRadius - 20)
    .attr("text-anchor", "middle")
    .style("font-size", "23px")
    .text("PhyloViewer: A Chord Dependency for Metagenomic Data");
  