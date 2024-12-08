import { readFile } from 'fs/promises';

type CellData = '#' | '.' | '>' | 'v' | '<' | '^' | 'X';
type GuardDirection = 'T' | 'L' | 'R' | 'B';
type Position = { x: number, y: number };

const printMatrix = (matrix: CellData[][]) => {
  for (const row of matrix) {
    console.log(row.reduce<string>((p, v) => p + v, ''));
  }
}

const calculateNextPos = (direction: GuardDirection, { x, y }: Position): Position => {
  switch (direction) {
    case 'B': return { x: x + 1, y };
    case 'T': return { x: x - 1, y };
    case 'R': return { x, y: y + 1 };
    case 'L': return { x, y: y - 1 };
  }
}

const nextGuardDir = (guardDir: GuardDirection): GuardDirection => {
  switch (guardDir) {
    case 'T': return 'R';
    case 'R': return 'B';
    case 'B': return 'L';
    case 'L': return 'T';
  }
}

const guardDirToCellData = (dir: GuardDirection): CellData => {
  switch (dir) {
    case 'B': return 'v';
    case 'T': return '^';
    case 'R': return '>';
    case 'L': return '<';
  }
}

const calculateGuardMovement = (matrix: CellData[][]): { matrix: CellData[][], movement: number, exit: boolean } => {
  let guardDir: GuardDirection = 'T';
  let guardPos: Position = { x: 0, y: 0 };
  let movement = 0;

  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      if (matrix[x][y] === '^') {
        guardDir = 'T';
        guardPos = { x, y };
        break;
      } else if (matrix[x][y] === '>') {
        guardDir = 'R';
        guardPos = { x, y };
        break;
      } else if (matrix[x][y] === '<') {
        guardDir = 'L';
        guardPos = { x, y };
        break;
      } else if (matrix[x][y] === 'v') {
        guardDir = 'B';
        guardPos = { x, y };
        break;
      }
    }
  }
  let nextPos = calculateNextPos(guardDir, guardPos);
  let exit = false;
  while (matrix[nextPos.x][nextPos.y] !== '#') {
    if (matrix[nextPos.x] === undefined || matrix[nextPos.x][nextPos.y] === undefined) {
      exit = true;
      break;
    }
    matrix[nextPos.x][nextPos.y] = matrix[guardPos.x][guardPos.y];
    matrix[guardPos.x][guardPos.y] = 'X';
    guardPos = nextPos;
    nextPos = calculateNextPos(guardDir, guardPos);
    movement++;
  }
  matrix[guardPos.x][guardPos.y] = guardDirToCellData(nextGuardDir(guardDir));

  return { movement, matrix, exit };
}

(async () => {
  const txt = await readFile('./input.txt', { encoding: 'utf8' });
  let matrix: CellData[][] = [];

  for (const line of txt.split('\n')) {
    let row: CellData[] = [];
    for (const char of line) {
      if (['#', '.', '>', 'v', '<', '^'].includes(char)) {
        row.push(char as CellData);
      } else {
        console.log('Unrecognized char: ', char);
      }
    }
    matrix.push(row);
  }
  printMatrix(matrix);

  let movement = 0;
  let exit = false;
  do {
    const results = calculateGuardMovement(matrix);
    movement += results.movement;
    exit = results.exit;
    matrix = results.matrix;


    printMatrix(matrix);
  } while (!exit);

  let totalVisits = matrix.map(row => row.reduce<number>((prev, i) => prev + (i == 'X' ? 1 : 0), 0)).reduce<number>((prev, curr) => prev + curr, 0);
  totalVisits += 1; // The final cell, where the guard is, should count

  console.log(totalVisits);
})();
