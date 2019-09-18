import renderGraph from "/utils/renderGraph";
import { forceSimulation, forceLink } from "d3-force";
import labelForce from "./labelForce";

let nodesAreOverlapping = true;

// TODO: add a note to say that x, y, vx, vy props will be added to the input labels
/**
 *
 * @param {Object[]} labels
 * @param {Number} labels[].idealX The x coordinate the label would most like to have
 * @param {Number} labels[].idealY The y coordinate the label would most like to have
 * @param {Number} labels[].rx The radius x for the label
 * @param {Number} labels[].ry The x coordinates of the label
 */
export default function(labels = []) {
  const graph = createSimulationGraph(labels);
  const { nodes, links } = graph;
  const updateGraph = renderGraph(graph);
  updateGraph();
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
    idealX,
    idealY,
    rx,
    ry
  };
}

function createAnchorNode(label) {
  const { idealX, idealY } = label;
  return {
    fx: idealX,
    fy: idealY
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
    labels.x = nodes[index].x;
    labels.y = nodes[index].y;
  });
}
