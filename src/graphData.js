const graphData = {
  nodes: [],
  links: [],
  labels: []
};

for (let i = 0; i < 100; i++) {
  const label = `Label ${i}`;

  graphData.labels.push({
    id: label,
    x: 494.6045038849575,
    y: 344.46397745101376,
    rx: label.length * 4.5,
    ry: 20
  });
}

graphData.nodes = [...graphData.labels];

graphData.nodes.forEach((labelNode, index) => {
  const anchorId = `Label${index}Anchor`;

  graphData.nodes.push({
    ...labelNode,
    id: anchorId,
    fx: labelNode.x,
    fy: labelNode.y,
    rx: anchorId.length
  });

  graphData.links.push({
    source: anchorId,
    target: labelNode.id,
    value: 8
  });
});

export default graphData;
