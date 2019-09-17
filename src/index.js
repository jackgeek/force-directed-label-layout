import labelLayout from "./labelLayout";

document.body.innerHTML = `<svg width="960" height="600"></svg>`;

const allLabels = [];

for (let i = 0; i < 100; i++) {
  const label = `Label ${i}`;

  allLabels.push({
    id: label,
    x: 494.6045038849575,
    y: 344.46397745101376,
    rx: label.length * 4.5,
    ry: 12
  });
}

labelLayout(allLabels);
