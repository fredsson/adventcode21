

module.exports = {
  initialize: (points) => {
    const [lowestX, highestX]= points[0].sort();
    const [lowestY, highestY] = points[1].sort((a,b) => a-b);

    return {
      position: [lowestX, lowestY],
      size: [
        highestX - lowestX,
        highestY - lowestY
      ],
    };
  },
  inside: (box, x, y) => {
    const insideX = x >= box.position[0] && x <= box.position[0] + box.size[0];
    const insideY = y >= box.position[1] && y <= box.position[1] + box.size[1]; 
    return insideX && insideY;
  },
  hasPassed: (box, x, y) => {
    const hasPassedX = x > box.position[0] + box.size[0];
    /*if (box.position[1] < 0 && y >= 0) {
      return false;
    }*/
    const hasPassedY = y < box.position[1]; 
    return hasPassedX || hasPassedY;
  }
}