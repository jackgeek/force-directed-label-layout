import { select } from "d3-selection";
import graph from "./graph";
import {
  forceCenter,
  forceLink,
  forceSimulation,
  forceCollide
} from "d3-force";
import ellipseForce from "./ellipseForce";

document.body.innerHTML =
  '<svg width="960" height="600"></svg><span id="tickCount"></span><button type="button" onclick="window.tick()">Tick</button>';
window.getGraph = () => graph;
var svg = select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// var color = d3.scaleOrdinal(d3.schemeCategory20);

var nd;
for (var i = 0; i < graph.nodes.length; i++) {
  nd = graph.nodes[i];
  nd.rx = nd.id.length * 4.5;
  nd.ry = 12;
}

function createForceWithFilter(force, filter) {
  const newForce = function newForce(...args) {
    return force(...args);
  };

  if (
    force.hasOwnProperty("initialize") &&
    typeof force.initialize === "function"
  ) {
    newForce.initialize = nodes => force.initialize(nodes.filter(filter));
  } else {
    throw new Error("This force cannot be filtered!");
  }

  Object.keys(force).forEach(property => {
    if (
      typeof force[property] === "function" &&
      !newForce.hasOwnProperty(property)
    ) {
      newForce[property] = (...args) => force[property](...args);
    }
  });

  return newForce;
}

var simulation = forceSimulation()
  .force(
    "link",
    forceLink().id(function(d) {
      return d.id;
    })
  )
  .force(
    "collide",
    createForceWithFilter(ellipseForce(0, 0.1), ({ anchor }) => !anchor)
  )
  .alphaTarget(0)
  .stop();

var link = svg
  .append("g")
  .attr("class", "link")
  .selectAll("line")
  .data(graph.links)
  .enter()
  .append("line")
  .attr("stroke-width", function(d) {
    return Math.sqrt(d.value);
  });

var node = svg
  .append("g")
  .attr("class", "node")
  .selectAll("ellipse")
  .data(graph.nodes.filter(({ anchor }) => !anchor))
  .enter()
  .append("ellipse")
  .attr("rx", function(d) {
    return d.rx;
  })
  .attr("ry", function(d) {
    return d.ry;
  });
// .attr("fill", function(d) { return color(d.group); })
// .call(d3.drag()
//     .on("start", dragstarted)
//     .on("drag", dragged)
//     .on("end", dragended));

var text = svg
  .append("g")
  .attr("class", "labels")
  .selectAll("text")
  .data(graph.nodes.filter(({ anchor }) => !anchor))
  .enter()
  .append("text")
  .attr("dy", 2)
  .attr("text-anchor", "middle")
  .text(function(d) {
    return d.id;
  })
  .attr("fill", "white");

simulation.nodes(graph.nodes); //.on("tick", ticked);

simulation.force("link").links(graph.links);
ticked();
function ticked() {
  link
    .attr("x1", function(d) {
      return d.source.x;
    })
    .attr("y1", function(d) {
      return d.source.y;
    })
    .attr("x2", function(d) {
      return d.target.x;
    })
    .attr("y2", function(d) {
      return d.target.y;
    });

  node
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });
  text
    .attr("x", function(d) {
      return d.x;
    })
    .attr("y", function(d) {
      return d.y;
    });
}
// let tickCount = 0;
// for (
//   let i = 0,
//     n = Math.ceil(
//       Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())
//     );
//   i < n;
//   ++i
// ) {
//   simulation.tick();
//   tickCount++;
// }

document.getElementById("tickCount").innerHTML = `tickCount === ${tickCount}`;

window.tick = () => {
  console.log("ticked");
  simulation.tick();
  ticked();
};

// function dragstarted(d) {
//   if (!d3.event.active) simulation.alphaTarget(0.3).restart();
//   d.fx = d.x;
//   d.fy = d.y;
// }

// function dragged(d) {
//   d.fx = d3.event.x;
//   d.fy = d3.event.y;
// }

// function dragended(d) {
//   if (!d3.event.active) simulation.alphaTarget(0);
//   d.fx = null;
//   d.fy = null;
// }
