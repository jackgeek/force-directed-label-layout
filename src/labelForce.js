/**
 * The original solution comes from this library https://github.com/jpurma/d3-ellipse-force
 * We've tweaked the original source code to suit our needs as follows:
 * 1. Removed padding between nodes
 * 2. Removed outerRepulse
 * 3. Filtering the nodes to not include fixed nodes when force.initialize is called
 * 4. Added onNoOverlappingNodes called to detect when nodes are no longer overlapping
 */
function NOOP() {}

export default function(innerRepulsion, onNoOverlappingNodes = NOOP) {
  var nodes;

  innerRepulsion = innerRepulsion == null ? 0.5 : +innerRepulsion;

  function force(alpha) {
    var i,
      j,
      n = nodes.length,
      // dimensions of this node
      node,
      my_w,
      my_h,
      my_x,
      my_y,
      // often used multiples
      my_w2,
      my_h2,
      my_wh,
      // dimensions of the other node
      other,
      other_w,
      other_h,
      other_x,
      other_y,
      // distance between nodes
      dist_x,
      dist_y,
      // components for the overall result
      force_ratio,
      dist,
      gap,
      repulsion,
      x_component,
      y_component,
      // computing elliptical force
      g,
      g2,
      x1,
      y1,
      x2,
      y2,
      d1,
      d2,
      force_ratio1,
      force_ratio2,
      areNodesOverlapping = false;

    for (i = 0; i < n; ++i) {
      node = nodes[i];
      my_w = node.rx;
      my_h = node.ry;
      my_w2 = my_w * my_w;
      my_h2 = my_h * my_h;
      my_wh = my_w * my_h;
      my_x = node.x + node.vx;
      my_y = node.y + node.vy;

      for (j = 0; j < n; ++j) {
        if (j === i) {
          continue;
        }
        other = nodes[j];
        other_w = other.rx;
        other_h = other.ry;
        other_x = other.x + other.vx;
        other_y = other.y + other.vy;
        dist_x = my_x - other_x;
        dist_y = my_y - other_y;
        if (dist_x === 0 && dist_y === 0) {
          node.vx += Math.random() * 4 - 2;
          node.vy += Math.random() * 4 - 2;
          continue;
        } else if (dist_x === 0) {
          force_ratio = (my_h / my_w + other_h / other_w) / 2;
          dist = Math.abs(dist_y);
          gap = dist - my_h - other_h;
        } else if (dist_y === 0) {
          force_ratio = 1;
          dist = Math.abs(dist_x);
          gap = dist - my_w - other_w;
        } else {
          // ellipse is defined as  x^2   y^2
          //                        --- + --- = 1
          //                        w^2   h^2
          // here x,y are points on ellipse's arc.
          // we have a line going between center points of two ellipses and we want to know
          // the point where it crosses the ellipse's arc. Because we know the line, we
          // know that y = g * x, where
          g = dist_y / dist_x;
          // now the only unknown in ellipse above is x, and thus we can find it by
          // moving pieces around (pen and paper work). equation becomes:
          //             w * h
          // x = ---------------------
          //     sqrt(h^2 + g^2 * w^2)

          g2 = g * g;
          x1 = my_wh / Math.sqrt(my_h2 + g2 * my_w2);
          y1 = g * x1;
          // the length of the little bit from the center of ellipse to its margin.
          // For circle it would be 'r', but for ellipse it varies.
          d1 = Math.sqrt(x1 * x1 + y1 * y1);
          // Strength of force that this ellipse eminates is modified by ratio of this bit
          // to the ellipse's width. (It doesn't matter if we use width or height as reference
          // point)
          force_ratio1 = d1 / my_w;
          // And same for the other ellipse:
          x2 =
            (other_w * other_h) /
            Math.sqrt(other_h * other_h + g2 * other_w * other_w);
          y2 = g * x2;
          d2 = Math.sqrt(x2 * x2 + y2 * y2);
          force_ratio2 = d2 / other_w;
          // now we can calculate the gap or overlap between two ellipses, and force ratio on
          // how strongly they should push as average of their force_ratios
          dist = Math.sqrt(dist_x * dist_x + dist_y * dist_y);
          gap = dist - d2 - d1;
          force_ratio = (force_ratio1 + force_ratio2) / 2;
        }
        x_component = dist_x / dist;
        y_component = dist_y / dist;
        if (gap < 0) {
          areNodesOverlapping = true;
          // force GROWS as gap goes further into negative
          repulsion = Math.min(
            Math.max(1.0, innerRepulsion * force_ratio * -gap),
            5.0
          );
          node.vx += repulsion * x_component;
          node.vy += repulsion * y_component;
        }
      }
    }

    if (!areNodesOverlapping) {
      onNoOverlappingNodes();
    }
  }

  force.initialize = function(my_nodes) {
    nodes = my_nodes.filter(
      ({ fx, fy }) => typeof fx === "undefined" && typeof fy === "undefined"
    );
  };

  force.innerRepulsion = function(my_innerRepulsion) {
    if (arguments.length) {
      innerRepulsion = +my_innerRepulsion;
      return force;
    } else {
      return innerRepulsion;
    }
  };

  return force;
}
