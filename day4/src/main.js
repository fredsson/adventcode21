const fs = require('fs');

function readValuesFromFile() {
  const fileBuffer = fs.readFileSync("inputs/a.txt", {encoding: 'utf-8'});
  return fileBuffer.split('\n').map(v => v);
}

function addRowToColumns(row, cols) {
  row.forEach((v, index) => {
    if (!cols[index]){
      cols[index] = [];
    }
    cols[index].push(v);
  });

  return cols;
}

function buildBoards(values) {
  const result = [];

  let currentBoard = {rows: [], cols: [], unmarked: []};
  values.forEach(v => {
    if (v.trim() .length === 0) {
      result.push(currentBoard);
      currentBoard = {rows: [], cols: [], unmarked: []}; 
      return;
    }

    const rowValues = v.split(' ').filter(v => v && v.length > 0);
    currentBoard.rows.push(rowValues);
    currentBoard.cols = addRowToColumns(rowValues, currentBoard.cols);
    currentBoard.unmarked.push(...rowValues);
  });

  return result;
}

function applyCallingToBoard(board, calling) {
  board.unmarked = board.unmarked.filter(v => v !== calling);
  board.rows = board.rows.map(row => row.filter(v => v !== calling));
  board.cols = board.cols.map(col => col.filter(v => v !== calling));
}

function checkForFirstWinningBoard(calling, boardsWithCalling) {
  boardsWithCalling.forEach(board => {
    const emptyRows = board.rows.filter(row => row.length === 0);
    const emptyCols = board.cols.filter(col => col.length === 0);
    if (emptyRows.length || emptyCols.length) {
      const sumOfUnmarked = board.unmarked.reduce((sum, val) => sum += +val, 0);
      console.log(calling * sumOfUnmarked);
      process.exit(0);
    }
  });
}

function checkForLastWinningBoard(calling, boardsWithCalling) {
  boardsWithCalling.forEach(board => {
    const emptyRows = board.rows.filter(row => row.length === 0);
    const emptyCols = board.cols.filter(col => col.length === 0);
    if (emptyRows.length || emptyCols.length) {
      if (boards.length === 1) {
        const sumOfUnmarked = board.unmarked.reduce((sum, val) => sum += +val, 0);
        console.log(calling * sumOfUnmarked);
        process.exit(0);
      } else {
        boards = boards.filter(b => b !== board);
      }
    }
  });
}

const values = readValuesFromFile();

const callingNumbers = values[0].split(',');

const boardValues = values.slice(2); // we ignore first divider
let boards = buildBoards(boardValues);
const outputFunction = process.argv[2] !== 'b' ? checkForFirstWinningBoard : checkForLastWinningBoard;

callingNumbers.forEach(calling => {
  const boardsWithCalling = boards.filter(b => b.unmarked.includes(calling));
  boardsWithCalling.forEach(board => applyCallingToBoard(board, calling));
  outputFunction(calling, boardsWithCalling);
});
