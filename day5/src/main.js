const fs = require('fs');

function readLineSegmentsFromFile() {
  const fileBuffer = fs.readFileSync("inputs/a.txt", {encoding: 'utf-8'});
  return fileBuffer.split('\n').map(v => v);
}

function buildLineSegments(lines) {
  return lines.map(line => {
    const coordinates = line.split('->');
    const start = coordinates[0].split(',').map(v => +v);
    const end = coordinates[1].split(',').map(v => +v);
   
    return {
     start,
     end,
    };
  });
}

function filterLineSegments(segments) {
  return segments.filter(segment => {
    const horizontal = segment.start[0] == segment.end[0];
    const vertical = segment.start[1] == segment.end[1];
    return horizontal || vertical; 
  });
}

function traverseLineSegments(segments) {
  return segments.reduce((paths, segment) => {
    const [startX, startY] = segment.start;
    const [endX, endY] = segment.end;

    const dx = (endX - startX) > 0 ? 1 : -1;
    const dy = (endY - startY) > 0 ? 1 : -1;

    let x = startX;
    let y = startY;

    let hasReachedEnd = false;
    while (!hasReachedEnd) {
      if (x === endX && y === endY) {
        hasReachedEnd = true;
      }

      const index = (y*1000) + x;
      if (!paths[index]){
        paths[index] = 1;
      } else {
        paths[index]++;
      }
      if (x - endX !== 0) {
        x += dx;
      }
      if (y - endY !== 0) {
        y += dy;
      }
    }

    return paths;
  }, []);
}

const lineSegments = process.argv[2] === 'b' ? 
  buildLineSegments(readLineSegmentsFromFile()) :
  filterLineSegments(buildLineSegments(readLineSegmentsFromFile()));

paths = traverseLineSegments(lineSegments);

console.log(paths.filter(v => v >= 2).length);
