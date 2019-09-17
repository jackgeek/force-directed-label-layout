import { forceSimulation, forceLink } from "d3-force";
import labelForce from "./labelForce";

let nodesAreOverlapping = true;

export default function(labels = []) {
  const nodes = [...labels];
  const links = [];

  const labelCount = labels.length;

  nodes.forEach((labelNode, index) => {
    nodes.push({
      ...labelNode,
      fx: labelNode.x,
      fy: labelNode.y
    });

    links.push({ source: index, target: index + labelCount });
  });

  const simulation = forceSimulation(nodes);
  simulation
    .force("link", forceLink(links).id((d, index) => index))
    .force(
      "collide",
      labelForce(1, () => {
        nodesAreOverlapping = false;
      })
    )
    .alphaTarget(0)
    .stop();

  while (nodesAreOverlapping) {
    simulation.tick();
  }
}
