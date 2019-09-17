import { forceLink, forceSimulation } from "d3-force";

export default function(d3Graph, { nodes, links, labels }) {
  const simulation = forceSimulation(nodes);
  simulation
    .force("link", forceLink(links).id(d => d.id))
    .alphaTarget(0)
    .on("tick", ticked);

  function ticked() {
    d3Graph
      .selectAll("line")
      .data(links)
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

    d3Graph
      .selectAll("ellipse")
      .data(nodes)
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      });
  }
}
