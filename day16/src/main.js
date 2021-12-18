const fs = require('fs');
const hexDecoder = require('./hex-decoder');

function readHexFromFile() {
  const fileBuffer = fs.readFileSync('inputs/a.txt', {encoding: 'utf-8'});
  return fileBuffer;
}

function readVersion(binaryData, index) {
  return [{type: 'VERSION', data: parseInt(binaryData.slice(index, index + 3), 2)}, 3];
}

function readType(binaryData, index) {
  return [{type: 'TYPE', data: parseInt(binaryData.slice(index, index + 3), 2)}, 3];
}

function readLengthType(binaryData, index) {
  return [{type: 'OPERATOR_SUB_TYPE', data: parseInt(binaryData.slice(index, index + 1), 2)}, 1];
}

function readSubPackages(binaryData, index) {
  return [{type: 'OPERATOR_PACKAGES', data: parseInt(binaryData.slice(index, index + 11), 2)}, 11];
}

function readPackageLength(binaryData, index) {
  return [{type: 'OPERATOR_SUBLENGTH', data: parseInt(binaryData.slice(index, index + 15),2)}, 15];
}

function readLiteral(binaryData, index) {
  let binaryLiteral = '';
  let totalConsumed = 0;
  for (let i = index; i < binaryData.length; i += 5) {
    totalConsumed += 5;
    const firstBit = binaryData.slice(i, i+1);
    if (firstBit === '0') {
      return [
        {type: 'LITERAL', data: parseInt(binaryLiteral + binaryData.slice(i+1, i+5), 2)},
        totalConsumed
      ];
    }

    binaryLiteral += binaryData.slice(i+1, i+5);
  }
}

function blah(binaryData, startIndex = 0) {
  let tokens = [];
  let index = startIndex;
  let token;
  let consumed;

  [token, consumed] = readVersion(binaryData, index);
  tokens.push(token);
  index += consumed;
  [token, consumed] = readType(binaryData, index);
  tokens.push(token);
  index += consumed;


  if (token.data === 4) {
    [token, consumed] = readLiteral(binaryData, index);
    index += consumed;
    tokens.push(token);
  } else {
    tokens.push({type: 'OPERATOR_START'});
    [token, consumed] = readLengthType(binaryData, index);
    index += consumed;
    tokens.push(token);

    if (token.data === 1) {
      [token, consumed] = readSubPackages(binaryData, index);
      index += consumed;
      tokens.push(token);
      for (let p = 0; p < token.data; p++) {
        const [subTokens, totalConsumed] = blah(binaryData, index);
        tokens = tokens.concat(subTokens);
        index += totalConsumed;
      }
    } else {
      [token, consumed] = readPackageLength(binaryData, index);
      index += consumed;
      tokens.push(token);
      for (let p = 0; p < token.data;) {
        [subTokens, totalConsumed] = blah(binaryData, index);
        tokens = tokens.concat(subTokens);
        index += totalConsumed;
        p += totalConsumed;
      } 
    }

    tokens.push({type: 'OPERATOR_END'});
  }

  return [tokens, index - startIndex];
}

function operatorIsStarting(tokens, token, index) {
  return token.type === 'TYPE' && tokens[index+1]?.type === 'OPERATOR_START';
}

