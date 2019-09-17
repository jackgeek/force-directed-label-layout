import { forceSimulation } from "d3-force";
import ellipseForce from "./labelForce";

let nodesAreOverlapping = true;

export default function(labels = []) {
  const simulation = forceSimulation(labels);
  simulation
    .force(
      "collide",
      ellipseForce(1, () => {
        nodesAreOverlapping = false;
      })
    )
    .alphaTarget(0)
    .stop();

  while (nodesAreOverlapping) {
    simulation.tick();
  }
}
