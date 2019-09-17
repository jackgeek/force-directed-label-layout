import { select } from "d3-selection";
import { forceLink, forceSimulation } from "d3-force";
import ellipseForce from "./labelForce";

export default function(labelNodes) {
  const svg = select("svg");
  const nodes = [...labelNodes];
  const links = [];

  nodes.forEach((labelNode, index) => {
    const anchorId = `Label${index}Anchor`;

    nodes.push({
      ...labelNode,
      id: anchorId,
      fx: labelNode.x,
      fy: labelNode.y,
      rx: anchorId.length * 4.5
    });

    links.push({ source: anchorId, target: labelNode.id, value: 8 });
  });

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
    .data(labelNodes)
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
    .data(labelNodes)
    .enter()
    .append("text")
    .attr("dy", 2)
    .attr("text-anchor", "middle")
    .text(function(d) {
      return d.id;
    })
    .attr("fill", "white");

  const simulation = forceSimulation(nodes);
  simulation
    .force("link", forceLink(links).id(d => d.id))
    .force(
      "collide",
      ellipseForce(1, () => {
        console.log("no overlapping labels");
        simulation.stop();
      })
    )
    .alphaTarget(0)
    .on("tick", ticked);

  function ticked() {
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
}