const operatorsByTypeId = new Map([
  [0, (tokens, token, startIndex) => {
    let sum = 0;
    let index = startIndex;
    let consumed = 0;
    while (token.type !== 'OPERATOR_END') {
      token = tokens[++index];
      consumed += 1;
      if (token.type === 'LITERAL') {
        sum += token.data;
      } else if (operatorIsStarting(tokens, token, index)) {
        const [s, c] = applyOperator(tokens, token, index);
        consumed += c;
        index += c;
        sum += s;
      }
    }
    return [sum, consumed];
  }],
  [1, (tokens, token, index) => {
    let values = [];
    let consumed = 0;
    while(token.type !== 'OPERATOR_END') {
      token = tokens[++index];
      consumed += 1;
      if (token.type === 'LITERAL') {
        values.push(token.data);
      } else if (operatorIsStarting(tokens, token, index)) {
        const [s, c] = applyOperator(tokens, token, index);
        consumed += c;
        index += c;
        values.push(s);
      }
    }

    const sum = values.reduce((total, v) => total !== undefined ? total * v : v, undefined);
    return [sum, consumed];
  }],
  [2, (tokens, token, index) => {
    let value = 1000000;
    let consumed = 0;
    while (token.type !== 'OPERATOR_END') {
      token = tokens[++index];
      consumed += 1;
      if (token.type === 'LITERAL') {
        value = Math.min(value, token.data);
      } else if (operatorIsStarting(tokens, token, index)) {
        const [s,c] = applyOperator(tokens, token, index);
        consumed += c;
        index += c;
        value = Math.min(value, s);
      }
    }
    return [value, consumed];
  }],
  [3, (tokens, token, index) => {
    let value = -1;
    let consumed = 0;
    while (token.type !== 'OPERATOR_END') {
      token = tokens[++index];
      consumed += 1;
      if (token.type === 'LITERAL') {
        value = Math.max(value, token.data);
      } else if (operatorIsStarting(tokens, token, index)) {
        const [s,c] = applyOperator(tokens, token, index);
        consumed += c;
        index += c;
        value = Math.max(value, s);
      }
    }
    return [value, consumed];
  }],
  [5, (tokens, token, index) => {
    let values = [];
    let consumed = 0;
    while (token.type !== 'OPERATOR_END') {
      token = tokens[++index];
      consumed += 1;
      if (token.type === 'LITERAL') {
        values.push(token.data);
      } else if (operatorIsStarting(tokens, token, index)) {
        const [s,c] = applyOperator(tokens, token, index);
        consumed += c;
        index += c;
        values.push(s);
      }
    }
    if (values.length > 2) {
      console.log('oohoh');
    }

    const result = values[0] > values[1] ? 1 : 0;

    return [result, consumed];
  }],
  [6, (tokens, token, index) => {
    let values = [];
    let consumed = 0;
    while (token.type !== 'OPERATOR_END') {
      token = tokens[++index];
      consumed += 1;
      if (token.type === 'LITERAL') {
        values.push(token.data);
      } else if (operatorIsStarting(tokens, token, index)) {
        const [s,c] = applyOperator(tokens, token, index);
        consumed += c;
        index += c;
        values.push(s);
      }
    }
    if (values.length > 2) {
      console.log('oohoh');
    }

    const result = values[0] < values[1] ? 1 : 0;

    return [result, consumed];
  }],
  [7, (tokens, token, index) => {
    let values = [];
    let consumed = 0;
    while (token.type !== 'OPERATOR_END') {
      token = tokens[++index];
      consumed += 1;
      if (token.type === 'LITERAL') {
        values.push(token.data);
      } else if (operatorIsStarting(tokens, token, index)) {
        const [s,c] = applyOperator(tokens, token, index);
        consumed += c;
        index += c;
        values.push(s);
      }
    }
    if (values.length > 2) {
      console.log('oohoh');
    }

    const result = values[0] === values[1] ? 1 : 0;
    return [result, consumed];
  }],
])

function applyOperator(tokens, token, startIndex) {
  let operatorFunction = operatorsByTypeId.get(token.data);
  if (operatorFunction) {
    const result = operatorFunction(tokens,token, startIndex);
    return result;
  }

  return [0, 0];
}

const hex = readHexFromFile();
const binary = hexDecoder.toBinary(hex);

const [tokens, _] = blah(binary);
if (process.argv[2] !== 'b') {
  console.log(tokens.filter(t => t.type === 'VERSION').reduce((total, t) => total + t.data, 0));
} else {
  let result = 0;
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    if (operatorIsStarting(tokens, token, i)) {
      let [s, c] = applyOperator(tokens, token, i);
      i += c;
      result += s;
    }
  }
  console.log(result);
}