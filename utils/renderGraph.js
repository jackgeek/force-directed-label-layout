import { select } from "d3-selection";

export default function renderGraph(graph) {
  const svg = select("svg");
  const { nodes, links } = graph;

  const group = svg.append("g").attr("class", "main");

  const unfixedNodes = ({ fx, fy }) =>
    typeof fx === "undefined" && typeof fy === "undefined";

  const link = group
    .append("g")
    .attr("class", "link")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", "blue")
    .attr("stroke-width", function(d) {
      return 5;
    });

  const node = group
    .append("g")
    .attr("class", "node")
    .selectAll("ellipse")
    .data(nodes)
    .enter()
    .append("ellipse")
    .attr("rx", function(d) {
      return d.rx;
    })
    .attr("ry", function(d) {
      return d.ry;
    });

  const text = group
    .append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes.filter(unfixedNodes))
    .enter()
    .append("text")
    .attr("dy", 2)
    .attr("text-anchor", "middle")
    .text(function(d, index) {
      return `${d.id} ${index}`;
    })
    .attr("fill", "red");

  function updateGraph() {
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
  }

  updateGraph();

  return updateGraph;
}
