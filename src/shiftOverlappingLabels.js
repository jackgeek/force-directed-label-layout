import renderGraph from "/utils/renderGraph";
import { forceSimulation, forceLink } from "d3-force";
import labelForce from "./labelForce";

let nodesAreOverlapping = true;

export default function(labels = []) {
  const graph = createSimulationGraph(labels);
  const { nodes, links } = graph;

  const updateGraph = renderGraph(graph);
  const simulation = forceSimulation(nodes);
  simulation
    .force(
      "link",
      forceLink(links)
        .id((d, index) => index)
        .distance(() => 0)
        .strength(() => 1)
    )
    .force(
      "collide",
      labelForce(1, () => {
        nodesAreOverlapping = false;
      })
    )
    .alphaTarget(0)
    .stop();
  updateGraph();
  while (nodesAreOverlapping) {
    simulation.tick();
  }

  updateGraph();
  updateLabelsFromSimulationNodes(labels, nodes);
}

function createSimulationGraph(labels) {
  const labelNodes = labels.map(createLabelNode);
  const anchorNodes = labels.map(createAnchorNode);
  return createGraphThatLinksLabelsToAnchors(labelNodes, anchorNodes);
}

function createLabelNode(label) {
  const { idealX, idealY, rx, ry } = label;
  return {
    id: `Label`,
    idealX,
    idealY,
    x: idealX,
    y: idealY,
    rx,
    ry
  };
}

function createAnchorNode(label) {
  const { idealX, idealY } = label;
  return {
    id: `Label Anchor`,
    fx: idealX,
    fy: idealY,
    x: idealX,
    y: idealY
  };
}

function createGraphThatLinksLabelsToAnchors(labelNodes, anchorNodes) {
  const nodes = [...labelNodes, ...anchorNodes];
  const links = [];
  const labelCount = labelNodes.length;
  labelNodes.forEach((_, index) =>
    links.push({ source: index + labelCount, target: index })
  );
  return { nodes, links };
}

function updateLabelsFromSimulationNodes(labels, nodes) {
  labels.forEach((label, index) => {
    label.x = nodes[index].x;
    label.y = nodes[index].y;
  });
}
