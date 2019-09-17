import { forceSimulation } from "d3-force";
import ellipseForce from "./labelForce";

export default function(d3Graph, labels) {
  const simulation = forceSimulation(labels);
  simulation
    .force(
      "collide",
      ellipseForce(1, () => {
        simulation.stop();
      })
    )
    .alphaTarget(0)
    .on("tick", ticked);

  function ticked() {
    d3Graph
      .selectAll("text")
      .data(labels)
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y;
      });
  }
}
