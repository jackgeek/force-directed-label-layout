import { select } from "d3-selection";
import graphData from "./graphData";
import nodelinkLayout from "./nodelinkLayout";
import labelLayout from "./labelLayout";

document.body.innerHTML = `<svg width="960" height="600"></svg>`;

const svg = select("svg");
const { links, labels } = graphData;

svg
  .append("g")
  .attr("class", "link")
  .selectAll("line")
  .data(links)
  .enter()
  .append("line")
  .attr("stroke-width", function(d) {
    return Math.sqrt(d.value);
  });

svg
  .append("g")
  .attr("class", "node")
  .selectAll("ellipse")
  .data(labels)
  .enter()
  .append("ellipse")
  .attr("rx", function(d) {
    return d.rx;
  })
  .attr("ry", function(d) {
    return d.ry;
  });

svg
  .append("g")
  .attr("class", "labels")
  .selectAll("text")
  .data(labels)
  .enter()
  .append("text")
  .attr("dy", 2)
  .attr("text-anchor", "middle")
  .text(function(d) {
    return d.id;
  })
  .attr("fill", "white");

nodelinkLayout(svg, graphData);
labelLayout(svg, labels);
