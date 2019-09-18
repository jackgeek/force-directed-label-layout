import { select } from "d3-selection";

export default function renderGraph(graph) {
  document.body.innerHTML = `<svg width="960" height="600"></svg>`;

  const svg = select("svg");
  const { nodes, links } = graph;

  const link = svg
    .append("g")
    .attr("class", "link")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", function(d) {
      return Math.sqrt(d.value);
    });

  const node = svg
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

  const text = svg
    .append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("dy", 2)
    .attr("text-anchor", "middle")
    .text(function(d, index) {
      return index;
    })
    .attr("fill", "white");

  function updateRenderedGraph() {
    updateNodesAndLinks();
    updateLinkLabels();
  }

  function updateNodesAndLinks() {
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
  }

  function updateLinkLabels() {
    text
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y;
      });
  }

  return updateRenderedGraph;
}
