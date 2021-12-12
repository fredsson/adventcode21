function parseIntoTree(segments) {
  const nodes = new Map();
  segments.forEach(segment => {
    const [n1, n2] = segment.split('-');
    if (nodes.has(n1)){
      const node = nodes.get(n1);
      node.neighbors.push(n2);
    } else {
      nodes.set(n1, {
        key: n1,
        neighbors: [n2],
      });
    }

    if (nodes.has(n2)) {
      const node = nodes.get(n2);
      node.neighbors.push(n1);
    } else {
      nodes.set(n2, {
        key: n2,
        neighbors: [n1],
      });
    }
  });
  return nodes;
}

module.exports = {
  parseIntoTree,
};
