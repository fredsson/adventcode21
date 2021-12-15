function addWithWrap(value, add) {
  const result = value + add;
  if (result >= 10) {
    return result - 9;
  }
  return result;
}

function expand(lines, times = 1) {
  let expandedMap = [];
  for (let t = 1; t <= times; t++) {
    for (const line of lines) {
      expandedMap.push(
        line.split('').map(v => addWithWrap(+v, t)).join('')
      );
    }
  }
  const verticallyExpandedLines = lines.concat(expandedMap);

  return verticallyExpandedLines.map(l => {
    let line = l;
    for (let t = 1; t <= times; t++) {
      line += l.split('').map(v => addWithWrap(+v, t)).join('');
    }
    return line;
  });
}

module.exports = {
  expand,
};