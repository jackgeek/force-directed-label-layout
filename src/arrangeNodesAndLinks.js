import { forceLink, forceSimulation } from "d3-force";

export default function(nodes = [], links = []) {
  const simulation = forceSimulation(nodes);
  simulation
    .force("link", forceLink(links).id(d => d.id))
    .alphaTarget(0)
    .stop();

  for (
    let i = 0,
      n = Math.ceil(
        Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())
      );
    i < n;
    ++i
  ) {
    simulation.tick();
  }
}
