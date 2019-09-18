import shiftOverlappingLabels from "./shiftOverlappingLabels";
import labelsInputFromHM from "./labelsInputFromHM";
import seedrandom from "seedrandom";

Math.random = seedrandom("2");

document.body.innerHTML = `<svg width="960" height="600"></svg>`;

shiftOverlappingLabels(labelsInputFromHM);
