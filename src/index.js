import { select } from "d3-selection";
import graph from "./graph";
import { forceLink, forceSimulation } from "d3-force";
import ellipseForce from "./labelForce";

const unfixedNodes = ({ fx, fy }) =>
  typeof fx === "undefined" && typeof fy === "undefined";

let tickCount = 0;

document.body.innerHTML = `
    <svg width="960" height="600"></svg>
    <div id="tickCount"></div>
`;

window.getGraph = () => graph;
var svg = select("svg");

var nd;
for (var i = 0; i < graph.nodes.length; i++) {
  nd = graph.nodes[i];
  nd.rx = nd.id.length * 4.5;
  nd.ry = 12;
}

var simulation = forceSimulation()
  .force(
    "link",
    forceLink().id(function(d) {
      return d.id;
    })
  )
  .force(
    "collide",
    ellipseForce(1, () => {
      simulation.stop();
    })
  )
  .alphaTarget(0);

var link = svg
  .append("g")
  .attr("class", "link")
  .selectAll("line")
  .data(graph.links)
  .enter()
  .append("line")
  .attr("stroke-width", function(d) {
    return Math.sqrt(d.value);
  });

var node = svg
  .append("g")
  .attr("class", "node")
  .selectAll("ellipse")
  .data(graph.nodes.filter(unfixedNodes))
  .enter()
  .append("ellipse")
  .attr("rx", function(d) {
    return d.rx;
  })
  .attr("ry", function(d) {
    return d.ry;
  });

var text = svg
  .append("g")
  .attr("class", "labels")
  .selectAll("text")
  .data(graph.nodes.filter(unfixedNodes))
  .enter()
  .append("text")
  .attr("dy", 2)
  .attr("text-anchor", "middle")
  .text(function(d) {
    return d.id;
  })
  .attr("fill", "white");

simulation.nodes(graph.nodes).on("tick", ticked);

simulation.force("link").links(graph.links);

function ticked() {
  tickCount += 1;
  link
    .attr("x1", function(d) {
      return d.source.x;
    })
    .attr("y1", function(d) {
      return d.source.y;
    })
    .attr("x2", function(d) {
      return d.target.x;
    })
    .attr("y2", function(d) {
      return d.target.y;
    });

  node
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });
  text
    .attr("x", function(d) {
      return d.x;
    })
    .attr("y", function(d) {
      return d.y;
    });
  document.getElementById("tickCount").innerHTML = `tickCount === ${tickCount}`;
}
