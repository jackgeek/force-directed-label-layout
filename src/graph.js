const graph = {
  nodes: [],
  links: []
};

function addLabel(id) {
  const anchorId = `Label${id}Anchor`;
  const labelId = `Label ${id}`;
  graph.nodes.push({
    id: anchorId,
    fx: 494.6045038849575,
    fy: 344.46397745101376,
    x: 494.6045038849575,
    y: 344.46397745101376
  });
  graph.nodes.push({
    id: labelId,
    x: 494.6045038849575,
    y: 344.46397745101376
  });
  graph.links.push({ source: anchorId, target: labelId, value: 8 });
}

for (let i = 1; i < 50; i += 1) {
  addLabel(i);
}

export default graph;
