const fs = require('fs');

function readLinesFromFile() {
  const fileBuffer = fs.readFileSync("inputs/a.txt", {encoding: 'utf-8'});
  return fileBuffer.split('\n').map(v => v);
}

function getNextTokenGenerator(line) {
  const startTokens = ['[', '(', '{', '<'];
  let lineIndex = 0;
  return () => {
    if (lineIndex >= line.length) {
      return {
        type: 'END_OF_LINE',
        data: undefined
      };
    }
    const c = line[lineIndex];
    const type = startTokens.some(v => v === c) ? 'START_TOKEN' : 'END_TOKEN';
    lineIndex++;
    return {
      type,
      data: c
    };
  };
}

const startTokenByEndToken = new Map([
  [')', '('],
  ['}', '{'],
  [']', '['],
  ['>', '<'],
]);

const lines = readLinesFromFile();
const incorrectTokens = [];
const missingTokens = [];
lines.forEach(line => {
  const tokenStack = [];
  const generator = getNextTokenGenerator(line);
  let token = generator();
  while(token.type !== 'END_OF_LINE') {
    if (token.type === 'START_TOKEN') {
      tokenStack.push(token.data);
    } else if (token.type === 'END_TOKEN') {
      const lastToken = tokenStack.pop();
      if (!lastToken) {
        return;
      }
      const expected = startTokenByEndToken.get(token.data);
      if (lastToken !== expected){
        incorrectTokens.push(token.data);
        return;
      }
    }
    token = generator();
  }
  missingTokens.push(tokenStack);
});

if (process.argv[2] !== 'b') {
  const pointsForToken = new Map([
    [')', 3],
    [']', 57],
    ['}', 1197],
    ['>', 25137],
  ]);
  console.log(incorrectTokens.reduce((total, token) => total + pointsForToken.get(token), 0));
} else {
  const tokensForFinishing = missingTokens.map(tokens => {
    return tokens.map(v => {
      switch(v) {
        case '[':
          return ']';
        case '(':
          return ')';
        case '<':
          return '>';
        case '{':
          return '}';
      };
    });
  });
  
  const pointsForFinishingToken = new Map([
    [')', 1],
    [']', 2],
    ['}', 3],
    ['>', 4],
  ]);
  
  const scoreForFinishing = tokensForFinishing.map(tokens => {
    return tokens.reduceRight((t, v) => (t * 5) + pointsForFinishingToken.get(v), 0);
  });
  
  const middle = Math.floor(scoreForFinishing.length / 2);
  console.log(scoreForFinishing.sort((a, b) => b - a)[middle]);
}
